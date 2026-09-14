import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Bot,
  Plus,
  ArrowRight,
  Monitor,
  Gamepad2,
  Leaf,
  HeartPulse,
  ShoppingBag,
  Car,
  AlertTriangle,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryType, StockItem } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    user,
    totalPortfolioValue,
    totalProfitLoss,
    totalProfitRate,
    availableCash,
    stocks,
    setCurrentTab,
    setSelectedCategory,
    setSelectedStockDetail,
    setActiveRiskStock,
    setShowAiChatModal,
    setShowChargeModal,
    setShowQuizModal,
  } = useApp();

  // Subtle flat icons for minimalist gray chip categories
  const categories: { label: CategoryType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'IT/인터넷', icon: Monitor },
    { label: '게임·엔터테인먼트', icon: Gamepad2 },
    { label: '친환경·에너지', icon: Leaf },
    { label: '바이오·헬스케어', icon: HeartPulse },
    { label: '소비재·유통', icon: ShoppingBag },
    { label: '미래 모빌리티', icon: Car },
  ];

  const handleSelectCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setCurrentTab('market');
  };

  const handleStockClick = (stock: StockItem) => {
    if (stock.isRiskRestricted) {
      setActiveRiskStock(stock);
    }
    setSelectedStockDetail(stock);
  };

  const currentTotal = totalPortfolioValue ?? 901459;
  const currentProfit = totalProfitLoss ?? 12450;
  const currentRate = totalProfitRate ?? 1.4;

  return (
    <div className="flex-1 flex flex-col bg-[#FFFFFF] pb-8 space-y-5 p-5 text-[#191F28] overflow-y-auto no-scrollbar">
      {/* 1. Asset Area: Display Total Assets at 32pt Extra Bold (Toss Securities inspired) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#8B95A1]">
              {user?.name || '지우'}의 투자 자산
            </span>
            <span className="text-[10px] font-bold bg-[#F2F4F6] text-[#4E5968] px-2 py-0.5 rounded-md">
              실시간
            </span>
          </div>

          <button
            id="charge-cash-button"
            onClick={() => setShowChargeModal(true)}
            className="flex items-center gap-1 text-xs font-extrabold text-[#6C47FF] hover:bg-[#F0ECFF] px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>충전하기</span>
          </button>
        </div>

        {/* 32pt Extra Bold Total Assets */}
        <div className="space-y-1">
          <h1 className="text-[32px] font-extrabold text-[#191F28] tracking-tight leading-none">
            {currentTotal.toLocaleString()}원
          </h1>

          <div
            className={`flex items-center gap-1.5 text-xs font-bold ${
              currentProfit >= 0 ? 'text-[#F04452]' : 'text-[#3182F6]'
            }`}
          >
            <span>
              {currentProfit >= 0 ? '+' : ''}
              {currentProfit.toLocaleString()}원 ({currentRate >= 0 ? '+' : ''}
              {currentRate.toFixed(1)}%)
            </span>
            <span className="text-[11px] text-[#8B95A1] font-normal">오늘 수익</span>
          </div>
        </div>

        {/* Available Cash Banner in Light Gray Container */}
        <div className="bg-[#F9FAFB] p-3.5 rounded-2xl border border-[#F2F4F6] flex items-center justify-between text-xs">
          <span className="text-[#8B95A1] font-medium">주문 가능 잔액</span>
          <span className="font-extrabold text-[#191F28]">
            {(availableCash ?? 0).toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 2. Minimalist Categories: Soft Rounded Gray Chips with Subtle Flat Icons */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#191F28]">관심 테마 탐색</h3>
          <button
            onClick={() => {
              setSelectedCategory('전체');
              setCurrentTab('market');
            }}
            className="text-xs text-[#8B95A1] hover:text-[#191F28] font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <span>전체</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                id={`home-cat-${cat.label}`}
                onClick={() => handleSelectCategory(cat.label)}
                className="bg-[#F9FAFB] hover:bg-[#F2F4F6] active:bg-[#E5E8EB] border border-[#F2F4F6] text-[#333D4B] font-bold text-xs py-3 px-3.5 rounded-2xl flex items-center gap-2.5 transition cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FFFFFF] text-[#4E5968] flex items-center justify-center border border-[#E5E8EB] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Featured Stocks: Borderless rows with 16px vertical padding, clean 1px dividers, and crisp +Red/-Blue badges */}
      <div className="space-y-1">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#6C47FF]" />
            <h3 className="text-sm font-extrabold text-[#191F28]">실시간 인기 종목</h3>
          </div>
          <span className="text-xs text-[#8B95A1]">1,000원부터 구매</span>
        </div>

        {/* Stock List: Borderless rows, py-4 (16px vertical padding), 1px dividers (#F2F4F6) */}
        <div className="divide-y divide-[#F2F4F6]">
          {stocks.slice(0, 5).map((stock) => {
            const isUp = stock.changeRate >= 0;
            return (
              <div
                key={stock.id}
                id={`home-stock-${stock.id}`}
                onClick={() => handleStockClick(stock)}
                className="py-4 flex items-center justify-between hover:bg-[#F9FAFB] -mx-2 px-2 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F2F4F6] text-[#191F28] flex items-center justify-center font-extrabold text-xs border border-[#E5E8EB]">
                    {stock.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-[#191F28]">{stock.name}</h4>
                      {stock.isRiskRestricted && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-[#F04452] flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>거래제한</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8B95A1]">{stock.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#191F28] block">
                    {stock.currentPrice.toLocaleString()}원
                  </span>
                  {/* Crisp +Red / -Blue badge */}
                  <span
                    className={`inline-block text-xs font-bold ${
                      isUp ? 'text-[#F04452]' : 'text-[#3182F6]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {stock.changeRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI Briefing Card in Crisp Toss Style */}
      <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#F2F4F6] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#6C47FF] text-white flex items-center justify-center font-extrabold text-xs">
              AI
            </div>
            <h3 className="font-extrabold text-sm text-[#191F28]">오늘의 AI 금융 브리핑</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#F0ECFF] text-[#6C47FF] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-[#6C47FF]" />
            <span>검증완료 ✓</span>
          </div>
        </div>

        <p className="text-xs text-[#4E5968] leading-relaxed">
          "오늘 국내 시장은 미국 기술주 강세와 글로벌 AI 인프라 수주 확대로 반도체와 친환경 에너지
          테마가 시장을 이끌고 있어요!"
        </p>

        <button
          id="open-ai-guide-chat-button"
          onClick={() => setShowAiChatModal(true)}
          className="w-full py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F2F4F6] text-[#6C47FF] border border-[#E5E8EB] font-extrabold text-xs shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#6C47FF]" />
          <span>AI 가이드와 실시간 질의응답</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Daily Quiz Card */}
      <div
        id="home-quiz-banner"
        onClick={() => setShowQuizModal(true)}
        className="bg-[#FFFFFF] border border-[#F2F4F6] p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#F8F9FA] transition shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6C47FF] text-white flex items-center justify-center font-black text-sm">
            Q
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-extrabold text-[#191F28]">오늘의 금융 상식 퀴즈</h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#F0ECFF] text-[#6C47FF] rounded-md">
                +10P
              </span>
            </div>
            <p className="text-[11px] text-[#8B95A1] mt-0.5">
              '주가수익비율(PER)'이 무엇인지 맞혀보세요!
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
      </div>
    </div>
  );
};
