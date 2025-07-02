import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Users,
  ChevronRight,
  Clock,
  Lock,
  Copy,
  Filter,
  Loader2,
  History,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import MainNavbar from "@/components/common/MainNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useUserChallengeHistory, useActiveOpenChallenges, useGetOwnersActiveChallenges } from "@/services/useChallenges";
import { fetchBulkProblemMetadata } from "@/services/useProblemList";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatDate } from "@/utils/formattedDate";
import { getUserProfile } from "@/api/userApi";
import bgGradient from "@/assets/challengegradient.png";
import avatarIcon from "@/assets/avatar.png";

// Custom hook to fetch multiple creator profiles
const useFetchCreatorProfiles = (creatorIds) => {
  const [profiles, setProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const creatorIdsKey = JSON.stringify(creatorIds.sort());

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!creatorIds.length) {
        setProfiles({});
        setIsLoading(false);
        return;
      }

      if (creatorIds.every((id) => profiles[id]?.userName)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const profilePromises = creatorIds.map((id) =>
          profiles[id]?.userName
            ? Promise.resolve(profiles[id])
            : getUserProfile({ userID: id }).catch((err) => {
              console.error(`Failed to fetch profile for userID ${id}:`, err);
              return { userName: null, avatarURL: null };
            })
        );
        const results = await Promise.all(profilePromises);
        const profileMap = creatorIds.reduce((acc, id, index) => {
          const profile = results[index];
          acc[id] = profile && typeof profile === "object" && profile.userName && profile.avatarURL
            ? profile
            : { userName: null, avatarURL: null };
          return acc;
        }, { ...profiles });
        setProfiles(profileMap);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch creator profiles:", err);
        setError("Failed to fetch creator profiles");
        toast.error("Failed to fetch creator profiles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [creatorIdsKey]);

  return { profiles, isLoading, error };
};

const CurrentOngoingChallenge = ({
  challenge,
  setActiveChallenge,
  setActiveChallengeId,
  copyRoomInfo,
  handleJoinChallenge,
  creatorProfile,
  isLoadingCreator,
  isCreatorError,
}) => {
  const [problemMetadata, setProblemMetadata] = useState([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

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
          toast.error("Failed to load problem details");
        } finally {
          setIsLoadingMetadata(false);
        }
      }
    };
    fetchMetadata();
  }, [challenge?.processedProblemIds]);

  if (!challenge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-900/90 text-white border border-zinc-700 rounded-xl shadow-lg p-6 max-w-5xl mx-auto space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          
          <button
            onClick={copyRoomInfo}
            className="text-blue-400 border border-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-600/10 transition"
          >
            Copy Room Info
          </button>
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
            {/* title and lock */}
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-green-400">
                {challenge.title}
              </h2>
              {challenge.isPrivate && <Lock className="h-5 w-5 text-yellow-400" />}
            </div>

            {/* creator + stats */}
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
                    src={creatorProfile.avatarURL}
                    alt="creator"
                    className="w-6 h-6 rounded-full hover:ring-2 hover:ring-green-500 transition"
                    onClick={() => navigate(`/profile/${creatorProfile.userName}`)}
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
                    {creatorProfile?.userName || challenge.creatorId.slice(0, 8)}
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

            {/* problems */}
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
                    key={problem.problem_id}
                    className={cn(
                      "border rounded-md p-3 shadow-sm transition hover:scale-[1.01]",
                      problem.difficulty === "E" && "border-green-500/30 bg-green-900/20",
                      problem.difficulty === "M" && "border-yellow-500/30 bg-yellow-900/20",
                      problem.difficulty === "H" && "border-red-500/30 bg-red-900/20"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{problem.title}</p>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded font-semibold",
                          problem.difficulty === "E" && "bg-green-800 text-green-300",
                          problem.difficulty === "M" && "bg-yellow-800 text-yellow-300",
                          problem.difficulty === "H" && "bg-red-800 text-red-300"
                        )}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{problem.tags?.join(", ") || "No tags"}</p>
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
  );
};

// MinimizableModal component with Framer Motion
const MinimizableModal = ({ isOpen, onClose, children, setIsModalOpen, title }) => {
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
              <h2 className="text-lg font-bold text-gray-200">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// HoverModal component for avatar hover
const HoverModal = ({ isVisible, onClick, challengeTitle }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-16 right-4 bg-black/80 backdrop-blur-lg border border-gray-600/50 rounded-lg shadow-lg p-4 w-64"
        >
          <p className="text-gray-200 text-sm mb-3 font-medium">Challenge found: {challengeTitle}</p>
          <Button
            size="sm"
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={onClick}
            aria-label="Rejoin challenge"
          >
            Rejoin
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MinimalChallenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoverModalVisible, setIsHoverModalVisible] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.userProfile);

  const { data: publicChallengeHistory, isLoading: publicHistoryLoading } = useUserChallengeHistory({
    isPrivate: false,
    page: 1,
    pageSize: 10,
  });

  const { data: privateChallengeHistory, isLoading: privateHistoryLoading } = useUserChallengeHistory({
    isPrivate: true,
    page: 1,
    pageSize: 10,
  });

  const { data: yourChallenges, isLoading: yourChallengesLoading } = useGetOwnersActiveChallenges({
    page: 1,
    pageSize: 10,
  });

  const { data: activeOpenChallenges, isLoading: activeOpenChallengesLoading } = useActiveOpenChallenges({
    page: 1,
    pageSize: 10,
  });

  // Memoize allChallenges
  const allChallenges = useMemo(() => {
    return [
      ...(activeOpenChallenges?.challenges || []),
      ...(yourChallenges?.challenges || []),
      ...(publicChallengeHistory?.challenges || []),
      ...(privateChallengeHistory?.challenges || []),
    ].filter(challenge => challenge && challenge.creatorId);
  }, [activeOpenChallenges, yourChallenges, publicChallengeHistory, privateChallengeHistory]);

  // Memoize creatorIds
  const creatorIds = useMemo(() => {
    return [...new Set(allChallenges.map((challenge) => challenge.creatorId))];
  }, [allChallenges]);

  // Fetch creator profiles
  const { profiles: creatorProfiles, isLoading: isLoadingCreators, error: creatorError } = useFetchCreatorProfiles(creatorIds);

  // Check for active challenge and control modal
  useEffect(() => {
    if (yourChallenges?.challenges?.length && !activeChallengeId) {
      setActiveChallenge(yourChallenges.challenges[0]);
      setActiveChallengeId(yourChallenges.challenges[0].challengeId);
      setIsModalOpen(true);
    } else if (!yourChallenges?.challenges?.length) {
      setIsModalOpen(false);
      setActiveChallenge(null);
      setActiveChallengeId(null);
    }
  }, [yourChallenges, activeChallengeId]);

  const handleJoinChallenge = (challenge) => {
    if (!challenge?.challengeId) {
      toast.error("Invalid challenge");
      return;
    }
    toast.success(`Joined challenge "${challenge.title}" successfully!`);
    navigate(`/challenge/${challenge.challengeId}`);
    setIsModalOpen(false);
  };

  const handleAbandonChallenge = (challenge) => {
    toast.success(`Abandoned challenge "${challenge.title}"`);
    setActiveChallenge(null);
    setActiveChallengeId(null);
    setIsModalOpen(false);
  };

  const loadChallenge = async (id) => {
    try {
      const challenge = allChallenges.find((c) => c.challengeId === id);
      if (challenge) {
        setActiveChallenge(challenge);
        setActiveChallengeId(id);
        setIsModalOpen(true);
      } else {
        toast.error("Challenge not found");
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
      toast.error("Failed to load challenge");
    }
  };

  const copyRoomInfo = (challenge) => {
    if (!challenge?.challengeId) {
      toast.error("Invalid challenge");
      return;
    }
    const roomInfo = `Challenge: ${challenge.title}\nRoom ID: ${challenge.challengeId}\nAccess Code: None (Public)\nDifficulty: N/A`;
    navigator.clipboard.writeText(roomInfo).then(() => {
      toast.success("Room information copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy room information");
    });
  };

  const RenderChallengeCard = (challenge, actions) => {
    const creatorProfile = creatorProfiles[challenge.creatorId] || { userName: null, avatarURL: null };

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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-200">
                  {challenge.title}
                  {challenge.isPrivate && (
                    <Lock className="h-4 w-4 text-yellow-400" aria-label="Private challenge" />
                  )}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Created: {formatDate(new Date(challenge.startTimeUnix * 1000))}
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
                    src={creatorProfile.avatarURL}
                    alt={`${creatorProfile.userName}'s avatar`}
                    className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${creatorProfile.userName}`);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        navigate(`/profile/${creatorProfile.userName}`);
                      }
                    }}
                  />
                )}
                <div>
                  {isLoadingCreators ? (
                    <p className="text-sm font-medium text-gray-200">Loading...</p>
                  ) : creatorError || !creatorProfile?.userName ? (
                    <p className="text-sm font-medium text-gray-200">Creator ID: {challenge.creatorId.substring(0, 8)}...</p>
                  ) : (
                    <p
                      className="text-sm font-medium text-gray-200 cursor-pointer hover:underline hover:text-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${creatorProfile.userName}`);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
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
                  <Users className="h-4 w-4" aria-hidden="true" /> {Object.keys(challenge.participants || {}).length} participants
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
                  copyRoomInfo(challenge);
                }}
                aria-label="Copy room information"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Info
              </Button>
            </motion.div>
          </CardContent>
          {actions && (
            <CardFooter className="flex justify-end">
              {actions}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  };

  const renderChallengeSection = (tab, title, challenges, isLoading, icon, color, buttonProps) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2 text-gray-200 text-lg">
          {icon}
          {title}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"
          aria-label={`Filter ${title.toLowerCase()}`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className={`h-10 w-10 animate-spin text-${color}-400`} aria-label={`Loading ${title.toLowerCase()}`} />
        </div>
      ) : challenges?.challenges?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.challenges.map((challenge) =>
            RenderChallengeCard(challenge, buttonProps(challenge))
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm">No {title.toLowerCase()} found</p>
          {tab === "active" && (
            <Button
              size="lg"
              className="mt-4 bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
              onClick={() => navigate("/create-challenges")}
              aria-label="Create new challenge"
              disabled={yourChallenges?.challenges?.length > 0}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">Create Challenge</span>
            </Button>
          )}
          {tab === "public" && (
            <p className="text-xs text-gray-400 mt-2">Join public challenges to see them here</p>
          )}
          {tab === "private" && (
            <p className="text-xs text-gray-400 mt-2">Join private challenges to see them here</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen text-foreground pt-16 pb-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.5)), url(${bgGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MainNavbar />
      <AnimatePresence>
        {yourChallenges?.challenges?.length > 0 && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
            onMouseEnter={() => setIsHoverModalVisible(true)}
            onMouseLeave={() => setIsHoverModalVisible(false)}
          >
            <img
              src={avatarIcon}
              alt="Active challenge"
              className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            />
            <HoverModal
              isVisible={isHoverModalVisible}
              onClick={() => setIsModalOpen(true)}
              challengeTitle={yourChallenges?.challenges[0]?.title || "Active Challenge"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {activeChallengeId && isModalOpen ? (
        <MinimizableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setIsModalOpen={setIsModalOpen}
          title="Your Active Challenge"
        >
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-200 text-center text-sm font-medium"
            >
              Your active challenge already found, Rejoin or Abandon?
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                onClick={() => handleJoinChallenge(yourChallenges.challenges[0])}
                aria-label="Rejoin challenge"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">Rejoin</span>
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 relative group py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 text-white"
                onClick={() => handleAbandonChallenge(yourChallenges.challenges[0])}
                aria-label="Abandon challenge"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Abandon</span>
              </Button>
            </motion.div>
            <CurrentOngoingChallenge
              challenge={yourChallenges.challenges[0]}
              setActiveChallenge={setActiveChallenge}
              setActiveChallengeId={setActiveChallengeId}
              copyRoomInfo={copyRoomInfo}
              handleJoinChallenge={handleJoinChallenge}
              creatorProfile={creatorProfiles[yourChallenges.challenges[0]?.creatorId] || { userName: null, avatarURL: null }}
              isLoadingCreator={isLoadingCreators}
              isCreatorError={creatorError}
            />
          </div>
        </MinimizableModal>
      ) : (
        <main className="page-container py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Challenges</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 text-sm px-4 py-2 rounded-md"
                  onClick={() => setIsJoinModalOpen(true)}
                  aria-label="Join private challenge"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Join Private
                </Button>
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                  onClick={() => navigate("/create-challenges")}
                  aria-label="Create new challenge"
                  disabled={yourChallenges?.challenges?.length > 0}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Create Challenge</span>
                </Button>
              </div>
            </div>

            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full p-2 pr-10 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                aria-label="Select challenge category"
              >
                <option value="active">Active Public Challenges</option>
                <option value="public">Public History</option>
                <option value="private">Private History</option>
              </select>
            </div>

            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/50 border-gray-600 rounded-md">
                  <TabsTrigger
                    value="active"
                    className="text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400 rounded-md"
                  >
                    Active Public Challenges
                  </TabsTrigger>
                  <TabsTrigger
                    value="public"
                    className="text-gray-300 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400 rounded-md"
                  >
                    Public History
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="text-gray-300 data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400 rounded-md"
                  >
                    Private History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  {renderChallengeSection(
                    "active",
                    "Active Public Challenges",
                    activeOpenChallenges,
                    activeOpenChallengesLoading,
                    <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
                    "green",
                    (challenge) => (
                      <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinChallenge(challenge);
                        }}
                        aria-label={`Join ${challenge.title} challenge`}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                        <span className="relative z-10">Join Challenge</span>
                      </Button>
                    )
                  )}
                </TabsContent>

                <TabsContent value="public">
                  {renderChallengeSection(
                    "public",
                    "Public Challenge History",
                    publicChallengeHistory,
                    publicHistoryLoading,
                    <History className="h-4 w-4 text-blue-400" aria-hidden="true" />,
                    "blue",
                    (challenge) => (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/challenge-results/${challenge.challengeId}`);
                        }}
                        aria-label={`View results for ${challenge.title}`}
                      >
                        View Results
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )
                  )}
                </TabsContent>

                <TabsContent value="private">
                  {renderChallengeSection(
                    "private",
                    "Private Challenge History",
                    privateChallengeHistory,
                    privateHistoryLoading,
                    <Lock className="h-4 w-4 text-yellow-400" aria-hidden="true" />,
                    "yellow",
                    (challenge) => (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/challenge-results/${challenge.challengeId}`);
                        }}
                        aria-label={`View results for ${challenge.title}`}
                      >
                        View Results
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:hidden">
              {activeTab === "active" &&
                renderChallengeSection(
                  "active",
                  "Active Public Challenges",
                  activeOpenChallenges,
                  activeOpenChallengesLoading,
                  <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
                  "green",
                  (challenge) => (
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinChallenge(challenge);
                      }}
                      aria-label={`Join ${challenge.title} challenge`}
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                      <span className="relative z-10">Join Challenge</span>
                    </Button>
                  )
                )}

              {activeTab === "public" &&
                renderChallengeSection(
                  "public",
                  "Public Challenge History",
                  publicChallengeHistory,
                  publicHistoryLoading,
                  <History className="h-4 w-4 text-blue-400" aria-hidden="true" />,
                  "blue",
                  (challenge) => (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/challenge-results/${challenge.challengeId}`);
                      }}
                      aria-label={`View results for ${challenge.title}`}
                    >
                      View Results
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )
                )}

              {activeTab === "private" &&
                renderChallengeSection(
                  "private",
                  "Private Challenge History",
                  privateChallengeHistory,
                  privateHistoryLoading,
                  <Lock className="h-4 w-4 text-yellow-400" aria-hidden="true" />,
                  "yellow",
                  (challenge) => (
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/challenge-results/${challenge.challengeId}`);
                      }}
                      aria-label={`View results for ${challenge.title}`}
                    >
                      View Results
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )
                )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default MinimalChallenges;