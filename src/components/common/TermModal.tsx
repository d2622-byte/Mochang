import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TermModal: React.FC = () => {
  const { activeTerm, setActiveTerm, triggerCelebration } = useApp();

  if (!activeTerm) return null;

  const handleUnderstand = () => {
    setActiveTerm(null);
    triggerCelebration({
      title: '용어 학습 완료! 💡',
      subtitle: `${activeTerm.term} 개념을 마스터했습니다!`,
      points: 5,
      xp: 15,
    });
  };

  return (
    <div
      id="term-modal-overlay"
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
        if (e.target === e.currentTarget) setActiveTerm(null);
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 relative"
        style={{ zIndex: 10600 }}
      >
        {/* Header */}
        <div className="bg-[#6C47FF] p-5 text-white relative">
          <button
            id="close-term-modal-button"
            onClick={() => setActiveTerm(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
              {activeTerm.badge} 금융 용어
            </span>
            <span className="text-[10px] text-white/80">알기 쉬운 금융 사전</span>
          </div>
          <h3 className="text-xl font-extrabold">{activeTerm.term}</h3>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C47FF] mb-1">
              <BookOpen className="w-4 h-4" />
              <span>청소년 눈높이 설명</span>
            </div>
            <p className="text-xs text-[#4E5968] leading-relaxed bg-[#F8F9FA] p-3.5 rounded-xl border border-[#F2F4F6]">
              {activeTerm.simpleExplanation}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C47FF] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>실제 예시로 이해하기</span>
            </div>
            <p className="text-xs text-[#191F28] leading-relaxed bg-[#F0ECFF] p-3.5 rounded-xl border border-[#6C47FF]/15">
              {activeTerm.example}
            </p>
          </div>

          <button
            id="term-understand-button"
            onClick={handleUnderstand}
            className="w-full py-3.5 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>이해했어요! (+15XP, +5P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
