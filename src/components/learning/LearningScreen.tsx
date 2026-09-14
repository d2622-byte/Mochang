import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  Play,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Trophy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FINANCIAL_TERMS } from '../../data/mockData';
import { SCurveRoadmap } from './SCurveRoadmap';

export const LearningScreen: React.FC = () => {
  const {
    xp,
    level,
    maxLevelXp,
    investmentScore,
    virtualPoints,
    missions,
    completeMission,
    setShowQuizModal,
    openTermByName,
    triggerCelebration,
    wrongAnswerNotes,
    setIsModalOpen,
  } = useApp();

  const [selectedLecture, setSelectedLecture] = useState<{
    title: string;
    level: string;
    duration: string;
    desc: string;
    points: number;
  } | null>(null);

  useEffect(() => {
    setIsModalOpen(Boolean(selectedLecture));
    return () => {
      setIsModalOpen(false);
    };
  }, [selectedLecture, setIsModalOpen]);

  const lectures = [
    {
      id: 'lec-1',
      title: '주식이란 무엇일까? 회사의 주인이 되는 법',
      level: '초급',
      duration: '5분',
      desc: '우리가 매일 마시는 음료수, 자주 하는 게임 회사의 일부를 소유하는 주식의 기본 원리를 재미있는 예시로 알아봐요.',
      points: 20,
    },
    {
      id: 'lec-2',
      title: '분산 투자의 중요성: 계란을 한 바구니에 담지 마라',
      level: '초급',
      duration: '7분',
      desc: '왜 모든 돈을 한 종목에 몰아서 투자하면 위험할까요? IT, 친환경, 소비재에 골고루 나누어 안전하게 자산을 불리는 비법!',
      points: 25,
    },
    {
      id: 'lec-3',
      title: '재무제표 쉽게 읽는 법: 회사의 건강검진표',
      level: '중급',
      duration: '10분',
      desc: '매출액, 영업이익, 당기순이익이 무엇인지 복잡한 회계 기호 없이 청소년의 눈높이에서 알기 쉽게 풀어드립니다.',
      points: 35,
    },
    {
      id: 'lec-4',
      title: 'PER과 PBR로 저평가 우량주 발굴하기',
      level: '중급',
      duration: '8분',
      desc: '현재 주가가 과연 비싼 걸까, 싼 걸까? 월가의 투자 대가들이 사용하는 2가지 핵심 비밀 지표를 마스터해보세요.',
      points: 30,
    },
  ];

  const handleStartMission = (missionId: string, type: string) => {
    if (type === 'QUIZ') {
      setShowQuizModal(true);
    } else {
      completeMission(missionId);
    }
  };

  const handleCompleteLecture = (lec: {
    title: string;
    level: string;
    duration: string;
    desc: string;
    points: number;
  }) => {
    triggerCelebration({
      title: '강의 수강 완료! 🎓',
      subtitle: `[${lec.title}] 학습을 마치고 금융 지식을 넓혔습니다!`,
      points: lec.points,
      xp: 40,
    });
    setSelectedLecture(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] text-[#191F28] relative overflow-hidden">
      {/* Top App Bar & Header: Sticky at top: 0 with z-index 100 & solid white (#FFFFFF) */}
      <div
        id="learning-screen-header-bar"
        className="p-4 bg-[#FFFFFF] border-b border-[#F2F4F6] shrink-0 sticky top-0 z-[100]"
        style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#191F28] tracking-tight">배우기 (학습 센터)</h2>
          {/* Reward Point Badge using Primary Purple (#6C47FF) & Light Purple Tint (#F0ECFF) */}
          <div className="flex items-center gap-1.5 bg-[#F0ECFF] px-3 py-1 rounded-full border border-[#6C47FF]/20 text-[#6C47FF] text-xs font-extrabold">
            <Award className="w-3.5 h-3.5 text-[#6C47FF]" />
            <span>{virtualPoints.toLocaleString()}P</span>
          </div>
        </div>
      </div>

      {/* Scrollable Body Content: Wrap S-curve nodes, learning cards, and missions inside a single scroll container (flex: 1; overflow-y: auto; z-index: 10;) */}
      <div
        id="learning-screen-scroll-body"
        className="flex-1 overflow-y-auto no-scrollbar z-10 p-4 space-y-4 pb-24"
        style={{ flex: 1, overflowY: 'auto', zIndex: 10 }}
      >
        {/* Top Level Progress Card Header: Primary Purple (#6C47FF) */}
        <div className="bg-[#6C47FF] p-5 rounded-[16px] text-white shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                내 학습 현황
              </span>
              <span className="text-xs text-white/80 font-medium">청소년 금융 루키</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
              <Trophy className="w-4 h-4 text-white/90" />
              <span>투자 점수 {investmentScore}점</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-[28px] font-extrabold tracking-tight text-white leading-tight">
              Lv. {level}
            </h3>
            <span className="text-xs text-white/80 font-semibold">
              다음 레벨까지 {Math.max(0, maxLevelXp - (xp % maxLevelXp))}XP
            </span>
          </div>

          {/* XP Progress Bar: Light Purple (#F0ECFF) fill inside purple card */}
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden mt-2.5 p-0.5">
            <div
              className="h-full bg-[#FFFFFF] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / maxLevelXp) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-white/80 font-medium mt-2">
            <span>현재 경험치</span>
            <span className="font-extrabold text-white">
              {xp} / {maxLevelXp} XP
            </span>
          </div>
        </div>

        {/* S-Curve Learning Path Roadmap (Duolingo-style with lesson nodes & Topic-bot hints) */}
        <SCurveRoadmap />

        {/* Today's Missions List: Standardized crisp white containers (#FFFFFF) over #F8F9FA with 12px border radius */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6C47FF]" />
              <h3 className="text-sm font-extrabold text-[#191F28]">오늘의 학습 미션</h3>
            </div>
            <span className="text-xs text-[#8B95A1] font-medium">
              {missions.filter((m) => m.isCompleted).length}/{missions.length} 완료
            </span>
          </div>

          <div className="space-y-2.5">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="bg-[#FFFFFF] p-4 rounded-[12px] border border-[#F2F4F6] transition flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-start gap-3 flex-1 pr-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      mission.isCompleted
                        ? 'bg-[#F0ECFF] text-[#6C47FF]'
                        : 'bg-[#F0ECFF] text-[#6C47FF]'
                    }`}
                  >
                    {mission.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6C47FF]" />
                    ) : (
                      <span className="text-xs font-extrabold text-[#6C47FF]">!</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-extrabold ${
                          mission.isCompleted
                            ? 'line-through text-[#8B95A1]'
                            : 'text-[#191F28]'
                        }`}
                      >
                        {mission.title}
                      </h4>
                      {/* Reward Point Badge (+10P): Primary Purple (#6C47FF) & Light Purple Tint (#F0ECFF) */}
                      <span className="text-[10px] font-extrabold text-[#6C47FF] bg-[#F0ECFF] px-2 py-0.5 rounded-md">
                        +{mission.pointReward}P
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8B95A1] leading-snug">
                      {mission.desc}
                    </p>
                  </div>
                </div>

                <div>
                  {mission.isCompleted ? (
                    <span className="text-xs font-bold text-[#8B95A1] px-3 py-1.5 bg-[#F8F9FA] rounded-lg inline-block">
                      완료됨
                    </span>
                  ) : (
                    /* Main CTA Buttons: Primary Purple (#6C47FF) */
                    <button
                      id={`start-mission-btn-${mission.id}`}
                      onClick={() => handleStartMission(mission.id, mission.type)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#6C47FF] hover:bg-[#5835E5] active:bg-[#4B29D3] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
                    >
                      {mission.type === 'QUIZ' ? '퀴즈 시작' : '미션 진행'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wrong Answer Notes: Standardized white card (#FFFFFF) with Alert/Warning Red (#FF3B30) for error badge */}
        {wrongAnswerNotes.length > 0 && (
          <div className="bg-[#FFFFFF] border border-[#F2F4F6] p-4 rounded-[12px] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F0ECFF] text-[#6C47FF] flex items-center justify-center font-bold">
                <HelpCircle className="w-4 h-4 text-[#6C47FF]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-[#191F28]">내 오답 노트</h4>
                  {/* Alert/Warning Red (#FF3B30) for error notes count badge */}
                  <span className="text-[10px] font-extrabold text-white bg-[#FF3B30] px-1.5 py-0.2 rounded-full">
                    {wrongAnswerNotes.length}개
                  </span>
                </div>
                <p className="text-[11px] text-[#8B95A1] mt-0.5">
                  틀린 문제를 다시 풀고 개념을 다져요
                </p>
              </div>
            </div>
            <button
              id="open-wrong-notes-button"
              onClick={() => setShowQuizModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#6C47FF] hover:bg-[#5835E5] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
            >
              복습하기
            </button>
          </div>
        )}

        {/* Recommended Learning Courses: Crisp white container (#FFFFFF) with 12px border radius */}
        <div className="bg-[#FFFFFF] p-5 rounded-[12px] border border-[#F2F4F6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#6C47FF]" />
              <h3 className="text-sm font-extrabold text-[#191F28]">추천 금융 강의</h3>
            </div>
            <span className="text-xs text-[#8B95A1] font-medium">전체보기</span>
          </div>

          <div className="space-y-2.5">
            {lectures.map((lec) => (
              <div
                key={lec.id}
                id={`lecture-card-${lec.id}`}
                onClick={() => setSelectedLecture(lec)}
                className="p-3.5 rounded-xl bg-[#F8F9FA] hover:bg-[#F0ECFF]/30 border border-[#F2F4F6] transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] text-[#6C47FF] border border-[#F2F4F6] flex items-center justify-center shrink-0 font-bold shadow-2xs">
                    <Play className="w-4 h-4 fill-[#6C47FF] text-[#6C47FF] ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#191F28] leading-snug line-clamp-1">
                      {lec.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#8B95A1] mt-0.5">
                      <span className="text-[#6C47FF] font-bold bg-[#F0ECFF] px-1.5 py-0.5 rounded text-[10px]">
                        {lec.level}
                      </span>
                      <span>·</span>
                      <span>{lec.duration}</span>
                      <span>·</span>
                      <span className="text-[#6C47FF] font-extrabold bg-[#F0ECFF] px-1.5 py-0.5 rounded text-[10px]">
                        +{lec.points}P
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
              </div>
            ))}
          </div>
        </div>

        {/* Financial Terms Quick Vocabulary: Light Purple (#F0ECFF) chips */}
        <div className="bg-[#FFFFFF] p-5 rounded-[12px] border border-[#F2F4F6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6C47FF]" />
              <h3 className="text-sm font-extrabold text-[#191F28]">청소년 필수 금융 사전</h3>
            </div>
            <span className="text-[11px] text-[#8B95A1]">터치 시 쉬운 풀이 확인</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {Object.keys(FINANCIAL_TERMS).map((key) => (
              <button
                key={key}
                id={`term-chip-${key}`}
                onClick={() => openTermByName(key)}
                className="px-3 py-1.5 rounded-lg bg-[#F0ECFF] hover:bg-[#6C47FF] hover:text-white active:bg-[#5835E5] text-[#6C47FF] text-xs font-extrabold transition cursor-pointer"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lecture Detail Modal */}
      {selectedLecture && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-[#FFFFFF] rounded-[16px] w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4 border border-[#F2F4F6]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-[#6C47FF] bg-[#F0ECFF] px-2.5 py-0.5 rounded-md">
                  {selectedLecture.level}
                </span>
                <span className="text-xs text-[#8B95A1] font-medium">
                  {selectedLecture.duration}
                </span>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-full cursor-pointer transition"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            {/* Video Placeholder Box */}
            <div className="h-36 bg-[#191F28] rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
              <div className="w-12 h-12 rounded-full bg-[#6C47FF] flex items-center justify-center mb-1">
                <Play className="w-6 h-6 fill-white ml-1" />
              </div>
              <span className="text-xs font-medium text-white/80">
                핵심 금융 요약 비디오
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-[#191F28] text-sm leading-snug">
                {selectedLecture.title}
              </h3>
              <p className="text-xs text-[#4E5968] mt-2 leading-relaxed bg-[#F8F9FA] p-3.5 rounded-xl border border-[#F2F4F6]">
                {selectedLecture.desc}
              </p>
            </div>

            <button
              onClick={() => handleCompleteLecture(selectedLecture)}
              className="w-full py-3.5 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>학습 완료하고 보상 받기 (+{selectedLecture.points}P)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
