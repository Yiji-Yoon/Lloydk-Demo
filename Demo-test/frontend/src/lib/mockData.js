export const MOCK_DEMOS = [
  // ==============================================
  // 1. 임직원 공통 서비스 (Employee)
  // ==============================================
  {
    id: 1,
    title: "Q&A 서비스",
    category: "employee",
    status: "completed",
    icon: "brain",
    expected_date: null
  },
  {
    id: 2,
    title: "문서 품질 및 오류 관리",
    category: "employee",
    status: "completed",
    icon: "shield",
    expected_date: null
  },
  {
    id: 3,
    title: "보고서 자동 생성",
    category: "employee",
    status: "completed",
    icon: "zap",
    expected_date: null
  },
  // [오픈 예정]
  {
    id: 101,
    title: "회의록 자동 생성",
    category: "employee",
    status: "in_progress",
    icon: "file-text",
    expected_date: "2025-01-15"
  },
  {
    id: 102,
    title: "인사이트 파인더",
    category: "employee",
    status: "in_progress",
    icon: "search",
    expected_date: "2025-02-01"
  },

  // ==============================================
  // 2. 고객 대응 서비스 (Customer)
  // ==============================================
  {
    id: 4,
    title: "고객 상담 요약 봇",
    category: "customer",
    status: "completed",
    icon: "headphones",
    expected_date: null
  },
  // [오픈 예정]
  {
    id: 201,
    title: "민원 분류기",
    category: "customer",
    status: "in_progress",
    icon: "filter",
    expected_date: "2025-01-20"
  },
  {
    id: 202,
    title: "VoC 자동 답변",
    category: "customer",
    status: "in_progress",
    icon: "message-circle",
    expected_date: "2025-02-10"
  },

  // ==============================================
  // 3. 내부 관리 및 보안 (Security)
  // ==============================================
  // [오픈 예정]
  {
    id: 301,
    title: "이상거래탐지",
    category: "security",
    status: "in_progress",
    icon: "alert-triangle",
    expected_date: "2025-01-25"
  },
  {
    id: 302,
    title: "이상행위탐지",
    category: "security",
    status: "in_progress",
    icon: "user-x",
    expected_date: "2025-02-15"
  },

  // ==============================================
  // 4. 경영 관리 (Management)
  // ==============================================
  {
    id: 6,
    title: "부진재고 관리 및 예측",
    category: "management",
    status: "completed",
    icon: "box",
    expected_date: null,
    externalLink: "https://sec-demo.lloydk.ai/ko/owui-chat"
  },

  {
    id: 401,
    title: "생산출하량 예측",
    category: "management",
    status: "in_progress", // 미오픈 상태
    icon: "chart",         // 그래프 아이콘
    expected_date: "2025-03-01"
  }
];