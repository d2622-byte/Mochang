import React, { useState } from 'react';
import {
  X,
  Shield,
  Sliders,
  CheckCircle2,
  User,
  FileText,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ParentManagementModal: React.FC = () => {
  const {
    showParentManagementModal,
    setShowParentManagementModal,
    parentSettings,
    updateParentSettings,
  } = useApp();

  const [limitInput, setLimitInput] = useState<number>(parentSettings.monthlyLimit);
  const [showLegalNotice, setShowLegalNotice] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>('');

  if (!showParentManagementModal) return null;

  const handleSaveLimit = () => {
    updateParentSettings({ monthlyLimit: limitInput });
    setSavedMsg('월 투자 한도가 성공적으로 변경되었습니다.');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const handleToggleApproval = () => {
    updateParentSettings({
      requireTradeApproval: !parentSettings.requireTradeApproval,
    });
  };

  return (
    <div
      id="parent-management-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-3 animate-in fade-in duration-200"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowParentManagementModal(false);
      }}
    >
      <div
        className="bg-[#FFFFFF] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F2F4F6] flex flex-col max-h-[90dvh] relative"
        style={{ zIndex: 10000 }}
      >
        {/* Header: Dark Purple Gradient (#1A103C to #2D1B69) */}
        <div className="bg-gradient-to-r from-[#1A103C] to-[#2D1B69] p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">보호자 전용 안심 관리 센터</h3>
              <p className="text-[10px] text-white/80">자녀의 안전한 금융 학습 파트너</p>
            </div>
          </div>
          <button
            id="close-parent-modal-button"
            onClick={() => setShowParentManagementModal(false)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 text-xs bg-[#F8F9FA] flex-1 min-h-0 pb-[max(16px,env(safe-area-inset-bottom,16px))] no-scrollbar">
          {/* Linked Child Profile Card */}
          <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#F2F4F6] flex items-center gap-3 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-[#F0ECFF] text-[#6C47FF] flex items-center justify-center font-bold text-sm shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-[#191F28] text-sm truncate">
                  {parentSettings.childName}님의 계정
                </h4>
                <span className="text-[10px] bg-[#F0ECFF] text-[#6C47FF] font-extrabold px-2 py-0.5 rounded-md shrink-0">
                  연동됨
                </span>
              </div>
              <p className="text-[#8B95A1] text-[11px] mt-0.5">{parentSettings.childAgeInfo}</p>
            </div>
          </div>

          {savedMsg && (
            <div className="p-2.5 bg-[#F0ECFF] border border-[#6C47FF]/20 text-[#6C47FF] font-extrabold rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6C47FF]" />
              <span>{savedMsg}</span>
            </div>
          )}

          {/* Setting 1: Monthly Limit Setting with Custom Interactive Slider */}
          <div className="bg-[#FFFFFF] p-4.5 rounded-2xl border border-[#F2F4F6] space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-[#191F28]">
                <div className="w-7 h-7 rounded-lg bg-[#F0ECFF] text-[#6C47FF] flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <span className="text-xs">월 모의투자 한도 설정</span>
              </div>
              <span className="text-base font-extrabold text-[#6C47FF] tracking-tight">
                {limitInput.toLocaleString()}원
              </span>
            </div>

            {/* Interactive Slider Track & Dynamic Indicator */}
            <div className="space-y-2 pt-1">
              <div className="relative flex items-center">
                <input
                  id="monthly-limit-slider"
                  type="range"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={limitInput}
                  onChange={(e) => setLimitInput(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E8EB] rounded-lg appearance-none cursor-pointer accent-[#6C47FF] focus:outline-hidden"
                />
              </div>

              {/* Min - Mid - Max ticks */}
              <div className="flex justify-between text-[11px] text-[#8B95A1] font-medium px-0.5">
                <span>10만원</span>
                <span className="text-[#6C47FF] font-extrabold">50만원 (권장)</span>
                <span>200만원</span>
              </div>
            </div>

            {/* Quick Limit Preset Pills */}
            <div className="flex gap-1.5 pt-0.5">
              {[300000, 500000, 1000000, 2000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLimitInput(preset)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    limitInput === preset
                      ? 'bg-[#6C47FF] text-white shadow-2xs'
                      : 'bg-[#F0ECFF] text-[#6C47FF] hover:bg-[#E5DDFF]'
                  }`}
                >
                  {preset >= 1000000 ? `${preset / 10000}만원` : `${preset / 10000}만원`}
                </button>
              ))}
            </div>

            {/* Current Limit Consumption Meter */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#F2F4F6] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8B95A1]">이번 달 현재 누적 체결액</span>
                <span className="font-extrabold text-[#191F28]">
                  {parentSettings.monthlyUsed.toLocaleString()}원 / {limitInput.toLocaleString()}원
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5E8EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6C47FF] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (parentSettings.monthlyUsed / limitInput) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-[#8B95A1] text-right">
                잔여 한도: {Math.max(0, limitInput - parentSettings.monthlyUsed).toLocaleString()}원
              </p>
            </div>

            <button
              id="save-limit-button"
              onClick={handleSaveLimit}
              className="w-full py-3 bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-[#FFFFFF] font-extrabold rounded-xl transition cursor-pointer shadow-xs text-xs"
            >
              한도 변경 저장하기
            </button>
          </div>

          {/* Setting 2: Trade Approval Switch */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#F2F4F6] flex items-center justify-between shadow-2xs">
            <div className="pr-3">
              <h4 className="font-extrabold text-[#191F28] text-xs">자녀 거래 실시간 승인제</h4>
              <p className="text-[11px] text-[#8B95A1] mt-0.5 leading-snug">
                {parentSettings.requireTradeApproval
                  ? '보호자가 사전 확인한 주문만 모의투자로 체결됩니다.'
                  : '자녀가 자율적으로 모의투자를 진행합니다.'}
              </p>
            </div>

            <button
              id="toggle-approval-button"
              onClick={handleToggleApproval}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                parentSettings.requireTradeApproval ? 'bg-[#6C47FF]' : 'bg-[#E5E8EB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  parentSettings.requireTradeApproval ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Setting 3: Child Financial Learning Report */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#F2F4F6] space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#191F28] text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#6C47FF]" />
                <span>자녀 금융 학습 리포트</span>
              </h4>
              <span className="text-[10px] text-[#8B95A1]">이번 달 기준</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F4F0FF] p-2.5 rounded-xl border border-[#6C47FF]/10">
                <span className="text-[10px] text-[#8B95A1] block font-medium">학습 경험치</span>
                <span className="font-extrabold text-[#6C47FF] text-sm">
                  +{parentSettings.learningReportMonthlyXp}XP
                </span>
              </div>
              <div className="bg-[#F4F0FF] p-2.5 rounded-xl border border-[#6C47FF]/10">
                <span className="text-[10px] text-[#8B95A1] block font-medium">퀴즈 정답률</span>
                <span className="font-extrabold text-[#6C47FF] text-sm">
                  {parentSettings.quizAccuracy}%
                </span>
              </div>
              <div className="bg-[#F4F0FF] p-2.5 rounded-xl border border-[#6C47FF]/10">
                <span className="text-[10px] text-[#8B95A1] block font-medium">완료 미션</span>
                <span className="font-extrabold text-[#6C47FF] text-sm">
                  {parentSettings.completedMissionsCount}개
                </span>
              </div>
            </div>
          </div>

          {/* Setting 4: Legal & Policy Notice */}
          <button
            id="open-legal-notice-button"
            onClick={() => setShowLegalNotice(true)}
            className="w-full py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#4E5968] font-bold text-xs border border-[#F2F4F6] transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span>보호자 확인 법적 고지 전문 보기</span>
          </button>
        </div>
      </div>

      {/* Legal Notice Sub-Modal */}
      {showLegalNotice && (
        <div
          className="fixed inset-0 z-[1050] bg-black/70 flex items-center justify-center p-4"
          style={{ zIndex: 1050 }}
        >
          <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-sm p-5 space-y-3 shadow-2xl border border-[#F2F4F6]">
            <div className="flex justify-between items-center border-b border-[#F2F4F6] pb-2">
              <h4 className="font-extrabold text-[#191F28] text-xs">청소년 금융 교육 및 보호 지침</h4>
              <button
                onClick={() => setShowLegalNotice(false)}
                className="text-[#8B95A1] hover:text-[#191F28] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] text-[#4E5968] space-y-2 leading-relaxed max-h-60 overflow-y-auto">
              <p>
                1. 스토픽(STOPIC)은 청소년의 건전한 금융 가치관 형성을 목적으로 가상 시드머니를 기반으로 모의투자 환경을 제공합니다.
              </p>
              <p>
                2. 법정대리인은 자녀의 계정에 월간 투자 한도를 설정할 수 있으며, 고변동성 파생상품 및 투기성 종목에 대한 거래 제한을 상시 모니터링할 수 있습니다.
              </p>
              <p>
                3. 플랫폼의 모든 거래는 법적 실거래가 아니며, 가상자산의 손익은 현금으로 환급되거나 청구되지 않습니다.
              </p>
            </div>
            <button
              onClick={() => setShowLegalNotice(false)}
              className="w-full py-2.5 bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold rounded-xl text-xs transition cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
