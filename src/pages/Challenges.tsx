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
  Lock,
  Unlock,
  ChevronDown,
} from "lucide-react";
import { format, isValid, fromUnixTime } from "date-fns";
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
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import SubmissionHistory from "@/components/common/SubmissionHistory";
import ChallengeInterface from "@/components/challenges/ChallengeInterface";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import JoinPrivateChallenge from "@/components/challenges/JoinPrivateChallenge";
import FriendChallengeDialog from "@/components/challenges/FriendChallengeDialog";
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
    queryFn: () => getChallenges({ isPrivate: false }),
  });

  const { data: privateChallenges, isLoading: privateChallengesLoading } = useQuery({
    queryKey: ["private-challenges"],
    queryFn: () => getChallenges({ isPrivate: true }),
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

  // Type guard to ensure challenges is an array
  const activeChallengesToRender = Array.isArray(challenges)
    ? challenges.filter(c => c.is_active)
    : [];

  // Type guard to ensure publicChallenges is an array
  const activePublicChallengesToRender = Array.isArray(publicChallenges)
    ? publicChallenges.filter(c => c.is_active)
    : [];

  // Type guard to ensure privateChallenges is an array
  const activePrivateChallengesToRender = Array.isArray(privateChallenges)
    ? privateChallenges.filter(c => c.is_active)
    : [];

  // Type guard to ensure invites is an array
  const invitesToRender = Array.isArray(invites) ? invites : [];

  // Date formatting function
  const formatChallengeDate = (timestamp?: number): string => {
    if (!timestamp || !Number.isFinite(timestamp)) return "Unknown date";

    const date = fromUnixTime(timestamp); // assumes timestamp is in seconds
    if (!isValid(date)) return "Invalid date";

    const year = date.getFullYear();
    if (year < 1970 || year > 2030) return "Invalid date";

    return format(date, "MM/dd/yyyy");
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
              accessCode={activeChallenge?.access_code}
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
              {/* Other sections omitted for brevity */}
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="invites">Invites</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                  {!challengesLoading && activeChallengesToRender.map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => loadChallenge(challenge.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {challenge.title}
                            {challenge.is_private && (
                              <Lock className="h-4 w-4 text-amber-500" />
                            )}
                          </CardTitle>
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded dark:bg-green-900/30 dark:text-green-300">
                            {challenge.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Created: {formatChallengeDate(challenge.created_at)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={challenge.createdBy?.profileImage || "/default-avatar.png"}
                              alt={challenge.createdBy?.username || "Unknown"}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy?.username || "Unknown"}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Created by</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Problems: {challenge.problem_ids?.length || 0}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Participants: {challenge.participant_ids?.length || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Challenge Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="flex flex-col items-start">
                              <span className="font-medium">Participants</span>
                              {challenge.participant_ids?.length ? (
                                challenge.participant_ids.map((id) => (
                                  <span key={id} className="text-sm text-zinc-600 dark:text-zinc-400">
                                    User: {id}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">No participants</span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Join Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {(challengesLoading || activeChallengesToRender.length === 0) && (
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
                  {!publicChallengesLoading && activePublicChallengesToRender.map((challenge) => (
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
                            <img
                              src={challenge.createdBy?.profileImage || "/default-avatar.png"}
                              alt={challenge.createdBy?.username || "Unknown"}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy?.username || "Unknown"}</p>
                              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                <span>{formatChallengeDate(challenge.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{challenge.participant_ids?.length || 0} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problem_ids?.length || 0} problems</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Challenge Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="flex flex-col items-start">
                              <span className="font-medium">Participants</span>
                              {challenge.participant_ids?.length ? (
                                challenge.participant_ids.map((id) => (
                                  <span key={id} className="text-sm text-zinc-600 dark:text-zinc-400">
                                    User: {id}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">No participants</span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Join Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {(publicChallengesLoading || activePublicChallengesToRender.length === 0) && (
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
                  {!privateChallengesLoading && activePrivateChallengesToRender.map((challenge) => (
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
                            <img
                              src={challenge.createdBy?.profileImage || "/default-avatar.png"}
                              alt={challenge.createdBy?.username || "Unknown"}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{challenge.createdBy?.username || "Unknown"}</p>
                              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                <span>{formatChallengeDate(challenge.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{challenge.participant_ids?.length || 0} participants</span>
                              <Users className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problem_ids?.length || 0} problems</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Challenge Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="flex flex-col items-start">
                              <span className="font-medium">Participants</span>
                              {challenge.participant_ids?.length ? (
                                challenge.participant_ids.map((id) => (
                                  <span key={id} className="text-sm text-zinc-600 dark:text-zinc-400">
                                    User: {id}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">No participants</span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                          Continue Challenge
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {(privateChallengesLoading || activePrivateChallengesToRender.length === 0) && (
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
                {/* Invites tab unchanged */}
              </Tabs>
              <SubmissionHistory />
            </div>
            {/* Right column unchanged */}
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