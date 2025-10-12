import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clipboard,
  ChevronRight,
  Lock,
  Users,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { fetchBulkProblemMetadata } from "@/services/useProblemList";
import avatarIcon from "@/assets/avatar.png";
import { useGetUserProfile } from "@/services/useGetUserProfile";

interface ChallengeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsModalOpen: (value: boolean) => void;
  challenge: any;
  setActiveChallengeId: (id: string | null) => void;
  copyRoomInfo: (challenge: any) => void;
  handleJoinChallenge: (challenge: any) => void;
  handleAbandonChallenge: (challenge: any) => void;
  creatorProfile: any;
  isLoadingCreator: boolean;
  isCreatorError: any;
}

const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  isOpen,
  onClose,
  setIsModalOpen,
  challenge,
  setActiveChallengeId,
  copyRoomInfo,
  handleJoinChallenge,
  handleAbandonChallenge,
  creatorProfile,
  isLoadingCreator,
  isCreatorError,
}) => {
  const [problemMetadata, setProblemMetadata] = useState([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const navigate = useNavigate();

  const { data: userProfile } = useGetUserProfile();

  console.log("active challenge ", challenge, " userprofile: ", userProfile)
  const isOwner = challenge?.creatorId == userProfile?.userId;

  useEffect(() => {
    const fetchMetadata = async () => {
      if (challenge?.processedProblemIds?.length) {
        setIsLoadingMetadata(true);
        try {
          const problems = await fetchBulkProblemMetadata(challenge.processedProblemIds);
          setProblemMetadata(problems || []);
          setMetadataError(null);
        } catch (error) {
          console.error("Failed to fetch problem metadata:", error);
          setMetadataError("Failed to load problem details");
          toast.error("Failed to load problem details", { duration: 1500 });
        } finally {
          setIsLoadingMetadata(false);
        }
      } else {
        setProblemMetadata([]);
      }
    };
    fetchMetadata();
  }, [challenge?.processedProblemIds]);

  if (!challenge || !challenge?.challengeId || !challenge?.processedProblemIds) {
    console.log("Invalid challenge data:", challenge);
    return (
      <div className="text-center py-4 text-gray-400">
        No active challenge available
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
          <motion.div
            className={cn(
              "bg-black/80 backdrop-blur-lg border border-gray-600/50 rounded-xl shadow-xl max-w-lg w-full mx-4"
            )}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600/50">
              <h2 className="text-lg font-bold text-gray-200">Your Active Challenge</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-300" />
              </Button>
            </div>
            <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-200 text-center text-sm font-medium"
                >
                  {isOwner
                    ? "You own this challenge. Abandon it to start fresh?"
                    : "Your active challenge is waiting. Ready to rejoin?"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex justify-center"
                >
                  {isOwner ? (
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <Button
                        size="lg"
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600 relative group py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 text-white w-full"
                        onClick={() => setShowAbandonConfirm(true)}
                        aria-label="Abandon challenge"
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">Abandon Challenge</span>
                      </Button>
                      <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 relative group py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white w-full"
                        onClick={() => handleJoinChallenge(challenge)}
                        aria-label="Rejoin challenge"
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                        <span className="relative z-10">Join Now</span>
                      </Button>
                      <AnimatePresence>
                        {showAbandonConfirm && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center"
                          >
                            <div
                              className="fixed inset-0 bg-black/60"
                              onClick={() => setShowAbandonConfirm(false)}
                            />
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.95, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-6 max-w-xs w-full z-50 flex flex-col items-center"
                            >
                              <div className="mb-4 text-center">
                                <p className="text-lg font-semibold text-red-400 mb-2">
                                  Abandon Challenge?
                                </p>
                                <p className="text-sm text-gray-300">
                                  Are you sure you want to abandon this challenge? This action cannot be undone.
                                </p>
                              </div>
                              <div className="flex gap-3 w-full mt-2">
                                <Button
                                  variant="secondary"
                                  className="flex-1"
                                  onClick={() => setShowAbandonConfirm(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => {
                                    setShowAbandonConfirm(false);
                                    handleAbandonChallenge(challenge);
                                  }}
                                >
                                  Abandon
                                </Button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 relative group py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white w-full max-w-xs"
                      onClick={() => handleJoinChallenge(challenge)}
                      aria-label="Rejoin challenge"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                      <span className="relative z-10">Rejoin Now</span>
                    </Button>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-900/90 text-white border border-zinc-700 rounded-xl shadow-lg p-6 max-w-5xl mx-auto space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-sm bg-zinc-800 px-2 py-1 rounded">
                        <span className="text-gray-300 font-semibold">ID:</span>
                        <span className="text-white">{challenge?.challengeId}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(challenge.challengeId)}
                          className="text-gray-400 hover:text-white ml-2"
                        >
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-sm bg-zinc-800 px-2 py-1 rounded">
                        <span className="text-gray-300 font-semibold">Password:</span>
                        <span className="text-white">{challenge?.password || "None"}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(challenge.password || "")}
                          className="text-gray-400 hover:text-white ml-2"
                        >
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-sm p-1 rounded mt-1">
                        <button
                          onClick={() => copyRoomInfo(challenge)}
                          className="text-blue-400 text-sm hover:underline"
                        >
                          Copy Room Url
                        </button>
                      </div>
                    </div>
                    <motion.div
                      onClick={() => setShowDetails((prev) => !prev)}
                      animate={{ rotate: showDetails ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="cursor-pointer text-gray-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-4 border-t border-zinc-700 pt-4"
                      >
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-green-400">
                            {challenge.title || "Untitled Challenge"}
                          </h2>
                          {challenge.isPrivate && <Lock className="h-5 w-5 text-yellow-400" />}
                          <h1 className="text-sm text-gray-300">
                            <span className="font-semibold text-white">Challenge ID:</span> {challenge?.challengeId}
                          </h1>
                          <h1 className="text-sm text-gray-300">
                            <span className="font-semibold text-white">Password:</span> {challenge?.password || "None"}
                          </h1>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {isLoadingCreator ? (
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            ) : isCreatorError || !creatorProfile?.userName ? (
                              <div className="w-6 h-6 rounded-full bg-green-900/40 flex items-center justify-center">
                                <Users className="h-4 w-4 text-green-400" />
                              </div>
                            ) : (
                              <img
                                src={creatorProfile.avatarURL || avatarIcon || "https://via.placeholder.com/24"}
                                alt="creator"
                                className="w-6 h-6 rounded-full hover:ring-2 hover:ring-green-500 transition"
                                onClick={() => navigate(`/profile/${creatorProfile.userName}`)}
                                onError={() => console.error("Failed to load creator avatar")}
                              />
                            )}
                            <div>
                              <p
                                className="text-sm font-medium hover:underline cursor-pointer"
                                onClick={() => {
                                  if (!creatorProfile?.userName) return;
                                  navigate(`/profile/${creatorProfile.userName}`);
                                }}
                              >
                                {creatorProfile?.userName || challenge.creatorId?.slice(0, 8) || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400">Challenge Creator</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1 text-sm">
                            <p>Problems: {challenge.problemCount || 0}</p>
                            <p className="flex items-center justify-end gap-1">
                              <Users className="h-4 w-4" />
                              {Object.keys(challenge.participants || {}).length} participants
                            </p>
                          </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                          {isLoadingMetadata ? (
                            <div className="flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                          ) : metadataError ? (
                            <p className="text-sm text-red-400">{metadataError}</p>
                          ) : problemMetadata.length ? (
                            problemMetadata.map((problem) => (
                              <div
                                key={problem?.problemId}
                                className={cn(
                                  "border rounded-md p-3 shadow-sm transition hover:scale-[1.01]",
                                  problem?.difficulty === "E" && "border-green-500/30 bg-green-900/20",
                                  problem?.difficulty === "M" && "border-yellow-500/30 bg-yellow-900/20",
                                  problem?.difficulty === "H" && "border-red-500/30 bg-red-900/20"
                                )}
                              >
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-sm truncate">{problem?.title || "Unknown Problem"}</p>
                                  <span
                                    className={cn(
                                      "text-xs px-2 py-0.5 rounded font-semibold",
                                      problem?.difficulty === "E" && "bg-green-800 text-green-300",
                                      problem?.difficulty === "M" && "bg-yellow-800 text-yellow-300",
                                      problem?.difficulty === "H" && "bg-red-800 text-red-300"
                                    )}
                                  >
                                    {problem?.difficulty || "N/A"}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">
                                  {problem?.tags?.join(", ") || "No tags"}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">No problems available</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

    </AnimatePresence>
  );
};

export default ChallengeDetailsModal;