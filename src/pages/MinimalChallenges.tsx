/* eslint-disable no-constant-condition */
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
import { cn } from "@/lib/utils";
import { useUserChallengeHistory, useActiveOpenChallenges,useGetOwnersActiveChallenges } from "@/services/useChallenges";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatDate } from "@/utils/formattedDate";
import bgGradient from "@/assets/challengegradient.png";

const MinimalChallenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
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

  const handleJoinChallenge = (challenge) => {
    toast.success(`Joined challenge "${challenge.title}" successfully!`);
    navigate(`/challenge/${challenge.challengeId}`);
  };

  const loadChallenge = async (id) => {
    try {
      const challenge = [
        ...(activeOpenChallenges?.challenges || []),
        ...(yourChallenges?.challenges || []),
        ...(publicChallengeHistory?.challenges || []),
        ...(privateChallengeHistory?.challenges || []),
      ].find((c) => c.challengeId === id);

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

  const copyRoomInfo = (challenge) => {
    const roomInfo = `Challenge: ${challenge.title}\nRoom ID: ${challenge.challengeId}\nAccess Code: None (Public)\nDifficulty: N/A`;
    navigator.clipboard.writeText(roomInfo);
    toast.success("Room information copied to clipboard!");
  };

  const renderChallengeCard = (challenge, actions) => (
    <Card
      key={challenge.challengeId}
      className={cn(
        "metallic-card cursor-pointer backdrop-blur-lg bg-black/40 border shadow-lg transition-colors duration-200 group",
        "hover:border-green-500"
      )}
      onClick={() => loadChallenge(challenge.challengeId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && loadChallenge(challenge.challengeId)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-100">
            {challenge.title}
            {challenge.isPrivate && (
              <Lock className="h-4 w-4 text-yellow-400" aria-label="Private challenge" />
            )}
          </CardTitle>
          {/* <div className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs font-medium rounded">N/A</div> */}
        </div>
        <CardDescription className="flex items-center gap-1 text-gray-300">
          <Clock className="h-3 w-3" aria-hidden="true" />
          Created: {formatDate(new Date(challenge.startTimeUnix * 1000))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-900/40 flex items-center justify-center">
              <User className="h-4 w-4 text-green-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Creator ID: {challenge.creatorId.substring(0, 8)}...</p>
              <p className="text-xs text-gray-400">Challenge Creator</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-100">Problems: {challenge.problemCount || 0}</p>
            <p className="text-xl font-bold text-gray-100">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" /> {Object.keys(challenge.participants).length} participants
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
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
        </div>
      </CardContent>
      {actions && <CardFooter className="flex justify-end">{actions}</CardFooter>}
    </Card>
  );

  const renderChallengeSection = (tab, title, challenges, isLoading, icon, color, buttonProps) => (
    <div className="space-y-4">
      {tab !== "active" && tab !== "yours" && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2 text-gray-100">
            {icon}
            {title}
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-gray-600 text-gray-300 hover:bg-gray-700/50 metallic-button"
            aria-label={`Filter ${title.toLowerCase()}`}
          >
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className={`h-10 w-10 animate-spin text-${color}-400`} aria-label={`Loading ${title.toLowerCase()}`} />
        </div>
      ) : challenges?.challenges?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.challenges.map((challenge) =>
            renderChallengeCard(challenge, buttonProps(challenge))
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400">No {title.toLowerCase()} found</p>
          {(tab === "active" || tab === "yours") && (
            <Button
              size="lg"
              className="mt-4 bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
              onClick={() => navigate("/create-challenges")}
              aria-label="Create new challenge"
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
      className="min-h-screen text-foreground pt-16 pb-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,2), rgba(0,0,0,0.1)), url(${bgGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MainNavbar />
      {activeChallengeId ? (
        <main className="page-container py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">{activeChallenge?.title || "Active Challenge"}</h1>
            <Button
              variant="outline"
              className="mt-4 sm:mt-0 text-sm border-gray-600 text-gray-300 hover:bg-gray-700/50 metallic-button"
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
        <main className="page-container py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between mb-5 md:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Challenges</h1>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50 metallic-button text-sm px-3 py-1"
                    onClick={() => setIsJoinModalOpen(true)}
                    aria-label="Join private challenge"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Join Private
                  </Button>
                  <Button
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                    onClick={() => navigate("/create-challenges")}
                    aria-label="Create new challenge"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">Create Challenge</span>
                  </Button>
                </div>
              </div>

              <div className="md:hidden relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full p-2 pr-10 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                  aria-label="Select challenge category"
                >
                  <option value="active">Active Public Challenges</option>
                  <option value="yours">Your Challenges</option>
                  <option value="public">Public History</option>
                  <option value="private">Private History</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                  
                </div>
              </div>

              <div className="hidden md:block">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                          className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
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

                  <TabsContent value="yours">
                    {renderChallengeSection(
                      "yours",
                      "Your Challenges",
                      yourChallenges,
                      yourChallengesLoading,
                      <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
                      "green",
                      (challenge) => (
                        <Button
                          size="lg"
                          className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
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
                          className="bg-blue-600 hover:bg-blue-700 metallic-button"
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
                          className="bg-yellow-600 hover:bg-yellow-700 metallic-button"
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
                        className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
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

                {activeTab === "yours" &&
                  renderChallengeSection(
                    "yours",
                    "Your Challenges",
                    yourChallenges,
                    yourChallengesLoading,
                    <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
                    "green",
                    (challenge) => (
                      <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
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
                        className="bg-blue-600 hover:bg-blue-700 metallic-button"
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
                        className="bg-yellow-600 hover:bg-yellow-700 metallic-button"
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
          </div>
        </main>
      )}
    </div>
  );
};

export default MinimalChallenges;