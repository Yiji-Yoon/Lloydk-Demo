from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from QnA import router as qna_router
from complaint_service import router as complaint_router

app = FastAPI()

# [CORS 설정] 리액트(5173)가 요청 보내는 것을 허락해줌
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.123.60:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(qna_router)
app.include_router(complaint_router)

@app.get("/api/demos")
def get_demos():
    return [
        # 1. 임직원 공통 서비스
        {
            "id": 1,
            "title": "Q&A 서비스",
            "description": "임직원들의 업무 관련 질문에 AI가 즉시 답변하는 지능형 Q&A 시스템입니다.",
            "category": "employee",
            "status": "completed",
            "icon": "brain",
            "expected_date": None,
            "externalLink": None
        },
        {
            "id": 2,
            "title": "문서 품질 및 오류 관리",
            "description": "문서의 오탈자, 문법 오류, 형식 불일치를 AI가 자동으로 검토하고 수정 제안을 제공합니다.",
            "category": "employee",
            "status": "completed",
            "icon": "shield",
            "expected_date": None,
            "externalLink": None
        },
        {
            "id": 3,
            "title": "보고서 자동 생성",
            "description": "수집된 데이터를 분석하여 업무 보고서를 자동으로 생성하는 솔루션입니다.",
            "category": "employee",
            "status": "completed",
            "icon": "zap",
            "expected_date": None,
            "externalLink": None
        },
        {
            "id": 101,
            "title": "회의록 자동 생성",
            "description": "음성을 텍스트로 변환하고 회의 내용을 요약합니다.",
            "category": "employee",
            "status": "in_progress",
            "icon": "file-text",
            "expected_date": "2025-01-15",
            "externalLink": None
        },
        {
            "id": 102,
            "title": "인사이트 파인더",
            "description": "뉴스 기사를 수집하여 유의미한 인사이트를 자동으로 발굴합니다.",
            "category": "employee",
            "status": "in_progress",
            "icon": "search",
            "expected_date": "2025-02-01",
            "externalLink": None
        },

        # 2. 고객 대응 서비스
        {
            "id": 4,
            "title": "고객 상담 요약 봇",
            "description": "고객과의 통화 내용을 텍스트로 변환하고 핵심 내용을 요약합니다.",
            "category": "customer",
            "status": "in_progress",
            "icon": "headphones",
            "expected_date": "2025-01-20",
            "externalLink": None
        },
        {
            "id": 201,
            "title": "민원 분류기",
            "description": "접수된 민원을 AI가 분석하여 담당 부서로 자동 배정합니다.",
            "category": "customer",
            "status": "completed",
            "icon": "filter",
            "expected_date": None,
            "externalLink": None
        },
        {
            "id": 202,
            "title": "VoC 자동 답변",
            "description": "반복되는 고객 문의에 대해 AI가 적절한 답변을 생성합니다.",
            "category": "customer",
            "status": "in_progress",
            "icon": "message-circle",
            "expected_date": "2025-02-10",
            "externalLink": None
        },

        # 3. 내부 관리 및 보안
        {
            "id": 301,
            "title": "이상거래탐지",
            "description": "실시간 거래 데이터를 분석하여 부정 행위를 탐지합니다.",
            "category": "security",
            "status": "in_progress",
            "icon": "alert-triangle",
            "expected_date": "2025-01-25",
            "externalLink": None
        },
        {
            "id": 302,
            "title": "이상행위탐지",
            "description": "시스템 로그를 분석하여 비정상적인 접근이나 행위를 차단합니다.",
            "category": "security",
            "status": "in_progress",
            "icon": "user-x",
            "expected_date": "2025-02-15",
            "externalLink": None
        },

        # 4. 경영 관리
        {
            "id": 6,
            "title": "부진재고 관리 및 예측",
            "description": "오랫동안 팔리지 않는 재고를 식별하고 처리 방안을 제안합니다.",
            "category": "management",
            "status": "completed",
            "icon": "box",
            "expected_date": None,
            # 👇 설정하신 외부 링크 (구글)
            "externalLink": "https://sec-demo.lloydk.ai/ko/owui-chat" 
        },
        {
            "id": 401,
            "title": "생산출하량 예측",
            "description": "시장 데이터를 기반으로 최적의 생산 및 출하량을 예측합니다.",
            "category": "management",
            "status": "in_progress",
            "icon": "chart",
            "expected_date": "2025-03-01",
            "externalLink": None
        }
    ]
