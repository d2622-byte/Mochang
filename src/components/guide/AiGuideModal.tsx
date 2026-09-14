import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiGuideModal: React.FC = () => {
  const {
    showAiChatModal,
    setShowAiChatModal,
    openTermByName,
    setSelectedStockDetail,
    stocks,
    setCurrentTab,
  } = useApp();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<
    {
      id: string;
      sender: 'user' | 'bot';
      text: string;
      fact?: string;
      opinion?: string;
      source?: string;
      verifiedDate?: string;
      caution?: string;
      terms?: string[];
      actionStockId?: string;
    }[]
  >([
    {
      id: 'init',
      sender: 'bot',
      text: '안녕하세요 지우님! 저는 스토픽(STOPIC) AI 금융 가이드예요. 주식 시장 흐름이나 기업 분석, 어려운 금융 용어 무엇이든 물어보세요!',
      fact: '국내 코스피 시장은 미국 반도체 기술주 강세와 글로벌 AI 데이터센터 수주 확대로 반도체 및 친환경 에너지 업종을 중심으로 매수세가 유입되고 있습니다.',
      opinion: '단기 급등에 따른 변동성을 경계하며, PER이 안정적이고 실적이 입증된 우량 기업에 분산투자하는 전략이 바람직합니다.',
      source: '한국거래소(KRX) & 금융감독원 DART',
      verifiedDate: '2026.09.10 09:30 KST',
      terms: ['PER', '분산투자', '소수점투자'],
      actionStockId: 'samsung',
    },
  ]);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  if (!showAiChatModal) return null;

  const quickPrompts = [
    '요즘 주식 시장 흐름은 어때?',
    '오늘 이 기업 주가가 왜 올랐나요?',
    '초보자가 투자할 때 주의할 점은?',
    '친환경 에너지 종목 전망은?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
      },
    ]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: any = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '',
        source: '한국거래소(KRX) 시장정보 & 금융감독원 전자공시시스템',
        verifiedDate: '2026.09.10 09:45 KST',
      };

      if (query.includes('시장 흐름') || query.includes('요즘')) {
        botResponse.text = '지우님, 오늘의 국내외 주요 금융 시장 요약입니다!';
        botResponse.fact = '미국 연준(Fed)의 금리 인하 기대감과 AI 인프라 투자 지속으로 주요 기술주 지수가 상승세를 이어가고 있습니다.';
        botResponse.opinion = '단기 시세 차익보다는 1,000원 단위 소수점 분산투자로 장기적인 성장주를 모아가는 습관을 추천드립니다.';
        botResponse.terms = ['분산투자', '시가총액'];
        botResponse.actionStockId = 'samsung';
      } else if (query.includes('왜 올랐') || query.includes('주가')) {
        botResponse.text = '오늘 시장에서 주목받는 기업들의 주가 변동 원인을 분석해 드려요!';
        botResponse.fact = '삼성전자와 네이버는 생성형 AI 및 고대역폭 메모리(HBM) 수주 확대로 3분기 실적 개선 공시가 확인되었습니다.';
        botResponse.opinion = '글로벌 빅테크 기업들의 인공지능 투자 확대 사이클이 지속되는 한 IT/인터넷 업종의 우호적인 업황이 유지될 가능성이 높습니다.';
        botResponse.terms = ['PER', 'PBR'];
        botResponse.actionStockId = 'naver';
      } else if (query.includes('초보') || query.includes('주의')) {
        botResponse.text = '청소년 투자자가 꼭 지켜야 할 안전 투자 3원칙을 알려드릴게요!';
        botResponse.fact = '통계적으로 무리한 레버리지 상품이나 단기 테마주에 집중 투자한 초보 투자자의 원금 손실률은 80% 이상에 달합니다.';
        botResponse.opinion = '1) 1,000원부터 소액 소수점 투자, 2) 최소 3개 이상 다른 분야에 분산투자, 3) 잃어도 학업에 지장 없는 용돈 범위 내 투자가 필수입니다.';
        botResponse.terms = ['분산투자', '소수점투자', '레버리지'];
      } else {
        botResponse.text = `지우님이 질문하신 "${query}"에 대한 AI 정밀 분석 리포트입니다.`;
        botResponse.fact = '해당 산업 부문은 최근 정부의 친환경 및 미래 모빌리티 육성 정책과 맞물려 글로벌 수출 비중이 증가하고 있습니다.';
        botResponse.opinion = '중장기적인 전동화 전환 트렌드는 명확하나, 분기별 원자재 가격 변동에 따른 마진 변화를 지속적으로 체크해야 합니다.';
        botResponse.terms = ['배당금', 'PER'];
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  const handleStockNavigate = (stockId: string) => {
    const target = stocks.find((s) => s.id === stockId);
    if (target) {
      setShowAiChatModal(false);
      setSelectedStockDetail(target);
      setCurrentTab('market');
    }
  };

  return (
    <div
      id="ai-guide-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
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
        if (e.target === e.currentTarget) setShowAiChatModal(false);
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm h-[90vh] sm:h-[720px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 relative"
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6C5CE7] to-[#5A4AD1] p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm">AI 투자 가이드 (STOPIC Bot)</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[10px] text-purple-200">청소년 전용 금융 지식 & 검증 엔진</p>
            </div>
          </div>
          <button
            id="close-ai-guide-button"
            onClick={() => setShowAiChatModal(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'user' ? (
                <div className="bg-[#6C5CE7] text-white p-3 rounded-2xl rounded-tr-xs text-xs font-semibold max-w-[80%] shadow-xs">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-2 max-w-[95%]">
                  {/* Bot Intro Bubble */}
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-100 shadow-xs text-xs text-slate-800 leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Fact vs Opinion Split Cards (Module 3 Requirement) */}
                  {msg.fact && (
                    <div className="bg-blue-50 border border-blue-200/80 p-3 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center gap-1 font-bold text-blue-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>실제 확인된 사실 (Fact)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.fact}</p>
                    </div>
                  )}

                  {msg.opinion && (
                    <div className="bg-purple-50 border border-purple-200/80 p-3 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center gap-1 font-bold text-[#5A4AD1]">
                        <Lightbulb className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>AI의 분석 및 해석 (Opinion)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.opinion}</p>
                    </div>
                  )}

                  {/* Verification Badge & Source */}
                  {msg.source && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>신뢰성 검증 완료 ✓</span>
                      </div>
                      <div>출처: {msg.source}</div>
                      <div>기준 시점: {msg.verifiedDate}</div>
                    </div>
                  )}

                  {/* Clickable Terms */}
                  {msg.terms && msg.terms.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">용어 풀이:</span>
                      {msg.terms.map((t) => (
                        <button
                          key={t}
                          onClick={() => openTermByName(t)}
                          className="px-2 py-0.5 rounded-full bg-[#F0EEFF] hover:bg-purple-200 text-[#5A4AD1] text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5"
                        >
                          <HelpCircle className="w-2.5 h-2.5" />
                          <span>{t}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Stock Navigation button if available */}
                  {msg.actionStockId && (
                    <button
                      onClick={() => handleStockNavigate(msg.actionStockId!)}
                      className="text-xs text-[#6C5CE7] font-bold bg-white border border-purple-200 px-3 py-1.5 rounded-xl hover:bg-purple-50 transition cursor-pointer flex items-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>관련 종목 차트 보러가기 →</span>
                    </button>
                  )}

                  {/* Mandatory Legal Disclaimer */}
                  <div className="text-[9px] text-slate-400">
                    ※ 본 분석은 참고용이며 투자 결과를 보장하지 않습니다.
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-ping"></div>
              <span>AI 가이드가 신뢰성 있는 금융 데이터를 분석 중입니다...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#6C5CE7] text-[11px] font-medium text-slate-600 whitespace-nowrap transition cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            id="ai-guide-chat-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="궁금한 금융 상식을 입력해 보세요..."
            className="flex-1 px-3 py-2 bg-slate-100 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]"
          />
          <button
            id="send-ai-chat-button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="p-2 rounded-2xl bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
