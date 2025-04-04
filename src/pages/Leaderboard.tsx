
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchLeaderboard, fetchFriendsLeaderboard, setCurrentPage } from '@/store/slices/leaderboardSlice';
import MainNavbar from '@/components/MainNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Medal, Users, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';

const Leaderboard = () => {
  const dispatch = useAppDispatch();
  const { entries, loading, error, totalEntries, currentPage, period } = useAppSelector((state) => state.leaderboard);
  const [view, setView] = useState<'global' | 'friends'>('global');
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "all">("weekly");
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  useEffect(() => {
    if (view === 'global') {
      dispatch(fetchLeaderboard({ page: currentPage, limit: itemsPerPage, period: selectedPeriod }));
    } else {
      // Map our internal period to the API period format
      const apiPeriod = selectedPeriod === "weekly" ? "weekly" : 
                        selectedPeriod === "monthly" ? "monthly" : 
                        "all-time";
      dispatch(fetchFriendsLeaderboard(apiPeriod));
    }
  }, [dispatch, view, currentPage, selectedPeriod]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handlePeriodChange = (newPeriod: "weekly" | "monthly" | "all") => {
    setSelectedPeriod(newPeriod);
    dispatch(setCurrentPage(1)); // Reset to page 1 when changing period
  };

  const handleViewChange = (newView: 'global' | 'friends') => {
    setView(newView);
    dispatch(setCurrentPage(1)); // Reset to page 1 when changing view
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted-foreground">See who's leading the pack in solving challenges</p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button
                variant={view === 'global' ? "default" : "outline"}
                onClick={() => handleViewChange('global')}
                className="flex items-center"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Global
              </Button>
              <Button
                variant={view === 'friends' ? "default" : "outline"}
                onClick={() => handleViewChange('friends')}
                className="flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Friends
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue={selectedPeriod} onValueChange={(value: "weekly" | "monthly" | "all") => handlePeriodChange(value)}>
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading leaderboard data. Please try again.</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-md">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No data available</h3>
              <p className="text-muted-foreground">
                {view === 'friends' ? 'Add friends to see them on the leaderboard!' : 'No users found for this period.'}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-muted/20 rounded-md overflow-hidden border border-border/60">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Problems</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Contests</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {entries.map((entry, index) => (
                      <tr key={entry.user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Medal className={`h-5 w-5 mr-1.5 ${
                                index === 0 ? 'text-yellow-400' : 
                                index === 1 ? 'text-gray-400' : 
                                'text-amber-600'
                              }`} />
                            ) : (
                              <span className="text-sm font-medium text-muted-foreground ml-1.5 mr-2.5">{entry.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={entry.user.profileImage} alt={entry.user.username} />
                              <AvatarFallback>{entry.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-foreground">{entry.user.username}</div>
                              <div className="text-xs text-muted-foreground">{entry.user.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-primary">{entry.score}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-foreground">{entry.problemsSolved}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center hidden md:table-cell">
                          <span className="text-sm text-foreground">{entry.contestsParticipated}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center hidden md:table-cell">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {entry.streakDays} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {view === 'global' && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-border/50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-border/50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Leaderboard;
