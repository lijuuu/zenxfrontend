import React, { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, getDay, getDaysInMonth } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

type ActivityDay = {
  date: string;
  count: number;
  isActive: boolean;
};

interface MonthlyActivityHeatmapProps {
  data?: ActivityDay[];
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const MonthlyActivityHeatmap: React.FC<MonthlyActivityHeatmapProps> = ({
  data,
  className = "",
  showTitle = true,
  compact = false
}) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Get current month and its days
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    // Generate array of days for the current month
    const days = eachDayOfInterval({ start, end });

    if (!data) {
      const generatedData: ActivityDay[] = days.map(day => {
        const isActive = Math.random() > 0.3; // 70% chance of being active
        const count = isActive ? Math.floor(Math.random() * 10) + 1 : 0;
        return {
          date: format(day, 'yyyy-MM-dd'),
          count,
          isActive
        };
      });
      setActivityData(generatedData);
    } else {
      setActivityData(data);
    }
  }, [data]);

  // Create dynamic grid for the month
  const createDynamicGrid = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const daysInMonth = getDaysInMonth(today);
    const firstDayOfMonth = getDay(start); // 0 (Sun) to 6 (Sat)

    // Calculate total slots and weeks needed
    const totalSlots = daysInMonth + firstDayOfMonth;
    const weeksNeeded = Math.ceil(totalSlots / 7);

    // Initialize grid with null values
    const grid: (ActivityDay | null)[][] = Array(weeksNeeded)
      .fill(null)
      .map(() => Array(7).fill(null));

    // Fill empty slots before the first day with null (to be gray)
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid[0][i] = null;
    }

    // Populate the grid with activity data
    let dayIndex = 0;
    for (let week = 0; week < weeksNeeded; week++) {
      for (let day = 0; day < 7; day++) {
        const currentPosition = week * 7 + day;
        if (currentPosition < firstDayOfMonth || dayIndex >= activityData.length) {
          // Fill remaining slots with null (to be gray)
          if (currentPosition >= firstDayOfMonth) {
            grid[week][day] = null;
          }
          continue;
        }
        grid[week][day] = activityData[dayIndex];
        dayIndex++;
      }
    }

    return grid;
  };

  const grid = createDynamicGrid();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Circle size and gap settings
  const circleSize = 'w-10 h-10'; // Reduced size to accommodate gaps
  const gap = 'gap-1'; // Equal X and Y gaps between circles

  return (
    <Card className={`bg-black border-zinc-800/50 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Monthly Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="w-full">
              <div className={`grid grid-cols-7 ${gap} mb-2 justify-items-center`}>
                {daysOfWeek.map((day, i) => (
                  <div key={day} className="text-xs text-zinc-500">
                    {isMobile ? day.charAt(0) : day}
                  </div>
                ))}
              </div>

              <TooltipProvider>
                <div className={`grid grid-cols-7 ${gap} justify-items-center`}>
                  {grid.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
                      // Empty slots (before/after month) are gray
                      if (!day) {
                        return (
                          <div
                            key={`empty-${weekIndex}-${dayIndex}`}
                            className={`${circleSize} rounded-full bg-gray-900 opacity-50`}
                          />
                        );
                      }

                      return (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={`${circleSize} rounded-full cursor-pointer transition-all duration-200 transform hover:scale-125 hover:z-10 ${
                                day.isActive
                                  ? 'bg-green-500 hover:bg-green-400'
                                  : 'bg-red-500 hover:bg-red-400'
                              }`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              style={{ transformOrigin: 'center' }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="text-xs font-medium bg-zinc-900 border-zinc-700 z-50 shadow-lg animate-in fade-in-50 zoom-in-95"
                          >
                            <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                            <p>
                              {day.isActive
                                ? `${day.count} contribution${day.count !== 1 ? 's' : ''}`
                                : 'No activity'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  )}
                </div>
              </TooltipProvider>

              <div className="mt-3 flex items-center justify-between pt-1 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Inactive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;