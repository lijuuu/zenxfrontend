import React from "react";

interface ParticipantMeta {
  userId?: string;
  firstName?: string;
  profileImage?: string;
}

interface ParticipantsPanelProps {
  participants: ParticipantMeta[] | undefined;
}

const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({ participants }) => {
  return (
    <div className="border border-zinc-800/50 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Participants</h2>
        <span className="text-xs text-zinc-400">{participants?.length || 0}</span>
      </div>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {participants && participants.length > 0 ? (
          participants.map((p, idx) => (
            <div key={p.userId || idx.toString()} className="flex items-center gap-2 p-2 rounded-md border border-zinc-800/60">
              <img src={p.profileImage || "/avatar.png"} className="h-6 w-6 rounded-full border border-zinc-800" />
              <span className="text-sm truncate">{p.firstName || (p.userId ? p.userId.substring(0, 8) : "-")}</span>
            </div>
          ))
        ) : (
          <div className="text-xs text-zinc-500">No participants yet.</div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPanel;


