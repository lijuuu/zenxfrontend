
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, className }) => {
  return (
    <Card className={cn("bg-zinc-900/40 border-zinc-800/50", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-medium text-zinc-400">{title}</h3>
          {icon}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold">{value}</div>
          {change && (
            <div className="text-xs text-green-400">{change}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
