
import { useEffect, useState } from 'react';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO, subDays, eachDayOfInterval, getDay, startOfYear, endOfYear, getYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

interface ActivityDay {
  date: string;
  count: number;
  level: ActivityLevel;
}

interface ContributionProps {
  className?: string;
  showTitle?: boolean;
}

const ContributionActivity = ({ className, showTitle = true }: ContributionProps) => {
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Generate mock activity data for the selected year
    const year = currentYear;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    if (endDate > new Date()) {
      endDate.setTime(new Date().getTime());
    }
    
    const days = eachDayOfInterval({ 
      start: startDate, 
      end: endDate 
    });
    
    const generatedData: ActivityDay[] = days.map(day => {
      // More activity on weekends and random distribution
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      let randomWeight = Math.random();
      if (isWeekend) randomWeight *= 1.5;
      
      // Higher chance of activity in recent days
      const daysFromStart = Math.floor((day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const recencyBoost = Math.min(1, (days.length - daysFromStart) / 100);
      randomWeight *= recencyBoost;
      
      // Random activity count between 0 and 10
      const count = Math.floor(randomWeight * 10);
      
      // Determine activity level based on count
      let level: ActivityLevel = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;
      
      return {
        date: format(day, 'yyyy-MM-dd'),
        count,
        level
      };
    });
    
    setActivityData(generatedData);
  }, [currentYear]);

  // Function to get color based on activity level
  const getColor = (level: ActivityLevel) => {
    switch (level) {
      case 0: return 'bg-zinc-800 hover:bg-zinc-700';
      case 1: return 'bg-green-900 hover:bg-green-800';
      case 2: return 'bg-green-700 hover:bg-green-600';
      case 3: return 'bg-green-600 hover:bg-green-500';
      case 4: return 'bg-green-500 hover:bg-green-400';
      default: return 'bg-zinc-800 hover:bg-zinc-700';
    }
  };

  // Format calendar data for rendering
  const formatCalendarData = () => {
    const calendarData = [];
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get first day of each month for month labels
    const months = [];
    let currentMonth = -1;
    
    for (const day of activityData) {
      const date = parseISO(day.date);
      const month = date.getMonth();
      
      if (month !== currentMonth) {
        months.push({
          month,
          index: months.length,
          label: monthLabels[month]
        });
        currentMonth = month;
      }
    }
    
    // Group days by week
    const weeks: ActivityDay[][] = [];
    let currentWeek: ActivityDay[] = [];
    let lastDay = 0;
    
    for (const day of activityData) {
      const date = parseISO(day.date);
      const dayOfWeek = date.getDay();
      
      // Start a new week when we hit Sunday (0) unless it's the first entry
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      lastDay = dayOfWeek;
    }
    
    // Add the last week if it's not empty
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek]);
    }
    
    return { weeks, months };
  };
  
  const { weeks, months } = formatCalendarData();
  
  // Function to get the last 30 days for monthly view
  const getMonthlyData = () => {
    const today = new Date();
    const startDate = subDays(today, 29);
    
    return activityData.filter(day => {
      const date = parseISO(day.date);
      return date >= startDate && date <= today;
    });
  };
  
  const monthlyData = getMonthlyData();
  
  // Group the monthly data into weeks
  const groupedMonthlyData = monthlyData.reduce<ActivityDay[][]>((acc, day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(day);
    return acc;
  }, []);
  
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
    <Card className={cn("bg-zinc-900/60 border-zinc-800/50", className)}>
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
        <Tabs defaultValue="yearly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border-zinc-700">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-green-500">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-green-500">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-3">
            <div className="flex flex-col">
              <div className="grid grid-cols-7 gap-1 mb-2 justify-items-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-xs text-zinc-500 text-center">
                    {day}
                  </div>
                ))}
              </div>
              
              <TooltipProvider>
                <div className="space-y-2">
                  {groupedMonthlyData.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1 justify-items-center">
                      {week.map((day) => (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`w-8 h-8 rounded-md transition-colors cursor-pointer ${getColor(day.level)}`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                            <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                            <p>{day.count} {day.count === 1 ? 'contribution' : 'contributions'}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-4">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="flex justify-center mb-1 text-xs text-zinc-500">
                  {months.map((month) => (
                    <div key={month.index} className="w-7">{month.label}</div>
                  ))}
                </div>
                
                <div className="flex gap-y-2">
                  <div className="grid grid-rows-7 grid-flow-row gap-1 mr-2 text-xs text-zinc-500">
                    <div></div>
                    <div>Mon</div>
                    <div></div>
                    <div>Wed</div>
                    <div></div>
                    <div>Fri</div>
                    <div></div>
                  </div>
                  
                  <TooltipProvider>
                    <div className="flex gap-1">
                      {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array(7).fill(0).map((_, dayIndex) => {
                            const day = week.find((d) => {
                              const date = parseISO(d.date);
                              return date.getDay() === dayIndex;
                            });
                            
                            if (!day) {
                              return <div key={dayIndex} className="w-3 h-3"></div>;
                            }
                            
                            return (
                              <Tooltip key={dayIndex}>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={`w-3 h-3 rounded-sm transition-colors cursor-pointer ${getColor(day.level)}`}
                                    onMouseEnter={() => setHoveredDay(day)}
                                    onMouseLeave={() => setHoveredDay(null)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs font-medium bg-zinc-900 border-zinc-700">
                                  <p>{format(parseISO(day.date), 'MMMM d, yyyy')}</p>
                                  <p>{day.count} {day.count === 1 ? 'contribution' : 'contributions'}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            {hoveredDay && (
              <div className="mt-2 text-sm font-medium animate-fade-in">
                <span className="mr-2 text-zinc-400">{format(parseISO(hoveredDay.date), 'MMMM d, yyyy')}:</span>
                <span className="text-green-400">{hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 text-xs text-zinc-500">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-zinc-800"></div>
                <div className="w-3 h-3 rounded-sm bg-green-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              </div>
              <span>More</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContributionActivity;
