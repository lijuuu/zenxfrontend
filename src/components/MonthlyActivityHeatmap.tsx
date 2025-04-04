
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const MonthlyActivityHeatmap: React.FC = () => {
  // Mock data for the heatmap
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();
  
  const mockData = Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(new Date().getFullYear(), currentMonth, i + 1).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 5),
  }));
  
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-zinc-800/50';
    if (count === 1) return 'bg-green-900/60';
    if (count === 2) return 'bg-green-700/80';
    if (count === 3) return 'bg-green-600';
    return 'bg-green-500';
  };

  return (
    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          Monthly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={`day-${i}`} className="text-center text-xs text-zinc-500">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
            </div>
          ))}

          {Array.from({ length: new Date(new Date().getFullYear(), currentMonth, 1).getDay() }, (_, i) => (
            <div key={`empty-${i}`} className="w-full aspect-square"></div>
          ))}

          {mockData.map((day) => (
            <div 
              key={day.date} 
              className={`w-full aspect-square rounded-sm ${getIntensityClass(day.count)}`}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-800">
          <div className="text-xs text-zinc-500">April 2024</div>
          <div className="flex items-center gap-1.5">
            <div className="text-xs text-zinc-500">Less</div>
            <div className="flex items-center gap-0.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-zinc-800/50"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-900/60"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-700/80"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-600"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
            </div>
            <div className="text-xs text-zinc-500">More</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;
