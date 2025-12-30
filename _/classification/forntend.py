# app.py
import streamlit as st
from backend import RAGRouterService

st.set_page_config(page_title="민원 라우팅 RAG", page_icon="📨", layout="wide")
st.title("📨 민원 라우팅 RAG")

with st.sidebar:
    st.header("설정")
    collection_name = st.text_input("Qdrant 컬렉션명", "민원데이터")
    top_k = st.slider("검색 Top-K", 1, 20, 5)
    show_hits = st.checkbox("유사 민원 보기", True)

@st.cache_resource
def get_service(collection: str):
    # 컬렉션명이 바뀌면 서비스도 새로 만들도록 캐시키를 컬렉션에 둠
    return RAGRouterService(collection_name=collection)

service = get_service(collection_name)

question = st.text_area("새 민원(질문)", value="답변좀 씹지 마세요!!", height=120)
run_btn = st.button("🚀 담당부서 추천", use_container_width=True)

if run_btn:
    try:
        with st.spinner("담당부서를 추천하는 중..."):
            answer, hits = service.route(question, top_k=top_k)

        st.subheader("✅ 추천 결과")
        st.write(answer)

        if show_hits:
            st.subheader("🔎 유사 민원 검색 결과")
            for i, pt in enumerate(hits.points, start=1):
                p = pt.payload or {}
                st.markdown(
                    f"""
**#{i} (score: {getattr(pt, 'score', None)})**  
- 문의내용: {p.get('문의내용','')}  
- 답변부서: {p.get('답변부서','')}
"""
                )

    except Exception as e:
        st.exception(e)


# streamlit run forntend.py