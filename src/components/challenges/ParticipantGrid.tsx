import React from "react";
import { Users } from "lucide-react";

interface ParticipantMeta {
  userId?: string;
  firstName?: string;
  profileImage?: string;
}

interface ParticipantGridProps {
  participants: ParticipantMeta[];
  maxParticipants?: number;
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({ 
  participants, 
  maxParticipants = 30 
}) => {
  const squares = Array.from({ length: maxParticipants }, (_, i) => {
    const participant = participants[i];
    return { index: i, participant };
  });

  return (
    <div className="border border-zinc-800/50 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Participants
        </h2>
        <span className="text-xs text-zinc-400">
          {participants.length}/{maxParticipants}
        </span>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {squares.map(({ index, participant }) => (
          <div
            key={index}
            className={`
              aspect-square rounded-md border transition-all duration-200
              ${participant 
                ? 'border-primary/40 bg-primary/10 hover:border-primary/60 hover:bg-primary/20' 
                : 'border-zinc-800/60 bg-zinc-900/40'
              }
            `}
          >
            {participant ? (
              <div className="w-full h-full flex items-center justify-center p-1 group relative">
                <img 
                  src={participant.profileImage || "/avatar.png"} 
                  alt={participant.firstName || "User"}
                  className="w-full h-full rounded object-cover"
                />
                <div className="absolute inset-0 bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-2xs text-center px-1 truncate">
                    {participant.firstName || participant.userId?.substring(0, 6)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-800/60"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantGrid;
