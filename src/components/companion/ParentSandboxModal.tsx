import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
  HelpCircle,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopicBotMascot } from './TopicBotMascot';

export const ParentSandboxModal: React.FC = () => {
  const {
    parentSandboxQuest,
    setParentSandboxQuest,
    executeBuyOrder,
    triggerCelebration,
    parentSettings,
  } = useApp();

  const [selectedReason, setSelectedReason] = useState<string>('글로벌 기술 성장과 미래 비전');
  const [isCheckedDiversification, setIsCheckedDiversification] = useState<boolean>(true);
  const [isSimulatingParentApproval, setIsSimulatingParentApproval] = useState<boolean>(false);
  const [step, setStep] = useState<'reason' | 'approving' | 'approved'>('reason');

  if (!parentSandboxQuest) return null;

  const { stock, quantity, totalAmount } = parentSandboxQuest;

  const investmentReasons = [
    { id: 'growth', label: '글로벌 기술 성장과 미래 비전', icon: '🚀' },
    { id: 'diversify', label: '차곡차곡 모아가는 분산 적립식 투자', icon: '🧺' },
    { id: 'dividend', label: '안정적인 실적과 건강한 재무제표', icon: '📊' },
  ];

  const handleRequestApproval = () => {
    setIsSimulatingParentApproval(true);
    setStep('approving');

    // Simulate parent notification & immediate educational approval within 1.5s
    setTimeout(() => {
      setIsSimulatingParentApproval(false);
      setStep('approved');

      // Execute order directly through AppContext
      const result = executeBuyOrder(stock, quantity);

      if (result.success) {
        triggerCelebration({
          title: '대형 모의투자 승인 체결! 🛡️',
          subtitle: `부모님 샌드박스 퀘스트를 완료하고 ${stock.name} ${quantity}주를 매수했습니다!`,
          points: 30,
          xp: 50,
        });
      }
    }, 1500);
  };

  const handleClose = () => {
    setParentSandboxQuest(null);
    setStep('reason');
  };

  return (
    <div
      id="parent-sandbox-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-200"
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
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-[#FFFFFF] rounded-3xl w-full max-w-[390px] shadow-2xl border border-[#F2F4F6] overflow-hidden flex flex-col relative"
        style={{ zIndex: 10600 }}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#6C47FF] to-[#8C6FFF] p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
              <TopicBotMascot mood={step === 'approved' ? 'cheering' : 'quest'} size="sm" isFloating={false} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200 bg-black/20 px-2 py-0.5 rounded-full inline-block">
                Parent Sandbox Quest
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                부모님 안심 샌드박스 퀘스트
              </h3>
            </div>
          </div>
        </div>

        {/* Quest Body */}
        <div className="p-5 space-y-4 text-[#191F28]">
          {step === 'reason' && (
            <>
              {/* Order Info Banner */}
              <div className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#F2F4F6] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8B95A1] font-bold">대형 모의 주문</span>
                  <h4 className="text-sm font-extrabold text-[#191F28]">
                    {stock.name} {quantity}주
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8B95A1]">주문 총액</span>
                  <span className="text-base font-extrabold text-[#6C47FF] block">
                    {totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* CEO Topic-bot Message Box */}
              <div className="bg-[#F0ECFF] p-3.5 rounded-2xl border border-[#E5DDFF] flex items-start gap-2.5">
                <span className="text-lg">👑</span>
                <p className="text-xs text-[#4B29D3] font-bold leading-relaxed">
                  "통 큰 결심이네요! 10만 원 이상의 큰 거래는 투자 이유를 점검하고 부모님께 안심 알림을 보내는 특별 퀘스트를 통해 안전하게 진행돼요."
                </p>
              </div>

              {/* Step 1: Investment Reason Selection */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#191F28] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#6C47FF] text-white text-[10px] flex items-center justify-center font-black">
                    1
                  </span>
                  <span>이 종목에 투자하는 나의 생각은?</span>
                </label>
                <div className="space-y-1.5">
                  {investmentReasons.map((item) => {
                    const isSelected = selectedReason === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedReason(item.label)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#F0ECFF] border-[#6C47FF] text-[#6C47FF]'
                            : 'bg-white border-[#F2F4F6] text-[#4E5968] hover:bg-[#F8F9FA]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#6C47FF]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Risk Checkbox */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsCheckedDiversification(!isCheckedDiversification)}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#F8F9FA] border border-[#F2F4F6] text-left cursor-pointer transition hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={isCheckedDiversification}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#6C47FF] accent-[#6C47FF] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#333D4B]">
                    몰빵 대신 분산 투자 원칙을 염두에 두고 있어요.
                  </span>
                </button>
              </div>

              {/* Action Button */}
              <button
                id="request-parent-approval-btn"
                onClick={handleRequestApproval}
                disabled={!isCheckedDiversification}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-[#6C47FF]/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>부모님 승인 퀘스트 요청하기 ({totalAmount.toLocaleString()}원)</span>
              </button>
            </>
          )}

          {step === 'approving' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#F0ECFF] flex items-center justify-center text-[#6C47FF] animate-pulse">
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C47FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#6C47FF]"></span>
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#191F28]">
                  부모님 스마트폰으로 승인 요청 중...
                </h4>
                <p className="text-xs text-[#8B95A1]">
                  지우님의 튼튼한 투자 이유와 함께 안전 알림이 발송되었습니다.
                </p>
              </div>
            </div>
          )}

          {step === 'approved' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#191F28]">
                  부모님 안심 승인 완료! 🎉
                </h4>
                <p className="text-xs text-[#4E5968] leading-relaxed">
                  "훌륭한 투자 근거를 확인했어요! 계획적인 모의투자를 응원합니다."<br />
                  <span className="text-[#6C47FF] font-bold">
                    {stock.name} {quantity}주 ({totalAmount.toLocaleString()}원) 체결 완료
                  </span>
                </p>
              </div>

              <div className="w-full bg-[#F0ECFF] p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold text-[#6C47FF]">
                <Sparkles className="w-4 h-4" />
                <span>퀘스트 완료 보상: +30P / +50XP 획득!</span>
              </div>

              <button
                id="close-parent-sandbox-btn"
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-sm shadow-md transition cursor-pointer"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
