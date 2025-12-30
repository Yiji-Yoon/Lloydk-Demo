// src/api/base44Client.js (내용 교체)

export const base44 = {
  auth: {
    me: async () => null, // 가짜 로그인 정보
    logout: () => {},
  },
  entities: {
    DemoService: {
      list: async () => [], // 빈 리스트 반환
    }
  }
};