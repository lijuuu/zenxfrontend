import React, { useState } from 'react';
import { Challenge } from '@/api/types';
import { X, Info, Plus, Users, Check, Sword, Trophy, Clock, FileCode } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChatChallengeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (challenge: any) => void;
}

const ChatChallengeDialog: React.FC<ChatChallengeDialogProps> = ({
  isOpen,
  onClose,
  onCreateChallenge
}) => {
  const [challengeType, setChallengeType] = useState('public');
  const [difficulty, setDifficulty] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresIn, setExpiresIn] = useState('24h');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [accessCode, setAccessCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Mock friends data
  const friends = [
    { id: '1', name: 'Sophie Williams', avatar: 'https://i.pravatar.cc/300?img=9', online: true },
    { id: '2', name: 'Taylor Smith', avatar: 'https://i.pravatar.cc/300?img=5', online: false },
    { id: '3', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/300?img=3', online: true },
    { id: '4', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/300?img=4', online: false },
    { id: '5', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/300?img=2', online: true },
  ];

  const handleCreateChallenge = () => {
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const challenge = {
        id: `challenge-${Date.now()}`,
        title,
        description,
        isPrivate: challengeType === 'private',
        difficulty,
        expiresIn,
        participants: selectedFriends.length + 1, // +1 for current user
        accessCode: challengeType === 'private' ? accessCode || `XYZ${Math.floor(Math.random() * 1000)}` : undefined,
        invitedUsers: selectedFriends.map(id => friends.find(f => f.id === id)),
        createdAt: new Date().toISOString()
      };
      
      onCreateChallenge(challenge);
      
      // Reset form and close
      resetForm();
      setIsCreating(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setChallengeType('public');
    setDifficulty('medium');
    setTitle('');
    setDescription('');
    setExpiresIn('24h');
    setSelectedFriends([]);
    setAccessCode('');
  };

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sword className="mr-2 h-5 w-5 text-orange-500" />
            Create Challenge
          </DialogTitle>
          <DialogDescription>
            Create a coding challenge to compete with friends or the community
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="invite">Invite Friends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="challenge-type">Challenge Type</Label>
              <RadioGroup 
                id="challenge-type" 
                value={challengeType} 
                onValueChange={setChallengeType}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center">
                    <Trophy className="mr-1.5 h-4 w-4 text-blue-500" />
                    Public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center">
                    <Sword className="mr-1.5 h-4 w-4 text-orange-500" />
                    Private Battle
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Challenge Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Algorithm Sprint"
                />
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <RadioGroup 
                  id="difficulty" 
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
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the challenge and its objectives..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="expires">Expires In</Label>
              <RadioGroup 
                id="expires" 
                value={expiresIn} 
                onValueChange={setExpiresIn}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="48h" id="48h" />
                  <Label htmlFor="48h">48 hours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7d" id="7d" />
                  <Label htmlFor="7d">7 days</Label>
                </div>
              </RadioGroup>
            </div>
            
            {challengeType === 'private' && (
              <div>
                <Label htmlFor="access-code" className="flex items-center">
                  Access Code
                  <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs">Optional</Badge>
                </Label>
                <div className="relative">
                  <Input 
                    id="access-code" 
                    value={accessCode} 
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter an access code or leave blank for auto-generation"
                    className="pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  An access code can be shared with friends to join your private challenge
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Select Friends to Invite</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" /> 
                <span>Selected: {selectedFriends.length}</span>
              </Badge>
            </div>
            
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-2">
                {friends.map((friend) => (
                  <Card 
                    key={friend.id} 
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedFriends.includes(friend.id) 
                        ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5" 
                        : "hover:bg-accent/5"
                    )}
                    onClick={() => toggleFriendSelection(friend.id)}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className="w-10 h-10 rounded-full"
                          />
                          {friend.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{friend.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {friend.online ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      
                      {selectedFriends.includes(friend.id) ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[hsl(var(--accent-green))]">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-dashed border-muted-foreground">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateChallenge} 
            className="accent-color"
            disabled={!title || isCreating}
          >
            {isCreating ? (
              <>Creating Challenge...</>
            ) : (
              <>
                <FileCode className="mr-2 h-4 w-4" />
                Create Challenge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatChallengeDialog;
