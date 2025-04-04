import React, { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval, subMonths, getMonth, getDay, startOfYear, endOfYear, subYears, isToday } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

type HeatmapDataPoint = {
  date: string;
  count: number;
  isActive: boolean;
  level: ActivityLevel;
};

interface YearlyActivityHeatmapProps {
  data?: HeatmapDataPoint[];
  className?: string;
  showTitle?: boolean;
}

const YearlyActivityHeatmap: React.FC<YearlyActivityHeatmapProps> = ({ data, className, showTitle = true }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activityData, setActivityData] = useState<HeatmapDataPoint[]>([]);
  const [monthlyView, setMonthlyView] = useState<HeatmapDataPoint[]>([]);
  const [yearlyView, setYearlyView] = useState<HeatmapDataPoint[]>([]);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDataPoint | null>(null);
  
  // Get activity level based on count
  const getActivityLevel = (count: number): ActivityLevel => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };
  
  useEffect(() => {
    // Generate data if none provided
    if (!data) {
      const today = new Date();
      const startDate = subYears(today, 1);
      
      const days = eachDayOfInterval({ 
        start: startDate, 
        end: today 
      });
      
      const generatedData: HeatmapDataPoint[] = days.map(day => {
        // Random activity (70% chance of being active)
        const isActive = Math.random() > 0.3;
        const count = isActive ? Math.floor(Math.random() * 10) + 1 : 0;
        
        return {
          date: format(day, 'yyyy-MM-dd'),
          count,
          isActive,
          level: getActivityLevel(count)
        };
      });
      
      setActivityData(generatedData);
    } else {
      // Convert provided data to make sure it has activity level
      const processedData = data.map(item => ({
        ...item,
        level: getActivityLevel(item.count)
      }));
      setActivityData(processedData);
    }
  }, [data]);
  
  useEffect(() => {
    // Filter data for current year for yearly view
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);
    
    // Create complete yearly dataset with all days
    const allDaysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    // Create a map of existing activity data
    const activityMap = new Map();
    activityData.forEach(item => {
      activityMap.set(item.date, item);
    });
    
    // Build yearly view with all days, using activity data where available
    const fullYearData = allDaysInYear.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (activityMap.has(dateStr)) {
        return activityMap.get(dateStr);
      }
      
      // Default data for days without activity
      return {
        date: dateStr,
        count: 0,
        isActive: false,
        level: 0 as ActivityLevel
      };
    });
    
    setYearlyView(fullYearData);
    
    // Filter last 30 days for monthly view
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const monthlyData = activityData.filter(item => {
      const itemDate = parseISO(item.date);
      return itemDate >= lastMonth && itemDate <= today;
    });
    
    // Add empty days if needed to complete the monthly view
    const allDaysInMonth = eachDayOfInterval({ start: lastMonth, end: today });
    const monthActivityMap = new Map();
    monthlyData.forEach(item => {
      monthActivityMap.set(item.date, item);
    });
    
    const fullMonthData = allDaysInMonth.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (monthActivityMap.has(dateStr)) {
        return monthActivityMap.get(dateStr);
      }
      
      return {
        date: dateStr,
        count: 0,
        isActive: false,
        level: 0 as ActivityLevel
      };
    });
    
    setMonthlyView(fullMonthData);
    
  }, [activityData, currentYear]);
  
  // Group days by week for the monthly view
  const groupedByWeek = monthlyView.reduce<HeatmapDataPoint[][]>((acc, day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(day);
    return acc;
  }, []);
  
  // Group days for the yearly calendar view
  const getYearlyCalendarData = () => {
    const { calendar, monthNames, dayNames } = {
      calendar: Array(7).fill(null).map(() => Array(53).fill(null)),
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
    
    // Organize data into the calendar grid
    yearlyView.forEach(day => {
      const date = parseISO(day.date);
      
      // Get the day of the week (0-6)
      const dayOfWeek = getDay(date);
      
      // Approximate the week of the year
      const startOfYearDate = startOfYear(date);
      const dayOfYear = Math.floor((date.getTime() - startOfYearDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekOfYear = Math.floor(dayOfYear / 7);
      
      // Place the day in the calendar
      calendar[dayOfWeek][weekOfYear] = day;
    });
    
    return { calendar, monthNames, dayNames };
  };
  
  const { calendar, monthNames, dayNames } = getYearlyCalendarData();
  
  // Get color for the activity level
  const getLevelColor = (level: ActivityLevel, isActive: boolean): string => {
    if (!isActive) return 'bg-red-500 hover:bg-red-600';
    
    switch (level) {
      case 0: return 'bg-zinc-800 hover:bg-zinc-700';
      case 1: return 'bg-green-900 hover:bg-green-800';
      case 2: return 'bg-green-700 hover:bg-green-600';
      case 3: return 'bg-green-600 hover:bg-green-500';
      case 4: return 'bg-green-500 hover:bg-green-400';
      default: return 'bg-zinc-800 hover:bg-zinc-700';
    }
  };
  
  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };
  
  const handleNextYear = () => {
    const nextYear = currentYear + 1;
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
    }
  };
  
  return (
    <Card className={`bg-zinc-900/60 border-zinc-800/50 ${className}`}>
      {showTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Activity Heatmap
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 border-zinc-700"
                onClick={handlePrevYear}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{currentYear}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 border-zinc-700"
                onClick={handleNextYear}
                disabled={currentYear >= new Date().getFullYear()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border-zinc-700">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-green-500">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-green-500">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-3">
            <div className="flex flex-col space-y-1">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-xs text-zinc-500 text-center">
                    {day}
                  </div>
                ))}
              </div>
              
              <TooltipProvider>
                <div className="space-y-1">
                  {groupedByWeek.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                      {week.map((day) => (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`aspect-square w-5 h-5 rounded-sm transition-all cursor-pointer ${
                                day.isActive 
                                  ? 'bg-green-500 hover:scale-110' 
                                  : 'bg-red-500 hover:scale-110'
                              }`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                            <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                            <p>
                              {day.isActive 
                                ? `${day.count} contribution${day.count !== 1 ? 's' : ''}` 
                                : 'No activity'
                              }
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
              
              {hoveredDay && (
                <div className="mt-2 text-sm font-medium animate-fade-in">
                  <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
                  {hoveredDay.isActive ? (
                    <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
                  ) : (
                    <span className="text-red-400">No activity</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm bg-red-500"></div>
                  <span>Inactive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm bg-green-500"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-3">
            <div className="overflow-x-auto pb-2">
              <div className="flex flex-col">
                {/* Month labels */}
                <div className="flex mb-1 pl-6">
                  {monthNames.map((month, i) => (
                    <div key={month} className="text-xs text-zinc-500 w-11 md:w-10">
                      {month}
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  {/* Day of week labels */}
                  <div className="flex flex-col justify-around mr-1 h-32">
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                      <div key={i} className="text-xs text-zinc-500 h-4">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="flex-1">
                    <TooltipProvider>
                      <div className="grid grid-cols-53 gap-[2px]">
                        {calendar.map((row, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                            {row.map((day, colIndex) => {
                              if (!day) return <div key={`empty-${rowIndex}-${colIndex}`} className="w-2 h-2" />;
                              
                              const date = parseISO(day.date);
                              const isTodays = isToday(date);
                              
                              return (
                                <Tooltip key={`${rowIndex}-${colIndex}`}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className={`w-2 h-2 rounded-sm transition-all cursor-pointer ${getLevelColor(day.level, day.isActive)} ${
                                        isTodays ? 'ring-1 ring-white' : ''
                                      }`}
                                      style={{ gridRow: rowIndex + 1, gridColumn: colIndex + 1 }}
                                      onMouseEnter={() => setHoveredDay(day)}
                                      onMouseLeave={() => setHoveredDay(null)}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                                    <p>{format(date, 'MMMM d, yyyy')}</p>
                                    <p>
                                      {day.isActive 
                                        ? `${day.count} contribution${day.count !== 1 ? 's' : ''}` 
                                        : 'No activity'
                                      }
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
            
            {hoveredDay && (
              <div className="mt-2 text-sm font-medium animate-fade-in">
                <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
                {hoveredDay.isActive ? (
                  <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
                ) : (
                  <span className="text-red-400">No activity</span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-sm bg-green-900"></div>
                <div className="w-2 h-2 rounded-sm bg-green-700"></div>
                <div className="w-2 h-2 rounded-sm bg-green-600"></div>
                <div className="w-2 h-2 rounded-sm bg-green-500"></div>
              </div>
              <span>More</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default YearlyActivityHeatmap;
