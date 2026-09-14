export type CategoryType = 
  | 'IT/인터넷'
  | '게임·엔터테인먼트'
  | '친환경·에너지'
  | '바이오·헬스케어'
  | '소비재·유통'
  | '미래 모빌리티';

export interface StockPricePoint {
  time: string;
  price: number;
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: CategoryType;
  currentPrice: number;
  changeAmount: number;
  changeRate: number; // percentage, e.g. 1.24
  marketCap: string;
  per: number;
  pbr: number;
  dividendYield: number; // e.g. 1.8%
  description: string;
  chartData: {
    '1D': StockPricePoint[];
    '1W': StockPricePoint[];
    '1M': StockPricePoint[];
    '3M': StockPricePoint[];
    '1Y': StockPricePoint[];
  };
  isRiskRestricted?: boolean;
  riskReason?: string;
  todayAiSummary: {
    fact: string;
    opinion: string;
    source: string;
    verifiedDate: string;
    verifiedStatus: 'verified' | 'unverified' | 'caution';
    uncertainWarning?: string;
  };
}

export interface HoldingStock {
  stockId: string;
  stockCode: string;
  stockName: string;
  quantity: number; // can be fractional, e.g. 2.345
  avgBuyPrice: number;
  category: CategoryType;
}

export interface TransactionRecord {
  id: string;
  type: 'BUY' | 'SELL' | 'CHARGE' | 'BONUS';
  stockId?: string;
  stockName?: string;
  quantity?: number;
  pricePerShare?: number;
  totalAmount: number;
  date: string;
  status: 'COMPLETED' | 'PENDING_APPROVAL' | 'CANCELLED';
  aiReview?: string;
}

export interface MissionItem {
  id: string;
  title: string;
  desc: string;
  xpReward: number;
  pointReward: number;
  type: 'NEWS' | 'STOCK_ANALYSIS' | 'QUIZ' | 'VIRTUAL_TRADE' | 'TERM_STUDY';
  isCompleted: boolean;
  progress?: { current: number; total: number };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  termKey?: string;
}

export interface FinancialTerm {
  term: string;
  simpleExplanation: string;
  example: string;
  badge: '기초' | '중급';
}

export interface CommunityPost {
  id: string;
  author: string;
  avatarColor: string;
  tag: '자유글' | '질문' | '정보공유' | '이벤트';
  title: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  isOfficial?: boolean;
}

export interface AppNotification {
  id: string;
  category: '주문/체결' | '시세' | 'AI 브리핑' | '미션 보상' | '이벤트' | '서비스';
  title: string;
  content: string;
  timeAgo: string;
  isRead: boolean;
}

export interface ParentalControlSettings {
  isLinked: boolean;
  childName: string;
  childAgeInfo: string;
  monthlyLimit: number; // e.g. 500,000
  monthlyUsed: number; // e.g. 250,000
  requireTradeApproval: boolean;
  learningReportMonthlyXp: number;
  quizAccuracy: number;
  completedMissionsCount: number;
  allowHighRiskNotification: boolean;
}

export interface SpendingAnalysis {
  monthlyAllowance: number; // e.g. 100,000
  spentSoFar: number; // e.g. 68,000
  daysPassedInMonth: number; // e.g. 10
  totalDaysInMonth: number; // 30
  predictedDaysEarly: number; // e.g. 5
  isHighBurnRate: boolean;
  message: string;
}

export interface UserProfile {
  name: string;
  username: string;
  level: number;
  badge: string;
  email: string;
}

export type TopicBotMood =
  | 'greeting'
  | 'docent'
  | 'cheering'
  | 'commiserating'
  | 'mentor'
  | 'quest'
  | 'neutral';

export interface TopicBotMessage {
  id: string;
  text: string;
  subText?: string;
  mood: TopicBotMood;
  tag?: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismissMs?: number;
}

export interface ParentSandboxQuest {
  stock: StockItem;
  quantity: number;
  totalAmount: number;
  reason?: string;
  step: 'intro' | 'reason' | 'risk_check' | 'approval_request' | 'completed';
}
