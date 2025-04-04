
import { Trophy, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  trend?: {
    value: string;
    label: string;
    direction: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, description, change, trend, icon, className }: StatsCardProps) => {
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
        
        {(change || trend) && (
          <div className="flex items-center text-xs font-medium text-green-400">
            <ChevronUp className="h-3 w-3 mr-0.5" />
            {change || trend?.value}
            {trend?.label && <span className="ml-1 text-zinc-400">{trend.label}</span>}
          </div>
        )}
      </div>
      
      {description && (
        <span className="text-xs text-zinc-400 mt-1">{description}</span>
      )}
    </div>
  );
};

export default StatsCard;
