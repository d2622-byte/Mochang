import React from 'react';
import { AlertTriangle, ShieldAlert, BookOpen, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskWarningModal: React.FC = () => {
  const { activeRiskStock, setActiveRiskStock, openTermByName } = useApp();

  if (!activeRiskStock) return null;

  return (
    <div
      id="risk-warning-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-3 animate-in fade-in duration-200"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 10500,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveRiskStock(null);
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#FFD6D6] max-h-[90dvh] flex flex-col justify-between relative"
        style={{ zIndex: 10600 }}
      >
        {/* Header: Pure Alert Red for critical risk (pinned) */}
        <div className="bg-[#FF3B30] p-4 sm:p-5 text-white shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-white" />
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white">
              청소년 보호 필터링 시스템
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
            위험 종목 거래 제한 안내
          </h3>
          <p className="text-xs text-white/85 mt-0.5 font-medium">
            {activeRiskStock.name} ({activeRiskStock.code})
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-3.5 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="bg-[#FFF0F0] border border-[#FFD6D6] p-3.5 rounded-2xl">
            <div className="flex items-start gap-2 text-[#FF3B30] text-xs leading-relaxed font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF3B30] mt-0.5" />
              <span>
                {activeRiskStock.riskReason ||
                  '최근 비정상적인 변동성이 크거나 손실 위험이 매우 높은 고위험 상품입니다.'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-[#191F28] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#6C47FF]" />
              <span>왜 청소년 거래가 제한되나요?</span>
            </h4>
            <p className="text-xs text-[#4E5968] leading-relaxed bg-[#F8F9FA] p-3 rounded-xl border border-[#F2F4F6]">
              스토픽(STOPIC)은 청소년 여러분이 건강하고 올바른 투자 습관을 형성할 수 있도록, 원금 전액 손실 위험이 큰 레버리지·파생 상품 및 관리/투기성 종목의 모의투자를 안전하게 보호·제한하고 있습니다.
            </p>
          </div>
        </div>

        {/* Pinned Bottom CTA Buttons with Safe Area */}
        <div className="shrink-0 p-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom,16px))] bg-white border-t border-[#F2F4F6] flex gap-2">
          <button
            id="learn-leverage-term-button"
            onClick={() => {
              setActiveRiskStock(null);
              openTermByName('레버리지');
            }}
            className="flex-1 py-3 rounded-xl bg-[#F0ECFF] text-[#6C47FF] hover:bg-[#E5DDFF] font-extrabold text-xs transition cursor-pointer text-center"
          >
            '레버리지' 배우기
          </button>
          <button
            id="confirm-risk-modal-button"
            onClick={() => setActiveRiskStock(null)}
            className="flex-1 py-3 rounded-xl bg-[#191F28] hover:bg-[#2C333D] text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>이해했습니다</span>
          </button>
        </div>
      </div>
    </div>
  );
};
