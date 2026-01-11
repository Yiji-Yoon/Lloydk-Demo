# backend/app.py
import os
from qdrant_client import QdrantClient
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ollama
from sentence_transformers import SentenceTransformer
from typing import Literal, List

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://host.docker.internal:11434")
client = ollama.Client(host=OLLAMA_HOST)


# Qdrant 클라이언트 (로컬)
qdrant_host = os.getenv("QDRANT_HOST")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
client_qd = QdrantClient(
    url=qdrant_host,       # <--- 'host=' 대신 'url='을 써야 https:// 를 받아줍니다!
    api_key=qdrant_api_key
)

EMBED_MODEL = "Qwen/Qwen3-Embedding-0.6B"
EMBED_DIM = 1024
COLLECTION_NAME = "lloydk_docs"
model = SentenceTransformer(EMBED_MODEL, trust_remote_code=True)

router = APIRouter()

# 데이터 모델 정의
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    query: str
    history: List[ChatMessage] = []

def embed_batch(texts):
    cleaned = [str(t).strip() for t in texts if str(t).strip()]
    
    if not cleaned: 
        return None, []
        
    # model.encode는 numpy array를 반환합니다.
    resp = model.encode(cleaned, normalize_embeddings=True)
    return resp, cleaned

def rag_logic(question: str, history: list[ChatMessage]) -> str:
    question = question.strip()
    if not question:
        return "질문을 입력해주세요."

    # 1) 검색은 여전히 '이번 질문' 기준으로만
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

    contexts = [r.payload["text"] for r in results.points if "text" in r.payload]
    if not contexts:
        return "죄송합니다. 관련 문서를 찾지 못했습니다."

    context_text = "\n\n".join(contexts)

    system_prompt = (
        "너는 로이드케이 및 DO 솔루션 관련 기술 문서 어시스턴트야. "
        "제공된 문맥 내에서만 답변해. "
        "또한 사용자가 자세히 설명해달라 요청한 것이 아닌 이상, "
        "어느 정도 간단히 답변해 줘."
    )

    # 이번 턴에서 실제로 전달할 user 메시지 내용
    user_prompt = (
        f"[질문]\n{question}\n\n"
        f"[관련 문서]\n{context_text}\n\n"
        "위 정보를 바탕으로 한국어로 답변해줘."
    )

    # 2) Ollama에 넘길 messages 구성
    messages = [{"role": "system", "content": system_prompt}]

    MAX_HISTORY = 4
    trimmed_history = history[-MAX_HISTORY:]

    for m in trimmed_history:
        messages.append({"role": m.role, "content": m.content})

    # 마지막에 이번 질문 + 컨텍스트 붙인 user 메시지
    messages.append({"role": "user", "content": user_prompt})

    resp = client.chat(
        model='gpt-oss:20b',
        messages=messages,
    )
    return resp["message"]["content"]


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
