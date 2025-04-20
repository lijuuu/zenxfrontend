
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/services/useSearchUsers";
import { UserProfile } from "@/api/types";
import ChallengeBattleInvite from "@/components/challenges/ChallengeBattleInvite";

interface FriendChallengeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeUser?: (userId: string) => void;
}

const FriendChallengeDialog: React.FC<FriendChallengeDialogProps> = ({
  isOpen,
  onClose,
  onChallengeUser,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isChallenging, setIsChallenging] = useState(false);

  // Use the imported search hook
  const { 
    data: searchResults, 
    isLoading: isSearching,
    refetch
  } = useSearchUsers(searchQuery, { enabled: searchQuery.length >= 2 });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      refetch();
    }
  };

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
  };

  const handleChallenge = () => {
    if (!selectedUser) return;
    
    setIsChallenging(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Challenge Sent",
        description: `Challenge sent to ${selectedUser.userName}!`,
      });
      
      if (onChallengeUser && selectedUser.userID) {
        onChallengeUser(selectedUser.userID);
      }
      
      setIsChallenging(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Challenge a Friend</DialogTitle>
          <DialogDescription>
            Search for a user to challenge them to a coding battle.
          </DialogDescription>
        </DialogHeader>

        {!selectedUser ? (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search users by name or email"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>

              <div className="border rounded-md h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.map((user) => (
                      <div
                        key={user.userID}
                        className="p-3 hover:bg-accent/50 cursor-pointer transition-colors flex items-center gap-3"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {user.avatarURL ? (
                            <img src={user.avatarURL} alt={user.userName || 'User'} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.userName || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">{user.email || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Type at least 2 characters to search
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatarURL ? (
                    <img src={selectedUser.avatarURL} alt={selectedUser.userName || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-zinc-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.userName || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email || ''}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Choose Challenge Type:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start flex-col items-start active:scale-95 transition-transform bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                  >
                    <span className="text-sm font-medium">Quick Challenge</span>
                    <span className="text-xs text-muted-foreground">
                      Random problem, timed
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start flex-col items-start active:scale-95 transition-transform bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                  >
                    <span className="text-sm font-medium">Custom Challenge</span>
                    <span className="text-xs text-muted-foreground">
                      Pick problems, set time
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>
                Back
              </Button>
              <Button onClick={handleChallenge} disabled={isChallenging}>
                {isChallenging ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send Challenge"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendChallengeDialog;
