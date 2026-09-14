import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Bell,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Info,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Headphones,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockChart } from './StockChart';
import { PurchaseModal } from './PurchaseModal';
import { SellModal } from './SellModal';
import { StockPricePoint, StockItem } from '../../types';
import { TopicBotMascot } from '../companion/TopicBotMascot';

export const StockDetailScreen: React.FC = () => {
  const {
    selectedStockDetail: stock,
    setSelectedStockDetail,
    holdings,
    openTermByName,
    setActiveRiskStock,
    setIsTradeSheetOpen,
  } = useApp();

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [scrubPrice, setScrubPrice] = useState<number | null>(null);

  const isTradeSheetActive = showPurchaseModal || showSellModal;

  useEffect(() => {
    setIsTradeSheetOpen(isTradeSheetActive);
    return () => {
      setIsTradeSheetOpen(false);
    };
  }, [isTradeSheetActive, setIsTradeSheetOpen]);

  // Accordion card states
  const [isAiBriefingOpen, setIsAiBriefingOpen] = useState<boolean>(true);
  const [isKeyMetricsOpen, setIsKeyMetricsOpen] = useState<boolean>(true);
  const [isDocentOpen, setIsDocentOpen] = useState<boolean>(true);

  if (!stock) return null;

  const getDocentAnalysis = (stockItem: StockItem, currentScrubPrice: number | null) => {
    if (currentScrubPrice !== null) {
      const diff = currentScrubPrice - stockItem.currentPrice;
      const diffSign = diff >= 0 ? '+' : '';
      return {
        tag: '실시간 차트 스크러버 탐색',
        title: `${currentScrubPrice.toLocaleString()}원 시점 탐색`,
        explanation: `선택하신 가격대(${diffSign}${diff.toLocaleString()}원)는 장중 투자자들의 매수·매도 주문이 가장 치열하게 맞붙었던 순간이에요!`,
        ceoHumor: `워런 버핏의 귀띔: "초 단위 등락에 심장 졸이지 말고, 10년 뒤에도 이 회사가 세상을 바꿀지 생각하세요!" ☕`,
      };
    }

    const name = stockItem.name;
    const isUp = stockItem.changeRate >= 0;

    if (name.includes('삼성전자')) {
      return {
        tag: isUp ? '급등 요인 분석' : '조정 요인 분석',
        title: isUp ? 'AI 메모리 데이터센터 수주 폭발! 🚀' : '반도체 사이클 숨고르기 📉',
        explanation: isUp
          ? '글로벌 빅테크 기업들이 차세대 HBM 메모리를 대량 주문하면서 주가가 강한 탄력을 받고 있어요.'
          : '단기 차익 실현 물량이 나오며 숨고르기 중이에요. 단기 파도보단 메모리 업황의 큰 조류를 보세요.',
        ceoHumor: '젠슨 황도 "삼성 없으면 우리 AI 칩 못 만든다"고 할 정도지만, 한 바구니 몰빵은 금물입니다! 👔',
      };
    }

    if (name.includes('현대차') || name.includes('모빌리티') || name.includes('테슬라')) {
      return {
        tag: isUp ? '실적 모멘텀' : '변동성 체크',
        title: isUp ? '북미 전기차 & 하이브리드 흥행 🚗' : 'CEO 트윗 & 단기 변동성 ⚡',
        explanation: isUp
          ? '하이브리드와 전동화 라인업의 해외 수출 실적이 예상치를 웃돌며 시장의 신뢰를 얻고 있어요.'
          : '원자재 가격과 글로벌 환율 변동으로 투자자들이 잠시 커피 한잔하며 관망하는 중이에요.',
        ceoHumor: '일론 머스크가 트위터(X)에 글을 남겼든 아니든, 자율주행 소프트웨어 혁신 엔진을 주목해요! 🤖',
      };
    }

    if (name.includes('카카오') || name.includes('네이버')) {
      return {
        tag: isUp ? '플랫폼 모멘텀' : '숨고르기 구간',
        title: isUp ? '생성형 AI 검색 & 웹툰 해외 진출 📱' : '광고 경기 둔화 우려 ☕',
        explanation: isUp
          ? '자체 개발 AI 모델을 검색과 메신저에 결합하면서 신규 수익 창출 기대감이 주가를 끌어올렸어요.'
          : '계절적 광고 비수기 영향으로 주가가 횡보 중이나, 탄탄한 사용자 풀은 여전히 견고합니다.',
        ceoHumor: '지우님이 매일 보내는 톡과 검색 하나하나가 이 회사의 알짜배기 매출 기반이랍니다! 💡',
      };
    }

    if (name.includes('에코프로') || name.includes('친환경')) {
      return {
        tag: isUp ? '배터리 호재' : '원자재 조정',
        title: isUp ? '차세대 양극재 대규모 공급 체결 ⚡' : '광물 가격 하락 영향 🔋',
        explanation: isUp
          ? '글로벌 완성차 메이커와의 대형 장기 공급 계약 소식이 전해지며 강력한 매수세가 유입되었어요.'
          : '주요 광물 가격 조정 여파가 반영되고 있어요. 기술력 있는 선두 기업의 점유율 확대를 지켜봐요.',
        ceoHumor: '배터리처럼 찌릿찌릿 급등락할 때일수록 분산투자로 내 포트폴리오를 지키는 게 최고예요! 🛡️',
      };
    }

    if (name.includes('크래프톤') || name.includes('엔터')) {
      return {
        tag: isUp ? '신작 글로벌 흥행' : '업데이트 대기',
        title: isUp ? '신작 게임 해외 예약자 돌파 🎮' : '대형 패치 전 숨고르기 🕹️',
        explanation: isUp
          ? '새로운 IP 게임이 글로벌 스팀 차트 상위권에 랭크되며 실적 퀀텀점프 기대가 커졌어요.'
          : '게이머들이 패치 노트를 기다리듯 투자자들도 다음 대규모 시즌 업데이트 성과를 대기 중이에요.',
        ceoHumor: '게임 속에서 치킨을 뜯듯, 주식 시장에서도 끝까지 인내한 자가 승리의 트로피를 쥡니다! 🍗',
      };
    }

    return {
      tag: isUp ? '주가 상승 배경' : '주가 조정 배경',
      title: isUp ? `호실적 기대감 상승 (+${stockItem.changeRate}%)` : `시장 조정 숨고르기 (${stockItem.changeRate}%)`,
      explanation: isUp
        ? '업종 전반에 우호적인 수급이 유입되며 주가가 탄탄하게 상승세를 이어가고 있어요.'
        : '단기 차익 실현과 시장 변동성으로 인해 숨을 고르는 구간이에요.',
      ceoHumor: '주가는 바다의 파도 같아서 밀려왔다 빠져나가지만, 기업의 본질 체력은 그대로랍니다! 🌊',
    };
  };

  const docent = getDocentAnalysis(stock, scrubPrice);

  // Find user's holding for this stock
  const userHolding = holdings.find((h) => h.stockId === stock.id);
  const holdingQuantity = userHolding ? userHolding.quantity : 0;
  const holdingValue = Math.round(holdingQuantity * stock.currentPrice);
  const costBasis = userHolding ? Math.round(holdingQuantity * userHolding.avgBuyPrice) : 0;
  const profitAmount = holdingValue - costBasis;
  const profitRate = costBasis > 0 ? (profitAmount / costBasis) * 100 : 0;

  const [sellNotice, setSellNotice] = useState<string>('');

  const handleBuyClick = () => {
    if (stock.isRiskRestricted) {
      setActiveRiskStock(stock);
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleSellClick = () => {
    if (!userHolding || userHolding.quantity <= 0) {
      setSellNotice('현재 보유 중인 주식이 없습니다.');
      setTimeout(() => setSellNotice(''), 2500);
      return;
    }
    setShowSellModal(true);
  };

  const displayPrice = scrubPrice ?? stock.currentPrice;

  return (
    <div className="flex-1 flex flex-col bg-[#FFFFFF] min-h-full relative overflow-y-auto no-scrollbar">
      {/* Top Header Bar: Sticky top 0, z-index 100, solid white background */}
      <div
        id="stock-detail-top-header"
        className="h-13 px-4 flex items-center justify-between bg-[#FFFFFF] border-b border-[#F2F4F6] shrink-0 sticky top-0 z-[100]"
        style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}
      >
        <button
          id="stock-detail-back-button"
          onClick={() => setSelectedStockDetail(null)}
          className="p-2 -ml-1 rounded-full hover:bg-[#F2F4F6] text-[#191F28] transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1 mx-2">
          <h2 className="text-base font-extrabold text-[#191F28] leading-tight truncate">
            {stock.name}
          </h2>
          <span className="text-[11px] text-[#8B95A1] font-medium">{stock.code} · 코스피</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            id="toggle-favorite-button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full hover:bg-[#F2F4F6] text-[#8B95A1] transition cursor-pointer"
          >
            <Star
              className={`w-5 h-5 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-[#8B95A1]'
              }`}
            />
          </button>
          <button
            id="stock-alert-button"
            className="p-2 rounded-full hover:bg-[#F2F4F6] text-[#8B95A1] transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Header: Real-time Price & Change Rate Banner */}
        <div className="bg-[#FFFFFF] p-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F2F4F6] text-[#4E5968]">
              {stock.category}
            </span>
            {stock.isRiskRestricted && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-[#F04452] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>거래제한</span>
              </span>
            )}
          </div>

          <div className="pt-1 flex items-baseline gap-2">
            <h1 className="text-[32px] font-extrabold text-[#191F28] tracking-tight leading-none">
              {displayPrice.toLocaleString()}원
            </h1>
            {scrubPrice && (
              <span className="text-xs text-[#8B95A1] font-medium">(탐색 중)</span>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 text-sm font-bold ${
              stock.changeRate >= 0 ? 'text-[#F04452]' : 'text-[#3182F6]'
            }`}
          >
            <span>{stock.changeRate >= 0 ? '▲' : '▼'}</span>
            <span>{stock.changeAmount.toLocaleString()}원</span>
            <span>({stock.changeRate >= 0 ? '+' : ''}{stock.changeRate}%)</span>
            <span className="text-xs text-[#8B95A1] font-normal ml-0.5">오늘</span>
          </div>
        </div>

        {/* Toss Style Interactive Stock Chart with Scrubber */}
        <StockChart
          chartData={stock.chartData}
          isPositive={stock.changeRate >= 0}
          onScrub={(pt) => setScrubPrice(pt ? pt.price : null)}
        />

        {/* Topic-bot Real-Time Chart Docent Card */}
        <section
          id="topic-bot-chart-docent-section"
          className="bg-gradient-to-br from-[#FAF9FF] to-[#F0ECFF] p-4 rounded-2xl border border-[#E5DDFF] shadow-xs relative overflow-hidden transition-all"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#6C47FF] text-white shadow-xs">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-[#191F28]">토픽이의 실시간 차트 도슨트</span>
                  <span className="flex items-center gap-0.5 text-[9px] font-black text-[#6C47FF] bg-white px-1.5 py-0.5 rounded-full border border-[#E5DDFF]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] animate-ping"></span>
                    ON AIR
                  </span>
                </div>
                <span className="text-[10px] text-[#6C47FF] font-bold">
                  {docent.tag}
                </span>
              </div>
            </div>

            <TopicBotMascot mood="docent" size="sm" isFloating={false} />
          </div>

          {/* Docent Explanation & CEO Humor (2-3 sentences max) */}
          <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-[#E5DDFF] space-y-1.5">
            <h4 className="text-xs font-extrabold text-[#191F28] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6C47FF]" />
              <span>{docent.title}</span>
            </h4>
            <p className="text-xs text-[#333D4B] font-bold leading-relaxed">
              {docent.explanation}
            </p>
            <div className="pt-1 border-t border-[#F2F4F6] mt-1.5 flex items-start gap-1 text-[11px] text-[#5530E5] font-medium leading-normal">
              <span className="shrink-0 text-xs">💬</span>
              <span>{docent.ceoHumor}</span>
            </div>
          </div>

          {/* Scrubber Usage Hint */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#8B95A1] px-1">
            <span>💡 차트를 좌우로 드래그하면 특정 시점 해설을 들려드려요!</span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">모의투자 학습용</span>
          </div>
        </section>

        {/* My Position Summary (If holding shares) */}
        {userHolding && userHolding.quantity > 0 && (
          <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#F2F4F6] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F2F4F6] pb-2.5">
              <span className="text-xs font-bold text-[#191F28]">내 보유 현황</span>
              <span className="text-xs font-extrabold text-[#6C47FF] bg-[#F0ECFF] px-2.5 py-0.5 rounded-full">
                {holdingQuantity}주 보유 중
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#F2F4F6]">
                <span className="text-[#8B95A1] block mb-0.5 text-[11px]">평균 매수가</span>
                <span className="text-sm font-extrabold text-[#191F28]">
                  {userHolding.avgBuyPrice.toLocaleString()}원
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#F2F4F6]">
                <span className="text-[#8B95A1] block mb-0.5 text-[11px]">평가 수익</span>
                <span
                  className={`text-sm font-extrabold ${
                    profitAmount >= 0 ? 'text-[#FF3B30]' : 'text-[#3182F6]'
                  }`}
                >
                  {profitAmount >= 0 ? '+' : ''}
                  {profitAmount.toLocaleString()}원 ({profitRate.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accordion Card 1: AI 기업 브리핑 (Borderless card, 16px rounded corners, ample inner padding, subtle shadow) */}
        <div className="bg-[#F9FAFB] rounded-2xl p-5 shadow-xs border border-[#F2F4F6] transition-all">
          <button
            id="accordion-ai-briefing-toggle"
            onClick={() => setIsAiBriefingOpen(!isAiBriefingOpen)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#6C47FF] text-white flex items-center justify-center font-extrabold text-xs">
                AI
              </div>
              <h3 className="font-extrabold text-[#191F28] text-sm">AI 맞춤 기업 브리핑</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#F0ECFF] text-[#6C47FF] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#6C47FF]" />
                <span>검증완료 ✓</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8B95A1] transition-transform duration-200 ${
                  isAiBriefingOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isAiBriefingOpen && (
            <div className="mt-4 space-y-3 pt-3 border-t border-[#F2F4F6] animate-in fade-in duration-200">
              {/* Fact vs Opinion Split Display Cards */}
              <div className="space-y-2.5">
                {/* Fact Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E8EB] p-3.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C47FF] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]"></span>
                    <span>실제 확인된 사실 (Fact)</span>
                  </div>
                  <p className="text-xs text-[#4E5968] leading-relaxed">
                    {stock.todayAiSummary.fact}
                  </p>
                </div>

                {/* Opinion Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E8EB] p-3.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C47FF] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]"></span>
                    <span>AI의 분석 & 해석 (Opinion)</span>
                  </div>
                  <p className="text-xs text-[#4E5968] leading-relaxed">
                    {stock.todayAiSummary.opinion}
                  </p>
                </div>

                {/* Uncertain warning if applicable */}
                {stock.todayAiSummary.uncertainWarning && (
                  <div className="bg-[#FFF0F0] border border-[#FFD6D6] p-3 rounded-xl flex items-start gap-2 text-xs text-[#FF3B30] font-medium">
                    <AlertTriangle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                    <span>{stock.todayAiSummary.uncertainWarning}</span>
                  </div>
                )}
              </div>

              {/* Source & Timestamp */}
              <div className="text-[11px] text-[#8B95A1] flex items-center justify-between pt-1">
                <span>출처: {stock.todayAiSummary.source}</span>
                <span>기준: {stock.todayAiSummary.verifiedDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Card 2: 기업 핵심 지표 (Borderless card, 16px rounded corners, ample inner padding, subtle shadow) */}
        <div className="bg-[#F9FAFB] rounded-2xl p-5 shadow-xs border border-[#F2F4F6] transition-all">
          <button
            id="accordion-key-metrics-toggle"
            onClick={() => setIsKeyMetricsOpen(!isKeyMetricsOpen)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#191F28] text-sm">기업 핵심 지표</h3>
              <span className="text-[11px] text-[#6C47FF] font-extrabold">용어 탭 시 해설</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#8B95A1] transition-transform duration-200 ${
                isKeyMetricsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isKeyMetricsOpen && (
            <div className="mt-4 space-y-3 pt-3 border-t border-[#F2F4F6] animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {/* PER */}
                <button
                  id="detail-term-per"
                  onClick={() => openTermByName('PER')}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] border border-[#F2F4F6] hover:border-[#E2D9FF] active:border-[#6C47FF] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#8B95A1] mb-1">
                    <span className="font-bold text-[#4E5968]">PER</span>
                    <div className="w-5 h-5 rounded-full bg-[#F0ECFF] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-3.5 h-3.5 text-[#6C47FF]" />
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-[#191F28]">
                    {stock.per > 0 ? `${stock.per}배` : '해당없음'}
                  </span>
                </button>

                {/* PBR */}
                <button
                  id="detail-term-pbr"
                  onClick={() => openTermByName('PBR')}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] border border-[#F2F4F6] hover:border-[#E2D9FF] active:border-[#6C47FF] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#8B95A1] mb-1">
                    <span className="font-bold text-[#4E5968]">PBR</span>
                    <div className="w-5 h-5 rounded-full bg-[#F0ECFF] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-3.5 h-3.5 text-[#6C47FF]" />
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-[#191F28]">
                    {stock.pbr > 0 ? `${stock.pbr}배` : '해당없음'}
                  </span>
                </button>

                {/* 배당금 */}
                <button
                  id="detail-term-dividend"
                  onClick={() => openTermByName('배당금')}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] border border-[#F2F4F6] hover:border-[#E2D9FF] active:border-[#6C47FF] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#8B95A1] mb-1">
                    <span className="font-bold text-[#4E5968]">배당수익률</span>
                    <div className="w-5 h-5 rounded-full bg-[#F0ECFF] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-3.5 h-3.5 text-[#6C47FF]" />
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-[#191F28]">
                    {stock.dividendYield}%
                  </span>
                </button>

                {/* 시가총액 */}
                <button
                  id="detail-term-marketcap"
                  onClick={() => openTermByName('시가총액')}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] border border-[#F2F4F6] hover:border-[#E2D9FF] active:border-[#6C47FF] text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[#8B95A1] mb-1">
                    <span className="font-bold text-[#4E5968]">시가총액</span>
                    <div className="w-5 h-5 rounded-full bg-[#F0ECFF] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-3.5 h-3.5 text-[#6C47FF]" />
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#191F28] truncate block">
                    {stock.marketCap}
                  </span>
                </button>
              </div>

              <p className="text-xs text-[#6B7684] leading-relaxed pt-1">
                {stock.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sell Notice Toast */}
      {sellNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#191F28] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg animate-in fade-in flex items-center gap-1.5 whitespace-nowrap">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{sellNotice}</span>
        </div>
      )}

      {/* Sticky Bottom Trading Action Bar: Dual Buttons side-by-side (flex ratio 1 : 2) */}
      <div
        id="stock-detail-bottom-action-bar"
        className={
          isTradeSheetActive
            ? 'hidden'
            : 'sticky bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-[#F2F4F6] z-[90] shadow-md box-border'
        }
        style={{
          display: isTradeSheetActive ? 'none' : 'flex',
          visibility: isTradeSheetActive ? 'hidden' : 'visible',
          gap: '8px',
          padding: '12px 16px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 16px))',
          boxSizing: 'border-box',
          position: 'sticky',
          bottom: 0,
          zIndex: 90,
        }}
      >
        {/* Left Button: '매도' (Sell) - flex ratio: 1, Light Purple background (#F0ECFF) */}
        <button
          id="detail-sell-button"
          onClick={handleSellClick}
          className="py-3.5 px-3 rounded-2xl bg-[#F0ECFF] hover:bg-[#E5DDFF] active:bg-[#DDD3FF] text-[#6C47FF] font-extrabold text-sm transition cursor-pointer text-center flex items-center justify-center min-w-0"
          style={{ flex: 1 }}
        >
          <span className="truncate whitespace-nowrap">
            {userHolding && userHolding.quantity > 0 ? `매도 (${userHolding.quantity}주)` : '매도'}
          </span>
        </button>

        {/* Right Button: '소수점 매수하기' (Buy) - flex ratio: 2, Primary Purple fill (#6C47FF) */}
        <button
          id="detail-buy-button"
          onClick={handleBuyClick}
          className={`py-3.5 px-3 rounded-2xl font-extrabold text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
            stock.isRiskRestricted
              ? 'bg-[#FF3B30] hover:bg-[#D9303E] text-white shadow-[#FF3B30]/20'
              : 'bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-[#FFFFFF] shadow-[#6C47FF]/25'
          }`}
          style={{ flex: 2 }}
        >
          {stock.isRiskRestricted ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="truncate whitespace-nowrap">거래 제한 확인</span>
            </>
          ) : (
            <span className="truncate whitespace-nowrap">소수점 매수하기</span>
          )}
        </button>
      </div>

      {/* Frictionless Order Bottom-Sheet */}
      {showPurchaseModal && (
        <PurchaseModal
          stock={stock}
          userHolding={userHolding}
          onClose={() => setShowPurchaseModal(false)}
          onSwitchToSell={() => {
            setShowPurchaseModal(false);
            if (!userHolding || userHolding.quantity <= 0) {
              setSellNotice('현재 보유 중인 주식이 없습니다.');
              setTimeout(() => setSellNotice(''), 2500);
            } else {
              setShowSellModal(true);
            }
          }}
        />
      )}

      {/* Sell Confirmation Bottom-Sheet */}
      {showSellModal && (
        <SellModal
          stock={stock}
          holding={
            userHolding || {
              stockId: stock.id,
              stockCode: stock.code,
              stockName: stock.name,
              quantity: 0,
              avgBuyPrice: stock.currentPrice,
              category: stock.category,
            }
          }
          onClose={() => setShowSellModal(false)}
          onSwitchToBuy={() => {
            setShowSellModal(false);
            setShowPurchaseModal(true);
          }}
        />
      )}
    </div>
  );
};
