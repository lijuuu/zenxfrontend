
import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, getDay, getDaysInMonth, addMonths, subMonths, isSameMonth, addDays, subDays } from 'date-fns';
import { Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/useMobile';
import { useMonthlyActivity } from '@/services/useMonthlyActivityHeatmap';

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
  userId?: string;
  staticMode?: boolean;
  variant?: 'default' | 'dashboard' | 'profile';
}

const useFetchMonthData = (userId = '', initialDate: Date) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);

  // Get fallback user ID from localStorage if needed
  const effectiveUserID = userId || localStorage.getItem('userid') || '';

  const currentMonth = useMonthlyActivity(
    effectiveUserID,
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear()
  );

  useEffect(() => {
    if (currentMonth.data) {
      const normalizeData = (data: any) => {
        return data.map((day: any) => ({
          date: day.date,
          count: day.count || 0,
          isActive: day.isActive || false,
        }));
      };
      const normalizedData = normalizeData(currentMonth?.data || []);
      setActivityData(normalizedData);
    }
  }, [currentMonth.data]);

  const setNewDate = (date: Date) => setSelectedDate(date);

  return {
    activityData,
    setNewDate,
    selectedDate,
    isLoading: currentMonth.isLoading,
    isError: currentMonth.isError,
    error: currentMonth.error
  };
};

const SkeletonGrid = ({ weeksNeeded, compact }: { weeksNeeded: number, compact?: boolean }) => {
  const circleSize = compact ? 'w-8 h-8' : 'w-10 h-10';
  const gap = 'gap-1';
  return (
    <div className={`grid grid-cols-7 ${gap} justify-items-center`}>
      {Array.from({ length: weeksNeeded }).map((_, weekIndex) =>
        Array.from({ length: 7 }).map((_, dayIndex) => (
          <div
            key={`skeleton-${weekIndex}-${dayIndex}`}
            className={`${circleSize} rounded-full bg-gray-700 animate-pulse`}
          />
        ))
      )}
    </div>
  );
};

const MonthlyActivityHeatmap: React.FC<MonthlyActivityHeatmapProps> = ({
  data: propData,
  className = "",
  showTitle = true,
  compact = false,
  userId = "",
  staticMode = false,
  variant = 'default'
}) => {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const isMobile = useIsMobile();

  // Get a fallback user ID if none is provided
  const {
    activityData,
    setNewDate,
    selectedDate,
    isLoading,
    isError,
    error
  } = useFetchMonthData(userId, new Date());

  const createDynamicGrid = () => {
    const start = startOfMonth(selectedDate);
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(start);
    const weeksNeeded = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

    const grid = Array(weeksNeeded).fill(null).map(() => Array(7).fill(null));
    const dateToData = new Map(activityData.map(d => [d.date, d]));

    let currentDate = subDays(start, firstDayOfMonth);

    for (let week = 0; week < weeksNeeded; week++) {
      for (let day = 0; day < 7; day++) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        if (isSameMonth(currentDate, start)) {
          grid[week][day] = dateToData.get(dateStr) || { date: dateStr, count: 0, isActive: false };
        } else {
          grid[week][day] = null;
        }
        currentDate = addDays(currentDate, 1);
      }
    }

    return grid;
  };

  const grid = createDynamicGrid();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const circleSize = compact ? 'w-8 h-8' : 'w-10 h-10';
  const gap = 'gap-1';

  const weeksNeeded = Math.ceil((getDaysInMonth(selectedDate) + getDay(startOfMonth(selectedDate))) / 7);

  // Determine card styling based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'dashboard':
        return 'bg-zinc-900/30 border-zinc-800/40 backdrop-blur-sm shadow-sm';
      case 'profile':
        return 'bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm';
      default:
        return 'bg-black border-zinc-800/50';
    }
  };

  if (isLoading) {
    return (
      <Card className={`${getCardStyles()} ${className}`}>
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
            {!staticMode && (
              <div className="flex justify-between items-center mb-2">
                <button className="px-2 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700">Previous</button>
                <span className="text-sm text-zinc-400">{format(selectedDate, 'MMMM yyyy')}</span>
                <button className="px-2 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700">Next</button>
              </div>
            )}
            {staticMode && (
              <div className="mb-2 text-center">
                <span className="text-sm text-zinc-400">{format(selectedDate, 'MMMM yyyy')}</span>
              </div>
            )}
            <div className="flex justify-center">
              <div className="w-full">
                <div className={`grid grid-cols-7 ${gap} mb-2 justify-items-center`}>
                  {daysOfWeek.map((day, i) => (
                    <div key={day} className="text-xs text-zinc-500">
                      {isMobile || compact ? day.charAt(0) : day}
                    </div>
                  ))}
                </div>
                <SkeletonGrid weeksNeeded={weeksNeeded} compact={compact} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={`${getCardStyles()} ${className}`}>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-zinc-400 mb-2">Unable to load activity data</p>
            <p className="text-sm text-zinc-500">{error?.message || "Please try again later"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getCardStyles()} ${className}`}>
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
          {!staticMode ? (
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setNewDate(subMonths(selectedDate, 1))}
                className="px-2 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-400">
                {format(selectedDate, 'MMMM yyyy')}
              </span>
              <button
                onClick={() => setNewDate(addMonths(selectedDate, 1))}
                className="px-2 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="mb-2 text-center">
              <span className="text-sm text-zinc-400">{format(selectedDate, 'MMMM yyyy')}</span>
            </div>
          )}
          <div className="flex justify-center">
            <div className="w-full">
              <div className={`grid grid-cols-7 ${gap} mb-2 justify-items-center`}>
                {daysOfWeek.map((day, i) => (
                  <div key={day} className="text-xs text-zinc-500">
                    {isMobile || compact ? day.charAt(0) : day}
                  </div>
                ))}
              </div>

              <TooltipProvider>
                <div className={`grid grid-cols-7 ${gap} justify-items-center`}>
                  {grid.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
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
                              className={`${circleSize} rounded-full cursor-pointer transition-all duration-200 transform hover:scale-125 hover:z-10 ${day.isActive
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
