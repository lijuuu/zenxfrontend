
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { updateProfile } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { UserProfile } from "@/api/types";

interface ProfileEditTabProps {
  user: UserProfile;
}

const ProfileEditTab: React.FC<ProfileEditTabProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.user);
  
  // Form state
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [primaryLanguageID, setPrimaryLanguageID] = useState("");
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  // Populate form with user profile data on mount
  useEffect(() => {
    if (user) {
      setUserName(user.userName || user.username || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setCountry(user.country || "");
      setPrimaryLanguageID(user.primaryLanguageID || "");
      setMuteNotifications(user.muteNotifications || false);
      setBio(user.bio || "");
      
      // Set social media links
      if (user.socials) {
        setGithub(user.socials.github || "");
        setTwitter(user.socials.twitter || "");
        setLinkedin(user.socials.linkedin || "");
      }
    }
  }, [user]);

  // Show success/error messages when profile update status changes
  useEffect(() => {
    if (status === 'succeeded') {
      toast.success("Profile updated successfully");
    } else if (status === 'failed' && error) {
      toast.error(`Failed to update profile: ${error}`);
    }
  }, [status, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      userName,
      firstName,
      lastName,
      country,
      primaryLanguageID,
      muteNotifications,
      bio,
      socials: { github, twitter, linkedin },
    };
    
    dispatch(updateProfile(profileData));
  };

  // Use initials for avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (!user) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card className="border border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatarURL || user.profileImage} />
                  <AvatarFallback className="bg-green-900/30 text-green-500">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="w-full">
                  Change Avatar
                </Button>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="NG">Nigeria</SelectItem>
                    <SelectItem value="CN">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryLanguageID">Preferred Programming Language</Label>
                <Select
                  value={primaryLanguageID}
                  onValueChange={setPrimaryLanguageID}
                >
                  <SelectTrigger id="primaryLanguageID">
                    <SelectValue placeholder="Select your preferred language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="js">JavaScript</SelectItem>
                    <SelectItem value="py">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="cs">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="ts">TypeScript</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="muteNotifications"
                  checked={muteNotifications}
                  onCheckedChange={setMuteNotifications}
                />
                <Label htmlFor="muteNotifications">Mute Notifications</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6 border border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-xl">Social Links</CardTitle>
            <CardDescription>
              Connect your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProfileEditTab;
