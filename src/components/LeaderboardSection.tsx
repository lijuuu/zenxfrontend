
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Medal, ChevronRight } from "lucide-react";
import { getLeaderboard } from "@/api/leaderboardApi";

const LeaderboardSection = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboardPreview', activeTab],
    queryFn: () => getLeaderboard({ 
      limit: 5, 
      period: activeTab as 'weekly' | 'monthly' | 'all' 
    }),
  });

  const leaderboardData = data?.leaderboard || [];

  return (
    <section className="section-spacing bg-zinc-900">
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="inline-block mb-4">
              <div className="bg-green-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-green-400">
                Rankings
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              Top Performers
            </h2>
            
            <p className="text-lg text-zinc-400 max-w-xl">
              See who's leading the pack and get inspired to improve your own performance.
            </p>
          </div>
          
          <div className="inline-flex bg-zinc-800 p-1 rounded-full border border-zinc-700">
            <button
              onClick={() => setActiveTab("daily")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "daily" 
                  ? "bg-zinc-700 text-white" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "weekly" 
                  ? "bg-zinc-700 text-white" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "monthly" 
                  ? "bg-zinc-700 text-white" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-800/50 backdrop-blur-lg rounded-xl border border-zinc-700/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700/50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-5 h-5 bg-zinc-700 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-zinc-700 rounded-full"></div>
                          <div className="ml-4">
                            <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                            <div className="h-3 w-16 bg-zinc-700 rounded mt-2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 w-12 bg-zinc-700 rounded ml-auto"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 w-10 bg-zinc-700 rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  leaderboardData.map((user, index) => (
                    <tr key={user.user.id} className="transition-colors hover:bg-zinc-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 ? (
                            <Trophy className="w-5 h-5 text-amber-500" />
                          ) : index === 1 ? (
                            <Medal className="w-5 h-5 text-zinc-400" />
                          ) : index === 2 ? (
                            <Medal className="w-5 h-5 text-amber-700" />
                          ) : (
                            <span className="text-sm font-medium text-zinc-400">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700">
                            <img src={user.user.profileImage} alt={user.user.fullName} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.user.fullName}</div>
                            <div className="text-xs text-zinc-500">@{user.user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-white">{user.score.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-emerald-400">
                          +{Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 9)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="py-4 px-6 border-t border-zinc-700/50 bg-zinc-800/30">
            <Link 
              to="/leaderboard"
              className="text-sm font-medium text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors group"
            >
              View full leaderboard
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
