import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { 
  Brain, BarChart3, Shield, Link2, Zap, CheckCircle2, Headphones, Box,
  FileText, Search, Filter, MessageCircle, AlertTriangle, UserX, LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

// 1. 아이콘 맵핑 (백엔드에서 오는 icon 문자열과 매칭)
const iconMap = {
  brain: Brain, 
  chart: LineChart, // 'chart'는 꺾은선 그래프 아이콘으로 연결
  shield: Shield, 
  link: Link2, 
  zap: Zap, 
  headphones: Headphones, 
  box: Box,
  'file-text': FileText,
  search: Search,
  filter: Filter,
  'message-circle': MessageCircle,
  'alert-triangle': AlertTriangle,
  'user-x': UserX
};

// 2. 내부 페이지 주소 매핑
const demoPageMap = {
  'Q&A 서비스': 'QnAService',
  '문서 품질 및 오류 관리': 'DocumentQuality',
  '보고서 자동 생성': 'ReportGenerator',
  '민원 분류기': 'complaint',
  '인사이트파인더': 'InsightFinder'
  // '부진재고...'는 외부 링크라서 굳이 매핑 안 해도 됨 (데이터 따라감)
};

const DemoCard = forwardRef(({ demo, index }, ref) => {
  // 아이콘이 없으면 기본값(Brain) 사용
  const IconComponent = iconMap[demo.icon] || Brain;
  const isCompleted = demo.status === 'completed';
  const demoPage = demoPageMap[demo.title];

  // 🚀 [핵심 로직] 클릭 시 어디로 갈지 결정 (사이드바와 동일한 로직)
  let Wrapper = 'div';
  let wrapperProps = {};
  let isClickable = false;

  if (demo.externalLink) {
    // 1. 외부 링크가 있으면 <a> 태그 (새 창 열기)
    Wrapper = 'a';
    wrapperProps = { 
      href: demo.externalLink,
      target: "_blank",
      rel: "noopener noreferrer"
    };
    isClickable = true;
  } else if (isCompleted && demoPage) {
    // 2. 완성됐고 내부 페이지가 있으면 <Link> 태그
    Wrapper = Link;
    wrapperProps = { to: createPageUrl(demoPage) };
    isClickable = true;
  }
  // 3. 준비 중이면 그냥 div (클릭 안 됨)

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Wrapper 
        {...wrapperProps}
        className={`block h-full group relative bg-white rounded-2xl border transition-all duration-300
          ${isClickable 
            ? 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
            : 'border-slate-100 bg-slate-50/50 cursor-default'
          }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            {/* 아이콘 박스 */}
            <div className={`p-3 rounded-xl transition-colors ${isClickable ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-slate-100 text-slate-400'}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            
            {/* 상태 뱃지 (시연 가능 / 준비 중) */}
            {isClickable ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                시연 가능
              </Badge>
            ) : (
              <Badge variant="outline" className="text-slate-400 border-slate-200 bg-white">
                {demo.expected_date ? '오픈 예정' : '준비 중'}
              </Badge>
            )}
          </div>
          
          {/* 제목 */}
          <h3 className={`text-lg font-bold mb-2 ${isClickable ? 'text-slate-900 group-hover:text-blue-700' : 'text-slate-400'}`}>
            {demo.title}
          </h3>
          
          {/* 설명 */}
          <p className={`text-sm leading-relaxed line-clamp-2 ${isClickable ? 'text-slate-500' : 'text-slate-400'}`}>
            {demo.description}
          </p>

          {/* 오픈 예정일 표시 (준비 중인 경우에만) */}
          {!isClickable && demo.expected_date && (
            <div className="mt-auto pt-4 flex items-center text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2" />
              {new Date(demo.expected_date).toLocaleDateString('ko-KR')} 오픈 예정
            </div>
          )}
          
          {/* 외부 링크 아이콘 표시 (선택 사항) */}
          {demo.externalLink && (
             <div className="mt-auto pt-4 flex items-center text-xs font-medium text-blue-600">
                외부 사이트로 이동 &rarr;
             </div>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
});

DemoCard.displayName = "DemoCard";

export default DemoCard;