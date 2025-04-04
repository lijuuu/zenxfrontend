
import React, { useState } from "react";
import { PenSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/api/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { updateProfile } from "@/store/slices/userSlice";
import { toast } from "sonner";

interface ProfileSettingsTabProps {
  user: UserProfile;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  bio: string;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
  country: string;
}

const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(state => state.user.status);
  const userError = useAppSelector(state => state.user.error);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    socials: {
      github: user?.socials?.github || "",
      twitter: user?.socials?.twitter || "",
      linkedin: user?.socials?.linkedin || "",
      website: user?.socials?.website || ""
    },
    country: user?.country || "",
  });

  // Check for status and error
  React.useEffect(() => {
    if (userStatus === 'succeeded') {
      toast.success("Profile updated successfully!");
    } else if (userStatus === 'failed' && userError) {
      toast.error("Failed to update profile: " + userError);
    }
  }, [userStatus, userError]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., socials.github)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProfileFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  const getAvatarInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Profile Information</CardTitle>
          <CardDescription>
            Update your profile information visible to other users
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative mb-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user?.avatarURL || "https://i.pravatar.cc/300?img=1"} />
              <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
            </Avatar>
            <Button 
              className="absolute bottom-0 right-0 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 h-8 w-8 p-0"
              variant="ghost"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
            <p className="text-muted-foreground">@{user?.userName}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="johndoe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              
              <div className="space-y-2">
                <Label htmlFor="socials.github">GitHub</Label>
                <Input
                  id="socials.github"
                  name="socials.github"
                  value={formData.socials.github}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socials.twitter">Twitter</Label>
                <Input
                  id="socials.twitter"
                  name="socials.twitter"
                  value={formData.socials.twitter}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socials.linkedin">LinkedIn</Label>
                <Input
                  id="socials.linkedin"
                  name="socials.linkedin"
                  value={formData.socials.linkedin}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socials.website">Website</Label>
                <Input
                  id="socials.website"
                  name="socials.website"
                  value={formData.socials.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 gap-2"
                disabled={userStatus === 'loading'}
              >
                <Save className="h-4 w-4" />
                {userStatus === 'loading' ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
