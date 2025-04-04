
import React, { useState } from "react";
import { PenSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/api/types";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/userApi";
import { toast } from "sonner";

interface ProfileSettingsTabProps {
  user: User;
}

interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  website: string;
  githubProfile: string;
  location: string;
}

const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ user }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    website: user?.website || "",
    githubProfile: user?.githubProfile || "",
    location: user?.location || "",
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
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
              <AvatarImage src={user?.profileImage || "https://i.pravatar.cc/300?img=1"} />
              <AvatarFallback>{user?.fullName.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button 
              className="absolute bottom-0 right-0 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 h-8 w-8 p-0"
              variant="ghost"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{user?.fullName}</h3>
            <p className="text-muted-foreground">@{user?.username}</p>
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                />
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubProfile">GitHub Profile</Label>
                <Input
                  id="githubProfile"
                  name="githubProfile"
                  value={formData.githubProfile}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;
