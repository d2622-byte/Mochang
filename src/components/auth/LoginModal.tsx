import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const {
    showLoginModal,
    setShowLoginModal,
    attemptLogin,
    quickDemoLogin,
    loginFailures,
    isLockedOut,
    isLoggedIn,
  } = useApp();

  const [idInput, setIdInput] = useState<string>('jiwoo');
  const [passInput, setPassInput] = useState<string>('1234');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!showLoginModal && isLoggedIn) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = attemptLogin(idInput, passInput);
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage('');
    }
  };

  return (
    <div
      id="login-modal-overlay"
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
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100 relative"
        style={{ zIndex: 10000 }}
      >
        <div className="bg-gradient-to-br from-[#6C5CE7] to-[#5A4AD1] p-6 text-white text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">스토픽 (STOPIC) 로그인</h2>
          <p className="text-xs text-purple-100 mt-1">청소년 안심 금융 교육 & 모의투자</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {/* Error / Lockout banner */}
          {errorMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                isLockedOut
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">아이디</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                id="login-username-input"
                type="text"
                disabled={isLockedOut}
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                id="login-password-input"
                type="password"
                disabled={isLockedOut}
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>테스트 계정: jiwoo / 1234</span>
            {loginFailures > 0 && <span className="text-rose-500 font-bold">{loginFailures}/5회 실패</span>}
          </div>

          <button
            id="submit-login-button"
            type="submit"
            disabled={isLockedOut}
            className="w-full py-3 rounded-xl bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLockedOut ? '5분 뒤 재시도 가능' : '로그인'}
          </button>

          <button
            id="quick-demo-login-button"
            type="button"
            onClick={quickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-[#F0EEFF] hover:bg-[#E5E0FF] text-[#5A4AD1] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>지우 계정으로 1초 빠른 시작</span>
          </button>
        </form>
      </div>
    </div>
  );
};
