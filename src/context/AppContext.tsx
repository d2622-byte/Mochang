import React, { createContext, useContext, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  StockItem,
  HoldingStock,
  TransactionRecord,
  MissionItem,
  QuizQuestion,
  FinancialTerm,
  CommunityPost,
  AppNotification,
  ParentalControlSettings,
  SpendingAnalysis,
  CategoryType,
  UserProfile,
  TopicBotMessage,
  ParentSandboxQuest,
} from '../types';
import {
  INITIAL_STOCKS,
  INITIAL_HOLDINGS,
  INITIAL_MISSIONS,
  INITIAL_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PARENT_SETTINGS,
  INITIAL_SPENDING_ANALYSIS,
  INITIAL_TRANSACTIONS,
  FINANCIAL_TERMS,
} from '../data/mockData';

export type MainTabType = 'home' | 'market' | 'learning' | 'mypage';

interface CelebrationPayload {
  title: string;
  subtitle: string;
  points: number;
  xp: number;
}

interface AppContextType {
  // Navigation & Modals
  currentTab: MainTabType;
  setCurrentTab: (tab: MainTabType) => void;
  selectedStockDetail: StockItem | null;
  setSelectedStockDetail: (stock: StockItem | null) => void;
  purchaseStock: StockItem | null;
  setPurchaseStock: (stock: StockItem | null) => void;
  activeRiskStock: StockItem | null;
  setActiveRiskStock: (stock: StockItem | null) => void;
  activeTerm: FinancialTerm | null;
  setActiveTerm: (term: FinancialTerm | null) => void;
  showAiChatModal: boolean;
  setShowAiChatModal: (show: boolean) => void;
  showNotificationModal: boolean;
  setShowNotificationModal: (show: boolean) => void;
  showParentManagementModal: boolean;
  setShowParentManagementModal: (show: boolean) => void;
  showSpendingRiskModal: boolean;
  setShowSpendingRiskModal: (show: boolean) => void;
  showChargeModal: boolean;
  setShowChargeModal: (show: boolean) => void;
  showQuizModal: boolean;
  setShowQuizModal: (show: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showPortfolioDetailModal: boolean;
  setShowPortfolioDetailModal: (show: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isTradeSheetOpen: boolean;
  setIsTradeSheetOpen: (open: boolean) => void;

  // Topic-bot Companion & Parent Sandbox Quest
  topicBotMessage: TopicBotMessage | null;
  setTopicBotMessage: (msg: TopicBotMessage | null) => void;
  triggerTopicBotSpeech: (msg: Partial<TopicBotMessage>) => void;
  parentSandboxQuest: ParentSandboxQuest | null;
  setParentSandboxQuest: (quest: ParentSandboxQuest | null) => void;

  // Authentication & User
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  loginFailures: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
  attemptLogin: (id: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  quickDemoLogin: () => void;

  // Stocks & Holdings
  stocks: StockItem[];
  holdings: HoldingStock[];
  transactions: TransactionRecord[];
  availableCash: number;
  totalAssetValue: number;
  totalPortfolioValue: number;
  totalHoldingsValue: number;
  totalProfitAmount: number;
  totalProfitLoss: number;
  totalProfitRate: number;
  selectedCategory: CategoryType | '전체';
  setSelectedCategory: (cat: CategoryType | '전체') => void;

  // Actions
  executeBuyOrder: (stock: StockItem, quantity: number) => { success: boolean; message: string };
  executeSellOrder: (stock: StockItem, quantity: number) => { success: boolean; message: string };
  chargeCash: (amount: number) => void;

  // Gamification & Missions
  xp: number;
  level: number;
  maxLevelXp: number;
  investmentScore: number;
  virtualPoints: number;
  missions: MissionItem[];
  completeMission: (missionId: string) => void;
  wrongAnswerNotes: QuizQuestion[];
  recordQuizResult: (answeredQuestions: QuizQuestion[], wrongQuestions: QuizQuestion[], scorePercent: number) => void;

  // Celebration
  celebration: CelebrationPayload | null;
  closeCelebration: () => void;
  triggerCelebration: (payload: CelebrationPayload) => void;

  // Parental Control
  parentSettings: ParentalControlSettings;
  updateParentSettings: (settings: Partial<ParentalControlSettings>) => void;

  // Spending Risk
  spending: SpendingAnalysis;

  // Community
  posts: CommunityPost[];
  toggleLikePost: (postId: string) => void;
  addPost: (title: string, content: string, tag: '자유글' | '질문' | '정보공유') => void;
  applyReferralCode: (code: string) => { success: boolean; message: string };

  // Notifications
  notifications: AppNotification[];
  markAllNotificationsAsRead: () => void;
  openTermByName: (termKey: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<MainTabType>('home');
  const [selectedStockDetail, setSelectedStockDetail] = useState<StockItem | null>(null);
  const [purchaseStock, setPurchaseStock] = useState<StockItem | null>(null);
  const [activeRiskStock, setActiveRiskStock] = useState<StockItem | null>(null);
  const [activeTerm, setActiveTerm] = useState<FinancialTerm | null>(null);
  const [showAiChatModal, setShowAiChatModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showParentManagementModal, setShowParentManagementModal] = useState<boolean>(false);
  const [showSpendingRiskModal, setShowSpendingRiskModal] = useState<boolean>(false);
  const [showChargeModal, setShowChargeModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showPortfolioDetailModal, setShowPortfolioDetailModal] = useState<boolean>(false);
  const [isTradeSheetOpen, setIsTradeSheetOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Topic-bot Companion & Parent Sandbox Quest State
  const [topicBotMessage, setTopicBotMessage] = useState<TopicBotMessage | null>(null);
  const [parentSandboxQuest, setParentSandboxQuest] = useState<ParentSandboxQuest | null>(null);

  // Computed isModalOpen: true when ANY modal, bottom-sheet, or dialog is active
  const isModalOpen = useMemo(() => {
    return Boolean(
      isTradeSheetOpen ||
      isCustomModalOpen ||
      purchaseStock !== null ||
      activeRiskStock !== null ||
      activeTerm !== null ||
      showAiChatModal ||
      showNotificationModal ||
      showParentManagementModal ||
      showSpendingRiskModal ||
      showChargeModal ||
      showQuizModal ||
      showLoginModal ||
      showPortfolioDetailModal ||
      parentSandboxQuest !== null
    );
  }, [
    isTradeSheetOpen,
    isCustomModalOpen,
    purchaseStock,
    activeRiskStock,
    activeTerm,
    showAiChatModal,
    showNotificationModal,
    showParentManagementModal,
    showSpendingRiskModal,
    showChargeModal,
    showQuizModal,
    showLoginModal,
    showPortfolioDetailModal,
    parentSandboxQuest,
  ]);

  const triggerTopicBotSpeech = (msg: Partial<TopicBotMessage>) => {
    setTopicBotMessage({
      id: msg.id || `topic-msg-${Date.now()}`,
      text: msg.text || '',
      subText: msg.subText,
      mood: msg.mood || 'greeting',
      tag: msg.tag,
      actionLabel: msg.actionLabel,
      onAction: msg.onAction,
      autoDismissMs: msg.autoDismissMs,
    });
  };

  // Authentication & User State
  const [user, setUser] = useState<UserProfile>({
    name: '김지우',
    username: 'jiwoo_invest',
    level: 3,
    badge: '주니어 투자자',
    email: 'd2622@e-mirim.hs.kr',
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginFailures, setLoginFailures] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Financial State
  const [stocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [holdings, setHoldings] = useState<HoldingStock[]>(INITIAL_HOLDINGS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [availableCash, setAvailableCash] = useState<number>(250000);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | '전체'>('전체');

  // Gamification State
  const [xp, setXp] = useState<number>(350);
  const [investmentScore, setInvestmentScore] = useState<number>(85);
  const [virtualPoints, setVirtualPoints] = useState<number>(240);
  const [missions, setMissions] = useState<MissionItem[]>(INITIAL_MISSIONS);
  const [wrongAnswerNotes, setWrongAnswerNotes] = useState<QuizQuestion[]>([]);
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);

  // Parent & Analytics State
  const [parentSettings, setParentSettings] = useState<ParentalControlSettings>(INITIAL_PARENT_SETTINGS);
  const [spending] = useState<SpendingAnalysis>(INITIAL_SPENDING_ANALYSIS);

  // Community & Notification State
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Level computation: Lv. 3 (350 / 500 XP)
  const maxLevelXp = 500;
  const level = useMemo(() => {
    return Math.floor(xp / 200) + 1;
  }, [xp]);

  // Asset computation
  const totalHoldingsValue = useMemo(() => {
    return holdings.reduce((sum, item) => {
      const current = stocks.find((s) => s.id === item.stockId);
      const price = current ? current.currentPrice : item.avgBuyPrice;
      return sum + Math.round(item.quantity * price);
    }, 0);
  }, [holdings, stocks]);

  const totalAssetValue = useMemo(() => {
    return availableCash + totalHoldingsValue;
  }, [availableCash, totalHoldingsValue]);

  const totalCostBasis = useMemo(() => {
    return holdings.reduce((sum, item) => sum + Math.round(item.quantity * item.avgBuyPrice), 0);
  }, [holdings]);

  const totalProfitAmount = totalHoldingsValue - totalCostBasis;
  const totalProfitRate = totalCostBasis > 0 ? (totalProfitAmount / totalCostBasis) * 100 : 0;

  // Trigger celebration with confetti
  const triggerCelebration = (payload: CelebrationPayload) => {
    setCelebration(payload);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894'],
      });
    } catch {
      // ignore if confetti fails
    }
  };

  const closeCelebration = () => {
    setCelebration(null);
  };

  // Open dictionary term
  const openTermByName = (termKey: string) => {
    const term = FINANCIAL_TERMS[termKey];
    if (term) {
      setActiveTerm(term);
    }
  };

  // Login handler based on flow diagram
  const attemptLogin = (id: string, pass: string): { success: boolean; message: string } => {
    if (isLockedOut) {
      return { success: false, message: '5회 이상 로그인에 실패했습니다. 잠시 후 재시도 가능합니다.' };
    }
    // Correct demo credentials: id: jiwoo, pass: 1234
    if (id === 'jiwoo' && pass === '1234') {
      setIsLoggedIn(true);
      setLoginFailures(0);
      setShowLoginModal(false);
      return { success: true, message: '로그인되었습니다.' };
    }

    const nextFailures = loginFailures + 1;
    setLoginFailures(nextFailures);

    if (nextFailures >= 5) {
      setIsLockedOut(true);
      setLockoutRemainingSeconds(300);
      return {
        success: false,
        message: '5회 이상 로그인에 실패했습니다. (5분 뒤 재시도 가능)',
      };
    }

    return {
      success: false,
      message: `비밀번호가 ${nextFailures}회 틀렸습니다. (5회 실패 시 일시 잠금)`,
    };
  };

  const quickDemoLogin = () => {
    setIsLoggedIn(true);
    setLoginFailures(0);
    setIsLockedOut(false);
    setShowLoginModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setShowLoginModal(true);
  };

  // Safe Trading Logic
  const executeBuyOrder = (stock: StockItem, quantity: number): { success: boolean; message: string } => {
    // 1. Risk check
    if (stock.isRiskRestricted) {
      setActiveRiskStock(stock);
      return {
        success: false,
        message: stock.riskReason || '위험 종목 탐지: 청소년 보호를 위해 거래가 제한된 종목입니다.',
      };
    }

    // 2. Minimum amount verification (1,000 KRW)
    const totalAmount = Math.round(stock.currentPrice * quantity);
    if (totalAmount < 1000) {
      return {
        success: false,
        message: '결제 가능 금액은 최소 1,000원 이상부터 입니다.',
      };
    }

    // 3. Balance verification
    if (totalAmount > availableCash) {
      return {
        success: false,
        message: `주문 가능 금액(${availableCash.toLocaleString()}원)이 부족합니다.`,
      };
    }

    // 4. Parental Monthly Limit verification
    if (parentSettings.monthlyUsed + totalAmount > parentSettings.monthlyLimit) {
      return {
        success: false,
        message: `부모님이 설정한 이번 달 투자 한도(${parentSettings.monthlyLimit.toLocaleString()}원)를 초과하여 매수할 수 없습니다. (현재 사용: ${parentSettings.monthlyUsed.toLocaleString()}원)`,
      };
    }

    // Deduct cash
    setAvailableCash((prev) => prev - totalAmount);

    // Update parent settings monthly used
    setParentSettings((prev) => ({
      ...prev,
      monthlyUsed: prev.monthlyUsed + totalAmount,
    }));

    // Update Holdings
    setHoldings((prev) => {
      const existing = prev.find((h) => h.stockId === stock.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        const newAvg = Math.round(
          (existing.avgBuyPrice * existing.quantity + stock.currentPrice * quantity) / newQuantity
        );
        return prev.map((h) =>
          h.stockId === stock.id
            ? { ...h, quantity: Number(newQuantity.toFixed(4)), avgBuyPrice: newAvg }
            : h
        );
      } else {
        return [
          ...prev,
          {
            stockId: stock.id,
            stockCode: stock.code,
            stockName: stock.name,
            quantity: Number(quantity.toFixed(4)),
            avgBuyPrice: stock.currentPrice,
            category: stock.category,
          },
        ];
      }
    });

    // Add Transaction
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'BUY',
      stockId: stock.id,
      stockName: stock.name,
      quantity,
      pricePerShare: stock.currentPrice,
      totalAmount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'COMPLETED',
      aiReview: `${stock.name} ${quantity}주를 ${stock.currentPrice.toLocaleString()}원에 매수했습니다. ${stock.todayAiSummary.opinion}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        category: '주문/체결',
        title: '주문 체결 완료',
        content: `${stock.name} ${quantity}주 매수 체결 (${totalAmount.toLocaleString()}원) 완료되었습니다.`,
        timeAgo: '방금 전',
        isRead: false,
      },
      ...prev,
    ]);

    // Check mission m4: 가상 투자 1회 진행
    completeMission('m4');

    // Gain XP for practicing safe investment
    setXp((prev) => prev + 30);
    setInvestmentScore((prev) => Math.min(100, prev + 2));

    return {
      success: true,
      message: '결제를 완료했습니다.',
    };
  };

  const executeSellOrder = (stock: StockItem, quantity: number): { success: boolean; message: string } => {
    const existing = holdings.find((h) => h.stockId === stock.id);
    if (!existing || existing.quantity < quantity) {
      return { success: false, message: '보유 수량이 부족합니다.' };
    }

    const totalAmount = Math.round(stock.currentPrice * quantity);
    const profit = Math.round((stock.currentPrice - existing.avgBuyPrice) * quantity);

    setAvailableCash((prev) => prev + totalAmount);

    setHoldings((prev) => {
      const remaining = Number((existing.quantity - quantity).toFixed(4));
      if (remaining <= 0.0001) {
        return prev.filter((h) => h.stockId !== stock.id);
      }
      return prev.map((h) => (h.stockId === stock.id ? { ...h, quantity: remaining } : h));
    });

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'SELL',
      stockId: stock.id,
      stockName: stock.name,
      quantity,
      pricePerShare: stock.currentPrice,
      totalAmount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'COMPLETED',
      aiReview: `${stock.name} 매도 실현 손익: ${profit >= 0 ? '+' : ''}${profit.toLocaleString()}원. 모의투자를 통해 매매 타이밍을 경험했습니다.`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        category: '주문/체결',
        title: '매도 체결 완료',
        content: `${stock.name} ${quantity}주 매도 (${totalAmount.toLocaleString()}원) 완료되었습니다.`,
        timeAgo: '방금 전',
        isRead: false,
      },
      ...prev,
    ]);

    return { success: true, message: '매도가 완료되었습니다.' };
  };

  const chargeCash = (amount: number) => {
    setAvailableCash((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'CHARGE',
        totalAmount: amount,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'COMPLETED',
      },
      ...prev,
    ]);
    triggerCelebration({
      title: '가상 투자금 충전 완료!',
      subtitle: `${amount.toLocaleString()}원의 모의투자금이 안전하게 지급되었습니다.`,
      points: 10,
      xp: 20,
    });
    setVirtualPoints((prev) => prev + 10);
    setXp((prev) => prev + 20);
  };

  const completeMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId && !m.isCompleted) {
          triggerCelebration({
            title: '미션 완료! 축하해요! 🏆',
            subtitle: `[${m.title}] 미션을 달성하여 보상을 획득했습니다.`,
            points: m.pointReward,
            xp: m.xpReward,
          });
          setXp((prevXp) => prevXp + m.xpReward);
          setVirtualPoints((prevPt) => prevPt + m.pointReward);
          setInvestmentScore((prevScore) => Math.min(100, prevScore + 3));
          return { ...m, isCompleted: true };
        }
        return m;
      })
    );
  };

  const recordQuizResult = (answered: QuizQuestion[], wrongs: QuizQuestion[], scorePercent: number) => {
    setWrongAnswerNotes(wrongs);
    const earnedXp = Math.round(scorePercent * 0.8);
    const earnedPoints = Math.round(scorePercent * 0.4);

    setXp((prev) => prev + earnedXp);
    setVirtualPoints((prev) => prev + earnedPoints);

    if (scorePercent >= 70) {
      completeMission('m3');
      triggerCelebration({
        title: '금융 퀴즈 마스터! 🎓',
        subtitle: `정답률 ${scorePercent}%로 우수한 성적을 기록했습니다! 오답 노트에서 복습해 보세요.`,
        points: earnedPoints,
        xp: earnedXp,
      });
    }

    setParentSettings((prev) => ({
      ...prev,
      quizAccuracy: Math.round((prev.quizAccuracy + scorePercent) / 2),
      learningReportMonthlyXp: prev.learningReportMonthlyXp + earnedXp,
    }));
  };

  const updateParentSettings = (settings: Partial<ParentalControlSettings>) => {
    setParentSettings((prev) => ({ ...prev, ...settings }));
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const addPost = (title: string, content: string, tag: '자유글' | '질문' | '정보공유') => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: '지우 (나)',
      avatarColor: 'bg-violet-500',
      tag,
      title,
      content,
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      createdAt: '방금 전',
    };
    setPosts((prev) => [newPost, ...prev]);
    setXp((prev) => prev + 20);
    setVirtualPoints((prev) => prev + 10);
  };

  const applyReferralCode = (code: string): { success: boolean; message: string } => {
    if (!code.trim()) {
      return { success: false, message: '추천인 코드를 입력해 주세요.' };
    }
    const bonusAmount = 5000;
    setAvailableCash((prev) => prev + bonusAmount);
    setVirtualPoints((prev) => prev + 50);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'BONUS',
        totalAmount: bonusAmount,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'COMPLETED',
        aiReview: '친구 초대 추천인 리워드로 모의투자금 5,000원이 지급되었습니다.',
      },
      ...prev,
    ]);

    triggerCelebration({
      title: '친구 초대 리워드 지급! 🎁',
      subtitle: `추천인 등록 완료! 가상 투자금 5,000원과 50P가 충전되었습니다.`,
      points: 50,
      xp: 40,
    });

    return {
      success: true,
      message: '친구 초대 보너스 5,000원이 충전되었습니다!',
    };
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedStockDetail,
        setSelectedStockDetail,
        purchaseStock,
        setPurchaseStock,
        activeRiskStock,
        setActiveRiskStock,
        activeTerm,
        setActiveTerm,
        showAiChatModal,
        setShowAiChatModal,
        showNotificationModal,
        setShowNotificationModal,
        showParentManagementModal,
        setShowParentManagementModal,
        showSpendingRiskModal,
        setShowSpendingRiskModal,
        showChargeModal,
        setShowChargeModal,
        showQuizModal,
        setShowQuizModal,
        showLoginModal,
        setShowLoginModal,
        showPortfolioDetailModal,
        setShowPortfolioDetailModal,
        isModalOpen,
        setIsModalOpen: setIsCustomModalOpen,
        isTradeSheetOpen,
        setIsTradeSheetOpen,
        topicBotMessage,
        setTopicBotMessage,
        triggerTopicBotSpeech,
        parentSandboxQuest,
        setParentSandboxQuest,
        isLoggedIn,
        user,
        setUser,
        loginFailures,
        isLockedOut,
        lockoutRemainingSeconds,
        attemptLogin,
        logout,
        quickDemoLogin,
        stocks,
        holdings,
        transactions,
        availableCash,
        totalAssetValue,
        totalPortfolioValue: totalAssetValue,
        totalHoldingsValue,
        totalProfitAmount,
        totalProfitLoss: totalProfitAmount,
        totalProfitRate,
        selectedCategory,
        setSelectedCategory,
        executeBuyOrder,
        executeSellOrder,
        chargeCash,
        xp,
        level,
        maxLevelXp,
        investmentScore,
        virtualPoints,
        missions,
        completeMission,
        wrongAnswerNotes,
        recordQuizResult,
        celebration,
        closeCelebration,
        triggerCelebration,
        parentSettings,
        updateParentSettings,
        spending,
        posts,
        toggleLikePost,
        addPost,
        applyReferralCode,
        notifications,
        markAllNotificationsAsRead,
        openTermByName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
