
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import {
  Trophy,
  RefreshCw,
  Globe,
  Flag,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardUser } from '@/api/leaderboardApi';
import { useToast } from '@/hooks/useToast';
import MainNavbar from '@/components/common/MainNavbar';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useProblemStats } from '@/services/useProblemStats';

const Leaderboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('global');
  const authState = useSelector((state: any) => state.auth);
  const userId = authState?.userProfile?.userId || authState?.userId;

  // Fetch leaderboard data using React Query
  const {
    data: leaderboardData,
    isLoading,
    error,
    refetch
  } = useLeaderboard(userId);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    refetch()
    // refreshLeaderboard()
  }, []);


  const refreshLeaderboard = () => {
    refetch();
    toast({
      title: "Leaderboard refreshed",
      description: "The latest rankings have been loaded.",
    });
  };


  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-amber-500" />;
    } else if (rank === 2) {
      return <Medal className="w-5 h-5 text-zinc-400" />;
    } else if (rank === 3) {
      return <Medal className="w-5 h-5 text-amber-700" />;
    } else {
      return <span className="text-sm font-medium text-zinc-400">{rank}</span>;
    }
  };


  const { data: problemStats, isLoading: statsLoading } = useProblemStats(userId);
  // Calculate total problems done
  const totalProblemsDone = problemStats ?
    problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount : 0;

  const UserRow = ({ user, rank }: { user: LeaderboardUser; rank: number }) => (
    <TableRow key={user.UserId} className="transition-colors hover:bg-zinc-800/50">
      <TableCell className="w-16">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900">
          <RankBadge rank={rank} />
        </div>
      </TableCell>

      <TableCell>
        <Link to={`/profile/${user.UserName}`} className="flex items-center group">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700">
            <img
              src={user.AvatarURL || "https://res.cloudinary.com/dcfoqhrxb/image/upload/v1751096235/demo/avatar_rlqkrp.jpg"}
              alt={user.UserName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="ml-4">
            <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
              {user.UserName}
            </div>

            {user.Entity && (
              <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <Flag className="w-3 h-3" />
                <span>{user.Entity.toUpperCase()}</span>
                <img
                  src={`https://flagcdn.com/24x18/${user.Entity.toLowerCase()}.png`}
                  alt={`${user.Entity} flag`}
                  className="ml-1 w-4 h-3 object-cover rounded-sm"
                />
              </div>
            )}
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-right">
        <div className="text-sm font-semibold text-white">{user.Score.toLocaleString()}</div>
      </TableCell>
    </TableRow>
  );


  if (isLoading) {
    return (
      <div className="pt-4 pb-16 bg-black">
        <MainNavbar />
        <div className="container px-4 mx-auto max-w-6xl pt-20">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
                  <Trophy className="hidden sm:inline h-8 w-8 text-green-400" />
                  Leaderboard
                </h1>
                <p className="text-zinc-400">
                  Track performance metrics and see where you stand among other users.
                </p>
              </div>

              <Button
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
                onClick={refreshLeaderboard}
                disabled={isLoading}
              >
                <RefreshCw className={cn(
                  "mr-2 h-4 w-4",
                  isLoading && "animate-spin"
                )} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl">
            <div className="p-8 flex items-center justify-center">
              <RefreshCw className="animate-spin h-8 w-8 text-green-500 mr-2" />
              <p className="text-zinc-300">Loading leaderboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 pb-16 bg-black">
        <MainNavbar />
        <div className="container px-4 mx-auto max-w-6xl pt-20">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
                  <Trophy className="hidden sm:inline h-8 w-8 text-green-400" />
                  Leaderboard
                </h1>
                <p className="text-zinc-400">
                  Track performance metrics and see where you stand among other users.
                </p>
              </div>

              <Button
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
                onClick={refreshLeaderboard}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl">
            <div className="p-8 text-center">
              <p className="text-zinc-400 mb-4">Failed to load leaderboard data.</p>
              <Button
                variant="outline"
                onClick={refreshLeaderboard}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-16 bg-black min-h-screen">
      <MainNavbar />
      {!isLoading && <div className="container px-4 mx-auto max-w-6xl pt-20">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
                <Trophy className="hidden sm:inline h-8 w-8 text-green-400" />
                Leaderboard
              </h1>
              <p className="text-zinc-400">
                Track performance metrics and see where you stand among other users.
              </p>
            </div>

            <Button
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800"
              onClick={refreshLeaderboard}
              disabled={isLoading}
            >
              <RefreshCw className={cn(
                "mr-2 h-4 w-4",
                isLoading && "animate-spin"
              )} />
              Refresh
            </Button>
          </div>
        </div>

        {leaderboardData && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-8">
            <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl p-6 col-span-1">
              <h3 className="text-xl font-bold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-700/30">
                  <span className="text-zinc-400">Username</span>
                  <span className="font-medium">{leaderboardData.UserName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-700/30">
                  <span className="text-zinc-400">Score</span>
                  <span className="font-medium">{leaderboardData.Score}</span>
                </div>
                {/* <div className="flex justify-between items-center pb-3 border-b border-zinc-700/30">
                  <span className="text-zinc-400">Problems Solved</span>
                  <span className="font-medium">{totalProblemsDone}</span>
                </div> */}
                <div className="flex justify-between items-center pb-3 border-b border-zinc-700/30">
                  <span className="text-zinc-400">Global Rank</span>
                   {/* the rank starts from 0 on the db, to make the frontend data easier to read we use +1 */}
                  <span className="font-medium">#{leaderboardData.GlobalRank + 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Country Rank</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{leaderboardData.EntityRank+1}</span>
                    {leaderboardData?.Entity && <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-500">{leaderboardData.Entity.toUpperCase()}</span>
                      <img src={`https://flagcdn.com/24x18/${leaderboardData.Entity?.toLowerCase()}.png`}></img>
                    </div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl lg:col-span-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center gap-4 p-4 border-b border-zinc-700/50">
                  <TabsList className="bg-zinc-900/50 border border-zinc-700">
                    <TabsTrigger value="global" className="data-[state=active]:bg-green-500">
                      <Globe className="w-4 h-4 mr-2" />
                      Global
                    </TabsTrigger>
                    <TabsTrigger value="country" className="data-[state=active]:bg-green-500">
                      <Flag className="w-4 h-4 mr-2" />
                      Country
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="global" className="mt-0">
                  {leaderboardData?.TopKGlobal && leaderboardData.TopKGlobal.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-zinc-700/50 bg-zinc-900/30">
                          <TableHead className="w-16 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</TableHead>
                          <TableHead className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</TableHead>
                          <TableHead className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboardData.TopKGlobal.map((user, index) => (
                          <UserRow key={user.UserId} user={user} rank={index + 1} />
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-zinc-400">No global leaderboard data available.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="country" className="mt-0">
                  {leaderboardData?.TopKEntity && leaderboardData.TopKEntity.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-zinc-700/50 bg-zinc-900/30">
                          <TableHead className="w-16 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</TableHead>
                          <TableHead className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</TableHead>
                          <TableHead className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboardData.TopKEntity.map((user, index) => (
                          <UserRow key={user.UserId} user={user} rank={index + 1} />

                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-zinc-400">No country leaderboard data available.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default Leaderboard;
