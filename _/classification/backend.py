# backend.py
import os
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient

load_dotenv()

EMBEDDING_MODEL = "text-embedding-3-small"

class RAGRouterService:
    def __init__(
        self,
        qdrant_host: str = "localhost",
        qdrant_port: int = 6333,
        collection_name: str = "민원데이터",
        openai_api_key: str | None = None,
        upstage_api_key: str | None = None,
    ):
        self.collection_name = collection_name

        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        self.upstage_api_key = upstage_api_key or os.getenv("UPSTAGE_API_KEY")

        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY가 설정되어 있지 않습니다.")
        if not self.upstage_api_key:
            raise ValueError("UPSTAGE_API_KEY가 설정되어 있지 않습니다.")

        self.oa_client = OpenAI(api_key=self.openai_api_key)
        self.chat_client = OpenAI(
            api_key=self.upstage_api_key,
            base_url="https://api.upstage.ai/v1"
        )
        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)

    def get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        resp = self.oa_client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
        return [d.embedding for d in resp.data]

    def rag_search(self, question: str, top_k: int = 5):
        question = (question or "").strip()
        if not question:
            raise ValueError("질문이 비어 있어요. 입력해 주세요 🙂")

        q_embs = self.get_embeddings_batch([question])
        if not q_embs:
            raise RuntimeError("임베딩을 생성하지 못했어요.")

        results = self.qdrant.query_points(
            collection_name=self.collection_name,
            query=q_embs[0],
            limit=top_k,
            with_payload=True
        )
        return results

    def choose_department_with_llm(self, query_text: str, hits) -> str:
        examples_text = ""
        for h in hits.points:
            p = h.payload or {}
            examples_text += (
                f"- 문의내용: {p.get('문의내용', '')}\n"
                f"  부서: {p.get('답변부서', '')}\n\n"
            )

        prompt = f"""
너는 민원 라우팅 보조 시스템이다.

아래는 과거 민원 문의내용과 실제로 배정된 담당 부서 목록이다.

[과거 민원 사례]
{examples_text}

위 사례들을 참고해서, 아래 '새 민원'에 대해 가장 적절한 담당 부서 하나를 골라라.
반드시 위 사례에서 등장한 부서명 중 하나만 고르거나, 적절한 부서가 없을 경우 '추가민원'을 출력하라.
그리고 그 이유를 작성하라.

[새 민원]
\"\"\"{query_text}\"\"\"
"""

        resp = self.chat_client.chat.completions.create(
            model="solar-pro2",
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.choices[0].message.content.strip()

    def route(self, question: str, top_k: int = 5):
        """한 번에: 검색 + 부서 선택"""
        hits = self.rag_search(question, top_k=top_k)
        answer = self.choose_department_with_llm(question, hits)
        return answer, hits
