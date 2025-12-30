import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertCircle, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const sampleDocument = `회사 소개
저희 회사는 2015년에 설립되었으며, 혁신적인 솔루션을 제공하고있습니다. 

주요 제품
1. 인공지능 분석 플랫폼
2. 빅데이타 처리 시스템
3. 클라우드 통합 서비스

연락처
이메일: contact@company.com
전화: 02-1234-5678

※ 추가 문의사항은 고객센타로 연락주세요.`;

const checkResults = [
  { type: 'error', category: '맞춤법', text: '제공하고있습니다', suggestion: '제공하고 있습니다', line: 2 },
  { type: 'error', category: '띄어쓰기', text: '빅데이타', suggestion: '빅데이터', line: 6 },
  { type: 'warning', category: '표기법', text: '고객센타', suggestion: '고객센터', line: 12 },
  { type: 'info', category: '일관성', text: '제품 번호 형식', suggestion: '번호 형식을 통일하세요 (1, 2, 3 또는 ①, ②, ③)', line: 5 }
];

export default function DocumentQuality() {
  const [document, setDocument] = useState('');
  const [results, setResults] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = () => {
    setIsChecking(true);
    setHasChecked(false);
    
    setTimeout(() => {
      setResults(checkResults);
      setIsChecking(false);
      setHasChecked(true);
    }, 2000);
  };

  const loadSample = () => {
    setDocument(sampleDocument);
    setResults([]);
    setHasChecked(false);
  };

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const infoCount = results.filter(r => r.type === 'info').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-600 hover:text-emerald-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            데모 현황으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">문서 품질 및 오류 관리</h1>
              <p className="text-slate-600">문서의 오탈자, 문법 오류, 형식 오류를 자동으로 검출합니다</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">시연 가능</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">문서 입력</CardTitle>
                <Button onClick={loadSample} variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  샘플 불러오기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="검사할 문서를 입력하세요..."
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <Button
                onClick={handleCheck}
                disabled={!document || isChecking}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                {isChecking ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    검사 중...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    문서 검사하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Area */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">검사 결과</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!hasChecked ? (
                <div className="h-[450px] flex items-center justify-center text-center">
                  <div>
                    <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">문서를 입력하고 검사를 시작하세요</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                      <div className="text-xs text-red-600">오류</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
                      <div className="text-xs text-amber-600">경고</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{infoCount}</div>
                      <div className="text-xs text-blue-600">제안</div>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div className="space-y-3 max-h-[320px] overflow-y-auto">
                    <AnimatePresence>
                      {results.map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            result.type === 'error' 
                              ? 'bg-red-50 border-red-200' 
                              : result.type === 'warning'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {result.type === 'error' ? (
                              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            ) : result.type === 'warning' ? (
                              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{result.category}</Badge>
                                <span className="text-xs text-slate-500">라인 {result.line}</span>
                              </div>
                              <div className="text-sm">
                                <div className="font-mono text-slate-700 line-through mb-1">{result.text}</div>
                                <div className="font-mono text-slate-900 font-semibold">→ {result.suggestion}</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">서비스 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12,458</div>
                  <div className="text-sm text-slate-600 mt-1">검사 완료 문서</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">98.2%</div>
                  <div className="text-sm text-slate-600 mt-1">정확도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">1.2초</div>
                  <div className="text-sm text-slate-600 mt-1">평균 검사 시간</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">15,392</div>
                  <div className="text-sm text-slate-600 mt-1">수정 제안</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI 분석 인사이트
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">주요 오류 패턴</h4>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>띄어쓰기 오류</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>맞춤법 오류</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>표기 일관성</span>
                    <span className="font-semibold">23%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  개선 제안
                </h4>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>• 문서 작성 가이드라인 업데이트 권장</p>
                  <p>• 자주 발생하는 오류에 대한 교육 자료 제작 필요</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">다음 단계</h4>
                <Button variant="outline" size="sm" className="w-full justify-start text-left mb-2">
                  문서 품질 리포트 생성
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  맞춤 스타일 가이드 설정
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}