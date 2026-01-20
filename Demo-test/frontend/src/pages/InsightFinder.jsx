import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Building2, TrendingUp, AlertCircle,
  CheckCircle2, Clock, ArrowLeft, Lightbulb,
  FileText, BarChart3, Target, Users, DollarSign,
  Newspaper, Sparkles, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// 목 데이터: 분석 진행 단계
const analysisSteps = [
  { id: 1, label: '회사 정보 수집', icon: Building2 },
  { id: 2, label: '뉴스 크롤링', icon: Newspaper },
  { id: 3, label: '데이터 분석', icon: BarChart3 },
  { id: 4, label: '인사이트 생성', icon: Lightbulb },
  { id: 5, label: '제안서 작성', icon: FileText }
];

// 목 데이터: 분석 결과
const mockAnalysisResult = {
  company: "삼성전자",
  industry: "반도체/전자",
  analysisDate: "2026-01-14",
  newsCount: 127,
  newsInsights: [
    {
      id: 1,
      title: "반도체 시장 회복세 지속",
      summary: "삼성전자가 3분기 연속 영업이익 증가세를 기록하며 메모리 반도체 시장의 회복을 주도하고 있습니다.",
      sentiment: "positive",
      sources: 15,
      date: "2026-01-10"
    },
    {
      id: 2,
      title: "AI 칩 시장 진출 본격화",
      summary: "삼성전자가 AI 가속기 칩 개발에 대규모 투자를 발표하며 엔비디아와의 경쟁 구도를 예고했습니다.",
      sentiment: "positive",
      sources: 23,
      date: "2026-01-08"
    },
    {
      id: 3,
      title: "파운드리 사업 수율 개선 필요",
      summary: "삼성 파운드리의 3나노 공정 수율이 경쟁사 대비 낮아 추가 기술 개선이 필요한 상황입니다.",
      sentiment: "negative",
      sources: 8,
      date: "2026-01-05"
    }
  ],
  keyInsights: [
    {
      category: "시장 기회",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
      items: [
        "AI 반도체 시장 급성장 (연평균 40% 성장 예상)",
        "메모리 반도체 수요 회복세",
        "자동차용 반도체 시장 확대"
      ]
    },
    {
      category: "경쟁 우위",
      icon: Target,
      color: "text-blue-600 bg-blue-50",
      items: [
        "HBM3E 메모리 시장 선도",
        "종합 반도체 기업으로서의 시너지",
        "글로벌 생산 네트워크 확보"
      ]
    },
    {
      category: "주요 리스크",
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
      items: [
        "파운드리 수율 개선 지연",
        "중국 시장 불확실성",
        "기술 인력 확보 경쟁 심화"
      ]
    }
  ],
  recommendations: [
    {
      title: "AI 반도체 투자 확대",
      description: "AI 가속기 및 HBM 메모리 개발에 집중 투자하여 고부가가치 시장 선점",
      priority: "high",
      impact: "매출 20% 증가 예상",
      timeline: "2026 Q2-Q4"
    },
    {
      title: "파운드리 기술력 강화",
      description: "3나노 이하 공정 수율 개선 및 GAA 기술 조기 안정화",
      priority: "high",
      impact: "파운드리 수익성 개선",
      timeline: "2026-2027"
    },
    {
      title: "전략적 파트너십 구축",
      description: "AI 기업들과의 협력 강화 및 맞춤형 솔루션 제공",
      priority: "medium",
      impact: "신규 고객 확보",
      timeline: "2026 전반"
    }
  ],
  metrics: {
    marketShare: "17.3%",
    revenueGrowth: "+12.5%",
    sentiment: "85/100",
    innovationIndex: "92/100"
  }
};

export default function InsightFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  // 회사 검색 및 분석 시작
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep(0);
    setAnalysisResult(null);

    // 진행 상태 시뮬레이션
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisProgress(((i + 1) / analysisSteps.length) * 100);
    }

    // 분석 완료
    setAnalysisResult({
      ...mockAnalysisResult,
      company: searchQuery
    });
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setSearchQuery('');
    setAnalysisResult(null);
    setAnalysisProgress(0);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-600 hover:text-purple-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            데모 현황으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-600/10">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">인사이트파인더</h1>
              <p className="text-slate-600">기업 뉴스 분석을 통한 시장 인사이트 및 전략 제안</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">시연 가능</Badge>
        </div>

        {/* 회사 검색 */}
        {!analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-600" />
                  회사 검색
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="분석할 회사명을 입력하세요 (예: 삼성전자, 현대자동차)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 text-lg"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-purple-600 hover:bg-purple-700 px-8"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    분석 시작
                  </Button>
                </div>

                {/* 샘플 회사 */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 mb-3">샘플 회사</p>
                  <div className="flex flex-wrap gap-2">
                    {['삼성전자', '현대자동차', 'SK하이닉스', 'LG에너지솔루션', '네이버'].map((company) => (
                      <Button
                        key={company}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(company)}
                        className="hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Building2 className="w-3 h-3 mr-1" />
                        {company}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 안내 메시지 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">AI 기반 종합 분석</p>
                      <p className="text-blue-700">
                        최근 뉴스, 재무 데이터, 시장 동향을 분석하여 실행 가능한 인사이트와 전략을 제공합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 분석 진행 중 */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600 animate-spin" />
                  {searchQuery} 분석 중...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={analysisProgress} className="h-2" />

                <div className="space-y-3">
                  {analysisSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          isCurrent
                            ? 'bg-purple-50 border-purple-300'
                            : isCompleted
                              ? 'bg-green-50 border-green-300'
                              : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isCurrent ? (
                          <Icon className="w-5 h-5 text-purple-600 animate-pulse" />
                        ) : (
                          <Icon className="w-5 h-5 text-slate-400" />
                        )}
                        <span className={`font-medium ${
                          isCurrent ? 'text-purple-900' : isCompleted ? 'text-green-900' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="text-center text-sm text-slate-600">
                  예상 소요 시간: 약 {analysisSteps.length * 1.5}초
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 분석 결과 */}
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 결과 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {analysisResult.company} 분석 결과
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {analysisResult.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <Newspaper className="w-4 h-4" />
                    {analysisResult.newsCount}개 뉴스 분석
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {analysisResult.analysisDate}
                  </span>
                </div>
              </div>
              <Button onClick={handleReset} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                새로운 검색
              </Button>
            </div>

            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries({
                '시장 점유율': { value: analysisResult.metrics.marketShare, icon: Target },
                '매출 성장률': { value: analysisResult.metrics.revenueGrowth, icon: TrendingUp },
                '시장 심리': { value: analysisResult.metrics.sentiment, icon: Users },
                '혁신 지수': { value: analysisResult.metrics.innovationIndex, icon: Sparkles }
              }).map(([label, data]) => {
                const Icon = data.icon;
                return (
                  <Card key={label}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">{label}</span>
                        <Icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{data.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 탭 컨텐츠 */}
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="news">
                  <Newspaper className="w-4 h-4 mr-2" />
                  뉴스 인사이트
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  핵심 인사이트
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <FileText className="w-4 h-4 mr-2" />
                  전략 제안
                </TabsTrigger>
              </TabsList>

              {/* 뉴스 인사이트 탭 */}
              <TabsContent value="news" className="space-y-4 mt-6">
                {analysisResult.newsInsights.map((news) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{news.title}</CardTitle>
                            <p className="text-slate-600">{news.summary}</p>
                          </div>
                          <Badge
                            className={
                              news.sentiment === 'positive'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : news.sentiment === 'negative'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : 'bg-slate-100 text-slate-700'
                            }
                          >
                            {news.sentiment === 'positive' ? '긍정' : news.sentiment === 'negative' ? '부정' : '중립'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {news.sources}개 출처
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {news.date}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              {/* 핵심 인사이트 탭 */}
              <TabsContent value="insights" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisResult.keyInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${insight.color}`}>
                              <Icon className="w-4 h-4" />
                              <CardTitle className="text-base">{insight.category}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {insight.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                  <ArrowRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* 전략 제안 탭 */}
              <TabsContent value="recommendations" className="space-y-4 mt-6">
                {analysisResult.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <Badge
                                className={
                                  rec.priority === 'high'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }
                              >
                                {rec.priority === 'high' ? '높음' : '중간'} 우선순위
                              </Badge>
                            </div>
                            <p className="text-slate-600">{rec.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-medium text-blue-900">예상 효과</span>
                            </div>
                            <p className="text-sm text-blue-800">{rec.impact}</p>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-medium text-purple-900">추진 일정</span>
                            </div>
                            <p className="text-sm text-purple-800">{rec.timeline}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* 보고서 다운로드 */}
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">종합 분석 보고서</h3>
                        <p className="text-sm text-slate-600">
                          전체 분석 결과를 PDF 형식으로 다운로드하실 수 있습니다.
                        </p>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <FileText className="w-4 h-4 mr-2" />
                        보고서 다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
