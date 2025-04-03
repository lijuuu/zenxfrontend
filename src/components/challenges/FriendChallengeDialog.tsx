
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Search, 
  Sword, 
  Trophy, 
  Shield, 
  Clock, 
  X,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { searchUsers } from '@/api/challengeApi';
import { User as UserType } from '@/api/types';
import { useToast } from '@/hooks/use-toast';
import ChallengeBattleInvite from '../chat/ChallengeBattleInvite';

interface FriendChallengeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Create a simplified Friend type that doesn't need all User properties
interface FriendItem {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  isOnline?: boolean;
}

const FriendChallengeDialog: React.FC<FriendChallengeDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendItem | null>(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState('5');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock friends data
  const friends: FriendItem[] = [
    { id: '1', username: 'sophie', fullName: 'Sophie Williams', profileImage: 'https://i.pravatar.cc/300?img=9', isOnline: true },
    { id: '2', username: 'taylor', fullName: 'Taylor Smith', profileImage: 'https://i.pravatar.cc/300?img=5', isOnline: false },
    { id: '3', username: 'mchen', fullName: 'Mike Chen', profileImage: 'https://i.pravatar.cc/300?img=3', isOnline: true },
    { id: '4', username: 'alex', fullName: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/300?img=4', isOnline: false },
    { id: '5', username: 'emma', fullName: 'Emma Wilson', profileImage: 'https://i.pravatar.cc/300?img=2', isOnline: true },
  ];

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectFriend = (friend: FriendItem | UserType) => {
    // Create a FriendItem from either a FriendItem or UserType
    const friendItem: FriendItem = {
      id: friend.id,
      username: friend.username,
      fullName: friend.fullName,
      profileImage: friend.profileImage || '',
      isOnline: 'isOnline' in friend ? friend.isOnline : undefined
    };
    
    setSelectedFriend(friendItem);
    setShowPreview(false);
  };

  const handleSendChallenge = () => {
    if (!selectedFriend) {
      toast({
        title: "No friend selected",
        description: "Please select a friend to challenge",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // In a real app, this would send an API request
    setTimeout(() => {
      toast({
        title: "Challenge sent!",
        description: `Your challenge has been sent to ${selectedFriend.fullName}`,
      });
      
      setIsLoading(false);
      onClose();
      
      // In a real app, this would redirect to the challenge or chat page
      // navigate('/chat');
    }, 1000);
  };

  const handlePreview = () => {
    if (!selectedFriend) {
      toast({
        title: "No friend selected",
        description: "Please select a friend to challenge",
        variant: "destructive"
      });
      return;
    }
    
    setShowPreview(true);
  };

  const getTimeLimitText = () => {
    const minutes = parseInt(timeLimit);
    return `${minutes} min`;
  };

  const mockChallenge = {
    id: "challenge-preview",
    title: "Coding Battle",
    isPrivate: true,
    accessCode: "XYZ123",
    expiresIn: getTimeLimitText(),
    participants: 2,
    difficulty: difficulty as "easy" | "medium" | "hard"
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sword className="mr-2 h-5 w-5 text-orange-500" />
            Challenge a Friend
          </DialogTitle>
          <DialogDescription>
            Select a friend and set up a coding battle
          </DialogDescription>
        </DialogHeader>

        {showPreview ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Challenge Preview</h3>
            <ChallengeBattleInvite 
              challenge={mockChallenge}
              onAccept={() => {}}
              onDecline={() => setShowPreview(false)}
            />
            <DialogFooter className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Back to Edit
              </Button>
              <Button 
                className="accent-color"
                onClick={handleSendChallenge}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Challenge'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Tabs defaultValue="friends" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="search">Search Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="friends" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Select a Friend</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> 
                  <span>{friends.length} Friends</span>
                </Badge>
              </div>
              
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <Card 
                      key={friend.id} 
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedFriend?.id === friend.id 
                          ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5" 
                          : "hover:bg-accent/5"
                      )}
                      onClick={() => selectFriend(friend)}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            <img 
                              src={friend.profileImage} 
                              alt={friend.fullName} 
                              className="w-10 h-10 rounded-full"
                            />
                            {friend.isOnline && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{friend.fullName}</h4>
                            <p className="text-xs text-muted-foreground">
                              @{friend.username} • {friend.isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        
                        {selectedFriend?.id === friend.id ? (
                          <CheckCircle className="h-5 w-5 text-[hsl(var(--accent-green))]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-dashed border-muted-foreground"></div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="accent-color"
                  disabled={searchQuery.length < 2 || isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              <ScrollArea className="h-[160px] pr-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <Card 
                        key={user.id} 
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedFriend?.id === user.id 
                            ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5" 
                            : "hover:bg-accent/5"
                        )}
                        onClick={() => selectFriend(user)}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={user.profileImage} 
                              alt={user.fullName} 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-medium text-sm">{user.fullName}</h4>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                          
                          {selectedFriend?.id === user.id ? (
                            <CheckCircle className="h-5 w-5 text-[hsl(var(--accent-green))]" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-dashed border-muted-foreground"></div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground">Try a different search term</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <Search className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-muted-foreground">Search for users</p>
                    <p className="text-xs text-muted-foreground">Enter at least 2 characters</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <div className="space-y-4 mt-6 pt-4 border-t">
              <div>
                <Label>Difficulty</Label>
                <RadioGroup 
                  value={difficulty} 
                  onValueChange={setDifficulty}
                  className="flex space-x-2 mt-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="easy" id="easy" className="sr-only" />
                    <Label 
                      htmlFor="easy" 
                      className={cn(
                        "px-2 py-1 text-xs rounded-full cursor-pointer",
                        difficulty === "easy" 
                          ? "bg-green-500 text-white" 
                          : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      )}
                    >
                      Easy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="medium" id="medium" className="sr-only" />
                    <Label 
                      htmlFor="medium" 
                      className={cn(
                        "px-2 py-1 text-xs rounded-full cursor-pointer",
                        difficulty === "medium" 
                          ? "bg-amber-500 text-white" 
                          : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                      )}
                    >
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="hard" id="hard" className="sr-only" />
                    <Label 
                      htmlFor="hard" 
                      className={cn(
                        "px-2 py-1 text-xs rounded-full cursor-pointer",
                        difficulty === "hard" 
                          ? "bg-red-500 text-white" 
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      )}
                    >
                      Hard
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Time Limit</Label>
                <RadioGroup 
                  value={timeLimit} 
                  onValueChange={setTimeLimit}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="time-5" />
                    <Label htmlFor="time-5">5 minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="time-15" />
                    <Label htmlFor="time-15">15 minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="time-30" />
                    <Label htmlFor="time-30">30 minutes</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={!selectedFriend || isLoading}
                  className="flex gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  className="accent-color"
                  onClick={handleSendChallenge}
                  disabled={!selectedFriend || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Challenge'}
                </Button>
              </div>
            </DialogFooter>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendChallengeDialog;
