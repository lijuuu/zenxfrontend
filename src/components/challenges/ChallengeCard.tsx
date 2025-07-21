import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Copy, Users, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formattedDate";
import avatarIcon from "@/assets/avatar.png";

interface ChallengeCardProps {
  challenge: any;
  creatorProfile: any;
  isLoadingCreators: boolean;
  creatorError: any;
  loadChallenge: (id: string) => void;
  copyRoomUrl: (challenge: any) => void;
  actions?: React.ReactNode;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  creatorProfile,
  isLoadingCreators,
  creatorError,
  loadChallenge,
  copyRoomUrl,
  actions,
}) => {
  const navigate = useNavigate();

  if (!challenge?.challengeId || !challenge?.creatorId) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
    >
      <Card
        key={challenge.challengeId}
        className={cn(
          "cursor-pointer backdrop-blur-lg bg-black/40 border border-gray-600/50 shadow-lg transition-colors duration-200 group rounded-xl hover:border-green-500"
        )}
        onClick={() => loadChallenge(challenge.challengeId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && loadChallenge(challenge.challengeId)}
      >
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-200">
                {challenge.title || "Untitled Challenge"}
                {challenge.isPrivate && (
                  <Lock className="h-4 w-4 text-yellow-400" aria-label="Private challenge" />
                )}
              </CardTitle>
            </div>
            <CardDescription className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Created: {challenge.startTimeUnix ? formatDate(new Date(challenge.startTimeUnix * 1000)) : "Unknown"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {isLoadingCreators ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Loading creator profile" />
              ) : creatorError || !creatorProfile?.userName ? (
                <div className="w-8 h-8 rounded-full bg-green-900/40 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-400" aria-hidden="true" />
                </div>
              ) : (
                <img
                  src={creatorProfile.avatarURL || avatarIcon || "https://via.placeholder.com/32"}
                  alt={`${creatorProfile.userName || "Creator"}'s avatar`}
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (creatorProfile.userName) {
                      navigate(`/profile/${creatorProfile.userName}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && creatorProfile.userName) {
                      e.stopPropagation();
                      navigate(`/profile/${creatorProfile.userName}`);
                    }
                  }}
                  onError={() => console.error("Failed to load creator avatar")}
                />
              )}
              <div>
                {isLoadingCreators ? (
                  <p className="text-sm font-medium text-gray-200">Loading...</p>
                ) : creatorError || !creatorProfile?.userName ? (
                  <p className="text-sm font-medium text-gray-200">
                    Creator ID: {challenge.creatorId.substring(0, 8)}...
                  </p>
                ) : (
                  <p
                    className="text-sm font-medium text-gray-200 cursor-pointer hover:underline hover:text-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (creatorProfile.userName) {
                        navigate(`/profile/${creatorProfile.userName}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && creatorProfile.userName) {
                        e.stopPropagation();
                        navigate(`/profile/${creatorProfile.userName}`);
                      }
                    }}
                  >
                    {creatorProfile.userName}
                  </p>
                )}
                <p className="text-xs text-gray-400">Challenge Creator</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-semibold text-gray-200">Problems: {challenge.problemCount || 0}</p>
              <p className="text-sm font-semibold text-gray-200 flex items-center justify-end gap-1">
                <Users className="h-4 w-4" aria-hidden="true" />
                {Object.keys(challenge.participants || {}).length} participants
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-xs text-gray-400 flex items-center justify-between"
          >
            <span>Room ID: {challenge.challengeId.substring(0, 8)}...</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 p-0 text-gray-300 hover:text-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                copyRoomUrl(challenge);
              }}
              aria-label="Copy room information"
            >
              <Copy className="h-3 w-3 mr-1" />
            </Button>
          </motion.div>
        </CardContent>
        {actions && <CardFooter className="flex justify-end">{actions}</CardFooter>}
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;