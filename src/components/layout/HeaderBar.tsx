import React from 'react';
import { ArrowLeft, Bell, Bot, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBack = false,
  onBack,
  showSearch = true,
  onSearchClick,
}) => {
  const {
    notifications,
    setShowNotificationModal,
    setShowAiChatModal,
    setSelectedStockDetail,
    setCurrentTab,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedStockDetail(null);
    }
  };

  return (
    <div
      id="top-app-header-bar"
      className="h-13 px-4 flex items-center justify-between bg-[#FFFFFF] shrink-0 sticky top-0 z-[100] border-b border-[#F2F4F6]"
      style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {showBack ? (
          <button
            id="header-back-button"
            onClick={handleBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[#F2F4F6] text-[#191F28] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}

        {title ? (
          <h1 className="text-base font-extrabold text-[#191F28] truncate tracking-tight">{title}</h1>
        ) : (
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <span className="w-2 h-2 rounded-full bg-[#6C47FF]"></span>
            <span className="text-lg font-extrabold tracking-tight text-[#191F28]">STOPIC</span>
            <span className="text-[11px] font-bold text-[#6C47FF] bg-[#F0ECFF] px-1.5 py-0.5 rounded-md ml-0.5">
              청소년
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {showSearch && (
          <button
            id="header-search-button"
            onClick={() => {
              if (onSearchClick) onSearchClick();
              else setCurrentTab('market');
            }}
            className="p-2 rounded-full hover:bg-[#F2F4F6] text-[#4E5968] transition cursor-pointer"
            title="종목 검색"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {/* AI Guide quick bot button */}
        <button
          id="header-ai-bot-button"
          onClick={() => setShowAiChatModal(true)}
          className="p-2 rounded-full bg-[#F0ECFF] text-[#6C47FF] hover:bg-[#E5DDFF] transition cursor-pointer relative group"
          title="AI 투자 가이드봇"
        >
          <Bot className="w-5 h-5" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C47FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C47FF]"></span>
          </span>
        </button>

        {/* Notification bell */}
        <button
          id="header-notifications-button"
          onClick={() => setShowNotificationModal(true)}
          className="p-2 rounded-full hover:bg-[#F2F4F6] text-[#4E5968] transition cursor-pointer relative"
          title="알림 센터"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B30] rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </div>
  );
};
