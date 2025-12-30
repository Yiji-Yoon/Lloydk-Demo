import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, FileText, Download, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: '1월', sales: 4200, target: 4000, growth: 5 },
  { month: '2월', sales: 3800, target: 4000, growth: -5 },
  { month: '3월', sales: 5100, target: 4500, growth: 15 },
  { month: '4월', sales: 4800, target: 4500, growth: 7 },
  { month: '5월', sales: 5500, target: 5000, growth: 10 },
  { month: '6월', sales: 6200, target: 5500, growth: 12 },
];

const reportTemplates = [
  { id: 'monthly_sales', name: '월간 매출 보고서', description: '월별 매출 실적 및 분석' },
  { id: 'quarterly_performance', name: '분기 실적 보고서', description: '분기별 KPI 달성 현황' },
  { id: 'product_analysis', name: '제품 분석 보고서', description: '제품별 판매 실적 분석' },
];

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 2500);
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const avgGrowth = (salesData.reduce((sum, item) => sum + item.growth, 0) / salesData.length).toFixed(1);
  const lastMonthSales = salesData[salesData.length - 1].sales;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-600 hover:text-purple-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            데모 현황으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">보고서 자동 생성</h1>
              <p className="text-slate-600">데이터를 기반으로 업무 보고서를 자동으로 생성합니다</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">시연 가능</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">보고서 설정</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">템플릿 선택</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="템플릿을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <h4 className="font-semibold text-slate-800 mb-1">
                    {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {reportTemplates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </motion.div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!selectedTemplate || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    보고서 생성
                  </>
                )}
              </Button>

              {showReport && (
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 다운로드
                </Button>
              )}

              <div className="pt-6 border-t space-y-3">
                <h4 className="font-semibold text-slate-800 text-sm">최근 생성 보고서</h4>
                {['2024년 6월 매출 보고서', '2024년 2분기 실적 보고서', '제품 A 분석 보고서'].map((item, idx) => (
                  <div key={idx} className="text-sm text-slate-600 hover:text-purple-600 cursor-pointer flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">보고서 미리보기</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!showReport ? (
                <div className="h-[600px] flex items-center justify-center text-center">
                  <div>
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">템플릿을 선택하고 보고서를 생성하세요</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Report Header */}
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">2024년 상반기 매출 보고서</h2>
                    <p className="text-slate-600">생성일: 2024년 6월 30일</p>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">요약</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-sm text-blue-600 mb-1">총 매출</div>
                        <div className="text-2xl font-bold text-blue-700">{totalSales.toLocaleString()}만원</div>
                      </div>
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                        <div className="text-sm text-emerald-600 mb-1">평균 성장률</div>
                        <div className="text-2xl font-bold text-emerald-700 flex items-center gap-1">
                          <TrendingUp className="w-5 h-5" />
                          {avgGrowth}%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="text-sm text-purple-600 mb-1">6월 매출</div>
                        <div className="text-2xl font-bold text-purple-700">{lastMonthSales.toLocaleString()}만원</div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">월별 매출 추이</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8b5cf6" name="실제 매출" />
                        <Bar dataKey="target" fill="#cbd5e1" name="목표" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">주요 인사이트</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                        <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-emerald-800">지속적인 성장세</div>
                          <div className="text-sm text-emerald-700">3월부터 목표를 초과 달성하며 안정적인 성장을 보이고 있습니다.</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-800">6월 최고 실적</div>
                          <div className="text-sm text-blue-700">6월 매출이 6,200만원으로 상반기 최고치를 기록했습니다.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Predictions */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      AI 기반 미래 예측
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-800">7월 예상 매출</h4>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">예측</Badge>
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mb-2">6,800만원</div>
                        <p className="text-sm text-purple-700">현재 추세 기반 +9.7% 성장 예상</p>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">하반기 전망</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                          <p>• 현재 성장 추세 유지 시 하반기 목표 달성 가능성 <strong>87%</strong></p>
                          <p>• 8-9월 성수기 집중 마케팅 권장</p>
                          <p>• 신규 제품 라인 추가 시 +15% 매출 증대 예상</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-3 text-sm">추천 액션</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                            성장 동력 분석 리포트 생성
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                            하반기 목표 시뮬레이션 실행
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                            경쟁사 벤치마크 분석
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}