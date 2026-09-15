import React, { useState, useRef, useEffect } from 'react';
import { Check, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopicBotMascot } from '../companion/TopicBotMascot';

interface LearningNode {
  id: string;
  title: string;
  shortTitle: string;
  level: number;
  status: 'completed' | 'active' | 'unlocked' | 'locked';
  icon: string;
  cx: number;
  cy: number;
}

export const SCurveRoadmap: React.FC = () => {
  const { setShowQuizModal } = useApp();
  const [lockedShakeId, setLockedShakeId] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  // 5 Nodes anchored precisely onto the S-curve cubic Bezier path inside 360 x 480 viewBox
  const nodes: LearningNode[] = [
    {
      id: 'node-1',
      title: '주식의 첫걸음: 회사의 주인 되기',
      shortTitle: '주식 기초',
      level: 1,
      status: 'completed',
      icon: '🌱',
      cx: 180,
      cy: 48,
    },
    {
      id: 'node-2',
      title: '계란을 한 바구니에 담지 마라: 분산투자',
      shortTitle: '분산투자',
      level: 2,
      status: 'active',
      icon: '🧺',
      cx: 90,
      cy: 140,
    },
    {
      id: 'node-3',
      title: '재무제표 해독: 회사의 건강검진표',
      shortTitle: '재무제표',
      level: 3,
      status: 'unlocked',
      icon: '🩺',
      cx: 270,
      cy: 236,
    },
    {
      id: 'node-4',
      title: 'PER과 PBR의 마법: 저평가 보물찾기',
      shortTitle: 'PER & PBR',
      level: 4,
      status: 'unlocked',
      icon: '💎',
      cx: 90,
      cy: 332,
    },
    {
      id: 'node-5',
      title: 'S-Curve 최종 관문: 100만 원 실전 마스터',
      shortTitle: '실전 마스터',
      level: 5,
      status: 'locked',
      icon: '👑',
      cx: 180,
      cy: 424,
    },
  ];

  const handleNodeTap = (e: React.MouseEvent, node: LearningNode) => {
    e.preventDefault();
    e.stopPropagation();

    if (node.status === 'locked') {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      setLockedShakeId(node.id);
      shakeTimeoutRef.current = setTimeout(() => {
        setLockedShakeId(null);
      }, 450);
      return;
    }

    // Direct Screen Transition: Immediately trigger full-screen Duolingo quiz
    setShowQuizModal(true);
  };

  return (
    <div
      id="s-curve-learning-path-section"
      className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#F2F4F6] shadow-xs space-y-4"
    >
      {/* Title & S-Curve Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#6C47FF] text-white flex items-center justify-center font-black text-xs shadow-xs">
            S
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#191F28] flex items-center gap-1.5">
              <span>S-Curve 러닝 패스</span>
              <span className="text-[10px] font-bold text-[#6C47FF] bg-[#F0ECFF] px-2 py-0.5 rounded-full">
                단계별 금융 로드맵
              </span>
            </h3>
            <p className="text-[11px] text-[#8B95A1] font-medium mt-0.5">
              노드를 터치하면 바로 퀴즈 챌린지가 시작돼요!
            </p>
          </div>
        </div>

        <TopicBotMascot mood="cheering" size="sm" isFloating={false} />
      </div>

      {/* S-Curve Interactive Canvas Area */}
      <div className="relative w-full max-w-[340px] mx-auto h-[480px] bg-gradient-to-b from-[#FAF9FF] to-[#F8F9FA] rounded-2xl border border-[#F0ECFF] overflow-hidden select-none">
        {/* Background S-Curve Path SVG: Mathematically intersects (cx, cy) of each node */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 360 480"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Track Path */}
          <path
            d="M 180 48 C 180 94, 90 94, 90 140 C 90 188, 270 188, 270 236 C 270 284, 90 284, 90 332 C 90 378, 180 378, 180 424"
            stroke="#E5DDFF"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Completed Segment (Lv.1 to Lv.2) */}
          <path
            d="M 180 48 C 180 94, 90 94, 90 140"
            stroke="#6C47FF"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Dotted Trajectory Path (Lv.2 to Lv.5) precisely through node centers */}
          <path
            d="M 90 140 C 90 188, 270 188, 270 236 C 270 284, 90 284, 90 332 C 90 378, 180 378, 180 424"
            stroke="#6C47FF"
            strokeWidth="4"
            strokeDasharray="6 8"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </svg>

        {/* Lesson Nodes Rendered on Path with absolute mathematical coordinate anchoring */}
        {nodes.map((node) => {
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';
          const isShaking = lockedShakeId === node.id;

          // Percentage coordinates directly corresponding to the 360 x 480 SVG coordinate system
          const leftPercent = (node.cx / 360) * 100;
          const topPercent = (node.cy / 480) * 100;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-10 flex flex-col items-center select-none"
            >
              {/* Pulsing Highlight Ring for Active Node */}
              {isActive && (
                <div className="absolute -inset-2 rounded-full bg-[#6C47FF]/20 animate-ping pointer-events-none" />
              )}

              {/* Node Circle Button: 56x56 px centered exactly on (cx, cy) */}
              <button
                id={`roadmap-node-${node.id}`}
                onClick={(e) => handleNodeTap(e, node)}
                title={isLocked ? `${node.shortTitle} (잠김)` : `${node.shortTitle} 퀴즈 시작`}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 ease-out shadow-md select-none ${
                  isCompleted
                    ? 'bg-[#6C47FF] text-white ring-4 ring-[#F0ECFF] hover:scale-105 cursor-pointer active:scale-95'
                    : isActive
                    ? 'bg-gradient-to-br from-[#6C47FF] to-[#8C6FFF] text-white ring-4 ring-[#6C47FF]/30 scale-110 shadow-lg hover:scale-115 cursor-pointer active:scale-95'
                    : isLocked
                    ? `node-locked cursor-not-allowed bg-[#E5E8EB] ${
                        isShaking
                          ? 'is-shaking border-2 border-[#FF3B30] text-[#FF3B30]'
                          : 'border-2 border-[#D1D6DB] text-[#8B95A1] opacity-80'
                      }`
                    : 'bg-white text-[#6C47FF] border-2 border-[#6C47FF] ring-2 ring-[#F0ECFF] hover:scale-110 cursor-pointer active:scale-95'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : isLocked ? (
                  <Lock
                    className={`w-5 h-5 transition-colors duration-150 ${
                      isShaking ? 'text-[#FF3B30]' : 'text-[#8B95A1]'
                    }`}
                  />
                ) : (
                  <span className="text-xl leading-none">{node.icon}</span>
                )}
              </button>

              {/* Strict Relative Positioning: Label Badge centered directly on the node centerline & dotted path */}
              <div
                className="absolute top-full mt-2 left-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs whitespace-nowrap pointer-events-none"
                style={{
                  transform: 'translate(-50%, 0)',
                }}
              >
                <span
                  className={`px-2 py-0.5 rounded-full block ${
                    isActive
                      ? 'bg-[#191F28] text-white font-black'
                      : isCompleted
                      ? 'bg-[#6C47FF]/10 text-[#6C47FF] font-bold border border-[#6C47FF]/20'
                      : isLocked
                      ? 'bg-[#E5E8EB] text-[#8B95A1] font-semibold'
                      : 'bg-white/95 text-[#4E5968] font-bold border border-[#E5E8EB]'
                  }`}
                >
                  Lv.{node.level} {node.shortTitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
