import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  PlusCircle,
  Users,
  Activity,
  Zap,
  Trophy,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Cpu,
  Shuffle,
  Lock,
  Unlock,
  Search
} from "lucide-react";
import MainNavbar from "@/components/MainNavbar";
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
import ActivityHeatmapRounded from "@/components/ActivityHeatmapRounded";
import ReferralBanner from "@/components/ReferralBanner";
import SubmissionHistory from "@/components/SubmissionHistory";
import ChallengeInterface from "@/components/ChallengeInterface";
import CreateChallengeForm from "@/components/CreateChallengeForm";
import JoinPrivateChallenge from "@/components/JoinPrivateChallenge";
import FriendChallengeDialog from "@/components/challenges/FriendChallengeDialog";
// import UserSearch from "@/components/UserSearch";
import { getChallenges, getChallenge, getChallengeInvites } from "@/api/challengeApi";
import { Challenge } from "@/api/types";

const Challenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isFriendChallengeOpen, setIsFriendChallengeOpen] = useState(false);
  const navigate = useNavigate();

  const { data: challenges, isLoading: challengesLoading, refetch: refetchChallenges } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getChallenges(),
  });

  const { data: publicChallenges, isLoading: publicChallengesLoading } = useQuery({
    queryKey: ["public-challenges"],
    queryFn: () => getChallenges({ private: false }),
  });

  const { data: privateChallenges, isLoading: privateChallengesLoading } = useQuery({
    queryKey: ["private-challenges"],
    queryFn: () => getChallenges({ private: true }),
  });

  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ["challenge-invites"],
    queryFn: getChallengeInvites,
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

  const handleQuickMatch = () => {
    navigate('/quick-match');
  };

  const handleChallengeAFriend = () => {
    setIsFriendChallengeOpen(true);
  };

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
                      <Users className="h-5 w-5 text-green-500" />
                      1v1 Challenges
                    </CardTitle>
                    <CardDescription>
                      Challenge friends or random opponents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quick Match</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Find an opponent with similar skill</p>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleQuickMatch}>
                        Start
                      </Button>
                    </div>

                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Challenge a Friend</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Send a challenge to a specific user</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleChallengeAFriend}>
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bento-card shadow-blue-500/5 hover:shadow-blue-500/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-blue-500" />
                      Competitions
                    </CardTitle>
                    <CardDescription>
                      Participate in contests and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Weekly Contest #145</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>Tomorrow, 10:00 AM</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Register
                      </Button>
                    </div>

                    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Algorithm Battle</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>Friday, 7:00 PM</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* <UserSearch className="w-full" /> */}

              {/* <ReferralBanner /> */}

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="invites">Invites</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {!challengesLoading && challenges?.filter(c => c.isActive).map((challenge) => (
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
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Participants: {challenge.participants}</p>
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

                  {(challengesLoading || !challenges?.filter(c => c.isActive).length) && (
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
                  {!publicChallengesLoading && publicChallenges?.filter(c => c.isActive).map((challenge) => (
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
                          <Unlock className="h-3 w-3 text-green-500" /> Public Challenge
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
                              <span className="text-sm">{challenge.participants} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problemCount} problems</p>
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

                  {(publicChallengesLoading || !publicChallenges?.filter(c => c.isActive).length) && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No public challenges found</p>
                      <Button
                        className="mt-4 bg-green-500 hover:bg-green-600"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Public Challenge
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="private" className="space-y-4">
                  {!privateChallengesLoading && privateChallenges?.filter(c => c.isActive).map((challenge) => (
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
                          <Lock className="h-3 w-3 text-amber-500" /> Private Challenge
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
                              <span className="text-sm">{challenge.participants} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problemCount} problems</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                          Continue Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(privateChallengesLoading || !privateChallenges?.filter(c => c.isActive).length) && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No private challenges found</p>
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsJoinModalOpen(true)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Join with Code
                        </Button>
                        <Button
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Private Challenge
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="invites" className="space-y-4">
                  {!invitesLoading && invites?.map((invite) => (
                    <Card
                      key={invite.challengeId}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          {invite.challengeTitle}
                          {invite.isPrivate && (
                            <Lock className="h-4 w-4 text-amber-500" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          Invited by {invite.invitedBy}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {invite.isPrivate
                            ? "You've been invited to join a private challenge."
                            : "You've been invited to participate in this challenge."
                          }
                        </p>
                        {invite.isPrivate && invite.accessCode && (
                          <div className="mt-2 p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-amber-500" />
                              <span className="font-mono text-sm">Code: {invite.accessCode}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className={invite.isPrivate ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
                          onClick={() => loadChallenge(invite.challengeId)}
                        >
                          Accept Invite
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  {(invitesLoading || !invites?.length) && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No challenge invites</p>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
                        When someone invites you to a challenge, it will appear here
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <SubmissionHistory />
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
                    <Users className="h-5 w-5 text-blue-500" />
                    Friends Online
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Alex Johnson</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Taylor Smith</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Friend" className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-zinc-300 rounded-full border-2 border-white dark:border-zinc-900"></span>
                      </div>
                      <span className="text-sm font-medium">Jamie Parker</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Away</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Message
                    </Button>
                  </div>

                  <Link to="/profile" className="flex items-center justify-center gap-1 text-sm font-medium text-zenblue mt-2 hover:underline">
                    View All Friends
                    <ChevronRight className="h-4 w-4" />
                  </Link>
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

      <FriendChallengeDialog
        isOpen={isFriendChallengeOpen}
        onClose={() => setIsFriendChallengeOpen(false)}
      />
    </div>
  );
};

export default Challenges;
