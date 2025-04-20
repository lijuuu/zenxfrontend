import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  PlusCircle,
  Users,
  ChevronRight,
  Calendar,
  Clock,
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
import SubmissionHistory from "@/components/common/SubmissionHistory";
import ChallengeInterface from "@/components/challenges/ChallengeInterface";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import JoinPrivateChallenge from "@/components/challenges/JoinPrivateChallenge";
import FriendChallengeDialog from "@/components/challenges/FriendChallengeDialog";
import { getChallenges, getChallenge, getChallengeInvites } from "@/api/challengeApi";
import { Challenge } from "@/api/types";
import ChallengeCard from "@/components/challenges/ChallengeCard";

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
    ? challenges.filter(c => c.isActive)
    : [];

  // Type guard to ensure publicChallenges is an array
  const activePublicChallengesToRender = Array.isArray(publicChallenges)
    ? publicChallenges.filter(c => c.isActive)
    : [];

  // Type guard to ensure privateChallenges is an array
  const activePrivateChallengesToRender = Array.isArray(privateChallenges)
    ? privateChallenges.filter(c => c.isActive)
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
              
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="invites">Invites</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {challenges?.map((challenge) => (
                    <div key={challenge.id} onClick={() => loadChallenge(challenge.id)}>
                      <ChallengeCard challenge={challenge} />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="public" className="space-y-4">
                  {publicChallenges?.map((challenge) => (
                    <div key={challenge.id} onClick={() => loadChallenge(challenge.id)}>
                      <ChallengeCard challenge={challenge} />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="private" className="space-y-4">
                  {privateChallenges?.map((challenge) => (
                    <div key={challenge.id} onClick={() => loadChallenge(challenge.id)}>
                      <ChallengeCard challenge={challenge} />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="invites" className="space-y-4">
                  {!invitesLoading && invitesToRender.map((invite) => (
                    <Card key={invite.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            Challenge Invite: {invite.challengeTitle}
                            {invite.isPrivate && (
                              <Lock className="h-4 w-4 text-amber-500" />
                            )}
                          </CardTitle>
                          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded dark:bg-blue-900/30 dark:text-blue-300">
                            {invite.difficulty}
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> Invited by: {invite.inviterUsername}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          You have been invited to join this challenge. Do you want to accept?
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Accept Invite
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {invitesLoading && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">Loading invites...</p>
                    </div>
                  )}
                  {!invitesLoading && invitesToRender.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-zinc-500 dark:text-zinc-400">No invites found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <SubmissionHistory />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Start or join a challenge quickly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Match
                  </Button>
                  <Button onClick={handleChallengeAFriend} className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Challenge a Friend
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>
                    Recent activities and submissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>No recent activity.</p>
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
