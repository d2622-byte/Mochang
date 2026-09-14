import React, { useState } from 'react';
import {
  Search,
  Monitor,
  Gamepad2,
  Leaf,
  HeartPulse,
  ShoppingBag,
  Car,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryType, StockItem } from '../../types';

export const MarketScreen: React.FC = () => {
  const {
    stocks,
    selectedCategory,
    setSelectedCategory,
    setSelectedStockDetail,
    setActiveRiskStock,
    holdings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'category' | 'ranking' | 'holding'>('category');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { label: CategoryType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'IT/인터넷', icon: Monitor },
    { label: '게임·엔터테인먼트', icon: Gamepad2 },
    { label: '친환경·에너지', icon: Leaf },
    { label: '바이오·헬스케어', icon: HeartPulse },
    { label: '소비재·유통', icon: ShoppingBag },
    { label: '미래 모빌리티', icon: Car },
  ];

  const filteredStocks = (stocks || []).filter((stock) => {
    if (!stock || !stock.name) return false;
    const query = (searchQuery || '').trim().toLowerCase();
    const matchesSearch =
      !query ||
      stock.name.toLowerCase().includes(query) ||
      (stock.code && stock.code.toLowerCase().includes(query));

    if (activeTab === 'holding') {
      const isHeld = (holdings || []).some((h) => h?.stockId === stock.id);
      return matchesSearch && isHeld;
    }

    if (activeTab === 'ranking') {
      return matchesSearch;
    }

    if (selectedCategory === '전체') {
      return matchesSearch;
    }
    return matchesSearch && stock.category === selectedCategory;
  });

  const handleStockClick = (stock: StockItem) => {
    if (stock.isRiskRestricted) {
      setActiveRiskStock(stock);
    }
    setSelectedStockDetail(stock);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] pb-6 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="p-4 bg-[#FFFFFF] border-b border-[#F2F4F6] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-extrabold text-[#191F28] tracking-tight">마켓 (투자하기)</h2>
          <span className="text-xs text-[#6C47FF] bg-[#F0ECFF] px-2.5 py-1 rounded-full font-extrabold">
            1,000원 조각 투자
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8B95A1] absolute left-3.5 top-3" />
          <input
            id="market-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기업명 또는 종목코드 검색 (예: 삼성전자)"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] rounded-2xl text-xs text-[#191F28] placeholder-[#8B95A1] focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30 border border-transparent focus:border-[#6C47FF] transition"
          />
        </div>

        {/* Sub Tabs: 카테고리 | 랭킹 | 보유 */}
        <div className="flex border-b border-[#F2F4F6] mt-3">
          <button
            id="market-subtab-category"
            onClick={() => setActiveTab('category')}
            className={`flex-1 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 ${
              activeTab === 'category'
                ? 'border-[#6C47FF] text-[#6C47FF]'
                : 'border-transparent text-[#8B95A1] hover:text-[#191F28]'
            }`}
          >
            카테고리
          </button>
          <button
            id="market-subtab-ranking"
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 ${
              activeTab === 'ranking'
                ? 'border-[#6C47FF] text-[#6C47FF]'
                : 'border-transparent text-[#8B95A1] hover:text-[#191F28]'
            }`}
          >
            인기 랭킹
          </button>
          <button
            id="market-subtab-holding"
            onClick={() => setActiveTab('holding')}
            className={`flex-1 py-2.5 text-xs font-extrabold transition cursor-pointer border-b-2 ${
              activeTab === 'holding'
                ? 'border-[#6C47FF] text-[#6C47FF]'
                : 'border-transparent text-[#8B95A1] hover:text-[#191F28]'
            }`}
          >
            보유 종목 ({holdings.length})
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Icons Grid */}
        {activeTab === 'category' && (
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#F2F4F6] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#191F28]">관심 분야로 기업 찾기</h3>
                <p className="text-[11px] text-[#8B95A1]">내가 좋아하는 분야의 기업에 투자해봐요</p>
              </div>
              {selectedCategory !== '전체' && (
                <button
                  id="reset-category-filter-button"
                  onClick={() => setSelectedCategory('전체')}
                  className="text-xs text-[#6C47FF] font-extrabold hover:underline cursor-pointer"
                >
                  전체보기
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    id={`category-tile-${cat.label}`}
                    onClick={() =>
                      setSelectedCategory(isSelected ? '전체' : cat.label)
                    }
                    className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition cursor-pointer border ${
                      isSelected
                        ? 'border-[#6C47FF] bg-[#F0ECFF] shadow-xs'
                        : 'border-[#F2F4F6] hover:border-[#E2D9FF] bg-[#FFFFFF]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#FFFFFF] text-[#6C47FF]' : 'bg-[#F0ECFF] text-[#6C47FF]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#191F28] text-center leading-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock List Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#6C47FF]" />
              <h3 className="text-xs font-extrabold text-[#191F28]">
                {activeTab === 'holding'
                  ? '내가 보유한 종목 리스트'
                  : selectedCategory === '전체'
                  ? '오늘의 종목'
                  : `[${selectedCategory}] 관련 기업`}
              </h3>
            </div>
            <span className="text-[11px] font-medium text-[#8B95A1]">{filteredStocks.length}개</span>
          </div>

          {filteredStocks.length === 0 ? (
            <div className="bg-[#FFFFFF] p-8 rounded-2xl text-center text-xs text-[#8B95A1] border border-[#F2F4F6]">
              조건에 맞는 종목이 없습니다.
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const holding = holdings.find((h) => h.stockId === stock.id);
              return (
                <div
                  key={stock.id}
                  id={`stock-card-${stock.id}`}
                  onClick={() => handleStockClick(stock)}
                  className={`bg-[#FFFFFF] p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 hover:shadow-xs active:scale-[0.99] ${
                    stock.isRiskRestricted
                      ? 'border-[#FFD6D6] bg-[#FFFBFB]'
                      : 'border-[#F2F4F6] hover:border-[#E2D9FF]'
                  }`}
                >
                  {/* Left & Middle Column (Avatar + Stock Info with Ellipsis) */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Brand/Ticker Avatar */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                        stock.isRiskRestricted
                          ? 'bg-[#FFF0F0] text-[#FF3B30]'
                          : 'bg-[#F0ECFF] text-[#6C47FF]'
                      }`}
                    >
                      {stock.name.slice(0, 2)}
                    </div>

                    {/* Middle Column (Stock Title & Sub-Metadata) */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center min-w-0">
                        <h4 className="font-extrabold text-[#191F28] text-sm truncate whitespace-nowrap overflow-hidden">
                          {stock.name}
                        </h4>
                      </div>

                      {/* Sub-Metadata Line: Code, Category, Risk Badge, Holding */}
                      <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-[11px] text-[#8B95A1] min-w-0">
                        <span className="font-medium shrink-0">{stock.code}</span>
                        <span className="shrink-0">·</span>
                        <span className="truncate max-w-[80px]">{stock.category}</span>
                        {stock.isRiskRestricted && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#FFF0F0] border border-[#FFD6D6] text-[#FF3B30] text-[10px] font-extrabold shrink-0 whitespace-nowrap">
                            <ShieldAlert className="w-3 h-3 text-[#FF3B30] shrink-0" />
                            <span>위험 종목 감지</span>
                          </span>
                        )}
                        {holding && (
                          <span className="text-[#6C47FF] font-extrabold shrink-0 whitespace-nowrap">
                            · {holding.quantity}주 보유
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dedicated Price & Percentage Container (Never wraps, right-aligned) */}
                  <div className="shrink-0 text-right flex flex-col items-end justify-center pl-2">
                    <div className="font-extrabold text-[#191F28] text-sm whitespace-nowrap tabular-nums">
                      {stock.currentPrice.toLocaleString()}원
                    </div>
                    <div
                      className={`text-xs font-extrabold whitespace-nowrap tabular-nums ${
                        stock.changeRate >= 0 ? 'text-[#FF3B30]' : 'text-[#3182F6]'
                      }`}
                    >
                      {stock.changeRate >= 0 ? '+' : ''}
                      {stock.changeRate}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
