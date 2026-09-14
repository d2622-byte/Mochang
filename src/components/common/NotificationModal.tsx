import React, { useState } from 'react';
import { X, Bell, CheckCircle2, TrendingUp, Sparkles, Shield, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { showNotificationModal, setShowNotificationModal, notifications, markAllNotificationsAsRead } =
    useApp();
  const [filter, setFilter] = useState<string>('전체');

  if (!showNotificationModal) return null;

  const categories = ['전체', '주문/체결', '시세', '서비스'];

  const filtered = notifications.filter((n) => {
    if (filter === '전체') return true;
    if (filter === '서비스') return n.category === '서비스' || n.category === '이벤트' || n.category === '미션 보상';
    return n.category === filter;
  });

  const getIcon = (cat: string) => {
    switch (cat) {
      case '주문/체결':
        return <CheckCircle2 className="w-4 h-4 text-[#6C47FF]" />;
      case '시세':
        return <TrendingUp className="w-4 h-4 text-[#6C47FF]" />;
      case 'AI 브리핑':
        return <Sparkles className="w-4 h-4 text-[#6C47FF]" />;
      case '미션 보상':
      case '이벤트':
        return <Gift className="w-4 h-4 text-[#6C47FF]" />;
      default:
        return <Shield className="w-4 h-4 text-[#8B95A1]" />;
    }
  };

  return (
    <div
      id="notification-modal-overlay"
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
        if (e.target === e.currentTarget) setShowNotificationModal(false);
      }}
    >
      <div
        className="bg-[#FFFFFF] rounded-[20px] w-full max-w-sm h-[520px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F2F4F6] relative"
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F2F4F6] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#6C47FF]" />
            <h3 className="font-extrabold text-[#191F28] text-base">알림</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="mark-all-read-button"
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-extrabold text-[#6C47FF] hover:underline cursor-pointer"
            >
              전체 읽기
            </button>
            <button
              id="close-notifications-button"
              onClick={() => setShowNotificationModal(false)}
              className="p-1 rounded-full text-[#8B95A1] hover:text-[#191F28] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 px-4 py-2 border-b border-[#F2F4F6] shrink-0 overflow-x-auto no-scrollbar bg-[#FFFFFF]">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`notif-filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
                filter === cat
                  ? 'bg-[#6C47FF] text-white'
                  : 'bg-[#F0ECFF] text-[#6C47FF] hover:bg-[#E5DDFF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8B95A1] text-xs">새로운 알림이 없습니다.</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-[12px] border transition ${
                  item.isRead
                    ? 'bg-[#FFFFFF] border-[#F2F4F6] text-[#4E5968]'
                    : 'bg-[#FFFFFF] border-[#6C47FF]/30 text-[#191F28] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {getIcon(item.category)}
                    <span className="text-[11px] font-extrabold text-[#191F28]">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-[#8B95A1]">{item.timeAgo}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#4E5968]">{item.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
