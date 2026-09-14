import React from 'react';
import { Home, TrendingUp, BookOpen, User } from 'lucide-react';
import { useApp, MainTabType } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, missions, setSelectedStockDetail } = useApp();

  const activeMissionsCount = missions.filter((m) => !m.isCompleted).length;

  const handleTabClick = (tab: MainTabType) => {
    setSelectedStockDetail(null);
    setCurrentTab(tab);
  };

  const navItems = [
    { id: 'home' as MainTabType, label: '홈', icon: Home },
    { id: 'market' as MainTabType, label: '마켓', icon: TrendingUp },
    {
      id: 'learning' as MainTabType,
      label: '학습',
      icon: BookOpen,
      badge: activeMissionsCount > 0 ? activeMissionsCount : undefined,
    },
    { id: 'mypage' as MainTabType, label: '마이페이지', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="h-[64px] bg-[#FFFFFF] border-t border-[#F2F4F6] flex items-center justify-around px-2 shrink-0 sticky bottom-0 z-[90]"
      style={{ position: 'sticky', bottom: 0, zIndex: 90, backgroundColor: '#FFFFFF' }}
    >
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors cursor-pointer ${
              isActive ? 'text-[#6C47FF]' : 'text-[#8B95A1] hover:text-[#4E5968]'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-[#FF3B30] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] mt-1 transition-all ${
                isActive ? 'font-extrabold text-[#6C47FF]' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
