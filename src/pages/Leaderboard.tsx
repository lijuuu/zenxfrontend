import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchLeaderboard } from '@/store/slices/leaderboardSlice';
import { LeaderboardEntry } from '@/api/types';
import MainNavbar from '@/components/MainNavbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Verified } from 'lucide-react';
import { cn } from '@/lib/utils';

const Leaderboard = () => {
  const dispatch = useAppDispatch();
  const { globalLeaderboard, status } = useAppSelector(state => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard({ period: "weekly" }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        
        {status === 'loading' ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : status === 'succeeded' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Problems Solved
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                {globalLeaderboard.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          <AvatarImage src={entry.avatarURL} alt={entry.userName} />
                          <AvatarFallback>{entry.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          {entry.userName}
                          {entry.isVerified && (
                            <Verified className="h-4 w-4 text-blue-500 ml-1" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {entry.currentRating || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {entry.problemsSolved || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-zinc-500">
            Error loading leaderboard data. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
