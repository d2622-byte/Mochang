import React, { useState } from 'react';
import { X, Delete, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockItem } from '../../types';
import { TopicBotMascot } from '../companion/TopicBotMascot';

interface PurchaseModalProps {
  stock: StockItem;
  userHolding?: { quantity: number } | null;
  onClose: () => void;
  onSwitchToSell?: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  stock,
  userHolding,
  onClose,
  onSwitchToSell,
}) => {
  const { availableCash, executeBuyOrder, setShowChargeModal, setParentSandboxQuest } = useApp();
  const [quantityStr, setQuantityStr] = useState<string>('0.1');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const quantity = parseFloat(quantityStr) || 0;
  const totalAmount = Math.round(quantity * stock.currentPrice);
  const isOverBalance = totalAmount > availableCash;
  const isLessThan1000 = totalAmount > 0 && totalAmount < 1000;

  // Preset quick addition (+0.1, +0.5, +1, Max)
  const handleAddQuantity = (add: number) => {
    const next = Number((Math.max(0.1, quantity + add)).toFixed(4));
    setQuantityStr(String(next));
    setErrorMessage('');
  };

  const handleSetMax = () => {
    if (availableCash <= 0) return;
    const maxQty = Math.floor((availableCash / stock.currentPrice) * 1000) / 1000;
    const formatted = maxQty > 0 ? String(maxQty) : '0';
    setQuantityStr(formatted);
    setErrorMessage('');
  };

  // Smooth numeric keypad handler
  const handleKeypadPress = (val: string) => {
    setErrorMessage('');
    if (val === 'backspace') {
      if (quantityStr.length <= 1) {
        setQuantityStr('0');
      } else {
        setQuantityStr(quantityStr.slice(0, -1));
      }
      return;
    }

    if (val === '.') {
      if (!quantityStr.includes('.')) {
        setQuantityStr(quantityStr + '.');
      }
      return;
    }

    if (quantityStr === '0') {
      setQuantityStr(val);
    } else {
      const parts = quantityStr.split('.');
      if (parts[1] && parts[1].length >= 4) return; // max 4 decimals for fractional shares
      const nextVal = quantityStr + val;
      setQuantityStr(nextVal);
    }
  };

  const handleExecuteOrder = () => {
    if (quantity <= 0) {
      setErrorMessage('주문할 수량을 입력해주세요.');
      return;
    }
    if (isOverBalance) {
      setErrorMessage('주문 가능 금액이 부족합니다.');
      return;
    }
    if (isLessThan1000) {
      setErrorMessage('최소 1,000원 이상부터 주문 가능합니다.');
      return;
    }

    // High-Value Orders (>= 100,000 KRW): Smoothly transition into 'Parent Sandbox Mode'
    if (totalAmount >= 100000) {
      onClose();
      setParentSandboxQuest({
        stock,
        quantity,
        totalAmount,
        step: 'reason',
      });
      return;
    }

    const result = executeBuyOrder(stock, quantity);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } else {
      setErrorMessage(result.message || '주문 처리에 실패했습니다.');
    }
  };

  return (
    <div
      id="purchase-bottomsheet-overlay"
      className="fixed inset-0 flex flex-col justify-end animate-in fade-in duration-200"
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
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Container Bounds: max-height: 85dvh, display: flex, flex-direction: column, position: relative, overflow: hidden */}
      <div
        id="purchase-bottomsheet-card"
        className="bg-[#FFFFFF] rounded-t-[32px] w-full max-w-[410px] mx-auto shadow-2xl animate-in slide-in-from-bottom duration-250 flex flex-col relative overflow-hidden border-t border-[#F2F4F6]"
        style={{
          maxHeight: '85dvh',
          zIndex: 10000,
          position: 'relative',
        }}
      >
        {/* Pinned Top Header */}
        <div className="shrink-0 p-4 pb-3 border-b border-[#F2F4F6] bg-[#FFFFFF]">
          {/* Drag Handle */}
          <div className="w-10 h-1 bg-[#E5E8EB] rounded-full mx-auto mb-2.5 shrink-0" />

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-[#191F28]">{stock.name}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F0ECFF] text-[#6C47FF]">
                  소수점 매수
                </span>
              </div>
              <p className="text-xs text-[#8B95A1] mt-0.5">
                현재가 {stock.currentPrice.toLocaleString()}원
              </p>
            </div>
            <button
              id="close-purchase-bottomsheet"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F2F4F6] text-[#8B95A1] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Execution Completed Modal State */}
        {isSuccess ? (
          <div className="flex-1 min-h-0 flex flex-col justify-between items-center text-center p-4 overflow-y-auto">
            <div className="my-auto flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F0ECFF] text-[#6C47FF] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-[#191F28]">주문이 체결되었습니다!</h4>
                <p className="text-xs text-[#8B95A1]">
                  {stock.name} {quantity}주 ({totalAmount.toLocaleString()}원)
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-[#F2F4F6] text-xs text-[#4E5968] max-w-[280px] w-full">
                <div className="flex justify-between">
                  <span>체결 단가</span>
                  <span className="font-bold text-[#191F28]">{stock.currentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>체결 수량</span>
                  <span className="font-bold text-[#6C47FF]">{quantity}주</span>
                </div>
              </div>
            </div>

            {/* Pinned Bottom CTA in Execution Completed */}
            <div
              className="w-full shrink-0 bg-[#FFFFFF] border-t border-[#F2F4F6] box-border"
              style={{
                padding: '12px 16px 16px 16px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <button
                id="confirm-purchase-complete-button"
                onClick={onClose}
                className="w-full py-3.5 bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-white font-extrabold text-sm rounded-2xl transition cursor-pointer shadow-md shadow-[#6C47FF]/25"
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Middle Container: flex: 1; overflow-y: auto; padding: 16px */}
            <div
              className="flex-1 min-h-0 overflow-y-auto space-y-2.5 sm:space-y-3 no-scrollbar"
              style={{ padding: '16px' }}
            >
              {/* Live Calculation Display */}
              <div className="text-center py-1.5 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[32px] sm:text-[36px] font-extrabold text-[#191F28] tracking-tight leading-none">
                    {quantityStr || '0'}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#8B95A1]">주</span>
                </div>
                <div className="text-sm font-extrabold text-[#6C47FF]">
                  약 {totalAmount.toLocaleString()}원
                </div>
                <div className="text-[11px] text-[#8B95A1] flex items-center justify-center gap-1.5 pt-0.5">
                  <span>주문 가능: {(availableCash ?? 0).toLocaleString()}원</span>
                  {isOverBalance && (
                    <button
                      onClick={() => setShowChargeModal(true)}
                      className="text-[#6C47FF] font-extrabold hover:underline cursor-pointer"
                    >
                      충전하기
                    </button>
                  )}
                </div>
              </div>

              {/* Encouraging Parent Sandbox Banner for High-Value Orders (>= 100,000 KRW) */}
              {totalAmount >= 100000 && (
                <div className="bg-[#F0ECFF] border border-[#E5DDFF] p-3 rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
                  <TopicBotMascot mood="quest" size="sm" isFloating={false} />
                  <div className="flex-1 text-left">
                    <span className="text-[10px] font-black text-[#6C47FF] uppercase tracking-wide block">
                      Parent Sandbox Quest Mode
                    </span>
                    <p className="text-xs text-[#333D4B] font-bold leading-snug">
                      "통 큰 결심이네요! 10만 원 이상 대형 거래는 안전한 <strong className="text-[#6C47FF]">부모님 승인 퀘스트</strong>로 진행돼요."
                    </p>
                  </div>
                </div>
              )}

              {/* Error or Notice Alert */}
              {errorMessage && (
                <div className="p-2.5 bg-[#FFF0F0] text-[#FF3B30] border border-[#FFD6D6] rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {isLessThan1000 && !errorMessage && (
                <p className="text-center text-[11px] text-[#8B95A1]">
                  최소 주문 금액은 1,000원 이상입니다.
                </p>
              )}

              {/* Preset Buttons (+0.1, +0.5, +1, Max) */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  id="preset-add-01"
                  onClick={() => handleAddQuantity(0.1)}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-bold text-xs transition cursor-pointer text-center"
                >
                  +0.1주
                </button>
                <button
                  type="button"
                  id="preset-add-05"
                  onClick={() => handleAddQuantity(0.5)}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F2F4F6] hover:bg-[#E5DDFF] text-[#4E5968] font-bold text-xs transition cursor-pointer text-center"
                >
                  +0.5주
                </button>
                <button
                  type="button"
                  id="preset-add-1"
                  onClick={() => handleAddQuantity(1)}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F2F4F6] hover:bg-[#E5DDFF] text-[#4E5968] font-bold text-xs transition cursor-pointer text-center"
                >
                  +1주
                </button>
                <button
                  type="button"
                  id="preset-max"
                  onClick={handleSetMax}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F0ECFF] hover:bg-[#E5DDFF] text-[#6C47FF] font-extrabold text-xs transition cursor-pointer text-center"
                >
                  최대
                </button>
              </div>

              {/* Smooth Numeric Keypad with 8px gap (gap-2) and 44px-48px button height */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    id={`numkey-${key}`}
                    onClick={() => handleKeypadPress(key)}
                    className="h-11 sm:h-12 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] active:bg-[#F0ECFF] text-[#191F28] font-bold text-base sm:text-lg flex items-center justify-center transition cursor-pointer border border-[#F2F4F6]"
                  >
                    {key === 'backspace' ? (
                      <Delete className="w-5 h-5 text-[#8B95A1]" />
                    ) : (
                      key
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Area: Internal Dual CTA Buttons ('매도' / '소수점 매수하기') styled with clean 16px bottom padding */}
            <div
              id="modal-dual-action-cta-area"
              className="shrink-0 bg-[#FFFFFF] border-t border-[#F2F4F6] w-full box-border"
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 16px 16px 16px',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Left Button: '매도' - flex ratio: 1, Light Purple background (#F0ECFF) */}
              <button
                type="button"
                id="modal-switch-to-sell-button"
                onClick={onSwitchToSell}
                className="py-3.5 px-3 rounded-2xl bg-[#F0ECFF] hover:bg-[#E5DDFF] active:bg-[#DDD3FF] text-[#6C47FF] font-extrabold text-sm transition cursor-pointer text-center flex items-center justify-center min-w-0"
                style={{ flex: 1 }}
              >
                <span className="truncate whitespace-nowrap">
                  {userHolding && userHolding.quantity > 0 ? `매도 (${userHolding.quantity}주)` : '매도'}
                </span>
              </button>

              {/* Right Button: '소수점 매수하기' - flex ratio: 2, Primary Purple fill (#6C47FF) */}
              <button
                type="button"
                id="execute-purchase-cta-button"
                onClick={handleExecuteOrder}
                disabled={quantity <= 0 || isOverBalance || isLessThan1000}
                className={`py-3.5 px-3 rounded-2xl font-extrabold text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 min-w-0 ${
                  quantity <= 0 || isOverBalance || isLessThan1000
                    ? 'bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed shadow-none'
                    : 'bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-[#FFFFFF] shadow-[#6C47FF]/25 active:scale-[0.99]'
                }`}
                style={{ flex: 2 }}
              >
                <span className="truncate whitespace-nowrap">
                  {quantity > 0
                    ? totalAmount >= 100000
                      ? '안심 퀘스트로 매수'
                      : `${quantity}주 매수하기`
                    : '소수점 매수하기'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
