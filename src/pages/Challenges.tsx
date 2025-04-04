
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Users, Lock, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MainNavbar from '@/components/MainNavbar';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import CreateChallengeForm from '@/components/challenges/CreateChallengeForm';
import FriendChallengeDialog from '@/components/challenges/FriendChallengeDialog';
import JoinPrivateChallenge from '@/components/challenges/JoinPrivateChallenge';
import { Challenge } from '@/api/types';
import { getChallenges } from '@/api/challengeApi';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [friendChallengeOpen, setFriendChallengeOpen] = useState(false);
  const [joinPrivateChallengeOpen, setJoinPrivateChallengeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      try {
        const challengesData = await getChallenges();
        setChallenges(challengesData);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
        toast({
          title: "Error",
          description: "Failed to load challenges. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const handleChallengeCreated = (newChallenge: Challenge) => {
    setChallenges(prevChallenges => [...prevChallenges, newChallenge]);
    setCreateChallengeOpen(false);
    toast({
      title: "Challenge Created",
      description: `Your challenge "${newChallenge.title}" has been created successfully!`,
    });
  };

  const handleChallengeJoined = (joinedChallenge: Challenge) => {
    setChallenges(prevChallenges => [...prevChallenges, joinedChallenge]);
    toast({
      title: "Challenge Joined",
      description: `You have successfully joined the challenge "${joinedChallenge.title}"!`,
    });
  };

  const filteredChallenges = challenges.filter(challenge => {
    const searchMatch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
    const difficultyMatch = difficultyFilter ? challenge.difficulty === difficultyFilter : true;

    let tabMatch = false;
    switch (activeTab) {
      case 'all':
        tabMatch = true;
        break;
      case 'active':
        tabMatch = challenge.status === 'active';
        break;
      case 'completed':
        tabMatch = challenge.status === 'completed';
        break;
      case 'private':
        tabMatch = challenge.isPrivate === true;
        break;
      default:
        tabMatch = true;
        break;
    }

    return searchMatch && difficultyMatch && tabMatch;
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Challenges</h1>
          <div className="flex space-x-4">
            <Button onClick={() => setCreateChallengeOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Challenge
            </Button>
            <Button variant="outline" onClick={() => setFriendChallengeOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Challenge Friends
            </Button>
            <Button variant="secondary" onClick={() => setJoinPrivateChallengeOpen(true)}>
              <Lock className="mr-2 h-4 w-4" />
              Join Private
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-4 mb-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All Challenges
          </Button>
          <Button
            variant={activeTab === 'active' ? 'default' : 'outline'}
            onClick={() => setActiveTab('active')}
          >
            Active
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'default' : 'outline'}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </Button>
          <Button
            variant={activeTab === 'private' ? 'default' : 'outline'}
            onClick={() => setActiveTab('private')}
          >
            Private
          </Button>
        </div>

        <JoinPrivateChallenge 
          isOpen={joinPrivateChallengeOpen}
          onClose={() => setJoinPrivateChallengeOpen(false)}
          onSuccess={handleChallengeJoined}
        />

        <FriendChallengeDialog 
          isOpen={friendChallengeOpen}
          onClose={() => setFriendChallengeOpen(false)}
        />

        <CreateChallengeForm 
          isOpen={createChallengeOpen}
          onClose={() => setCreateChallengeOpen(false)}
          onSuccess={handleChallengeCreated}
        />

        {loading ? (
          <div className="text-center">Loading challenges...</div>
        ) : (
          <>
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    createdBy={challenge.createdBy}
                    participants={typeof challenge.participants === 'number' ? challenge.participants : challenge.participants.length}
                    problemCount={challenge.problemCount || 0}
                    createdAt={challenge.createdAt}
                    description={challenge.description}
                    status={challenge.status}
                  />
                ))}
              </div>
            )}

            {activeTab === 'active' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    createdBy={challenge.createdBy}
                    participants={typeof challenge.participants === 'number' ? challenge.participants : challenge.participants.length}
                    problemCount={challenge.problemCount || 0}
                    createdAt={challenge.createdAt}
                    description={challenge.description}
                    status={challenge.status}
                  />
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    createdBy={challenge.createdBy}
                    participants={typeof challenge.participants === 'number' ? challenge.participants : challenge.participants.length}
                    problemCount={challenge.problemCount || 0}
                    createdAt={challenge.createdAt}
                    description={challenge.description}
                    status={challenge.status}
                  />
                ))}
              </div>
            )}

            {activeTab === 'private' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    id={challenge.id}
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    createdBy={challenge.createdBy}
                    participants={typeof challenge.participants === 'number' ? challenge.participants : challenge.participants.length}
                    problemCount={challenge.problemCount || 0}
                    createdAt={challenge.createdAt}
                    description={challenge.description}
                    status={challenge.status}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;
