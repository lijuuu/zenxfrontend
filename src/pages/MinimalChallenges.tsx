
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Search
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getChallenges, getChallenge } from "@/api/challengeApi";
import { Challenge } from "@/api/types";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import JoinPrivateChallenge from "@/components/challenges/JoinPrivateChallenge";
import ChallengeInterface from "@/components/challenges/ChallengeInterface";

interface UserEntry {
  userID: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
  rank?: number;
  score?: number;
  isFriend?: boolean;
}

const MinimalChallenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: activeChallenges, isLoading: activeChallengesLoading, refetch: refetchChallenges } = useQuery({
    queryKey: ["active-challenges"],
    queryFn: () => getChallenges({ active: true }),
  });

  const { data: publicChallenges, isLoading: publicChallengesLoading } = useQuery({
    queryKey: ["public-challenges-history"],
    queryFn: () => getChallenges({ private: false }),
  });

  const { data: privateChallenges, isLoading: privateChallengesLoading } = useQuery({
    queryKey: ["private-challenges-history"],
    queryFn: () => getChallenges({ private: true }),
  });

  const loadChallenge = async (id: string) => {
    try {
      const challenge = await getChallenge(id);
      if (challenge) {
        setActiveChallenge(challenge);
        setActiveChallengeId(id);
      }
    } catch (error) {
      console.error("Failed to load challenge:", error);
    }
  };

  const handleChallengeCreated = (newChallenge: Challenge) => {
    refetchChallenges();
  };

  const handleJoinSuccess = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setActiveChallengeId(challenge.id);
  };

  // Fix: Render participant count instead of participants array
  const renderParticipantCount = (challenge: Challenge) => {
    return typeof challenge.participants === 'number' 
      ? challenge.participants 
      : Array.isArray(challenge.participants) 
        ? challenge.participants.length 
        : 0;
  };

  // Mock top performers data
  const topPerformers: UserEntry[] = [
    {
      userID: "1",
      userName: "alex_johnson",
      firstName: "Alex",
      lastName: "Johnson",
      avatarURL: "https://randomuser.me/api/portraits/men/32.jpg",
      rank: 1,
      score: 428
    },
    {
      userID: "2",
      userName: "taylor_smith",
      firstName: "Taylor",
      lastName: "Smith",
      avatarURL: "https://randomuser.me/api/portraits/women/44.jpg",
      rank: 2,
      score: 412
    },
    {
      userID: "3",
      userName: "jamie_parker",
      firstName: "Jamie",
      lastName: "Parker",
      avatarURL: "https://randomuser.me/api/portraits/men/86.jpg",
      rank: 3,
      score: 387
    }
  ];

  return (
    <div className="min-h-screen rounded-lg shadow-lg text-foreground pt-16 pb-8">
      <MainNavbar />

      {activeChallengeId ? (
        <main className="page-container py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {activeChallenge?.title || "Active Challenge"}
            </h1>
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

          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm h-[calc(100vh-180px)] min-h-[600px]">
            <ChallengeInterface
              challenge={activeChallenge}
              isPrivate={activeChallenge?.isPrivate}
              accessCode={activeChallenge?.accessCode}
            />
          </div>
        </main>
      ) : (
        <main className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Challenges</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsJoinModalOpen(true)}
                  >
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bento-card shadow-green-500/5 hover:shadow-green-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-green-500" />
                      Quick Match
                    </CardTitle>
                    <CardDescription>
                      Challenge random opponents (Coming Soon)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Feature Locked</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">This feature will be available soon</p>
                      </div>
                      <Button size="sm" className="bg-zinc-500 hover:bg-zinc-600" disabled>
                        Locked
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bento-card shadow-blue-500/5 hover:shadow-blue-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-blue-500" />
                      Your Stats
                    </CardTitle>
                    <CardDescription>
                      Challenge participation statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Challenges Completed</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Win Rate</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Problems Solved</span>
                      <span className="font-semibold">87</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="active">Active Challenges</TabsTrigger>
                  <TabsTrigger value="public">Public History</TabsTrigger>
                  <TabsTrigger value="private">Private History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {!activeChallengesLoading && activeChallenges?.filter(c => c.isActive).map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => loadChallenge(challenge.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {challenge.title}
                            {challenge.isPrivate && (
                              <Lock className="h-4 w-4 text-amber-500" />
                            )}
                          </CardTitle>
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900/30 dark:text-green-300">
                            {challenge.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Created: {new Date(challenge.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={challenge.createdBy.profileImage} alt={challenge.createdBy.username} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy.username}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Created by</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Problems: {challenge.problemCount}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Participants: {renderParticipantCount(challenge)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Join Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(activeChallengesLoading || !activeChallenges?.filter(c => c.isActive).length) && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No active challenges</p>
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
                  {!publicChallengesLoading && publicChallenges?.filter(c => !c.isActive).map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => loadChallenge(challenge.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{challenge.title}</CardTitle>
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900/30 dark:text-green-300">
                            {challenge.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Unlock className="h-3 w-3 text-green-500" /> Public Challenge History
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={challenge.createdBy.profileImage} alt={challenge.createdBy.username} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy.username}</p>
                              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{renderParticipantCount(challenge)} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problemCount} problems</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          View Results
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(publicChallengesLoading || !publicChallenges?.filter(c => !c.isActive).length) && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No public challenge history found</p>
                      <p className="text-xs text-zinc-400 mt-2">Join public challenges to see them here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="private" className="space-y-4">
                  {!privateChallengesLoading && privateChallenges?.filter(c => !c.isActive).map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-amber-200/30 dark:border-amber-800/30"
                      onClick={() => loadChallenge(challenge.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {challenge.title}
                            <Lock className="h-4 w-4 text-amber-500" />
                          </CardTitle>
                          <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded dark:bg-amber-900/30 dark:text-amber-300">
                            {challenge.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-amber-500" /> Private Challenge History
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={challenge.createdBy.profileImage} alt={challenge.createdBy.username} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy.username}</p>
                              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{renderParticipantCount(challenge)} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problemCount} problems</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                          View Results
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(privateChallengesLoading || !privateChallenges?.filter(c => !c.isActive).length) && (
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
                    <span className="font-semibold">124</span>
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

              <Card className="bento-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-green-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topPerformers.map((performer) => (
                    <div key={performer.userID} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img src={performer.avatarURL} alt={`${performer.firstName} ${performer.lastName}`} className="w-8 h-8 rounded-full" />
                          {performer.rank === 1 && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-medium">{performer.firstName} {performer.lastName}</span>
                          <p className="text-xs text-zinc-500">Solved: {performer.score} problems</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        performer.rank === 1 
                          ? "bg-green-500/10 text-green-500" 
                          : performer.rank === 2 
                          ? "bg-blue-500/10 text-blue-500" 
                          : "bg-purple-500/10 text-purple-500"
                      }`}>
                        #{performer.rank}
                      </span>
                    </div>
                  ))}
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
      />
    </div>
  );
};

export default MinimalChallenges;
