import os
import ollama
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

# FastAPI 라우터 생성
router = APIRouter()

# 1. 설정값 및 클라이언트 초기화
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant") # 도커 네트워크 이름 사용
QDRANT_PORT = os.getenv("QDRANT_PORT", 6333)
COLLECTION_NAME = "complaints"

# [수정] Ollama 클라이언트 설정 (도커 밖의 호스트와 통신)
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")
client_ollama = ollama.Client(host=OLLAMA_HOST)

# [수정] Qwen 기반 임베딩 모델 초기화
# trust_remote_code=True는 Qwen3 같은 최신 아키텍처를 불러올 때 필수입니다.
embed_model = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B", trust_remote_code=True)
client_qd = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# --- [핵심 로직 함수들] ---

def get_embedding(text: str):
    # [수정] OpenAI 대신 로컬 SentenceTransformer 사용
    embedding = embed_model.encode(text)
    return embedding.tolist()
    

def get_department_recommendation(question: str):
    # 1. 임베딩 생성 및 Qdrant 검색
    q_vec = get_embedding(question)
    search_result = client_qd.query_points(
        collection_name=COLLECTION_NAME,
        query=q_vec,
        limit=5,
        with_payload=True
    )
    
    # 2. 유사 사례 텍스트 구성
    examples_text = ""
    hits_data = [] 
    
    for pt in search_result.points:
        payload = pt.payload or {}
        score = pt.score
        examples_text += f"- 문의내용: {payload.get('문의내용', '')}\n  부서: {payload.get('답변부서', '')}\n\n"
        
        hits_data.append({
            "score": round(score, 3),
            "content": payload.get('문의내용', ''),
            "department": payload.get('답변부서', '')
        })

    # 3. [수정] Ollama(gpt-oss:20b)에게 판단 요청
    prompt = f"""
    너는 민원 라우팅 보조 시스템이다.
    아래 [과거 민원 사례]를 참고해서 [새 민원]의 담당 부서를 골라라.
    사례에 없거나 판단이 어려우면 '추가민원'이라고 해. 이유도 간략히 설명해.

    [과거 민원 사례]
    {examples_text}

    [새 민원]
    {question}
    
    한국어로 답변해줘.
    """
    
    resp = client_ollama.chat(
        model="gpt-oss:20b",
        messages=[{"role": "user", "content": prompt}]
    )
    
    ai_answer = resp['message']['content']
    
    return {
        "recommendation": ai_answer,
        "similar_cases": hits_data
    }

# --- [API 정의] ---
class ComplaintRequest(BaseModel):
    text: str

@router.post("/api/classify")
def classify_complaint(req: ComplaintRequest):
    try:
        result = get_department_recommendation(req.text)
        return result
    except Exception as e:
        print(f"Error in classify_complaint: {e}")
        raise HTTPException(status_code=500, detail=str(e))