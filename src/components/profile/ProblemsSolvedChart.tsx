
import React from 'react';
import { UserProfile } from '@/api/types';
import { useProblemStats } from '@/services/useProblemStats';

interface ProblemsSolvedChartProps {
  profile: UserProfile;
}

const ProblemsSolvedChart: React.FC<ProblemsSolvedChartProps> = ({ profile }) => {
  const { userId } = profile;
  const { data: problemStats, isLoading, error } = useProblemStats(userId);

  if (isLoading) {
    return <div>Loading problem statistics...</div>; // loading state
  }

  if (error || !problemStats) {
    return <div>Error loading problem statistics.</div>; // error state
  }

  const easyColor = '#22c55e'; // green-500
  const mediumColor = '#f59e0b'; // amber-500
  const hardColor = '#ef4444'; // red-500;

  const data = [
    { name: 'Easy', value: problemStats.doneEasyCount, color: easyColor, total: problemStats.maxEasyCount },
    { name: 'Medium', value: problemStats.doneMediumCount, color: mediumColor, total: problemStats.maxMediumCount },
    { name: 'Hard', value: problemStats.doneHardCount, color: hardColor, total: problemStats.maxHardCount },
  ];

  const total = problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount;
  const totalAvailable = problemStats.maxEasyCount + problemStats.maxMediumCount + problemStats.maxHardCount;
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-md p-2 shadow-md">
          <p className="font-medium text-sm">{data.name} Problems</p>
          <p className="text-sm">
            Solved: <span className="font-medium">{data.value}</span>/{data.total}
          </p>
          <p className="text-sm text-muted-foreground">
            {Math.round((data.value / data.total) * 100)}% completion
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Easy Problems</div>
          <div className="text-xl font-semibold mt-1">{problemStats.doneEasyCount} / {problemStats.maxEasyCount}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(problemStats.doneEasyCount / problemStats.maxEasyCount) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Medium Problems</div>
          <div className="text-xl font-semibold mt-1">{problemStats.doneMediumCount} / {problemStats.maxMediumCount}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(problemStats.doneMediumCount / problemStats.maxMediumCount) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Hard Problems</div>
          <div className="text-xl font-semibold mt-1">{problemStats.doneHardCount} / {problemStats.maxHardCount}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(problemStats.doneHardCount / problemStats.maxHardCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSolvedChart;
