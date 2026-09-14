import React, { useState } from 'react';
import { X, CheckCircle2, Award, HelpCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUIZ_QUESTIONS } from '../../data/mockData';
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
      const finalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);
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

  return (
    <div
      id="quiz-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-3 animate-in fade-in duration-200"
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
        if (e.target === e.currentTarget) setShowQuizModal(false);
      }}
    >
      <div
        className="bg-[#FFFFFF] rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F2F4F6] flex flex-col max-h-[92vh] relative"
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F2F4F6] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#6C47FF] text-white flex items-center justify-center font-extrabold text-xs">
              Q
            </div>
            <div>
              <h3 className="font-extrabold text-[#191F28] text-sm">금융 상식 퀴즈</h3>
              <p className="text-[11px] text-[#8B95A1]">맞춤형 상식 쌓기 & 포인트 보상</p>
            </div>
          </div>
          <button
            id="close-quiz-modal-button"
            onClick={() => setShowQuizModal(false)}
            className="p-1 rounded-full text-[#8B95A1] hover:text-[#191F28] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="p-4 overflow-y-auto space-y-4 text-[#191F28]">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#8B95A1] mb-1.5">
                <span>
                  문제 {currentIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[#6C47FF] font-extrabold">{currentQ.category}</span>
              </div>
              <div className="w-full h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6C47FF] transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#F2F4F6]">
              <h4 className="text-sm font-extrabold text-[#191F28] leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'border-[#F2F4F6] hover:border-[#6C47FF]/40 text-[#191F28] bg-[#FFFFFF]';
                if (selectedOption === idx) {
                  btnStyle = 'border-[#6C47FF] bg-[#F0ECFF] text-[#6C47FF] font-extrabold';
                }
                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-[#6C47FF] bg-[#6C47FF] text-white font-extrabold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'border-[#FF3B30] bg-[#FF3B30]/10 text-[#FF3B30] line-through';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl text-xs font-medium border text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {isAnswerSubmitted && (
              <div className="p-3.5 rounded-xl text-xs space-y-2 animate-in fade-in bg-[#F8F9FA] border border-[#F2F4F6] text-[#191F28]">
                <div className="flex items-center gap-1.5 font-extrabold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#6C47FF]" />
                      <span className="text-[#6C47FF]">정답입니다!</span>
                      <span className="text-[10px] text-[#6C47FF] bg-[#F0ECFF] px-1.5 py-0.5 rounded font-extrabold ml-1">
                        +10P
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
                      <span className="text-[#FF3B30]">아쉬워요! 오답 노트에 기록되었습니다.</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#4E5968] leading-relaxed">{currentQ.explanation}</p>

                {currentQ.termKey && (
                  <button
                    onClick={() => openTermByName(currentQ.termKey!)}
                    className="text-[10px] font-bold text-[#6C47FF] bg-[#F0ECFF] px-2.5 py-1 rounded-full border border-[#6C47FF]/20 hover:bg-[#6C47FF] hover:text-white transition cursor-pointer flex items-center gap-1 mt-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>'{currentQ.termKey}' 용어 카드 확인하기</span>
                  </button>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div>
              {!isAnswerSubmitted ? (
                <button
                  id="confirm-quiz-answer-button"
                  disabled={selectedOption === null}
                  onClick={handleConfirmAnswer}
                  className="w-full py-3.5 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs shadow-xs disabled:opacity-40 transition cursor-pointer"
                >
                  정답 확인하기
                </button>
              ) : (
                <button
                  id="next-quiz-question-button"
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>
                    {currentIndex + 1 < QUIZ_QUESTIONS.length ? '다음 문제로' : '결과 보기'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="p-6 text-center space-y-4 overflow-y-auto text-[#191F28]">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#6C47FF] flex items-center justify-center text-white shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[#191F28] tracking-tight">퀴즈 완료!</h4>
              <p className="text-xs text-[#8B95A1] mt-1">
                총 {QUIZ_QUESTIONS.length}문제 중 {correctCount}문제를 맞혔습니다.
              </p>
            </div>

            {/* Score summary */}
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#F2F4F6] flex justify-around items-center">
              <div>
                <span className="text-[11px] text-[#8B95A1] block">정답률</span>
                <span className="text-xl font-extrabold text-[#6C47FF]">
                  {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-px h-8 bg-[#F2F4F6]" />
              <div>
                <span className="text-[11px] text-[#8B95A1] block">획득 보상</span>
                <span className="text-sm font-extrabold text-[#6C47FF]">
                  +{correctCount * 10}P
                </span>
              </div>
            </div>

            {/* Wrong Answer Note list if any */}
            {wrongQuestions.length > 0 && (
              <div className="text-left space-y-2 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#191F28]">
                  <HelpCircle className="w-4 h-4 text-[#6C47FF]" />
                  <span>맞춤 복습 오답 노트 ({wrongQuestions.length}개)</span>
                </div>
                {wrongQuestions.map((wq) => (
                  <div
                    key={wq.id}
                    className="p-3 bg-[#F8F9FA] border border-[#FF3B30]/20 rounded-xl text-[11px] space-y-1"
                  >
                    <div className="font-extrabold text-[#191F28]">{wq.question}</div>
                    <div className="text-[#6C47FF] font-bold">
                      정답: {wq.options[wq.correctIndex]}
                    </div>
                    <div className="text-[#8B95A1]">{wq.explanation}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                id="retry-quiz-button"
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-xl bg-[#F0ECFF] hover:bg-[#E5DDFF] text-[#6C47FF] font-extrabold text-xs transition cursor-pointer"
              >
                다시 풀기
              </button>
              <button
                id="finish-quiz-button"
                onClick={() => setShowQuizModal(false)}
                className="flex-1 py-3.5 rounded-xl bg-[#6C47FF] hover:bg-[#5835E5] text-white font-extrabold text-xs shadow-xs transition cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
