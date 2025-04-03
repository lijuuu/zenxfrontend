import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Puzzle, Trophy, UserPlus, Github, Globe, MapPin, Clock, BarChart3, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllChallenges, getUserChallenges } from "@/api/challengeApi";
import { getUserProfile } from "@/api/userApi";
import { UserProfile, Challenge } from "@/api/types";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ChallengesList from "@/components/profile/ChallengesList";
import ContributionActivity from "@/components/ContributionActivity";
import MonthlyActivityHeatmap from "@/components/MonthlyActivityHeatmap";
import ProblemsSolvedChart from "@/components/profile/ProblemsSolvedChart";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import MainNavbar from "@/components/MainNavbar";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const isMobile = useIsMobile();
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    isError: profileError 
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId || 'current'),
    retry: false,
  });
  
  useEffect(() => {
    const loadChallenges = async () => {
      if (profile) {
        try {
          const userChallenges = await getUserChallenges(profile.id);
          setChallenges(userChallenges);
        } catch (error) {
          console.error("Failed to load user challenges:", error);
          toast({
            title: "Error",
            description: "Failed to load user challenges. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadChallenges();
  }, [profile, toast]);
  
  // Count private and public challenges
  const privateChallenges = challenges.filter(c => c.isPrivate).length;
  const publicChallenges = challenges.filter(c => !c.isPrivate).length;
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-5 pb-8">
        <div className="page-container">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <div className="h-24 w-full animate-pulse bg-zinc-800 rounded-md"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-40 animate-pulse bg-zinc-800 rounded-md"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-64 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-64 animate-pulse bg-zinc-800 rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (profileError) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-5 pb-8">
        <div className="page-container">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load profile</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen  text-white">
      <MainNavbar/>
      <main className="pt-20 pb-8">
        <div className="page-container">
          <div className="w-full max-w-6xl mx-auto">
            {/* Profile Overview */}
            <Card className="mb-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
              <CardContent className="p-6">
                {/* Profile Header Section */}
                <ProfileHeader profile={profile!} userId={userId} />
              </CardContent>
            </Card>
            
            {/* Stats Section */}
            <Card className="mb-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" /> Statistics Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ProfileStats profile={profile!} />
                
                {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Challenges</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Public</span>
                        </div>
                        <span className="font-medium">{publicChallenges}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm">Private</span>
                        </div>
                        <span className="font-medium">{privateChallenges}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Current</span>
                        </div>
                        <span className="font-medium">{profile?.currentStreak || 0} days</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Longest</span>
                        </div>
                        <span className="font-medium">{profile?.longestStreak || 0} days</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Current</span>
                        </div>
                        <span className="font-medium">{profile?.currentRating || 0}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Global Rank</span>
                        </div>
                        <span className="font-medium">#{profile?.globalRank || '-'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}
              </CardContent>
            </Card>
            
            {/* Activity Section - Only show on small screens */}
            {isMobile && (
              <Card className="mb-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 sm:hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" /> Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <MonthlyActivityHeatmap showTitle={false} />
                </CardContent>
              </Card>
            )}
            
            {/* Activity & Challenges Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Problems Solved */}
              <div className="lg:col-span-8 space-y-6">
                <Tabs defaultValue="problems" className="w-full">
                  <TabsList className="w-full justify-start bg-zinc-800 border-zinc-700">
                    <TabsTrigger value="problems" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Problems Solved</TabsTrigger>
                    <TabsTrigger value="submissions" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Recent Submissions</TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="problems" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <ProblemsSolvedChart profile={profile!} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="submissions" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <RecentSubmissions userId={profile?.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <ProfileAchievements badges={profile?.badges || []} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column - Challenges */}
              <div className="lg:col-span-4">
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" /> Challenges
                    </CardTitle>
                    <CardDescription>
                      Total: {challenges.length} ({publicChallenges} public, {privateChallenges} private)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChallengesList challenges={challenges} />
                    
                    <div className="mt-4 pt-4 border-t border-zinc-700/50">
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Puzzle className="mr-2 h-4 w-4" />
                        View All Challenges
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {profile?.website || profile?.githubProfile || profile?.location ? (
                  <Card className="mt-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Links & Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile?.website && (
                        <a 
                          href={profile.website}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm truncate">{profile.website}</span>
                        </a>
                      )}
                      
                      {profile?.githubProfile && (
                        <a 
                          href={`https://github.com/${profile.githubProfile}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="text-sm truncate">{profile.githubProfile}</span>
                        </a>
                      )}
                      
                      {profile?.location && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
