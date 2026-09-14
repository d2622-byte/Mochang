/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { HeaderBar } from './components/layout/HeaderBar';
import { BottomNavigation } from './components/layout/BottomNavigation';

// Screens
import { HomeScreen } from './components/home/HomeScreen';
import { MarketScreen } from './components/market/MarketScreen';
import { StockDetailScreen } from './components/market/StockDetailScreen';
import { LearningScreen } from './components/learning/LearningScreen';
import { MyPageScreen } from './components/mypage/MyPageScreen';

// Modals & Overlays
import { LoginModal } from './components/auth/LoginModal';
import { RiskWarningModal } from './components/market/RiskWarningModal';
import { TermModal } from './components/common/TermModal';
import { CelebrationModal } from './components/common/CelebrationModal';
import { ChargeModal } from './components/common/ChargeModal';
import { NotificationModal } from './components/common/NotificationModal';
import { AiGuideModal } from './components/guide/AiGuideModal';
import { QuizModal } from './components/learning/QuizModal';
import { ParentManagementModal } from './components/mypage/ParentManagementModal';
import { TopicBotCompanion } from './components/companion/TopicBotCompanion';
import { ParentSandboxModal } from './components/companion/ParentSandboxModal';

const AppContent: React.FC = () => {
  const { currentTab, selectedStockDetail } = useApp();

  const renderActiveScreen = () => {
    // If a stock detail view is active, show the Stock Detail Screen
    if (selectedStockDetail) {
      return <StockDetailScreen />;
    }

    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'market':
        return <MarketScreen />;
      case 'learning':
        return <LearningScreen />;
      case 'mypage':
        return <MyPageScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileFrame>
      {!selectedStockDetail && currentTab !== 'learning' && <HeaderBar />}
      <main className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        {renderActiveScreen()}
      </main>
      {!selectedStockDetail && <BottomNavigation />}

      {/* Global Modals & Dialogs */}
      <LoginModal />
      <RiskWarningModal />
      <TermModal />
      <CelebrationModal />
      <ChargeModal />
      <NotificationModal />
      <AiGuideModal />
      <QuizModal />
      <ParentManagementModal />
      <ParentSandboxModal />

      {/* Always-On Proactive Companion Agent: Topic-bot (토픽이) */}
      <TopicBotCompanion />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

