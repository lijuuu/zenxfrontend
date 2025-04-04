
import { Trophy, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "flex flex-col bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        {icon}
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        
        {change && (
          <div className="flex items-center text-xs font-medium text-green-400">
            <ChevronUp className="h-3 w-3 mr-0.5" />
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
