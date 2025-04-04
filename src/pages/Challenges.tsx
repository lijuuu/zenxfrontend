
import React, { useState, useEffect } from 'react';
import MainNavbar from '@/components/MainNavbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ChallengeSidebar from '@/components/challenges/ChallengeSidebar';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, SortAsc, Users, Trophy, Target } from 'lucide-react';
import { getChallenges } from '@/api/challengeApi';
import { Challenge } from '@/api/types';
import CreateChallengeForm from '@/components/challenges/CreateChallengeForm';
import FriendChallengeDialog from '@/components/challenges/FriendChallengeDialog';
import JoinPrivateChallenge from '@/components/challenges/JoinPrivateChallenge';
import { Skeleton } from '@/components/ui/skeleton';

const Challenges = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [privateChallenges, setPrivateChallenges] = useState<Challenge[]>([]);
  const [createdChallenges, setCreatedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [challengeCreated, setChallengeCreated] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const data = await getChallenges();
        setChallenges(data);
        
        // Filter challenges based on type
        setPublicChallenges(data.filter(challenge => !challenge.isPrivate));
        setPrivateChallenges(data.filter(challenge => challenge.isPrivate && !challenge.ownerId));
        setCreatedChallenges(data.filter(challenge => challenge.ownerId));
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [challengeCreated]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const getFilteredChallenges = () => {
    switch (selectedFilter) {
      case 'active':
        return challenges.filter(challenge => challenge.status === 'active');
      case 'popular':
        return [...challenges].sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));
      case 'friends':
        return challenges.filter(challenge => challenge.participants?.some(p => p.isFriend));
      case 'weekly':
        return challenges.filter(challenge => challenge.type === 'weekly');
      case 'upcoming':
        return challenges.filter(challenge => new Date(challenge.startDate) > new Date());
      case 'recent':
        return [...challenges].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      case 'battle':
        return challenges.filter(challenge => challenge.type === 'battle');
      default:
        return challenges;
    }
  };

  const handleChallengeCreated = () => {
    setChallengeCreated(prev => !prev);
    setCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <ChallengeSidebar 
            onFilterChange={handleFilterChange}
            selectedFilter={selectedFilter}
          />
          
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Challenges</h1>
                <p className="text-zinc-400 mt-1">Compete with others and improve your skills</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Filter Challenges</DialogTitle>
                      <DialogDescription>
                        Apply filters to find the right challenges for you
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Filter controls go here */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Difficulty</label>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="bg-green-500/10 hover:bg-green-500/20">Easy</Button>
                          <Button variant="outline" size="sm" className="bg-yellow-500/10 hover:bg-yellow-500/20">Medium</Button>
                          <Button variant="outline" size="sm" className="bg-red-500/10 hover:bg-red-500/20">Hard</Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Status</label>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Active</Button>
                          <Button variant="outline" size="sm">Upcoming</Button>
                          <Button variant="outline" size="sm">Completed</Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trophy className="h-4 w-4 mr-2" />
                      Join Private
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <JoinPrivateChallenge />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Challenge Friend
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <FriendChallengeDialog />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="accent-color">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Challenge
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <CreateChallengeForm onSuccess={handleChallengeCreated} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="mb-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4 md:w-[500px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                  <TabsTrigger value="created">My Challenges</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="rounded-lg border border-zinc-800 overflow-hidden">
                          <div className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-6" />
                            <div className="flex gap-2 mb-4">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : getFilteredChallenges().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Target className="h-16 w-16 text-zinc-700 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No challenges found</h3>
                      <p className="text-zinc-500 max-w-md mb-6">
                        There are no challenges that match your filter criteria. Try changing your filters or create a new challenge.
                      </p>
                      <Button 
                        className="accent-color"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredChallenges().map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="public" className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-lg border border-zinc-800 overflow-hidden">
                          <div className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-6" />
                            <div className="flex gap-2 mb-4">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : publicChallenges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <h3 className="text-xl font-medium mb-2">No public challenges</h3>
                      <p className="text-zinc-500 max-w-md">Check back later for new challenges</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {publicChallenges.map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="private" className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2].map(i => (
                        <div key={i} className="rounded-lg border border-zinc-800 overflow-hidden">
                          <div className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-6" />
                            <div className="flex gap-2 mb-4">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : privateChallenges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <h3 className="text-xl font-medium mb-2">No private challenges</h3>
                      <p className="text-zinc-500 max-w-md">You haven't joined any private challenges yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {privateChallenges.map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="created" className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2].map(i => (
                        <div key={i} className="rounded-lg border border-zinc-800 overflow-hidden">
                          <div className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-full mb-6" />
                            <div className="flex gap-2 mb-4">
                              <Skeleton className="h-8 w-16" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : createdChallenges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <h3 className="text-xl font-medium mb-2">No created challenges</h3>
                      <p className="text-zinc-500 max-w-md mb-6">
                        You haven't created any challenges yet. Start a new challenge to compete with friends or other users.
                      </p>
                      <Button 
                        className="accent-color"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {createdChallenges.map((challenge) => (
                        <ChallengeCard key={challenge.id} challenge={challenge} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Challenges;
