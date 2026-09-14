import React, { useState } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#ECEEF5] flex flex-col items-center justify-center p-0 sm:p-4 text-slate-800 font-sans selection:bg-[#6C5CE7]/20 selection:text-[#5A4AD1]">
      {/* Top Floating Control Bar on desktop */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6C5CE7] animate-pulse"></span>
          <span className="font-bold text-[#5A4AD1]">STOPIC</span>
          <span className="text-slate-400">· 청소년 AI 금융 교육 & 모의투자</span>
        </div>
        <button
          id="toggle-view-mode-button"
          onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white shadow-xs border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          title="화면 모드 전환"
        >
          {isMobileFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>와이드 모드</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>모바일 프레임</span>
            </>
          )}
        </button>
      </header>

      {/* Main Container: Strict Mobile Viewport Boundary */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-white overflow-hidden mobile-viewport phone-frame ${
          isMobileFrameMode
            ? 'max-w-[410px] h-[100dvh] sm:h-[860px] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800'
            : 'max-w-xl min-h-[100dvh] sm:min-h-[900px] sm:rounded-3xl sm:shadow-xl sm:border border-slate-200'
        }`}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* iOS Dynamic Island & Status Bar: Solid and clean, z-index 100 */}
        <div
          id="ios-status-bar"
          className="h-11 px-6 flex items-center justify-between text-slate-800 text-xs font-semibold select-none shrink-0 bg-white pt-1 border-b border-[#F2F4F6]/50"
          style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}
        >
          <span className="tracking-tight text-[13px] font-bold">9:41</span>

          {/* Dynamic Island Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-[10px] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-200">모의투자 활성</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-[10px] font-bold text-[#6C5CE7] bg-[#F0EEFF] px-1.5 py-0.5 rounded">가상</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <span className="text-[10px] mr-0.5">100%</span>
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>
        </div>

        {/* Content Area - Children are managed directly inside the mobile container without trapping stacking context */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#F8F9FA] min-h-0">
          {children}
        </div>

        {/* iOS Home Indicator Bar: Anchored at bottom */}
        <div
          id="ios-home-indicator-bar"
          className="w-full flex justify-center py-1.5 bg-white shrink-0 border-t border-[#F2F4F6]/40"
          style={{ zIndex: 95 }}
        >
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
