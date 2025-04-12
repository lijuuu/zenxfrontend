import React, { useState, useCallback, useMemo, useEffect } from "react";
import { PenSquare, Save, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useUpdateUserProfile } from "@/services/useUpdateUserProfile";
import { useUpdateProfileImage } from "@/services/useUpdateProfileImage";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import SimpleSpinLoader from "../ui/simplespinloader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import axiosInstance from "@/utils/axiosInstance";
import { debounce } from "lodash";

// Validation schema
const profileSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
});

const ProfileEditTab: React.FC = () => {
  const { data: userProfile, isLoading, error } = useGetUserProfile();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserProfile();
  const { mutate: updateProfileImage, isPending: isUpdatingImage } = useUpdateProfileImage(userProfile?.userID);
  const queryClient = useQueryClient();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(userProfile?.userName || "");

  // Debounced username check
  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username === userProfile?.userName) {
        setUsernameAvailable(true);
        return;
      }

      try {
        const result = profileSchema.shape.userName.safeParse(username);
        if (!result.success) {
          setUsernameAvailable(false);
          return;
        }

        const response = await axiosInstance.get("/users/username/available", {
          params: { username },
          headers: { "X-Requires-Auth": "false" },
        });
        setUsernameAvailable(response.data.payload.available);
      } catch (error) {
        setUsernameAvailable(false);
      }
    }, 500),
    [userProfile?.userName]
  );

  // Handle username change with debouncing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setUserName(username);
    checkUsernameAvailability(username);
  };

  // Memoized form submission handler
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const profileData = {
        userID: userProfile?.userID,
        userName: formData.get("userName") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        country: formData.get("country") as string,
        primaryLanguageID: formData.get("primaryLanguageID") as string,
        muteNotifications: formData.get("muteNotifications") === "on",
        bio: formData.get("bio") as string,
        socials: {
          github: formData.get("github") as string,
          twitter: formData.get("twitter") as string,
          linkedin: formData.get("linkedin") as string,
        },
      };

      const validation = profileSchema.safeParse({
        userName: profileData.userName,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
      });

      if (validation.success && usernameAvailable) {
        updateUser(profileData);
      }
    },
    [updateUser, userProfile?.userID, usernameAvailable]
  );

  // Memoized image change handler
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  // Memoized crop completion handler
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Memoized crop and upload handler
  const handleCropAndUpload = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels || !userProfile?.userID) return;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setIsDialogOpen(false);
          updateProfileImage(croppedFile, {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["userProfile"], 
              });
            },
          });
        }
      },
      "image/jpeg",
      0.9
    );
  }, [imageSrc, croppedAreaPixels, updateProfileImage, userProfile?.userID, queryClient]);

  // Memoized initials generator
  const getInitials = useMemo(() => {
    if (userProfile?.firstName && userProfile?.lastName)
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    if (userProfile?.userName) return userProfile.userName[0].toUpperCase();
    return "U";
  }, [userProfile?.firstName, userProfile?.lastName, userProfile?.userName]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      checkUsernameAvailability.cancel();
    };
  }, [checkUsernameAvailability]);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error Loading Profile</div>;

  return (
    <div className="space-y-6">
      {(isUpdating || isUpdatingImage) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <SimpleSpinLoader />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Card className="border border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>Update Your Personal Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userProfile?.avatarURL || userProfile?.profileImage} />
                  <AvatarFallback className="bg-green-900/30 text-green-500">{getInitials}</AvatarFallback>
                </Avatar>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <PenSquare className="h-4 w-4 mr-2" /> Change Avatar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                      {imageSrc && (
                        <div className="relative h-96">
                          <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        </div>
                      )}
                      {imageSrc && (
                        <Button onClick={handleCropAndUpload} className="w-full" disabled={isUpdatingImage}>
                          <Crop className="h-4 w-4 mr-2" /> Upload
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={userProfile?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={userProfile?.lastName || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    name="userName"
                    value={userName}
                    onChange={handleUsernameChange}
                    className={`${
                      !usernameAvailable && userProfile?.userName !== userName ? "border-red-500" : ""
                    }`}
                  />
                  {!usernameAvailable && userProfile?.userName !== userName && (
                    <span className="text-sm text-red-500">Username is not available</span>
                  )}
                  {usernameAvailable && userProfile?.userName !== userName && (
                    <span className="text-sm text-green-500">Username is available</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" defaultValue={userProfile?.bio || ""} rows={4} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select name="country" defaultValue={userProfile?.country || ""}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select Your Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                    <SelectItem value="ng">Nigeria</SelectItem>
                    <SelectItem value="cn">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryLanguageID">Preferred Language</Label>
                <Select name="primaryLanguageID" defaultValue={userProfile?.primaryLanguageID || ""}>
                  <SelectTrigger id="primaryLanguageID">
                    <SelectValue placeholder="Select Language" />
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
                  name="muteNotifications"
                  defaultChecked={userProfile?.muteNotifications || false}
                />
                <Label htmlFor="muteNotifications">Mute Notifications</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6 border border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-xl">Social Links</CardTitle>
            <CardDescription>Connect Your Social Media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">Github</Label>
              <Input id="github" name="github" defaultValue={userProfile?.socials?.github || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" name="twitter" defaultValue={userProfile?.socials?.twitter || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">Linkedin</Label>
              <Input id="linkedin" name="linkedin" defaultValue={userProfile?.socials?.linkedin || ""} />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isUpdating || !usernameAvailable}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProfileEditTab;