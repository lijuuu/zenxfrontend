
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Trophy, Medal, ChevronRight, Flag } from "lucide-react";
import { useSelector } from "react-redux";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const LeaderboardSection = () => {
  const [activeTab, setActiveTab] = useState("global");
  const authState = useSelector((state: any) => state.auth);
  const userId = authState?.userProfile?.userID || authState?.userID;

  const { data, isLoading, error } = useLeaderboard(userId);

  const leaderboardData = activeTab === "global" 
    ? data?.TopKGlobal?.slice(0, 5) || []
    : data?.TopKEntity?.slice(0, 5) || [];

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
              onClick={() => setActiveTab("global")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "global" 
                  ? "bg-zinc-700 text-white" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Global
            </button>
            <button
              onClick={() => setActiveTab("country")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === "country" 
                  ? "bg-zinc-700 text-white" 
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Country
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
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-zinc-400">
                      Failed to load leaderboard data. Please try again later.
                    </td>
                  </tr>
                ) : (
                  leaderboardData.map((user, index) => (
                    <tr key={user.UserId} className="transition-colors hover:bg-zinc-700/30">
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
                            <img src={user.AvatarURL} alt={user.UserName} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.UserName}</div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1">
                              <Flag className="w-3 h-3" /> {user.Entity.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-white">{user.Score.toLocaleString()}</div>
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
