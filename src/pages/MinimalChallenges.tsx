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
  Unlock,
  Search,
  Filter,
  Copy,
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
// import { Challenge } from "@/api/challengeTypes";
// import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
// import JoinPrivateChallenge from "@/components/challenges/JoinPrivateChallenge";
import { useProblemStats } from "@/services/useProblemStats";
import { useProblemList } from "@/services/useProblemList";
import { useChallenges, useUserChallengeHistory, useJoinChallenge } from "@/services/useChallenges";
import { useAppSelector } from "@/hooks/useAppSelector";
import { formatDate } from "@/utils/formattedDate";

const MinimalChallenges = () => {
  // const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  // const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  // const navigate = useNavigate();
  // const user = useAppSelector(state => state.auth.userProfile);

  // const { data: problemStats, isLoading: statsLoading } = useProblemStats("current");

  // const joinChallengeMutation = useJoinChallenge();

  // const { data: activeChallenges, isLoading: activeChallengesLoading } = useChallenges({
  //   active: true,
  //   pageSize: 10
  // });
  // const { data: publicChallenges, isLoading: publicChallengesLoading } = useChallenges({
  //   isPrivate: false,
  // });

  // const { data: publicChallengeHistory, isLoading: publicHistoryLoading } = useUserChallengeHistory({
  //   userId: user?.userID,
  //   isPrivate: false
  // });

  // const { data: privateChallengeHistory, isLoading: privateHistoryLoading } = useUserChallengeHistory({
  //   userId: user?.userID,
  //   isPrivate: true
  // });

  // console.log("activeChallenges",activeChallenges)
  // console.log('publicChallengeHistory',publicChallengeHistory)
  // console.log('privateChallengeHistory',privateChallengeHistory)

  // const totalProblemsDone = problemStats
  //   ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount
  //   : 0;

  // const loadChallenge = async (id: string) => {
  //   try {
  //     const challenge = [
  //       ...(activeChallenges || []),
  //       ...(publicChallenges || []),
  //       ...(publicChallengeHistory?.challenges || []),
  //       ...(privateChallengeHistory?.challenges || []),
  //     ].find((c) => c.id === id);

  //     if (challenge) {
  //       setActiveChallenge(challenge);
  //       setActiveChallengeId(id);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load challenge:", error);
  //   }
  // };

  // const handleChallengeCreated = (newChallenge: Challenge) => {
  //   toast.success(`Challenge "${newChallenge.title}" created successfully!`);
  // };

  // const handleJoinChallenge = async (challenge: Challenge) => {
  //   if (!challenge.id) return;

  //   try {
  //     await joinChallengeMutation.mutateAsync({
  //       challengeId: challenge.id,
  //       accessCode: challenge.isPrivate ? challenge.accessCode : undefined
  //     });

  //     navigate(`/challenge-room/${challenge.id}`);
  //   } catch (error) {
  //     console.error("Failed to join challenge:", error);
  //   }
  // };

  // const handleJoinSuccess = (challenge: Challenge) => {
  //   toast.success(`Joined challenge "${challenge.title}" successfully!`);
  // };


  // const copyRoomInfo = (challenge: Challenge) => {
  //   const roomInfo = `Challenge: ${challenge.title}\nRoom ID: ${challenge.id}\nAccess Code: ${challenge.accessCode || "None (Public)"
  //     }\nDifficulty: ${challenge.difficulty}`;
  //   navigator.clipboard.writeText(roomInfo);
  //   toast.success("Room information copied to clipboard!");
  // };

  // const renderChallengeCard = (challenge: Challenge, actions?: React.ReactNode) => (
  //   <Card
  //     key={challenge.id}
  //     className="cursor-pointer hover:shadow-md transition-shadow"
  //     onClick={() => loadChallenge(challenge.id)}
  //   >
  //     <CardHeader className="pb-2">
  //       <div className="flex items-center justify-between">
  //         <CardTitle className="flex items-center gap-2">
  //           {challenge.title}
  //           {challenge.isPrivate && (
  //             <Lock className="h-4 w-4 text-amber-500" />
  //           )}
  //         </CardTitle>
  //         <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900/30 dark:text-green-300">
  //           {challenge.difficulty}
  //         </div>
  //       </div>
  //       <CardDescription className="flex items-center gap-1">
  //         <Clock className="h-3 w-3" /> Created:{" "}
  //         {formatDate(challenge.createdAt)}
  //       </CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-2">
  //           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
  //             <User className="h-4 w-4 text-primary" />
  //           </div>
  //           <div>
  //             <p className="text-sm font-medium">Creator ID: {challenge.creatorId.substring(0, 8)}...</p>
  //             <p className="text-xs text-zinc-500 dark:text-zinc-400">Challenge Creator</p>
  //           </div>
  //         </div>
  //         <div className="text-right">
  //           <p className="text-sm font-medium">Problems: {challenge.problemIds.length}</p>
  //           <p className="text-xs text-zinc-500 dark:text-zinc-400">
  //             <span className="flex items-center gap-1">
  //               <Users className="h-3 w-3" /> {challenge.participantIds.length || 0}{" "}
  //               participants
  //             </span>
  //           </p>
  //         </div>
  //       </div>
  //       <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between">
  //         <span>Room ID: {challenge.id.substring(0, 8)}...</span>
  //         <Button
  //           size="sm"
  //           variant="ghost"
  //           className="h-6 p-0"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             copyRoomInfo(challenge);
  //           }}
  //         >
  //           <Copy className="h-3 w-3 mr-1" />
  //           Copy Info
  //         </Button>
  //       </div>
  //     </CardContent>
  //     {actions && (
  //       <CardFooter className="flex justify-end">
  //         {actions}
  //       </CardFooter>
  //     )}
  //   </Card>
  // );

  return (
    <div className="min-h-screen rounded-lg shadow-lg text-foreground pt-16 pb-8">
      <MainNavbar />

      <p className="flex justify-center ">Ongoing Work</p>

      {/* {activeChallengeId ? (
        <main className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{activeChallenge?.title || "Active Challenge"}</h1>
            <Button
              variant="outline"
              onClick={() => {
                setActiveChallengeId(null);
                setActiveChallenge(null);
              }}
              className="text-sm"
            >
              Exit Challenge
            </Button>
          </div>
        </main>
      ) : (
        <main className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Challenges</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Join Private
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </div> */}

              {/* <div className=" gap-6">
                <Card className="bento-card shadow-green-500/5 hover:shadow-green-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-green-500" />
                      Quick Match
                    </CardTitle>
                    <CardDescription>Start a coding challenge instantly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Random Problem</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Solve a random problem with friends
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleQuickMatch("Easy")}
                        >
                          Easy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleQuickMatch("Medium")}
                        >
                          Medium
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleQuickMatch("Hard")}
                        >
                          Hard
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Challenge a Friend</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Create a private room and share the link
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => startFriendChallenge("Easy")}
                        >
                          Easy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => startFriendChallenge("Medium")}
                        >
                          Medium
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          onClick={() => startFriendChallenge("Hard")}
                        >
                          Hard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div> */}

              {/* <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="active">Active Challenges</TabsTrigger>
                  <TabsTrigger value="public">Public History</TabsTrigger>
                  <TabsTrigger value="private">Private History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeChallengesLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : activeChallenges?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeChallenges.map((challenge) =>
                        renderChallengeCard(
                          challenge,
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinChallenge(challenge);
                            }}
                          >
                            Join Challenge
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No active public challenges</p>
                      <Button
                        className="mt-4 bg-green-500 hover:bg-green-600"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Challenge
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="public" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      Public Challenge History
                    </h3>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-3 w-3 mr-1" /> Filter
                    </Button>
                  </div>

                  {publicHistoryLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : publicChallengeHistory?.challenges.length ? (
                    publicChallengeHistory.challenges.map((challenge) =>
                      renderChallengeCard(
                        challenge,
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          View Results
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )
                    )
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No public challenge history found</p>
                      <p className="text-xs text-zinc-400 mt-2">Join public challenges to see them here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="private" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-500" />
                      Private Challenge History
                    </h3>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-3 w-3 mr-1" /> Filter
                    </Button>
                  </div>

                  {privateHistoryLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : privateChallengeHistory?.challenges.length ? (
                    privateChallengeHistory.challenges.map((challenge) =>
                      renderChallengeCard(
                        challenge,
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                          View Results
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )
                    )
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No private challenge history found</p>
                      <p className="text-xs text-zinc-400 mt-2">Join private challenges to see them here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-8">
              <Card className="bento-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Problems Solved</span>
                    <span className="font-semibold">{totalProblemsDone}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Streak</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Longest Streak</span>
                    <span className="font-semibold">21 days</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">1750</span>
                      <span className="text-xs text-green-500">+15</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Global Rank</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">#1,245</span>
                      <span className="text-xs text-green-500">+32</span>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
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
        onSuccess={handleJoinSuccess}
      /> */}
    </div>
  );
};

export default MinimalChallenges;
