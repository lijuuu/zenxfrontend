
import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ChallengeDocument } from '@/api/challengeTypes';
import EventFeed from './EventFeed';
import ChallengeStatusCard from './ChallengeStatusCard';
// import ProblemsList from './ProblemsList';
import LeaderboardCard from './LeaderboardCard';
// import ChallengeActions from './ChallengeActions';

interface Event {
  type: string;
  message: string;
  username?: string;
  problemName?: string;
  id: number;
}

interface ChallengeOverviewProps {
  challenge: ChallengeDocument;
  events: Event[];
  selectedProblemId: string | null;
  onRemoveEvent: (id: number) => void;
  onTimeWarning: () => void;
  onTimeUp: () => void;
  onProblemSelect: (problemId: string) => void;
  onStartChallenge: () => void;
  onForfeitChallenge: () => void;
}

const ChallengeOverview: React.FC<ChallengeOverviewProps> = ({
  challenge,
  events,
  selectedProblemId,
  onRemoveEvent,
  onTimeWarning,
  onTimeUp,
  onProblemSelect,
  onStartChallenge,
  onForfeitChallenge
}) => {
  const user = useAppSelector(state => state.auth.userProfile);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Left column - Events feed and Problems */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Feed Card */}
          <Card className="overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardHeader className="pb-2 border-b border-zinc-800/60">
              <CardTitle className="text-lg flex items-center">
                <FileCode className="h-5 w-5 text-primary mr-2" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <EventFeed events={events} onRemoveEvent={onRemoveEvent} />
            </CardContent>
          </Card>

          {/* Challenge Status Card */}
          <Card className="overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardHeader className="pb-2 border-b border-zinc-800/60">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                Challenge Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChallengeStatusCard 
                challenge={challenge} 
                onTimeWarning={onTimeWarning} 
                onTimeUp={onTimeUp} 
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Problems Card - Commented out, use ActiveChallenge page instead */}
        {/* <Card className="overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <ProblemsList 
            problemIds={challenge.processedProblemIds}
            selectedProblemId={selectedProblemId}
            onProblemSelect={onProblemSelect}
          />
        </Card> */}
      </div>

      {/* Right column - Leaderboard and Actions */}
      <div className="space-y-6">
        <LeaderboardCard 
          entries={challenge.leaderboard || []} 
          currentUserId={user?.userId}
          className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950"
        />

        {/* Actions Card - Commented out, use ActiveChallenge page instead */}
        {/* <Card className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardHeader className="pb-2 border-b border-zinc-800/60">
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChallengeActions 
              challenge={challenge} 
              currentUserId={user?.userId}
              onStartChallenge={onStartChallenge}
              onForfeitChallenge={onForfeitChallenge}
            />
          </CardContent>
        </Card> */}
      </div>
    </motion.div>
  );
};

export default ChallengeOverview;
