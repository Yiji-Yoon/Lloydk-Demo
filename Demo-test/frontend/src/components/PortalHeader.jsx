import React from 'react';
import { motion } from 'framer-motion';

export default function PortalHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative px-8 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          {/* Logo & Title */}
          <div className="flex items-center gap-6 mb-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69425d25058a80a1c4b3e584/ba2042d8b_favicon.png"
              alt="LLOYDK Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">LLOYDK</h1>
              <p className="text-lg font-semibold text-blue-600">DEMO PORTAL</p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            데모 및 PoC 관련 문의:
            <span className="text-slate-800 font-medium"> sales@lloydk.co.kr</span>
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-slate-200">
            <div>
              <div className="text-2xl font-bold text-slate-800">Enterprise</div>
              <div className="text-sm text-slate-500">솔루션 레벨</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <div className="text-2xl font-bold text-blue-600">Real-time</div>
              <div className="text-sm text-slate-500">시연 환경</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <div className="text-2xl font-bold text-slate-800">Secure</div>
              <div className="text-sm text-slate-500">통합 SSO</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}