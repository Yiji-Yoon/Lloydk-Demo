import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, LogOut, User, Menu, Brain, BarChart3, Shield, Link2, Zap, CheckCircle2, Users, Headphones, ShieldAlert, TrendingUp, Box, FileText, Search, Filter, MessageCircle, AlertTriangle, UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// 아이콘 맵핑
const iconMap = {
  brain: Brain, chart: BarChart3, shield: Shield, link: Link2, zap: Zap, headphones: Headphones, box: Box,
  'file-text': FileText, search: Search, filter: Filter, 'message-circle': MessageCircle, 'alert-triangle': AlertTriangle, 'user-x': UserX
};

const categoryInfo = {
  employee: { label: '임직원 공통 서비스', icon: Users },
  customer: { label: '고객 대응 서비스', icon: Headphones },
  security: { label: '내부 관리 및 보안', icon: ShieldAlert },
  management: { label: '경영 관리', icon: TrendingUp },
};

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setUser({ full_name: "관리자", email: "admin@myservice.com" });
  }, []);

  // 백엔드 연결 (실패시 빈 배열 반환하여 에러 방지)
  const { data: demos = [] } = useQuery({
    queryKey: ['demos-nav'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/demos');
        return res.data;
      } catch (e) {
        console.warn("메뉴 로딩 실패 (백엔드 확인 필요)");
        return [];
      }
    },
  });

  const handleLogout = () => setUser(null);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69425d25058a80a1c4b3e584/ba2042d8b_favicon.png" alt="LLOYDK" className="w-10 h-10 object-contain" />
              <div><h1 className="text-lg font-bold text-slate-800">LLOYDK</h1><p className="text-xs text-slate-500">DEMO PORTAL</p></div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6 space-y-1">
              <Link to={createPageUrl('Home')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentPageName === 'Home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Home className="w-5 h-5" /><span className="font-medium">데모 현황</span>
              </Link>
              <Link to={createPageUrl('Analytics')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentPageName === 'Analytics' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <BarChart3 className="w-5 h-5" /><span className="font-medium">AI 통합 분석</span>
              </Link>
            </div>

            {/* Dynamic Menu Items */}
            {Object.entries(categoryInfo).map(([categoryKey, { label, icon: CategoryIcon }]) => {
              const categoryDemos = demos.filter(d => d.category === categoryKey);
              if (categoryDemos.length === 0) return null;

              return (
                <div key={categoryKey} className="mb-6">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <CategoryIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                  </div>
                  <div className="space-y-1">
                    {categoryDemos.map((demo) => {
                      const isCompleted = demo.status === 'completed';
                      const IconComponent = iconMap[demo.icon] || Brain;
                      
                      // 내부 페이지 매핑 정보
                      const demoPageMap = {
                        'Q&A 서비스': 'QnAService',
                        '문서 품질 및 오류 관리': 'DocumentQuality',
                        '보고서 자동 생성': 'ReportGenerator',
                        '민원 분류기' : 'complaint'
                        // 외부 링크로 처리할 '부진재고...'는 여기서 굳이 매핑 안 해도 됨
                      };
                      
                      const demoPage = demoPageMap[demo.title];

                      // 🚀 [핵심 로직] 외부 링크 vs 내부 링크 vs 비활성 분기 처리
                      let ItemWrapper = 'div';
                      let itemProps = {};
                      let isActive = false;

                      if (demo.externalLink) {
                        // 1. 외부 링크가 있으면 무조건 <a> 태그 (새 창)
                        ItemWrapper = 'a';
                        itemProps = { 
                          href: demo.externalLink,
                          target: "_blank",
                          rel: "noopener noreferrer"
                        };
                        isActive = true;
                      } else if (isCompleted && demoPage) {
                        // 2. 완료됨 + 내부 페이지 매핑됨 -> <Link> 태그
                        ItemWrapper = Link;
                        itemProps = { to: createPageUrl(demoPage) };
                        isActive = true;
                      }
                      // 3. 그 외(준비 중) -> 그냥 'div' (비활성)

                      return (
                        <ItemWrapper 
                          key={demo.id} 
                          {...itemProps} 
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 
                            ${isActive 
                              ? 'text-slate-900 hover:bg-blue-50 cursor-pointer' 
                              : 'text-slate-400 cursor-default'
                            }
                          `}
                        >
                          <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-300'}`} />
                          <div className="flex-1 min-w-0">
                            <span className={`block truncate text-sm ${isActive ? 'font-bold' : 'font-normal'}`}>
                              {demo.title}
                            </span>
                            {!isCompleted && demo.expected_date && (
                              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                {new Date(demo.expected_date).toLocaleDateString('ko-KR')} 오픈
                              </span>
                            )}
                          </div>
                          {isActive && (<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />)}
                        </ItemWrapper>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          {user && (
            <div className="p-4 border-t border-slate-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-6 text-left hover:bg-slate-50">
                    <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600"><AvatarFallback className="bg-transparent text-white font-semibold">{user.full_name?.[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p><p className="text-xs text-slate-500 truncate">{user.email}</p></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="w-4 h-4 mr-2" />로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>{sidebarOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}</AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-slate-600"><Menu className="w-5 h-5" /></Button>
          <div className="flex items-center gap-2"><img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69425d25058a80a1c4b3e584/ba2042d8b_favicon.png" alt="LLOYDK" className="w-8 h-8 object-contain" /><span className="font-semibold text-slate-900">LLOYDK</span></div><div className="w-10" />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}