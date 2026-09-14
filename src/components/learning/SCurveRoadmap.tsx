import React, { useState } from 'react';
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
  hint: string;
  meme: string;
  reward: string;
  lectureId?: string;
}

export const SCurveRoadmap: React.FC = () => {
  const { triggerTopicBotSpeech, setShowQuizModal } = useApp();

  const [activeNodeId, setActiveNodeId] = useState<string>('node-2');
  const [, setHoveredNodeId] = useState<string | null>(null);

  const nodes: LearningNode[] = [
    {
      id: 'node-1',
      title: '주식의 첫걸음: 회사의 주인 되기',
      shortTitle: '주식 기초',
      level: 1,
      status: 'completed',
      icon: '🌱',
      hint: '워런 버핏도 처음엔 1주로 시작했어요! 이 노드는 이미 마스터하셨네요 🏆',
      meme: '“지우님이 산 주식 1주, 그게 바로 회사 지분의 위대한 시작!”',
      reward: '완료됨 (+20P)',
    },
    {
      id: 'node-2',
      title: '계란을 한 바구니에 담지 마라: 분산투자',
      shortTitle: '분산투자',
      level: 2,
      status: 'active',
      icon: '🧺',
      hint: '스티브 잡스도 처음엔 한 바구니에 사과만 담지 않았어요! 분산투자는 투자의 유일한 공짜 점심이랍니다 🍎',
      meme: '“몰빵 금지! 내 소중한 용돈은 여러 바구니에 나누어 쏙쏙!”',
      reward: '+25P / +40XP',
    },
    {
      id: 'node-3',
      title: '재무제표 해독: 회사의 건강검진표',
      shortTitle: '재무제표',
      level: 3,
      status: 'unlocked',
      icon: '🩺',
      hint: '재무제표는 암호문이 아니에요! 혈압 재듯 매출과 영업이익만 훑어보면 회사의 체력이 보인답니다 🩺',
      meme: '“적자 기업인지 흑자 기업인지 3초 만에 판별하는 치트키!”',
      reward: '+35P / +50XP',
    },
    {
      id: 'node-4',
      title: 'PER과 PBR의 마법: 저평가 보물찾기',
      shortTitle: 'PER & PBR',
      level: 4,
      status: 'locked',
      icon: '💎',
      hint: '워런 버핏의 단골 무기 PER과 PBR! 비싸게 사지 않는 비밀을 곧 파헤치게 될 거예요 💎',
      meme: '“원가 1만 원짜리 명품을 5천 원에 줍는 저평가 탐색 안경!”',
      reward: '+30P / +45XP',
    },
    {
      id: 'node-5',
      title: 'S-Curve 최종 관문: 100만 원 모의투자 실전',
      shortTitle: '실전 마스터',
      level: 5,
      status: 'locked',
      icon: '👑',
      hint: '전설의 100만 원 실전 마스터! 토픽이가 끝까지 페이스메이커로 함께 뛸게요 🏆',
      meme: '“청소년 투자왕의 왕관을 향해 질주하라!”',
      reward: '마스터 뱃지 +100P',
    },
  ];

  const handleNodeInteraction = (node: LearningNode) => {
    setActiveNodeId(node.id);

    // Proactively present a concise hint or cheering meme via Topic-bot Zero-Prompt Engine
    triggerTopicBotSpeech({
      mood: node.status === 'completed' ? 'greeting' : node.status === 'active' ? 'cheering' : 'mentor',
      text: node.hint,
      subText: node.meme,
      tag: `S-Curve Lv.${node.level} 노드 힌트`,
      actionLabel: node.status === 'locked' ? undefined : '퀴즈 풀고 노드 클리어',
      onAction:
        node.status === 'locked'
          ? undefined
          : () => {
              setShowQuizModal(true);
            },
      autoDismissMs: 7000,
    });
  };

  // Coordinates for the 5 nodes in an S-shaped flow inside an SVG viewbox of 360 x 480
  const nodePositions = [
    { x: 180, y: 40 },  // Node 1 (Center-top)
    { x: 90, y: 130 },  // Node 2 (Left)
    { x: 260, y: 220 }, // Node 3 (Right)
    { x: 100, y: 310 }, // Node 4 (Left)
    { x: 180, y: 400 }, // Node 5 (Center-bottom crown)
  ];

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
              노드를 터치하면 토픽이의 실시간 힌트 & 응원 밈이 나타나요!
            </p>
          </div>
        </div>

        <TopicBotMascot mood="cheering" size="sm" isFloating={false} />
      </div>

      {/* S-Curve Interactive Canvas Area */}
      <div className="relative w-full max-w-[340px] mx-auto h-[460px] bg-gradient-to-b from-[#FAF9FF] to-[#F8F9FA] rounded-2xl border border-[#F0ECFF] overflow-hidden select-none p-2">
        {/* Background S-Curve Path SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 360 460"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Completed / Active glowing path */}
          <path
            d="M180 50 C180 90, 90 90, 90 140 C90 190, 260 170, 260 230 C260 280, 100 270, 100 320 C100 370, 180 360, 180 400"
            stroke="#E5DDFF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M180 50 C180 90, 90 90, 90 140"
            stroke="#6C47FF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M90 140 C90 190, 260 170, 260 230 C260 280, 100 270, 100 320 C100 370, 180 360, 180 400"
            stroke="#6C47FF"
            strokeWidth="6"
            strokeDasharray="8 8"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Lesson Nodes Rendered on Path */}
        {nodes.map((node, index) => {
          const pos = nodePositions[index];
          const isSelected = activeNodeId === node.id;
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => handleNodeInteraction(node)}
              onMouseEnter={() => {
                setHoveredNodeId(node.id);
                handleNodeInteraction(node);
              }}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* Pulsing Ring for Active Node */}
              {isActive && (
                <div className="absolute -inset-2 rounded-full bg-[#6C47FF]/20 animate-ping pointer-events-none" />
              )}

              {/* Node Circle */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                  isCompleted
                    ? 'bg-[#6C47FF] text-white ring-4 ring-[#F0ECFF]'
                    : isActive
                    ? 'bg-gradient-to-br from-[#6C47FF] to-[#8C6FFF] text-white ring-4 ring-[#6C47FF]/30 scale-110 shadow-lg'
                    : isLocked
                    ? 'bg-[#E5E8EB] text-[#8B95A1] border-2 border-[#D1D6DB]'
                    : 'bg-white text-[#6C47FF] border-2 border-[#6C47FF] ring-2 ring-[#F0ECFF]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-[#8B95A1]" />
                ) : (
                  <span className="text-xl">{node.icon}</span>
                )}
              </div>

              {/* Node Label Pill */}
              <div
                className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#191F28] text-white scale-105'
                    : 'bg-white/90 backdrop-blur-xs text-[#4E5968] border border-[#F2F4F6]'
                }`}
              >
                Lv.{node.level} {node.shortTitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
