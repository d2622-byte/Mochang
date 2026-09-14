import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Wallet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChargeModal: React.FC = () => {
  const { showChargeModal, setShowChargeModal, chargeCash, availableCash } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);

  if (!showChargeModal) return null;

  const handleCharge = () => {
    chargeCash(selectedAmount);
    setShowChargeModal(false);
  };

  const amounts = [10000, 30000, 50000, 100000];

  return (
    <div
      id="charge-modal-overlay"
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
        if (e.target === e.currentTarget) setShowChargeModal(false);
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F2F4F6] max-h-[90dvh] flex flex-col justify-between relative"
        style={{ zIndex: 10000 }}
      >
        {/* Pinned Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#F2F4F6] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0ECFF] text-[#6C47FF] flex items-center justify-center font-bold shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#191F28] text-base">가상 투자금 충전</h3>
              <p className="text-[11px] text-[#8B95A1]">안전한 교육용 가상 머니</p>
            </div>
          </div>
          <button
            id="close-charge-modal-button"
            onClick={() => setShowChargeModal(false)}
            className="p-1 rounded-full text-[#8B95A1] hover:text-[#191F28] cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Container */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#F2F4F6] flex justify-between items-center">
            <span className="text-xs text-[#8B95A1] font-medium">현재 주문 가능 금액</span>
            <span className="text-base font-extrabold text-[#191F28]">
              {availableCash.toLocaleString()}원
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#191F28] block mb-2">충전할 가상 금액 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  id={`charge-amount-${amount}`}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedAmount === amount
                      ? 'border-[#6C47FF] bg-[#F0ECFF] text-[#6C47FF]'
                      : 'border-[#E5E8EB] hover:border-[#D1D6DB] text-[#4E5968]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{amount.toLocaleString()}원</span>
                </button>
              ))}
            </div>
          </div>

          {/* Education Notice */}
          <div className="flex items-start gap-2 bg-[#F0ECFF] p-3 rounded-xl text-[11px] text-[#4E5968] border border-[#6C47FF]/15">
            <ShieldCheck className="w-4 h-4 text-[#6C47FF] shrink-0 mt-0.5" />
            <p>
              스토픽의 모든 자산은 100% 모의투자용 가상 자산입니다. 실제 현금이 결제되거나 인출되지
              않으니 안심하고 학습하세요.
            </p>
          </div>
        </div>

        {/* Pinned Bottom CTA with Safe Area */}
        <div className="shrink-0 p-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom,16px))] bg-white border-t border-[#F2F4F6]">
          <button
            id="execute-charge-button"
            onClick={handleCharge}
            className="w-full py-3.5 rounded-2xl bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-white font-extrabold text-sm shadow-md shadow-[#6C47FF]/25 transition cursor-pointer"
          >
            {selectedAmount.toLocaleString()}원 충전하기
          </button>
        </div>
      </div>
    </div>
  );
};
