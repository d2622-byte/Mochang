import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = '아직 체결된 내역이 없습니다',
  subMessage = '모의투자를 시작하여 첫 주식을 매수해보세요.',
  icon: Icon = Inbox,
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-[#F2F4F6] text-center flex flex-col items-center justify-center space-y-2.5 my-2">
      <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] text-slate-400 flex items-center justify-center">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-[#191F28]">{message}</p>
        {subMessage && <p className="text-xs text-[#8B95A1]">{subMessage}</p>}
      </div>
    </div>
  );
};
