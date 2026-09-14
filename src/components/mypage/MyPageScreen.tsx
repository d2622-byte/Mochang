import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  TrendingUp,
  PieChart,
  History,
  Settings,
  LogOut,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ChevronRight,
  Shield,
  PlusCircle,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { EmptyState } from '../common/EmptyState';

export const MyPageScreen: React.FC = () => {
  const {
    user,
    totalPortfolioValue,
    totalProfitLoss,
    totalProfitRate,
    availableCash,
    transactions,
    setShowChargeModal,
    setShowParentManagementModal,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'asset' | 'history' | 'spending'>('asset');

  // Compute portfolio breakdown
  const cashVal = Math.max(0, availableCash ?? 0);
  const totalVal = Math.max(0, totalPortfolioValue ?? 0);
  const stockVal = Math.max(0, totalVal - cashVal);
  const totalAlloc = stockVal + cashVal || 1;
  const stockPercent = (stockVal / totalAlloc) * 100;
  const cashPercent = (cashVal / totalAlloc) * 100;

  // Safe trade history list
  const tradeHistory = transactions || [];

  return (
    <div className="flex-1 flex flex-col bg-[#FFFFFF] pb-10 overflow-y-auto no-scrollbar">
      {/* Profile Header */}
      <div className="p-5 bg-[#FFFFFF] border-b border-[#F2F4F6] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F4F6] text-[#191F28] flex items-center justify-center font-bold text-lg border border-[#E5E8EB]">
              {(user?.name || '지우').slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-[#191F28]">{user?.name || '김지우'}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F2F4F6] text-[#4E5968]">
                  Lv.{user?.level || 1} {user?.badge || '주니어 투자자'}
                </span>
              </div>
              <p className="text-xs text-[#8B95A1] mt-0.5">
                @{user?.username || 'jiwoo_invest'} · 청소년 안심 회원
              </p>
            </div>
          </div>

          <button
            id="open-parent-management-button"
            onClick={() => setShowParentManagementModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0ECFF] text-[#6C47FF] text-xs font-extrabold hover:bg-[#E5DDFF] transition cursor-pointer shadow-2xs"
          >
            <Shield className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span>부모 안심</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-[#F2F4F6] gap-2">
          <button
            id="mypage-tab-asset"
            onClick={() => setActiveTab('asset')}
            className={`flex-1 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 text-center ${
              activeTab === 'asset'
                ? 'border-[#191F28] text-[#191F28]'
                : 'border-transparent text-[#8B95A1] hover:text-[#4E5968]'
            }`}
          >
            자산 요약
          </button>
          <button
            id="mypage-tab-history"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 text-center ${
              activeTab === 'history'
                ? 'border-[#191F28] text-[#191F28]'
                : 'border-transparent text-[#8B95A1] hover:text-[#4E5968]'
            }`}
          >
            체결 내역 ({tradeHistory.length})
          </button>
          <button
            id="mypage-tab-spending"
            onClick={() => setActiveTab('spending')}
            className={`flex-1 py-2.5 text-xs font-bold transition cursor-pointer border-b-2 text-center ${
              activeTab === 'spending'
                ? 'border-[#191F28] text-[#191F28]'
                : 'border-transparent text-[#8B95A1] hover:text-[#4E5968]'
            }`}
          >
            소비 분석
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <ErrorBoundary>
          {/* TAB 1: ASSET OVERVIEW */}
          {activeTab === 'asset' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Total Assets Card */}
              <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#F2F4F6] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8B95A1]">총 가상 평가 자산</span>
                  <button
                    onClick={() => setShowChargeModal(true)}
                    className="text-xs font-bold text-[#3182F6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>충전하기</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-[28px] font-extrabold text-[#191F28] tracking-tight leading-none">
                    {(totalPortfolioValue ?? 0).toLocaleString()}원
                  </h2>
                  <div
                    className={`text-xs font-bold ${
                      (totalProfitLoss ?? 0) >= 0 ? 'text-[#F04452]' : 'text-[#3182F6]'
                    }`}
                  >
                    {(totalProfitLoss ?? 0) >= 0 ? '+' : ''}
                    {(totalProfitLoss ?? 0).toLocaleString()}원 (
                    {(totalProfitRate ?? 0).toFixed(2)}%)
                  </div>
                </div>

                {/* Minimalist Horizontal Bar Chart: Cash vs Stock asset allocation ratio */}
                <div className="pt-3 border-t border-[#F2F4F6] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#191F28]">자산 구성 비중</span>
                    <span className="text-[#8B95A1] text-[11px] font-medium">
                      주식 {stockPercent.toFixed(1)}% · 현금 {cashPercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-3 bg-[#E5E8EB] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#3182F6] transition-all duration-500 rounded-l-full"
                      style={{ width: `${Math.max(3, stockPercent)}%` }}
                      title={`주식 ${stockPercent.toFixed(1)}%`}
                    />
                    <div
                      className="h-full bg-[#00C48C] transition-all duration-500 rounded-r-full"
                      style={{ width: `${Math.max(3, cashPercent)}%` }}
                      title={`현금 ${cashPercent.toFixed(1)}%`}
                    />
                  </div>

                  {/* Breakdown indicators */}
                  <div className="flex justify-between items-center text-xs pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3182F6]" />
                      <span className="text-[#4E5968] font-medium">주식 평가</span>
                      <span className="font-bold text-[#191F28]">{stockVal.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00C48C]" />
                      <span className="text-[#4E5968] font-medium">주문 가능 잔액</span>
                      <span className="font-bold text-[#191F28]">{cashVal.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#F2F4F6] overflow-hidden divide-y divide-[#F2F4F6]">
                <button
                  onClick={() => setShowParentManagementModal(true)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[#F9FAFB] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2F4F6] text-[#3182F6] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#191F28]">부모님 안심 연동 설정</h4>
                      <p className="text-[11px] text-[#8B95A1]">월 500,000원 한도 관리 중</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
                </button>

                <button
                  id="logout-button"
                  onClick={logout}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[#F9FAFB] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2F4F6] text-[#8B95A1] flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#4E5968]">로그아웃</h4>
                      <p className="text-[11px] text-[#8B95A1]">로그인 화면 및 실패 락아웃 테스트</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTION HISTORY (Protected with nullish coalescing & EmptyState) */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {(!tradeHistory || tradeHistory.length === 0) ? (
                <EmptyState
                  message="아직 체결된 내역이 없습니다"
                  subMessage="소수점 모의투자를 통해 첫 주식을 매수해보세요."
                />
              ) : (
                (tradeHistory ?? []).map((tx) => {
                  if (!tx) return null;
                  const isBuy = tx.type === 'BUY';
                  const isCharge = tx.type === 'CHARGE';
                  const title = tx.stockName || (isCharge ? '가상 투자금 충전' : '주식 거래');
                  const dateStr = tx.date || '최근';
                  const priceStr =
                    tx.pricePerShare != null ? `@ ${tx.pricePerShare.toLocaleString()}원` : '';
                  const qtyStr = tx.quantity != null ? `${tx.quantity}주 체결` : '';

                  return (
                    <div
                      key={tx.id || `${dateStr}-${Math.random()}`}
                      className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#F2F4F6] flex items-center justify-between transition hover:border-[#E5E8EB]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                            isBuy
                              ? 'bg-rose-50 text-[#F04452]'
                              : isCharge
                              ? 'bg-emerald-50 text-[#00C48C]'
                              : 'bg-blue-50 text-[#3182F6]'
                          }`}
                        >
                          {isBuy ? '매수' : isCharge ? '충전' : '매도'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#191F28]">{title}</h4>
                          <p className="text-[11px] text-[#8B95A1] mt-0.5">
                            {[qtyStr, dateStr].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-xs text-[#191F28] block">
                          {isBuy ? '-' : '+'}{(tx.totalAmount ?? 0).toLocaleString()}원
                        </span>
                        {priceStr && (
                          <span className="text-[10px] text-[#8B95A1]">{priceStr}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: SPENDING RISK ANALYTICS */}
          {activeTab === 'spending' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#F2F4F6] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[#3182F6]" />
                    <h3 className="text-sm font-bold text-[#191F28]">지출 위험도 분석</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00C48C]">
                    안전 패턴 유지 중
                  </span>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-[#4E5968]">
                    <span>이번 달 청소년 용돈 지출 분석</span>
                    <span className="font-bold text-[#191F28]">총 85,000원</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#F2F4F6]">
                    <div
                      className="bg-[#3182F6] h-full"
                      style={{ width: '45%' }}
                      title="외식/간식 45%"
                    />
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: '30%' }}
                      title="문구/쇼핑 30%"
                    />
                    <div
                      className="bg-purple-400 h-full"
                      style={{ width: '25%' }}
                      title="게임/여가 25%"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8B95A1] pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#3182F6]"></span> 외식·간식 (45%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> 문구·쇼핑 (30%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span> 게임·취미 (25%)
                    </span>
                  </div>
                </div>

                {/* AI Saving Tip Card */}
                <div className="bg-[#F9FAFB] p-3.5 rounded-xl border border-[#F2F4F6] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3182F6]">
                    <Sparkles className="w-3.5 h-3.5 text-[#3182F6]" />
                    <span>AI 스마트 절약 팁</span>
                  </div>
                  <p className="text-xs text-[#4E5968] leading-relaxed">
                    "불필요한 군것질 비용을 주당 10,000원씩 아껴 우량주에 소수점 투자하면 1년에 약 52만
                    원의 든든한 미래 자산이 형성돼요!"
                  </p>
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

