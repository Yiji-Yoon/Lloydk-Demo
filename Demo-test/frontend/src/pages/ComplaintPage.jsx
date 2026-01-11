import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, FileText, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // 마크다운 설치하셨으니 사용!

export default function ComplaintPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      // FastAPI로 요청
      const res = await axios.post('/api/classify', {
        text: input
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-slate-600 mb-6 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> 메인으로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">📨 민원 자동 분류기</h1>
        <p className="text-slate-600 mb-8">민원 내용을 입력하면 AI가 담당 부서를 추천하고 유사 사례를 찾아줍니다.</p>
        <p className="text-sm text-gray-500 mb-4">해당 데모는 국토안전관리원 민원데이터를 사용합니다.</p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 입력 카드 */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>민원 내용 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-40 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 가로등이 깜빡거려서 밤에 너무 무서워요. 빨리 고쳐주세요."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
                onClick={handleClassify}
                disabled={loading}
              >
                {loading ? "분석 중..." : "🚀 담당 부서 찾기"}
              </Button>
            </CardContent>
          </Card>

          {/* 결과 카드 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Building2 className="w-5 h-5" />
                      AI 추천 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-slate-800">
                      <ReactMarkdown>{result.recommendation}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700">
                      <Search className="w-5 h-5" />
                      유사 민원 사례 (Top 5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.similar_cases.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-100 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                          <Badge variant="secondary" className="bg-white border-slate-200">
                            유사도: {item.score}
                          </Badge>
                          <span className="font-bold text-slate-700">{item.department}</span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">
                          <FileText className="w-3 h-3 inline mr-1" />
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}