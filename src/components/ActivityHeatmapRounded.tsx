
import React, { useState } from 'react';
import { format, parseISO, eachDayOfInterval, subMonths, getMonth } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapDataPoint {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityHeatmapRoundedProps {
  data: HeatmapDataPoint[];
  monthCount?: number;
}

const ActivityHeatmapRounded: React.FC<ActivityHeatmapRoundedProps> = ({ 
  data = [], 
  monthCount = 6 
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  // Generate date range for the last N months
  const endDate = new Date();
  const startDate = subMonths(endDate, monthCount);
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Convert data to a map for easy lookup
  const activityMap: Record<string, HeatmapDataPoint> = {};
  data.forEach(item => {
    activityMap[item.date] = item;
  });
  
  // Group days by month for rendering
  const monthsData: { month: number; days: Date[] }[] = [];
  let currentMonth = -1;
  
  allDays.forEach(day => {
    const month = getMonth(day);
    if (month !== currentMonth) {
      monthsData.push({ month, days: [day] });
      currentMonth = month;
    } else {
      monthsData[monthsData.length - 1].days.push(day);
    }
  });
  
  // Function to get color based on activity level
  const getLevelColor = (level: number): string => {
    const colors: string[] = [
      'bg-green-50/30 dark:bg-green-950/30', 
      'bg-green-200 dark:bg-green-800', 
      'bg-green-300 dark:bg-green-700', 
      'bg-green-400 dark:bg-green-600', 
      'bg-green-500 dark:bg-green-500'
    ];
    
    return colors[level] || colors[0];
  };

  // Month label formatter
  const getMonthLabel = (month: number): string => {
    const date = new Date();
    date.setMonth(month);
    return format(date, 'MMM');
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-start mb-1 space-x-6 px-4">
        {monthsData.map(({ month }) => (
          <div key={month} className="text-xs text-muted-foreground min-w-[24px]">
            {getMonthLabel(month)}
          </div>
        ))}
      </div>
      
      <div className="flex space-x-6 px-4">
        {monthsData.map(({ month, days }, monthIndex) => (
          <div key={month} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, weekdayIndex) => (
              <div key={weekdayIndex} className="flex gap-1">
                {days
                  .filter((_, dayIndex) => dayIndex % 7 === weekdayIndex)
                  .map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const activity = activityMap[dateStr];
                    const level = activity?.level || 0;
                    const count = activity?.count || 0;
                    
                    return (
                      <TooltipProvider key={dateStr}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-3 h-3 rounded-sm ${getLevelColor(level)} transition-all hover:scale-125 relative`}
                              onMouseEnter={() => setHoveredDate(dateStr)}
                              onMouseLeave={() => setHoveredDate(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" className="text-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{format(day, 'MMM d, yyyy')}</p>
                              <p>{count} contribution{count !== 1 ? 's' : ''}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-end mt-2 gap-1">
        <span className="text-xs text-muted-foreground mr-1">Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmapRounded;
