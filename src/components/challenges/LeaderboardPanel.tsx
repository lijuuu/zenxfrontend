import React from "react";

interface LeaderboardEntry {
  userId?: string;
  username?: string;
  score?: number;
  rank?: number;
}

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[] | undefined;
  currentUserId?: string;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ entries, currentUserId }) => {
  const list = Array.isArray(entries) ? entries : [];
  return (
    <div className="border border-zinc-800/50 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Leaderboard</h2>
        <span className="text-xs text-zinc-400">Top {list.length}</span>
      </div>
      <div className="p-3 space-y-2">
        {list.length > 0 ? (
          list.map((e, idx) => (
            <div
              key={e.userId || idx}
              className={`flex items-center justify-between p-2 rounded border border-zinc-800/60 ${currentUserId && e.userId === currentUserId ? "bg-primary/10" : ""
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400 w-6">{e.rank ?? idx + 1}</span>
                <span className="text-sm">{e.username || (e.userId ? e.userId.substring(0, 8) : "-")}</span>
              </div>
              <div className="text-sm font-medium">{e.score ?? 0}</div>
            </div>
          ))
        ) : (
          <div className="text-xs text-zinc-500">No entries yet.</div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPanel;


