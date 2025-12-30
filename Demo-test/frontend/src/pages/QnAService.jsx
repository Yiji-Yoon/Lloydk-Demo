import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils'; // 경로 주의 (@/utils)
import axios from 'axios'; // axios 임포트 확인
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 샘플 질문 데이터 (클릭하면 바로 질문 입력되게 하려고 남겨둠)
const sampleQnA = [
  {
    question: "연차 신청은 어떻게 하나요?",
    category: "인사",
  },
  {
    question: "업무용 소프트웨어 구매 절차는?",
    category: "IT",
  },
  {
    question: "경조사 휴가 일수는?",
    category: "인사",
  }
];

export default function QnAService() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 [핵심] 여기가 진짜 백엔드와 통신하는 부분입니다!
  const handleAsk = async () => {
    if (!question.trim()) return;

    // 1. 내 질문을 먼저 말풍선으로 띄움
    const userMessage = { type: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    
    const currentQuestion = question; // api 요청용 저장
    setQuestion(''); // 입력창 비우기
    setIsLoading(true); // 로딩 시작

    try {
      // 2. 파이썬(FastAPI)에게 질문 전송 (/api/chat)
      // (주의: 파이썬 main.py에 /api/chat 기능이 만들어져 있어야 함)
      const res = await axios.post('/api/chat', { query: currentQuestion });
      
      // 3. 파이썬이 준 대답을 받아옴
      const aiMessage = {
        type: 'ai',
        text: res.data.answer,
        // 백엔드에서 카테고리/점수를 안 주면 기본값 사용
        category: res.data.category || "AI 답변", 
        confidence: res.data.confidence || 98
      };
      
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("질문 실패:", error);
      // 에러 나면 빨간 말풍선 띄우기
      const errorMessage = { 
        type: 'ai', 
        text: "죄송합니다. AI 서버 연결에 실패했습니다. (백엔드가 켜져 있나요?)",
        category: "Error",
        confidence: 0
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const handleSampleClick = (q) => {
    setQuestion(q);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            데모 현황으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Q&A 서비스</h1>
              <p className="text-slate-600">업무 관련 질문에 AI가 즉시 답변합니다</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">시연 가능</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col h-[600px]">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">AI 어시스턴트</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">무엇을 도와드릴까요?</h3>
                    <p className="text-slate-500">업무 관련 질문을 입력하거나 샘플 질문을 선택하세요</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {chatHistory.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        
                        {/* 👇 [수정 2] 기존 <p>{msg.text}</p>를 지우고 아래 내용으로 교체 */}
                        <div className="text-sm leading-relaxed overflow-hidden">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // 리스트 점(•)이 보이게 설정
                              ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2" {...props} />,
                              // 제목 스타일
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold my-3" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold my-2" {...props} />,
                              // 굵은 글씨
                              strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                              // 테이블 스타일 (테두리, 여백 등)
                              table: ({node, ...props}) => <table className="border-collapse border border-slate-300 w-full my-3 text-sm" {...props} />,
                              th: ({node, ...props}) => <th className="border border-slate-300 p-2 bg-slate-200/50 font-bold" {...props} />,
                              td: ({node, ...props}) => <td className="border border-slate-300 p-2" {...props} />,
                              // 링크 스타일
                              a: ({node, ...props}) => <a className="text-blue-500 underline hover:text-blue-700" target="_blank" {...props} />,
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                        {/* 👆 [수정 끝] */}

                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                            {/* ... (기존 하단 뱃지 코드는 그대로 둠) ... */}
                            <Badge variant="outline" className="text-xs">{msg.category}</Badge>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              신뢰도 {msg.confidence}%
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="질문을 입력하세요..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  className="flex-1"
                />
                <Button onClick={handleAsk} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Sample Questions (우측 패널) */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">샘플 질문</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleQnA.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(item.question)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <p className="text-sm font-medium text-slate-800">{item.question}</p>
                    <Badge variant="outline" className="mt-2 text-xs">{item.category}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">서비스 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">평균 응답 시간</span>
                    <span className="text-lg font-bold text-blue-600">0.8초</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">정확도</span>
                    <span className="text-lg font-bold text-emerald-600">94.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">월간 질문 수</span>
                    <span className="text-lg font-bold text-slate-800">2,845</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 추가 정보 카드 생략 (기존 유지) */}
          </div>
        </div>
      </div>
    </div>
  );
}