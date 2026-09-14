import React, { useState } from 'react';
import { X, Delete, CheckCircle2, AlertCircle, ArrowDownCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockItem, HoldingStock } from '../../types';

interface SellModalProps {
  stock: StockItem;
  holding: HoldingStock;
  onClose: () => void;
  onSwitchToBuy?: () => void;
}

export const SellModal: React.FC<SellModalProps> = ({
  stock,
  holding,
  onClose,
  onSwitchToBuy,
}) => {
  const { executeSellOrder } = useApp();

  // Initial sell quantity defaults to 0.1 or full holding if < 0.1
  const initialQty = holding.quantity >= 0.1 ? '0.1' : String(holding.quantity);
  const [quantityStr, setQuantityStr] = useState<string>(initialQty);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const quantity = parseFloat(quantityStr) || 0;
  const isOverHolding = quantity > holding.quantity;

  // Financial Breakdown calculations
  const totalPayout = Math.round(quantity * stock.currentPrice);
  const costBasis = Math.round(quantity * holding.avgBuyPrice);
  const estimatedProfit = totalPayout - costBasis;
  const profitRate = costBasis > 0 ? (estimatedProfit / costBasis) * 100 : 0;

  // Preset fast-select pills: '+0.1주', '+0.5주', '전량 매도'
  const handleAddQuantity = (add: number) => {
    const next = Math.min(
      holding.quantity,
      Number((Math.max(0.1, quantity + add)).toFixed(4))
    );
    setQuantityStr(String(next));
    setErrorMessage('');
  };

  const handleSetFull = () => {
    setQuantityStr(String(holding.quantity));
    setErrorMessage('');
  };

  // Custom numeric keypad
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

  // Execute Sell Order
  const handleExecuteSell = () => {
    if (quantity <= 0) {
      setErrorMessage('매도할 수량을 입력해주세요.');
      return;
    }
    if (isOverHolding) {
      setErrorMessage(`보유 수량(${holding.quantity}주)을 초과할 수 없습니다.`);
      return;
    }

    const result = executeSellOrder(stock, quantity);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } else {
      setErrorMessage(result.message || '매도 처리에 실패했습니다.');
    }
  };

  return (
    <div
      id="sell-bottomsheet-overlay"
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
        id="sell-bottomsheet-card"
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
                  소수점 매도
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B95A1] mt-0.5">
                <span>{stock.code}</span>
                <span>·</span>
                <span>현재가 {stock.currentPrice.toLocaleString()}원</span>
                <span className="text-[#6C47FF] font-extrabold bg-[#F0ECFF] px-1.5 py-0.5 rounded-md text-[10px]">
                  {holding.quantity}주 보유
                </span>
              </div>
            </div>
            <button
              id="close-sell-bottomsheet"
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
                <h4 className="text-lg font-extrabold text-[#191F28]">매도 주문이 체결되었습니다!</h4>
                <p className="text-xs text-[#8B95A1]">
                  {stock.name} {quantity}주 (총 {totalPayout.toLocaleString()}원 정산)
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-[#F2F4F6] text-xs text-[#4E5968] max-w-[280px] w-full space-y-1">
                <div className="flex justify-between">
                  <span>매도 체결 단가</span>
                  <span className="font-bold text-[#191F28]">{stock.currentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>정산 총액</span>
                  <span className="font-bold text-[#6C47FF]">{totalPayout.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E5E8EB]">
                  <span>실현 손익</span>
                  <span
                    className={`font-extrabold ${
                      estimatedProfit >= 0 ? 'text-[#FF3B30]' : 'text-[#3182F6]'
                    }`}
                  >
                    {estimatedProfit >= 0 ? '+' : ''}
                    {estimatedProfit.toLocaleString()}원 ({profitRate >= 0 ? '+' : ''}
                    {profitRate.toFixed(1)}%)
                  </span>
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
                id="confirm-sell-complete-button"
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
              className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-2.5 no-scrollbar"
              style={{ padding: '16px' }}
            >
              {/* Live Calculation Display */}
              <div className="text-center py-1.5 space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[30px] sm:text-[34px] font-extrabold text-[#191F28] tracking-tight leading-none">
                    {quantityStr || '0'}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#8B95A1]">주</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#6C47FF]">
                  총 정산 예상금: 약 {totalPayout.toLocaleString()}원
                </div>
              </div>

              {/* Financial Breakdown: Estimated Payout & Profit/Loss Calculation */}
              <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-[#F2F4F6] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#4E5968]">
                  <span>매도 수량 x 현재가</span>
                  <span className="font-extrabold text-[#191F28]">
                    {quantity}주 x {stock.currentPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#4E5968]">
                  <span>평균 매수가</span>
                  <span className="font-bold text-[#191F28]">
                    {holding.avgBuyPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="pt-1.5 border-t border-[#E5E8EB] flex items-center justify-between">
                  <span className="font-bold text-[#191F28]">예상 평가 손익</span>
                  <span
                    className={`font-extrabold ${
                      estimatedProfit >= 0 ? 'text-[#FF3B30]' : 'text-[#3182F6]'
                    }`}
                  >
                    {estimatedProfit >= 0 ? '+' : ''}
                    {estimatedProfit.toLocaleString()}원 ({profitRate >= 0 ? '+' : ''}
                    {profitRate.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Error or Notice Alert */}
              {errorMessage && (
                <div className="p-2.5 bg-[#FFF0F0] text-[#FF3B30] border border-[#FFD6D6] rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Preset Pills: '+0.1주', '+0.5주', '전량 매도' */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  id="preset-sell-01"
                  onClick={() => handleAddQuantity(0.1)}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF] active:bg-[#E5DDFF] text-[#191F28] font-bold text-xs border border-[#F2F4F6] transition cursor-pointer text-center"
                >
                  +0.1주
                </button>
                <button
                  type="button"
                  id="preset-sell-05"
                  onClick={() => handleAddQuantity(0.5)}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF] active:bg-[#E5DDFF] text-[#191F28] font-bold text-xs border border-[#F2F4F6] transition cursor-pointer text-center"
                >
                  +0.5주
                </button>
                <button
                  type="button"
                  id="preset-sell-all"
                  onClick={handleSetFull}
                  className="py-2 sm:py-2.5 rounded-xl bg-[#F0ECFF] hover:bg-[#E5DDFF] text-[#6C47FF] font-extrabold text-xs border border-[#6C47FF]/20 transition cursor-pointer text-center"
                >
                  전량 매도
                </button>
              </div>

              {/* Smooth Numeric Keypad with 8px gap (gap-2) and 44px-48px button height */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    id={`sell-numkey-${key}`}
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
              id="sell-modal-dual-action-cta-area"
              className="shrink-0 bg-[#FFFFFF] border-t border-[#F2F4F6] w-full box-border"
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 16px 16px 16px',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Left Button: '매도' (Executes Sell) - flex ratio: 2, Primary Purple fill (#6C47FF) */}
              <button
                type="button"
                id="execute-sell-cta-button"
                onClick={handleExecuteSell}
                disabled={quantity <= 0 || isOverHolding}
                className={`py-3.5 px-3 rounded-2xl font-extrabold text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 min-w-0 ${
                  quantity <= 0 || isOverHolding
                    ? 'bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed shadow-none'
                    : 'bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-[#FFFFFF] shadow-[#6C47FF]/25 active:scale-[0.99]'
                }`}
                style={{ flex: 2 }}
              >
                <ArrowDownCircle className="w-4 h-4 shrink-0" />
                <span className="truncate whitespace-nowrap">
                  {quantity > 0 ? `${quantity}주 매도하기` : '매도하기'}
                </span>
              </button>

              {/* Right Button: '소수점 매수하기' (Switches to Buy) - flex ratio: 1, Light Purple background (#F0ECFF) */}
              <button
                type="button"
                id="modal-switch-to-buy-button"
                onClick={onSwitchToBuy}
                className="py-3.5 px-3 rounded-2xl bg-[#F0ECFF] hover:bg-[#E5DDFF] active:bg-[#DDD3FF] text-[#6C47FF] font-extrabold text-sm transition cursor-pointer text-center flex items-center justify-center min-w-0"
                style={{ flex: 1 }}
              >
                <span className="truncate whitespace-nowrap">소수점 매수하기</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
