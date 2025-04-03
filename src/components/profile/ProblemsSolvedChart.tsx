
import React from 'react';
import { UserProfile } from '@/api/types';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ProblemsSolvedChartProps {
  profile: UserProfile;
}

const ProblemsSolvedChart: React.FC<ProblemsSolvedChartProps> = ({ profile }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const easyColor = '#22c55e'; // green-500
  const mediumColor = '#f59e0b'; // amber-500
  const hardColor = '#ef4444'; // red-500
  
  const { easy, medium, hard } = profile.stats;
  
  const data = [
    { name: 'Easy', value: easy.solved, color: easyColor, total: easy.total },
    { name: 'Medium', value: medium.solved, color: mediumColor, total: medium.total },
    { name: 'Hard', value: hard.solved, color: hardColor, total: hard.total }
  ];
  
  const total = easy.solved + medium.solved + hard.solved;
  const totalAvailable = easy.total + medium.total + hard.total;
  
  // const CustomTooltip = ({ active, payload }: any) => {
  //   if (active && payload && payload.length) {
  //     const data = payload[0].payload;
  //     return (
  //       <div className="bg-background border border-border rounded-md p-2 shadow-md">
  //         <p className="font-medium text-sm">{data.name} Problems</p>
  //         <p className="text-sm">
  //           Solved: <span className="font-medium">{data.value}</span>/{data.total}
  //         </p>
  //         <p className="text-sm text-muted-foreground">
  //           {Math.round((data.value / data.total) * 100)}% completion
  //         </p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Easy Problems</div>
          <div className="text-xl font-semibold mt-1">{easy.solved} / {easy.total}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(easy.solved / easy.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Medium Problems</div>
          <div className="text-xl font-semibold mt-1">{medium.solved} / {medium.total}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(medium.solved / medium.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 border border-border/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Hard Problems</div>
          <div className="text-xl font-semibold mt-1">{hard.solved} / {hard.total}</div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(hard.solved / hard.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Problems Solved Distribution</h3>
          <p className="text-sm text-muted-foreground">
            {total} solved out of {totalAvailable} problems ({Math.round((total / totalAvailable) * 100)}%)
          </p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom"
              align="center"
              formatter={(value, entry, index) => (
                <span className="text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default ProblemsSolvedChart;
