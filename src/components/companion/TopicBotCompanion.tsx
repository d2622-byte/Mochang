import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Shield,
  Lightbulb,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopicBotMascot } from './TopicBotMascot';
import { TopicBotMood, TopicBotMessage } from '../../types';

export const TopicBotCompanion: React.FC = () => {
  const {
    currentTab,
    selectedStockDetail,
    totalProfitLoss,
    totalProfitRate,
    topicBotMessage,
    setTopicBotMessage,
    user,
    setCurrentTab,
    setSelectedStockDetail,
    isModalOpen,
  } = useApp();

  const [isExpandedSheet, setIsExpandedSheet] = useState<boolean>(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(true);
  const [activeMood, setActiveMood] = useState<TopicBotMood>('greeting');
  const [speechText, setSpeechText] = useState<string>('');
  const [speechSubText, setSpeechSubText] = useState<string | undefined>(undefined);
  const [actionButton, setActionButton] = useState<{ label: string; onClick: () => void } | null>(null);

  // 1. App Launch & Tab Change Trigger (Zero-Prompt Engine)
  useEffect(() => {
    // If a stock is opened, Chart Docent handles it
    if (selectedStockDetail) {
      return;
    }

    if (currentTab === 'home') {
      const isLoss = (totalProfitLoss ?? 0) < 0;
      const isGain = (totalProfitLoss ?? 0) > 0;

      if (isLoss) {
        setActiveMood('commiserating');
        setSpeechText(
          `파란불(${(totalProfitRate ?? 0).toFixed(1)}%)에 기죽지 마세요! 워런 버핏도 시작할 땐 잔고가 이보다 슬펐답니다... 존버는 승리해요! ☕`
        );
        setSpeechSubText('토픽이의 CEO 한마디: 단기 변동성보단 기업의 장기 성장 엔진을 믿어요.');
        setActionButton({
          label: '실시간 인기 종목 보기',
          onClick: () => {
            setCurrentTab('market');
          },
        });
      } else if (isGain) {
        setActiveMood('mentor');
        setSpeechText(
          `오늘 ${user?.name || '지우'}님 포트폴리오 +${(totalProfitRate ?? 1.4).toFixed(1)}% 상승 중! 이 기세면 차고에서 창업해도 되겠는데요? 🚀`
        );
        setSpeechSubText('기술 리더의 팁: 수익이 났을 때 분산투자 비중을 다시 점검해봐요.');
        setActionButton(null);
      } else {
        setActiveMood('greeting');
        setSpeechText(
          `지우님 환영해요! 오늘 기술주 시장이 롤러코스터를 탔어요—내 포트폴리오 상태 한번 볼까요? 🎢`
        );
        setSpeechSubText('오늘의 모의투자 목표: 1,000원으로 소수점 적립식 투자 연습하기');
        setActionButton(null);
      }
      setIsBubbleVisible(true);
    } else if (currentTab === 'market') {
      setActiveMood('mentor');
      setSpeechText(
        '어떤 기업이 미래 세상을 바꿀까요? 1,000원부터 안전하게 시작하는 소수점 투자의 세계에 오신 걸 환영해요! 🔍'
      );
      setSpeechSubText('궁금한 종목을 터치하면 토픽이가 실시간 차트 도슨트를 해드려요.');
      setActionButton(null);
      setIsBubbleVisible(true);
    } else if (currentTab === 'learning') {
      setActiveMood('cheering');
      setSpeechText(
        'S-Curve 러닝 패스에 오신 걸 환영해요! 노드를 하나씩 클리어할 때마다 레벨업과 함께 금융 지능이 쑥쑥 자라요! 🎓'
      );
      setSpeechSubText('각 노드를 터치하면 토픽이의 핵심 힌트와 응원 밈을 볼 수 있어요.');
      setActionButton(null);
      setIsBubbleVisible(true);
    } else if (currentTab === 'mypage') {
      setActiveMood('quest');
      setSpeechText(
        '부모님과 함께하는 투명하고 안전한 금융 생활! 이번 달 설정된 투자 한도와 학습 리포트를 체크해 보세요. 🛡️'
      );
      setSpeechSubText('철저한 리스크 관리야말로 진정한 억만장자 투자자의 첫 번째 습관입니다.');
      setActionButton(null);
      setIsBubbleVisible(true);
    }
  }, [currentTab, selectedStockDetail, totalProfitLoss, totalProfitRate, user?.name]);

  // 2. Custom TopicBot Message override (e.g. from Learning Node pause or Chart scrub)
  useEffect(() => {
    if (topicBotMessage) {
      setActiveMood(topicBotMessage.mood);
      setSpeechText(topicBotMessage.text);
      setSpeechSubText(topicBotMessage.subText);
      if (topicBotMessage.actionLabel && topicBotMessage.onAction) {
        setActionButton({
          label: topicBotMessage.actionLabel,
          onClick: topicBotMessage.onAction,
        });
      } else {
        setActionButton(null);
      }
      setIsBubbleVisible(true);

      if (topicBotMessage.autoDismissMs) {
        const timer = setTimeout(() => {
          setIsBubbleVisible(false);
          setTopicBotMessage(null);
        }, topicBotMessage.autoDismissMs);
        return () => clearTimeout(timer);
      }
    }
  }, [topicBotMessage, setTopicBotMessage]);

  const handleQuickQuestion = (q: string) => {
    if (q.includes('포트폴리오')) {
      setActiveMood('mentor');
      setSpeechText(
        `현재 수익률은 ${(totalProfitRate ?? 0).toFixed(1)}%입니다! 단기 등락에 울고 웃기보다, 좋은 기업을 꾸준히 모아가는 장기 투자자가 진짜 위너예요. 🏆`
      );
    } else if (q.includes('워런 버핏')) {
      setActiveMood('greeting');
      setSpeechText(
        '“잠자는 동안에도 돈이 들어오는 방법을 찾아내지 못한다면, 당신은 평생 일해야만 할 것이다.” — 워런 버핏 조언을 기억해요! 🛌'
      );
    } else if (q.includes('승인') || q.includes('10만')) {
      setActiveMood('quest');
      setSpeechText(
        '10만 원 이상 대형 거래는 부모님과 함께 안전을 점검하는 샌드박스 퀘스트예요! 계획적인 소비와 투자를 훈련하는 최고의 방법이랍니다. 🛡️'
      );
    } else {
      setActiveMood('cheering');
      setSpeechText(
        '오늘도 지우님의 똑똑한 모의투자를 응원해요! 궁금한 금융 용어나 차트는 언제든 토픽이에게 물어보세요! ✨'
      );
    }
    setIsExpandedSheet(false);
    setIsBubbleVisible(true);
  };

  // Force-hide / unmount floating widget and speech toast whenever any modal or bottom-sheet is open
  if (isModalOpen) {
    return null;
  }

  // Safe bottom offset strictly anchored inside mobile viewport:
  // On StockDetailScreen: sits at bottom-[84px] (above the sticky trading action bar)
  // On regular tab screens: sits at bottom-[72px] (above the bottom navigation bar)
  const bottomOffsetClass = selectedStockDetail ? 'bottom-[84px]' : 'bottom-[72px]';

  return (
    <>
      {/* Floating Mascot Widget & Non-Intrusive Speech Toast: strictly contained within Mobile Viewport */}
      <div
        id="topic-bot-companion-anchor"
        className={`absolute ${bottomOffsetClass} right-4 z-[100] flex flex-col items-end pointer-events-none transition-all duration-300`}
        style={{
          position: 'absolute',
          bottom: selectedStockDetail ? '84px' : '72px',
          right: '16px',
          maxWidth: 'calc(100% - 32px)',
          zIndex: 100,
        }}
      >
        {/* Speech Toast (Duolingo Minimalism: Max 2-3 sentences, #6C47FF accents) */}
        {isBubbleVisible && speechText && (
          <div
            id="topic-bot-speech-bubble"
            className="pointer-events-auto mb-2 max-w-[280px] sm:max-w-[310px] bg-[#FFFFFF] rounded-[16px] p-3.5 shadow-xl border-2 border-[#6C47FF] text-[#191F28] animate-in fade-in slide-in-from-bottom-2 duration-250 relative"
            style={{
              whiteSpace: 'normal',
              borderRadius: '16px',
            }}
          >
            {/* Close Button */}
            <button
              id="close-topic-bot-bubble"
              onClick={() => setIsBubbleVisible(false)}
              className="absolute top-2.5 right-2.5 text-[#8B95A1] hover:text-[#191F28] p-1 rounded-full cursor-pointer transition"
              title="토픽이 닫기"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header Tag */}
            <div className="flex items-center gap-1.5 mb-1.5 pr-6">
              <span className="w-2 h-2 rounded-full bg-[#6C47FF] animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-[#6C47FF]">
                {selectedStockDetail ? '토픽이의 차트 도슨트' : '토픽이의 실시간 브리핑'}
              </span>
            </div>

            {/* Message Body (2-3 sentences max) */}
            <p className="text-xs font-bold text-[#191F28] leading-relaxed" style={{ whiteSpace: 'normal' }}>
              {speechText}
            </p>

            {/* Subtext if present */}
            {speechSubText && (
              <p className="text-[11px] text-[#6B7684] mt-1 leading-snug" style={{ whiteSpace: 'normal' }}>
                {speechSubText}
              </p>
            )}

            {/* Contextual Action Button */}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="mt-2 text-xs font-extrabold text-[#6C47FF] bg-[#F0ECFF] hover:bg-[#E5DDFF] px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>{actionButton.label}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {/* Speech Pointer Arrow */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#FFFFFF] border-r-2 border-b-2 border-[#6C47FF] rotate-45"></div>
          </div>
        )}

        {/* Floating Mascot Button */}
        <button
          id="topic-bot-mascot-trigger"
          onClick={() => {
            if (isBubbleVisible) {
              setIsExpandedSheet(true);
            } else {
              setIsBubbleVisible(true);
            }
          }}
          className="pointer-events-auto relative group flex items-center justify-center p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5DDFF] shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <TopicBotMascot mood={activeMood} size="md" isFloating={true} />
          <span className="sr-only">토픽이 AI 어시스턴트 열기</span>
        </button>
      </div>

      {/* Expanded Quick Dialogue Bottom Sheet: Anchored within the Mobile Frame */}
      {isExpandedSheet && (
        <div className="absolute inset-0 z-[120] bg-black/40 backdrop-blur-2xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[28px] w-full max-w-[410px] mx-auto p-5 shadow-2xl border-t border-[#F2F4F6] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F2F4F6] pb-3">
              <div className="flex items-center gap-2.5">
                <TopicBotMascot mood="mentor" size="sm" isFloating={false} />
                <div>
                  <h4 className="text-sm font-extrabold text-[#191F28]">토픽이 (Topic-bot)</h4>
                  <span className="text-[11px] text-[#6C47FF] font-bold">
                    청소년 전용 AI 금융 교육 컴패니언
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExpandedSheet(false)}
                className="text-[#8B95A1] hover:text-[#191F28] p-1.5 rounded-full cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Insight */}
            <div className="bg-[#F0ECFF] p-4 rounded-2xl border border-[#E5DDFF] space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#6C47FF]">
                Current Zero-Prompt Insight
              </span>
              <p className="text-xs font-bold text-[#333D4B] leading-relaxed">
                "{speechText}"
              </p>
            </div>

            {/* Quick Contextual Prompts */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#191F28] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#6C47FF]" />
                <span>토픽이에게 한마디 듣기</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickQuestion('포트폴리오')}
                  className="p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF] border border-[#F2F4F6] hover:border-[#6C47FF] text-left text-xs font-bold text-[#4E5968] hover:text-[#6C47FF] transition cursor-pointer flex items-center justify-between"
                >
                  <span>☕ 내 포트폴리오 수익률 분석 & 멘탈 케어</span>
                  <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
                </button>
                <button
                  onClick={() => handleQuickQuestion('워런 버핏')}
                  className="p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF] border border-[#F2F4F6] hover:border-[#6C47FF] text-left text-xs font-bold text-[#4E5968] hover:text-[#6C47FF] transition cursor-pointer flex items-center justify-between"
                >
                  <span>👑 전설적인 CEO들의 한마디 격언</span>
                  <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
                </button>
                <button
                  onClick={() => handleQuickQuestion('승인')}
                  className="p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF] border border-[#F2F4F6] hover:border-[#6C47FF] text-left text-xs font-bold text-[#4E5968] hover:text-[#6C47FF] transition cursor-pointer flex items-center justify-between"
                >
                  <span>🛡️ 10만 원 이상 부모님 샌드박스 퀘스트란?</span>
                  <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsExpandedSheet(false)}
              className="w-full py-3 rounded-xl bg-[#F2F4F6] text-[#4E5968] font-extrabold text-xs transition cursor-pointer hover:bg-[#E5E8EB]"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
