
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, className }) => {
  return (
    <Card className={`bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && <p className="text-xs text-green-400 mt-1">{change}</p>}
          </div>
          {icon && <div className="p-2 bg-zinc-800/50 rounded-md">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
