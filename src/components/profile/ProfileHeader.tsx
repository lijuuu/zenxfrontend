
import React, { useState } from "react";
import { UserProfile } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Copy, 
  UserPlus,
  UserMinus,
  Loader2,
  MapPin,
  CalendarDays
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

interface ProfileHeaderProps {
  profile: UserProfile;
  userID?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, userID }) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authState = useSelector((state: any) => state.auth);
  
  const isOwnProfile = !userID || userID === profile.userID || 
    (authState.userProfile && (userID === authState.userProfile.userID || userID === authState.userID));
  
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(profile.userName);
    toast({
      title: "Username copied",
      description: `@${profile.userName} copied to clipboard`,
    });
  };
  
  const handleFollow = async () => {
    setIsLoading(true);
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? `You unfollowed @${profile.userName}` 
          : `You are now following @${profile.userName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  console.log()

  // Get initials for avatar fallback
  const getInitials = () => {
    const fullNameChars = `${profile.firstName} ${profile.lastName}`.split(' ').map(n => n[0]).join('');
    if (fullNameChars) return fullNameChars;
    if (profile.userName) return profile.userName.charAt(0).toUpperCase();
    return "U";
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={profile.profileImage || profile.avatarURL} alt={profile.firstName + ' ' + profile.lastName} />
            <AvatarFallback className="text-xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {profile.isOnline && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        
        <div className="flex gap-2 mt-3">
          {profile.country && (
            <img 
              src={`https://flagcdn.com/24x18/${profile.countryCode?.toLowerCase()}.png`}
              alt={profile.country}
              className="h-5 rounded"
            />
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:items-start items-center text-center md:text-left">
        <div className="flex flex-wrap gap-2 items-center">
          <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
          
          {profile.ranking && profile.ranking <= 100 && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-zinc-900">
              Top {profile.ranking}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-lg text-muted-foreground font-medium">@{profile.userName}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={handleCopyUsername}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy username</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {profile.bio && (
          <p className="mt-2 text-muted-foreground">{profile.bio}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Joined {new Date(profile.joinedDate || profile.createdAt).toLocaleDateString()}</span>
          </div>
          
          {profile.followers !== undefined && (
            <div className="flex items-center gap-4">
              <span className="text-sm"><strong>{profile.followers}</strong> followers</span>
              <span className="text-sm"><strong>{profile.following}</strong> following</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {isOwnProfile ? (
            <Button variant="outline" className="flex items-center gap-1.5" onClick={()=>navigate("/settings")}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <Button 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "" : "accent-color"}
              onClick={handleFollow}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isFollowing ? (
                <UserMinus className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
          
          <Button variant="outline" onClick={()=>navigate("/chat")}>
            Message
          </Button>
        </div>
      </div>
      
      <div className="md:ml-auto flex items-center gap-4 mt-4 md:mt-0 justify-center">
        <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg min-w-[100px]">
          <span className="text-2xl font-bold">{profile.problemsSolved || 0}</span>
          <span className="text-sm text-muted-foreground">Problems</span>
        </div>
        
        <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg min-w-[100px]">
          <span className="text-2xl font-bold">{profile.dayStreak || 0}</span>
          <span className="text-sm text-muted-foreground">Day Streak</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
