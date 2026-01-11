import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Users, Headphones, ShieldAlert, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoCard from '../components/DemoCard';
import PortalHeader from '../components/PortalHeader';

// [핵심] 방금 만든 가짜 데이터를 불러옵니다.
import { MOCK_DEMOS } from "@/lib/mockData"; 

const categoryInfo = {
  employee: { label: '임직원 공통 서비스', icon: Users, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  customer: { label: '고객 대응 서비스', icon: Headphones, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  security: { label: '내부 관리 및 보안', icon: ShieldAlert, color: 'bg-red-50 border-red-200 text-red-700' },
  management: { label: '경영 관리', icon: TrendingUp, color: 'bg-purple-50 border-purple-200 text-purple-700' },
};

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 임시 관리자 계정 세팅 (사이드바 하단 표시용)
    setUser({ email: 'admin@myservice.com', full_name: '관리자' });
  }, []);

  // [핵심] Base44 대신 가짜 데이터를 반환하도록 설정
  // [안전장치 모드]
  const { data: demos = [], isLoading } = useQuery({
    queryKey: ['demos'],
    queryFn: async () => {
      try {
        // 백엔드 API 호출
        const response = await axios.get('/api/demos');
        console.log("✅ 백엔드 연결 성공!");
        return response.data; 

      } catch (error) {
        // 백엔드가 꺼져있거나 에러(404)가 나면, 가짜 데이터 사용
        console.warn("⚠️ 백엔드 연결 실패 (가짜 데이터 사용):", error.message);
        return MOCK_DEMOS; 
      }
    },
  });

  // --- 필터링 로직 (그대로 유지) ---
  const filteredDemos = demos.filter(demo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && demo.status === 'completed') ||
      (filter === 'upcoming' && demo.status === 'in_progress');
    
    const matchesCategory = categoryFilter === 'all' || demo.category === categoryFilter;
    
    const matchesSearch = !searchQuery || 
      demo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const completedCount = demos.filter(d => d.status === 'completed').length;
  const upcomingCount = demos.filter(d => d.status === 'in_progress').length;

  const demosByCategory = Object.keys(categoryInfo).reduce((acc, category) => {
    acc[category] = filteredDemos.filter(d => d.category === category);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 상단 헤더 (원본 사진의 파란색 배너) */}
      <PortalHeader />

      <div className="px-8 py-8 bg-white">
        {/* 툴바 (탭, 검색창, 카테고리 필터) */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-slate-600"
                >
                  전체 <span className="ml-1.5 text-xs text-slate-400">({demos.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-slate-600"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  시연 가능 <span className="ml-1.5 text-xs text-slate-400">({completedCount})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-slate-600"
                >
                  준비 중 <span className="ml-1.5 text-xs text-slate-400">({upcomingCount})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="데모 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                categoryFilter === 'all' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
              onClick={() => setCategoryFilter('all')}
            >
              전체 카테고리
            </Badge>
            {Object.entries(categoryInfo).map(([key, { label, icon: Icon, color }]) => {
              const count = demos.filter(d => d.category === key).length;
              return (
                <Badge
                  key={key}
                  variant="outline"
                  className={`cursor-pointer transition-all border ${
                    categoryFilter === key 
                      ? color
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  onClick={() => setCategoryFilter(key)}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {label} ({count})
                </Badge>
              );
            })}
          </div>
        </div>

        {/* 데모 카드 그리드 (여기에 데이터가 뿌려집니다) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 bg-slate-100 rounded-xl" />
            ))}
          </div>
        ) : filteredDemos.length > 0 ? (
          <div className="space-y-10">
            {Object.entries(categoryInfo).map(([categoryKey, { label, icon: CategoryIcon, color }]) => {
              const categoryDemos = demosByCategory[categoryKey];
              if (!categoryDemos || categoryDemos.length === 0) return null;

              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${color.includes('blue') ? 'border-blue-200' : color.includes('emerald') ? 'border-emerald-200' : color.includes('red') ? 'border-red-200' : 'border-purple-200'}`}>
                    <div className={`p-2.5 rounded-lg ${color}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{label}</h2>
                    <Badge variant="outline" className="ml-auto">
                      {categoryDemos.length}개 서비스
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {categoryDemos.map((demo, index) => (
                        // 여기가 중요! DemoCard 컴포넌트가 카드를 그립니다.
                        <DemoCard key={demo.id} demo={demo} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // 데이터가 없을 때 나오는 화면 (이제 이 화면은 안 나올 겁니다)
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {demos.length === 0 ? "데이터를 불러올 수 없습니다" : "검색 결과가 없습니다"}
            </h3>
            <p className="text-slate-500">
              {demos.length === 0 
                ? "백엔드 연결 상태를 확인해주세요." 
                : "다른 키워드로 검색해 보세요"}
            </p>
          </motion.div>
        )}

        {/* 푸터 */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2025 LLOYDK. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                모든 시스템 정상 운영 중
              </span>
              {user && (
                <span className="text-slate-400">
                  로그인: {user.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}