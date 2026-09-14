import React, { useState } from 'react';
import { Trophy, Star, Award, Check, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CelebrationModal: React.FC = () => {
  const { celebration, closeCelebration } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!celebration) return null;

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `[스토픽 STOPIC] 지우님이 "${celebration.title}"을 달성했습니다! 함께 금융 상식을 키워봐요!`
      );
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        closeCelebration();
      }, 1200);
    } else {
      closeCelebration();
    }
  };

  return (
    <div
      id="celebration-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-200"
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
        if (e.target === e.currentTarget) closeCelebration();
      }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center border border-purple-100 relative max-h-[90dvh] flex flex-col justify-between"
        style={{ zIndex: 10000 }}
      >
        {/* Background glow & decoration */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-200/50 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="flex-1 min-h-0 overflow-y-auto pt-7 pb-3 px-5 no-scrollbar">
          {/* Trophy Avatar Graphic */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#6C47FF] flex items-center justify-center shadow-xl shadow-[#6C47FF]/25 text-white relative mb-3.5">
            <Trophy className="w-10 h-10 stroke-[1.8] fill-white/20" />
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#F0ECFF] text-[#6C47FF] rounded-full p-1.5 shadow-md border border-[#6C47FF]/20">
              <Star className="w-3.5 h-3.5 fill-[#6C47FF]" />
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-[#191F28] tracking-tight">{celebration.title}</h3>
          <p className="text-xs text-[#8B95A1] mt-1 leading-relaxed">{celebration.subtitle}</p>

          {/* Reward Box */}
          <div className="mt-4 bg-[#F0ECFF] p-3.5 rounded-2xl border border-[#6C47FF]/20 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-[#8B95A1]">포인트 보상</span>
              <div className="flex items-center gap-1 mt-0.5 text-[#6C47FF] font-extrabold text-sm">
                <Star className="w-3.5 h-3.5 fill-[#6C47FF] text-[#6C47FF]" />
                <span>+{celebration.points}P</span>
              </div>
            </div>
            <div className="w-px h-7 bg-[#6C47FF]/20" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold text-[#8B95A1]">경험치 획득</span>
              <div className="flex items-center gap-1 mt-0.5 text-[#6C47FF] font-extrabold text-sm">
                <Award className="w-3.5 h-3.5 text-[#6C47FF]" />
                <span>+{celebration.xp}XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Action Buttons with Safe Area */}
        <div className="shrink-0 p-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom,16px))] bg-white flex gap-2 border-t border-[#F2F4F6]">
          <button
            id="celebration-confirm-button"
            onClick={closeCelebration}
            className="flex-1 py-3 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#6C47FF]/20 transition cursor-pointer flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>확인</span>
          </button>
          <button
            id="celebration-share-button"
            onClick={handleShare}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1 ${
              copied
                ? 'bg-[#6C47FF] text-white'
                : 'bg-[#F0ECFF] hover:bg-[#E5DDFF] text-[#6C47FF]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>공유하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
