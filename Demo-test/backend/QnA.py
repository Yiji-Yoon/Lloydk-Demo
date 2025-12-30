# backend/app.py
import os
from qdrant_client import QdrantClient
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ollama
from sentence_transformers import SentenceTransformer

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")
client = ollama.Client(host=OLLAMA_HOST)


# Qdrant 클라이언트 (로컬)
client_qd = QdrantClient(
    host=os.getenv("QDRANT_HOST", "192.168.123.60"),
    port=int(os.getenv("QDRANT_PORT", 6333)),
)


EMBED_MODEL = "Qwen/Qwen3-Embedding-0.6B"
EMBED_DIM = 1024
COLLECTION_NAME = "lloydk_docs"
model = SentenceTransformer(EMBED_MODEL, trust_remote_code=True)

router = APIRouter()

# 데이터 모델 정의
class ChatRequest(BaseModel):
    query: str

def embed_batch(texts):
    cleaned = [str(t).strip() for t in texts if str(t).strip()]
    
    if not cleaned: 
        return None, []
        
    # model.encode는 numpy array를 반환합니다.
    resp = model.encode(cleaned, normalize_embeddings=True)
    return resp, cleaned

def rag_logic(question: str) -> str:
    question = question.strip()
    if not question: 
        return "질문을 입력해주세요."

    q_emb, _ = embed_batch([question])
    if q_emb is None or len(q_emb) == 0: 
        return "임베딩 실패"
    query_vector = q_emb[0]

    results = client_qd.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=5,
        with_payload=True
    )
    
    # 검색 결과에서 텍스트 추출
    contexts = [r.payload["text"] for r in results.points if "text" in r.payload]
    if not contexts: 
        return "죄송합니다. 관련 문서를 찾지 못했습니다."

    context_text = "\n\n".join(contexts)
    system_prompt = "너는 DO 솔루션 관련 기술 문서 어시스턴트야. 제공된 문맥 내에서만 답변해. 또한 사용자가 자세히 설명해달라 요청한 것이 아닌 이상, 어느 정도 간단히 답변해 줘."
    user_prompt = f"[질문]\n{question}\n\n[관련 문서]\n{context_text}\n\n한국어로 답변해줘."

    # Ollama를 통한 답변 생성
    resp = client.chat(
        model='gpt-oss:20b',
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return resp['message']['content']

# --- [API 엔드포인트] ---
# @app.post 대신 @router.post를 씁니다.
@router.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    print(f"사용자 질문 도착: {request.query}")
    try:
        answer = rag_logic(request.query)
        return {"answer": answer}
    except Exception as e:
        print(f"에러 발생: {e}")
        return {"answer": "죄송합니다. 서버 에러가 발생했습니다."}
