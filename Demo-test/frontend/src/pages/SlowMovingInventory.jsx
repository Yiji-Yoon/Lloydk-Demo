import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BarChart, TrendingDown, Package, AlertTriangle, ArrowLeft, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const inventoryData = [
  { id: 1, product: '무선 마우스 X200', category: 'IT기기', stock: 450, daysInStock: 180, value: 22500, status: 'critical' },
  { id: 2, product: '책상 LED 스탠드', category: '사무용품', stock: 320, daysInStock: 150, value: 16000, status: 'warning' },
  { id: 3, product: '모니터 거치대', category: 'IT기기', stock: 280, daysInStock: 145, value: 14000, status: 'warning' },
  { id: 4, product: '키보드 K100', category: 'IT기기', stock: 520, daysInStock: 210, value: 26000, status: 'critical' },
  { id: 5, product: '사무용 의자 매트', category: '사무용품', stock: 190, daysInStock: 120, value: 9500, status: 'warning' },
  { id: 6, product: 'USB 허브', category: 'IT기기', stock: 600, daysInStock: 240, value: 18000, status: 'critical' },
];

const categoryData = [
  { name: 'IT기기', value: 60, color: '#3b82f6' },
  { name: '사무용품', value: 30, color: '#8b5cf6' },
  { name: '기타', value: 10, color: '#64748b' },
];

const monthlyTrend = [
  { month: '1월', count: 45 },
  { month: '2월', count: 52 },
  { month: '3월', count: 48 },
  { month: '4월', count: 61 },
  { month: '5월', count: 58 },
  { month: '6월', count: 65 },
];

export default function SlowMovingInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const criticalCount = inventoryData.filter(item => item.status === 'critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center text-slate-600 hover:text-amber-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            데모 현황으로 돌아가기
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10">
              <BarChart className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">부진재고 관리</h1>
              <p className="text-slate-600">재고 데이터를 분석하여 부진 재고를 식별하고 처리 방안을 제안합니다</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">시연 가능</Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">총 부진재고</div>
              <div className="text-3xl font-bold text-slate-800">{inventoryData.length}</div>
              <div className="text-xs text-slate-500 mt-1">개 품목</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">총 재고 금액</div>
              <div className="text-3xl font-bold text-amber-600">{totalValue.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">만원</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">긴급 처리 필요</div>
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-slate-500 mt-1">개 품목</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">평균 재고 기간</div>
              <div className="text-3xl font-bold text-purple-600">172</div>
              <div className="text-xs text-slate-500 mt-1">일</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Inventory List */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">부진재고 목록</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterStatus(filterStatus === 'all' ? 'critical' : 'all')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {filterStatus === 'all' ? '전체' : '긴급'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {filteredData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      item.status === 'critical' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          item.status === 'critical' ? 'bg-red-100' : 'bg-amber-100'
                        }`}>
                          <Package className={`w-5 h-5 ${
                            item.status === 'critical' ? 'text-red-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{item.product}</h4>
                          <p className="text-sm text-slate-600">{item.category}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={item.status === 'critical' 
                          ? 'bg-red-100 text-red-700 border-red-200' 
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                        }
                      >
                        {item.status === 'critical' ? '긴급' : '경고'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">재고 수량</div>
                        <div className="font-semibold text-slate-800">{item.stock}개</div>
                      </div>
                      <div>
                        <div className="text-slate-600">재고 기간</div>
                        <div className="font-semibold text-slate-800">{item.daysInStock}일</div>
                      </div>
                      <div>
                        <div className="text-slate-600">재고 금액</div>
                        <div className="font-semibold text-slate-800">{item.value.toLocaleString()}만</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>제안: 할인 프로모션 또는 번들 판매 추천</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">카테고리별 분포</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {categoryData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">월별 추이</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsBar data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </RechartsBar>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-amber-600" />
                  AI 부진 원인 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2 text-sm">주요 원인</h4>
                  <div className="space-y-2 text-sm text-red-700">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>신제품 출시로 구형 모델 수요 급감</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>경쟁사 대비 가격 경쟁력 부족</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>마케팅 노출 부족 (조회수 평균 -45%)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">최적 처리 전략</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-800 text-sm">단계별 할인</span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">우선순위 1</Badge>
                      </div>
                      <p className="text-xs text-blue-700">150일 이상: 30% 할인</p>
                      <p className="text-xs text-blue-700">180일 이상: 50% 할인</p>
                      <div className="mt-2 text-xs font-semibold text-blue-800">
                        예상 효과: 재고 금액 회수율 78%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-purple-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-purple-800 text-sm">번들 & 크로스셀</span>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">우선순위 2</Badge>
                      </div>
                      <p className="text-xs text-purple-700">인기 신제품과 묶음 구성</p>
                      <div className="mt-2 text-xs font-semibold text-purple-800">
                        예상 효과: 판매량 +35%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-emerald-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-emerald-800 text-sm">B2B 대량 판매</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">우선순위 3</Badge>
                      </div>
                      <p className="text-xs text-emerald-700">중소기업 타겟 특가 제안</p>
                      <div className="mt-2 text-xs font-semibold text-emerald-800">
                        예상 효과: 대량 소진 가능
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3 text-sm">실행 액션</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                      할인 프로모션 자동 생성
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                      B2B 제안서 작성
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs">
                      번들 상품 최적화 분석
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}