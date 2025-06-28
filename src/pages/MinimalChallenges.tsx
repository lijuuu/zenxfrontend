import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Users,
  Zap,
  Trophy,
  ChevronRight,
  Calendar,
  Clock,
  User,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Challenge } from "@/api/challengeTypes";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import JoinPrivateChallenge from "@/components/challenges/JoinPrivateChallenge";
import { useProblemStats } from "@/services/useProblemStats";
import { useChallenges, useUserChallengeHistory, useJoinChallenge } from "@/services/useChallenges";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatDate } from "@/utils/formattedDate";
import bgGradient from "@/assets/challengegradient.png"

const MinimalChallenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.userProfile);

  const { data: problemStats, isLoading: statsLoading } = useProblemStats("current");
  const joinChallengeMutation = useJoinChallenge();
  const { data: activeChallenges, isLoading: activeChallengesLoading } = useChallenges({
    active: true,
    pageSize: 10
  });
  const { data: publicChallenges, isLoading: publicChallengesLoading } = useChallenges({
    isPrivate: false,
  });
  const { data: publicChallengeHistory, isLoading: publicHistoryLoading } = useUserChallengeHistory({
    userId: user?.userID,
    isPrivate: false
  });
  const { data: privateChallengeHistory, isLoading: privateHistoryLoading } = useUserChallengeHistory({
    userId: user?.userID,
    isPrivate: true
  });

  const totalProblemsDone = problemStats
    ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount
    : 0;

  const loadChallenge = async (id: string) => {
    try {
      const challenge = [
        ...(activeChallenges || []),
        ...(publicChallenges || []),
        ...(publicChallengeHistory?.challenges || []),
        ...(privateChallengeHistory?.challenges || []),
      ].find((c) => c.id === id);

      if (challenge) {
        setActiveChallenge(challenge);
        setActiveChallengeId(id);
      } else {
        toast.error("Challenge not found");
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
      toast.error("Failed to load challenge");
    }
  };

  const handleChallengeCreated = (newChallenge: Challenge) => {
    toast.success(`Challenge "${newChallenge.title}" created successfully!`);
  };

  const handleJoinChallenge = async (challenge: Challenge) => {
    if (!challenge.id) {
      toast.error("Invalid challenge ID");
      return;
    }

    try {
      await joinChallengeMutation.mutateAsync({
        challengeId: challenge.id,
        accessCode: challenge.isPrivate ? challenge.accessCode : undefined
      });
      navigate(`/challenge-room/${challenge.id}`);
      toast.success(`Joined challenge "${challenge.title}" successfully!`);
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast.error("Failed to join challenge");
    }
  };

  const handleQuickMatch = (difficulty: "Easy" | "Medium" | "Hard" = "Easy") => {
    const roomId = `rm_${Math.random().toString(36).substring(2, 10)}`;
    const password = Math.random().toString(36).substring(2, 8);
    const roomUrl = `/quick-match?room=${roomId}&password=${password}&difficulty=${difficulty}`;
    navigate(roomUrl);
  };

  const startFriendChallenge = (difficulty: "Easy" | "Medium" | "Hard" = "Easy") => {
    const roomId = `rm_${Math.random().toString(36).substring(2, 10)}`;
    const password = Math.random().toString(36).substring(2, 8);
    const roomUrl = `/quick-match?room=${roomId}&password=${password}&difficulty=${difficulty}&mode=friend`;
    const shareableLink = `${window.location.origin}${roomUrl}`;

    toast("Challenge created! Share this link with your friend.", {
      description: (
        <div className="mt-2">
          <div className="flex items-center gap-2 bg-gray-800 p-2 rounded mb-2 text-xs font-mono text-gray-200">
            <span className="truncate">{shareableLink}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-gray-300 hover:text-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(shareableLink);
                toast.success("Link copied to clipboard!");
              }}
              aria-label="Copy challenge link"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 metallic-button"
            onClick={() => navigate(roomUrl)}
            aria-label="Enter challenge room"
          >
            Enter Challenge Room
          </Button>
        </div>
      ),
      duration: 10000,
    });
  };

  const copyRoomInfo = (challenge: Challenge) => {
    const roomInfo = `Challenge: ${challenge.title}\nRoom ID: ${challenge.id}\nAccess Code: ${challenge.accessCode || "None (Public)"}\nDifficulty: ${challenge.difficulty}`;
    navigator.clipboard.writeText(roomInfo);
    toast.success("Room information copied to clipboard!");
  };

  const renderChallengeCard = (challenge: Challenge, actions?: React.ReactNode) => (
    <Card
      key={challenge.id}
      className={cn(
        "metallic-card cursor-pointer backdrop-blur-lg bg-black/40 border shadow-lg transition-colors duration-200 group",
        // border is transparent by default, highlight on hover/focus
        "hover:border-green-500"
      )}
      onClick={() => loadChallenge(challenge.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && loadChallenge(challenge.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-100">
            {challenge.title}
            {challenge.isPrivate && (
              <Lock className="h-4 w-4 text-amber-400" aria-label="Private challenge" />
            )}
          </CardTitle>
          <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded">
            {challenge.difficulty}
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 text-gray-300">
          <Clock className="h-3 w-3" aria-hidden="true" /> Created: {formatDate(challenge.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-900/40 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">Creator ID: {challenge.creatorId.substring(0, 8)}...</p>
              <p className="text-xs text-gray-400">Challenge Creator</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-200">Problems: {challenge.problemIds.length}</p>
            <p className="text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" /> {challenge.participantIds.length || 0} participants
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>Room ID: {challenge.id.substring(0, 8)}...</span>
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
        </div>
      </CardContent>
      {actions && (
        <CardFooter className="flex justify-end">
          {actions}
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div
      className="min-h-screen text-foreground pt-16 pb-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,2), rgba(0,0,0,0.1)), url(${bgGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      <MainNavbar />
      {activeChallengeId ? (
        <main className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-100">{activeChallenge?.title || "Active Challenge"}</h1>
            <Button
              variant="outline"
              className="text-sm border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
              onClick={() => {
                setActiveChallengeId(null);
                setActiveChallenge(null);
              }}
              aria-label="Exit challenge"
            >
              Exit Challenge
            </Button>
          </div>
        </main>
      ) : (
        <main className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-100">Challenges</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                    onClick={() => setIsJoinModalOpen(true)}
                    aria-label="Join private challenge"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Join Private
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 metallic-button"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label="Create new challenge"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </div>
              {/* 
              <Card className="metallic-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-100">
                    <Zap className="h-5 w-5 text-green-400" aria-hidden="true" />
                    Quick Match
                  </CardTitle>
                  <CardDescription className="text-gray-300">Start a coding challenge instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-800/50 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                      <Zap className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">Random Problem</p>
                      <p className="text-xs text-gray-400">Solve a random problem with friends</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => handleQuickMatch("Easy")}
                        aria-label="Start easy quick match"
                      >
                        Easy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => handleQuickMatch("Medium")}
                        aria-label="Start medium quick match"
                      >
                        Medium
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => handleQuickMatch("Hard")}
                        aria-label="Start hard quick match"
                      >
                        Hard
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <User className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">Challenge a Friend</p>
                      <p className="text-xs text-gray-400">Create a private room and share the link</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => startFriendChallenge("Easy")}
                        aria-label="Start easy friend challenge"
                      >
                        Easy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => startFriendChallenge("Medium")}
                        aria-label="Start medium friend challenge"
                      >
                        Medium
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                        onClick={() => startFriendChallenge("Hard")}
                        aria-label="Start hard friend challenge"
                      >
                        Hard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 bg-gray-800/50 border-gray-600">
                  <TabsTrigger
                    value="active"
                    className="text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                  >
                    Active Public Challenges
                  </TabsTrigger>
                  <TabsTrigger
                    value="yours"
                    className="text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                  >
                    Your Challenges
                  </TabsTrigger>
                  <TabsTrigger
                    value="public"
                    className="text-gray-300 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400"
                  >
                    Public History
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="text-gray-300 data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400"
                  >
                    Private History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeChallengesLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-green-400" aria-label="Loading active challenges" />
                    </div>
                  ) : activeChallenges?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeChallenges.map((challenge) =>
                        renderChallengeCard(
                          challenge,
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 metallic-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinChallenge(challenge);
                            }}
                            aria-label={`Join ${challenge.title} challenge`}
                          >
                            Join Challenge
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-400">No active public challenges</p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700 metallic-button"
                        onClick={() => setIsCreateModalOpen(true)}
                        aria-label="Create new challenge"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Challenge
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="yours" className="space-y-4">
                  {activeChallengesLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-green-400" aria-label="Loading active challenges" />
                    </div>
                  ) : activeChallenges?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeChallenges.map((challenge) =>
                        renderChallengeCard(
                          challenge,
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 metallic-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinChallenge(challenge);
                            }}
                            aria-label={`Join ${challenge.title} challenge`}
                          >
                            Join Challenge
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-400">No active public challenges</p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700 metallic-button"
                        onClick={() => setIsCreateModalOpen(true)}
                        aria-label="Create new challenge"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Challenge
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="public" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-100">
                      <History className="h-4 w-4 text-blue-400" aria-hidden="true" />
                      Public Challenge History
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                      aria-label="Filter public challenge history"
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      Filter
                    </Button>
                  </div>
                  {publicHistoryLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-400" aria-label="Loading public challenge history" />
                    </div>
                  ) : publicChallengeHistory?.challenges.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {publicChallengeHistory.challenges.map((challenge) =>
                        renderChallengeCard(
                          challenge,
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 metallic-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/challenge-results/${challenge.id}`);
                            }}
                            aria-label={`View results for ${challenge.title}`}
                          >
                            View Results
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-400">No public challenge history found</p>
                      <p className="text-xs text-gray-400 mt-2">Join public challenges to see them here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="private" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-100">
                      <Lock className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      Private Challenge History
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-600 text-gray-200 hover:bg-gray-700/50 metallic-button"
                      aria-label="Filter private challenge history"
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      Filter
                    </Button>
                  </div>
                  {privateHistoryLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-amber-400" aria-label="Loading private challenge history" />
                    </div>
                  ) : privateChallengeHistory?.challenges.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {privateChallengeHistory.challenges.map((challenge) =>
                        renderChallengeCard(
                          challenge,
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 metallic-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/challenge-results/${challenge.id}`);
                            }}
                            aria-label={`View results for ${challenge.title}`}
                          >
                            View Results
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-400">No private challenge history found</p>
                      <p className="text-xs text-gray-400 mt-2">Join private challenges to see them here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* <div className="space-y-8">
              {statsLoading ? (
                <Card className="metallic-card">
                  <CardContent className="flex justify-center items-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-400" aria-label="Loading stats" />
                  </CardContent>
                </Card>
              ) : (
                <Card className="metallic-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-100">
                      <Trophy className="h-5 w-5 text-amber-400" aria-hidden="true" />
                      Your Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Problems Solved</span>
                      <span className="font-semibold text-gray-200">{totalProblemsDone}</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Current Streak</span>
                      <span className="font-semibold text-gray-200">{0} days</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Longest Streak</span>
                      <span className="font-semibold text-gray-200">{0} days</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Current Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-200">{0}</span>
                        <span className="text-xs text-green-400">{0}</span>
                      </div>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Global Rank</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-200">{"N/A"}</span>
                        <span className="text-xs text-green-400">{0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div> */}
          </div>
        </main>
      )}

      <CreateChallengeForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleChallengeCreated}
      />

      <JoinPrivateChallenge
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={(challenge) => toast.success(`Joined challenge "${challenge.title}" successfully!`)}
      />
    </div>
  );
};

export default MinimalChallenges;