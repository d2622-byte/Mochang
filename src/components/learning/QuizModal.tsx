import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Award,
  BookOpen,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUIZ_QUESTIONS } from '../../data/mockData';
import { TopicBotMascot } from '../companion/TopicBotMascot';
import { QuizQuestion } from '../../types';

export const QuizModal: React.FC = () => {
  const { showQuizModal, setShowQuizModal, recordQuizResult, openTermByName } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!showQuizModal) return null;

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const isCorrect = selectedOption === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz complete
      const finalScore = Math.round(
        ((correctCount + (isCorrect ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100
      );
      recordQuizResult(QUIZ_QUESTIONS, wrongQuestions, finalScore);
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setWrongQuestions([]);
    setCorrectCount(0);
    setIsFinished(false);
  };

  const handleClose = () => {
    setShowQuizModal(false);
    handleReset();
  };

  return (
    <AnimatePresence>
      <motion.div
        id="duolingo-quiz-fullscreen-view"
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[9999] bg-[#FFFFFF] flex flex-col justify-between overflow-hidden"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 9999,
          backgroundColor: '#FFFFFF',
        }}
      >
        <div className="w-full max-w-[430px] mx-auto h-full flex flex-col bg-[#FFFFFF] relative overflow-hidden">
          {/* 1. Top Bar: Exit button, Animated Horizontal Progress Bar, Point Badge */}
          <div
            id="quiz-top-bar"
            className="px-4 py-3 flex items-center gap-3 shrink-0 bg-[#FFFFFF] border-b border-[#F2F4F6]"
          >
            {/* Exit button */}
            <button
              id="exit-quiz-button"
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B95A1] hover:text-[#191F28] hover:bg-[#F2F4F6] transition-colors cursor-pointer shrink-0"
              title="퀴즈 나가기"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Horizontal animated progress bar with question counter */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-black text-[#8B95A1]">
                <span className="text-[#6C47FF]">
                  문제 {currentIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="bg-[#F0ECFF] text-[#6C47FF] px-2 py-0.5 rounded-full text-[10px] font-black">
                  {currentQ?.category || '금융 상식'}
                </span>
              </div>

              {/* Duolingo Pill-style Track with smooth 3D gradient fill */}
              <div className="w-full h-3.5 bg-[#E5E8EB] rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6C47FF] to-[#8C6FFF] rounded-full relative"
                  initial={false}
                  animate={{
                    width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/35 rounded-full" />
                </motion.div>
              </div>
            </div>

            {/* Reward Preview Pill */}
            <div className="flex items-center gap-1 text-xs font-black text-[#6C47FF] bg-[#F0ECFF] px-2.5 py-1.5 rounded-full border border-[#6C47FF]/20 shrink-0">
              <Award className="w-3.5 h-3.5 text-[#6C47FF]" />
              <span>+10P</span>
            </div>
          </div>

          {!isFinished ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Scrollable Center Area: Question & Multiple-Choice Cards */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
                {/* 2. Question & Mascot Area (Upper Body): Vector Mascot + Clean Speech Bubble */}
                <div className="flex items-start gap-3.5 pt-2 shrink-0">
                  <div className="shrink-0 mt-0.5">
                    <TopicBotMascot
                      mood={
                        isAnswerSubmitted
                          ? isCorrect
                            ? 'cheering'
                            : 'commiserating'
                          : 'mentor'
                      }
                      size="md"
                      isFloating={false}
                    />
                  </div>

                  {/* Clean Speech Bubble pointing towards Topic-bot */}
                  <div className="flex-1 bg-[#FFFFFF] border-2 border-[#E5E8EB] rounded-2xl p-4 shadow-xs relative">
                    {/* Speech Triangle Tail pointing left */}
                    <div
                      className="absolute -left-2.5 top-5 w-0 h-0 pointer-events-none"
                      style={{
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        borderRight: '10px solid #E5E8EB',
                      }}
                    />
                    <div
                      className="absolute -left-[7px] top-5 w-0 h-0 pointer-events-none"
                      style={{
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        borderRight: '10px solid #FFFFFF',
                      }}
                    />

                    <span className="text-[11px] font-black text-[#6C47FF] bg-[#F0ECFF] px-2 py-0.5 rounded-md mb-1.5 inline-block">
                      {currentQ.category}
                    </span>
                    <h2 className="text-[15px] sm:text-[16px] font-extrabold text-[#191F28] leading-relaxed">
                      {currentQ.question}
                    </h2>
                  </div>
                </div>

                {/* 3. Multiple-Choice Option Cards (Middle): Stacked vertically with 12px gap */}
                <div className="flex flex-col gap-3 my-auto">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectChoice = idx === currentQ.correctIndex;

                    let cardStyle =
                      'border-2 border-[#E5E8EB] bg-[#FFFFFF] text-[#191F28] hover:border-[#6C47FF]/50 hover:bg-[#FAF9FF]';
                    let badgeStyle =
                      'bg-[#F2F4F6] text-[#4E5968] border border-[#E5E8EB]';

                    if (isSelected && !isAnswerSubmitted) {
                      cardStyle =
                        'border-[#6C47FF] bg-[#F0ECFF] text-[#6C47FF] ring-2 ring-[#6C47FF]/25 shadow-xs font-bold';
                      badgeStyle = 'bg-[#6C47FF] text-white border-transparent';
                    }

                    if (isAnswerSubmitted) {
                      if (isCorrectChoice) {
                        cardStyle =
                          'border-[#00C48C] bg-[#E8F9F3] text-[#00875A] ring-2 ring-[#00C48C]/30 font-bold';
                        badgeStyle = 'bg-[#00C48C] text-white border-transparent';
                      } else if (isSelected) {
                        cardStyle =
                          'border-[#FF3B30] bg-[#FEECEB] text-[#FF3B30] ring-2 ring-[#FF3B30]/30 line-through';
                        badgeStyle = 'bg-[#FF3B30] text-white border-transparent';
                      } else {
                        cardStyle =
                          'border-[#E5E8EB] bg-[#FFFFFF] opacity-45 text-[#8B95A1]';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`quiz-option-${idx}`}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full min-h-[56px] p-3.5 rounded-[12px] transition-all duration-150 text-left flex items-center gap-3 cursor-pointer select-none active:scale-[0.99] ${cardStyle}`}
                      >
                        {/* Option Index Badge: 1, 2, 3, 4 */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors ${badgeStyle}`}
                        >
                          {idx + 1}
                        </div>

                        {/* Option Text */}
                        <span className="flex-1 font-bold text-sm leading-snug">
                          {opt}
                        </span>

                        {/* Validation Indicator Icons */}
                        {isAnswerSubmitted && isCorrectChoice && (
                          <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrectChoice && (
                          <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duolingo Slide-in Answer Feedback Sheet (Appears upon submission) */}
              <AnimatePresence>
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.22 }}
                    className={`p-4 mx-4 mb-2 rounded-2xl border ${
                      isCorrect
                        ? 'bg-[#E8F9F3] border-[#00C48C]/40 text-[#00875A]'
                        : 'bg-[#FEECEB] border-[#FF3B30]/30 text-[#FF3B30]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-sm mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-[#00C48C]" />
                          <span>정답입니다! 🎉</span>
                          <span className="text-[11px] bg-white/80 text-[#00875A] px-2 py-0.5 rounded-full font-extrabold ml-1">
                            +10P 획득
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
                          <span>아쉬워요! 오답 노트에 저장되었어요 💡</span>
                        </>
                      )}
                    </div>

                    {!isCorrect && (
                      <div className="text-xs font-bold text-[#191F28] mb-1">
                        정답:{' '}
                        <span className="text-[#6C47FF]">
                          {currentQ.options[currentQ.correctIndex]}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-[#4E5968] leading-relaxed">
                      {currentQ.explanation}
                    </p>

                    {currentQ.termKey && (
                      <button
                        onClick={() => openTermByName(currentQ.termKey!)}
                        className="mt-2 text-[11px] font-extrabold text-[#6C47FF] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#6C47FF]/20 hover:bg-[#6C47FF] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>'{currentQ.termKey}' 용어 카드 확인하기</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. Bottom Primary Action Bar (Sticky Footer) */}
              <div
                id="quiz-sticky-footer"
                className="sticky bottom-0 bg-[#FFFFFF] border-t border-[#F2F4F6] p-4 sm:p-5 z-30"
                style={{
                  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                }}
              >
                {!isAnswerSubmitted ? (
                  <button
                    id="confirm-quiz-answer-button"
                    disabled={selectedOption === null}
                    onClick={handleConfirmAnswer}
                    className="w-full py-4 rounded-2xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-black text-base shadow-md disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-[0.98]"
                  >
                    확인
                  </button>
                ) : (
                  <button
                    id="next-quiz-question-button"
                    onClick={handleNextQuestion}
                    className={`w-full py-4 rounded-2xl text-white font-black text-base shadow-md transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isCorrect
                        ? 'bg-[#00C48C] hover:bg-[#00B07D]'
                        : 'bg-[#6C47FF] hover:bg-[#5835E5]'
                    }`}
                  >
                    <span>
                      {currentIndex + 1 < QUIZ_QUESTIONS.length
                        ? '계속하기'
                        : '결과 확인하기'}
                    </span>
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Duolingo-style Celebration & Results Summary View */
            <div className="flex-1 flex flex-col justify-between overflow-y-auto px-6 py-6 text-center text-[#191F28]">
              <div className="space-y-5 my-auto">
                {/* Mascot Celebrating */}
                <div className="flex justify-center">
                  <TopicBotMascot mood="cheering" size="lg" isFloating={false} />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#F0ECFF] text-[#6C47FF] px-3 py-1 rounded-full text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>학습 퀘스트 클리어!</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#191F28] tracking-tight">
                    금융 퀴즈를 모두 풀었어요!
                  </h3>
                  <p className="text-xs text-[#8B95A1]">
                    총 {QUIZ_QUESTIONS.length}문제 중 {correctCount}문제를 맞혔습니다.
                  </p>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-[#F2F4F6]">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#8B95A1]">정답률</span>
                    <span className="text-2xl font-black text-[#6C47FF]">
                      {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-l border-[#E5E8EB]">
                    <span className="text-[11px] font-bold text-[#8B95A1]">획득 포인트</span>
                    <span className="text-2xl font-black text-[#00C48C]">
                      +{correctCount * 10}P
                    </span>
                  </div>
                </div>

                {/* Wrong Questions Review Notes */}
                {wrongQuestions.length > 0 && (
                  <div className="text-left space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#191F28]">
                      <HelpCircle className="w-4 h-4 text-[#6C47FF]" />
                      <span>복습용 오답 노트 ({wrongQuestions.length}개)</span>
                    </div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {wrongQuestions.map((wq) => (
                        <div
                          key={wq.id}
                          className="p-3 bg-[#FAF9FF] border border-[#6C47FF]/20 rounded-xl text-xs space-y-1"
                        >
                          <div className="font-extrabold text-[#191F28]">
                            {wq.question}
                          </div>
                          <div className="text-[#6C47FF] font-bold text-[11px]">
                            정답: {wq.options[wq.correctIndex]}
                          </div>
                          <p className="text-[#6B7684] text-[11px]">
                            {wq.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              <div
                className="pt-4 border-t border-[#F2F4F6] flex flex-col gap-2 shrink-0"
                style={{
                  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                }}
              >
                <button
                  id="retry-quiz-button"
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl bg-[#F0ECFF] hover:bg-[#E5DDFF] text-[#6C47FF] font-black text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>다시 도전하기</span>
                </button>
                <button
                  id="finish-quiz-button"
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-black text-base shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  학습 센터로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
