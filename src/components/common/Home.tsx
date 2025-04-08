import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Sword, Trophy, Code, Flame, ArrowRight, Users, Github, Zap, Shield, Star,Sparkles } from 'lucide-react';
import Footer from './Footer';
import ChatBattleNotification from '@/components/challenges/ChatBattleNotification';
import MainNavbar from './MainNavbar';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);

  const handleQuickMatch = () => {
    navigate('/quick-match');
  };

  const handleChallengeAccept = () => {
    toast({
      title: "Challenge accepted",
      description: "You've joined the coding battle",
    });
    navigate('/challenges');
  };

  const mockBattleChallenge = {
    id: 'battle-1',
    title: 'Algorithm Masters Duel',
    isPrivate: true,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    expiresIn: '30 minutes',
    sender: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/300?img=11'
    },
    timestamp: '5 minutes ago'
  };

  useEffect(() => {
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar isAuthenticated={false} />

      <main className="flex-1 bg-gradient-to-b from-white to-green-50 dark:from-zinc-900 dark:to-zinc-950">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 md:px-8">
            <div className={`text-center max-w-4xl mx-auto transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-block mb-6">
                <Badge className="bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/60 px-3 py-1">
                  <Zap className="h-3.5 w-3.5 mr-1 inline-block" /> Competitive Coding
                </Badge>
              </div>

              <h1 className="text-4xl p-2 md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 z-10">
                Become a Better Developer Through Challenges
              </h1>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
                Start your coding journey with fun challenges designed for all skill levels, including beginners!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleQuickMatch}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Flame className="h-5 w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Quick Match</span>
                 
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/challenges')}
                  className="py-6 px-8 rounded-xl dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                >
                  <Sword className="h-5 w-5" />
                  Browse Challenges
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mock Battle Interface */}
        <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjI')] opacity-[0.03]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center gap-1 mb-3">
                <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 hover:dark:bg-green-900/30">
                  <Star className="h-3 w-3 mr-1" /> New Feature
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Exciting 1v1 <span className="text-secondary-foreground relative">
                  Code Battles
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500/30 rounded-full"></span>
                </span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Practice coding with friendly matches perfect for beginners and experienced coders alike.
              </p>
            </div>

            <div className="max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform">
              <ChatBattleNotification
                challenge={mockBattleChallenge}
                onAccept={handleChallengeAccept}
                onDecline={() => toast({ description: "Challenge declined" })}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 hover:dark:bg-green-900/50 px-3 py-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" /> Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to <span className="text-green-500">excel</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Start coding with beginner-friendly tools to learn, practice, and grow your skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Code className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">Real-world Problems</CardTitle>
                  <CardDescription className="text-base">
                    Learn coding with simple, practical challenges perfect for beginners.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <GitCompare className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">Live Competition</CardTitle>
                  <CardDescription className="text-base">
                    Practice with other beginners in fun, friendly coding matches.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Trophy className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">Leaderboard</CardTitle>
                  <CardDescription className="text-base">
                    See your progress and celebrate your coding wins as you learn.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-color text-white relative overflow-hidden">
          {/* Diagonal pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEgwdjU5LjkxaDU5LjkxVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iNTkuOTEgNTkuOTFMMCAwdjU5LjkxaDU5LjkxWiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="container mx-auto px-4 md:px-8 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Ready to challenge yourself?
                </h2>
                <p className="text-lg text-green-50 mb-6">
                  Join a welcoming community where beginners can learn coding step by step.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-green-500 text-black hover:bg-green-600 py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-700/30 transition-all"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="py-6 px-8 rounded-xl bg-transparent border-white text-white hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 hover:dark:bg-green-900/50 px-3 py-1.5 shadow-sm">
                <Users className="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-400" /> Community
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Join our growing developer community
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Meet friendly coders, ask questions, and start your coding adventure together.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <Users className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">10,000+</CardTitle>
                  <CardDescription className="text-base">
                    Friendly coders welcoming beginners like you
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <Code className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">100+</CardTitle>
                  <CardDescription className="text-base">
                    Easy-to-learn challenges for new coders
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-green-100 dark:border-green-900/30 dark:bg-zinc-800/90 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-green-200 dark:hover:border-green-800">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-4 relative overflow-hidden group shadow-md">
                    <div className="absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 bg-gradient-to-br from-green-400 to-emerald-600"></div>
                    <Github className="h-7 w-7 text-green-600 dark:text-green-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">Open Source</CardTitle>
                  <CardDescription className="text-base">
                    Explore coding with our beginner-friendly platform
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;