import React, { useState, useCallback, useEffect } from "react";
import { PenSquare, Save, Crop, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useUpdateUserProfile } from "@/services/useUpdateUserProfile";
import { useUpdateProfileImage } from "@/services/useUpdateProfileImage";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import axiosInstance from "@/utils/axiosInstance";
import SimpleSpinLoader from "../ui/simplespinloader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import useCountries from "@/hooks/useCountries";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema with socials object
const profileSchema = z.object({
  userName: z
    .string()
    .min(3, "username must be at least 3 characters")
    .max(20, "username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores"),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
  country: z.string().min(1, "Country is required"),
  primaryLanguageID: z.string().optional(),
  muteNotifications: z.boolean().optional(),
  socials: z
    .object({
      github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
      twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
      linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    })
    .optional(),
});

interface CountriesWithFlagsProps {
  value: string; // Country code (e.g., "US")
  onChange: (value: string) => void; // Updates form with country code
}

const CountriesWithFlags = ({ value, onChange }: CountriesWithFlagsProps) => {
  const { countries } = useCountries();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (code: string) => {
    console.log(`Selected code: ${code}, name: ${countries[code]}`);
    onChange(code); // Pass country code to form
    setDropdownOpen(false);
  };

  // Get display name for the selected country code
  const displayName = value && countries[value] ? countries[value] : "";

  return (
    <div className="relative w-full">
      <Label className="block text-sm font-medium text-white">Country</Label>
      <div
        className="flex items-center justify-between bg-zinc-800 text-white p-3 rounded-md mt-1 cursor-pointer hover:border-green-500 border border-zinc-700 transition-all duration-200"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {value && displayName ? (
          <div className="flex items-center space-x-2">
            <img
              src={`https://flagcdn.com/24x18/${value.toLowerCase()}.png`}
              alt={`${displayName} flag`}
              className="w-6 h-6"
              onError={(e) => {
                console.error(`Failed to load flag for ${value}`);
                e.currentTarget.src = "https://flagcdn.com/24x18/us.png"; // Fallback to US
              }}
            />
            <span>{displayName}</span>
          </div>
        ) : (
          <span>Select a country</span>
        )}
        <span>▼</span>
      </div>
      {dropdownOpen && (
        <div className="absolute w-full bg-zinc-900 text-white mt-2 max-h-60 overflow-y-auto rounded-xl shadow-lg z-10 border border-zinc-800">
          {Object.entries(countries)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([code, name]) => (
              <div
                key={code}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-zinc-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleSelect(code)}
              >
                <img
                  src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
                  alt={`${name} flag`}
                  className="w-6 h-6"
                  onError={(e) => {
                    console.error(`Failed to load flag for ${code}`);
                    e.currentTarget.src = "https://flagcdn.com/24x18/us.png"; // Fallback to US
                  }}
                />
                <span>{name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ProfileEditTab: React.FC = () => {
  const { data: userProfile, isLoading, error } = useGetUserProfile();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserProfile();
  const { mutate: updateProfileImage, isPending: isUpdatingImage } = useUpdateProfileImage(userProfile?.userID);
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm<{
    userName: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    country: string;
    primaryLanguageID?: string;
    muteNotifications?: boolean;
    socials?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  }>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: userProfile?.userName || "",
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      bio: userProfile?.bio || "",
      country: userProfile?.country || "",
      primaryLanguageID: userProfile?.primaryLanguageID || "",
      muteNotifications: userProfile?.muteNotifications || false,
      socials: {
        github: userProfile?.socials?.github || "",
        twitter: userProfile?.socials?.twitter || "",
        linkedin: userProfile?.socials?.linkedin || "",
      },
    },
  });

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "not_available">("idle");
  const [usernameError, setUsernameError] = useState<string>("");
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const debouncedUsername = useDebounce(currentUsername, 500);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Set initial values
  useEffect(() => {
    if (userProfile?.userName) {
      setCurrentUsername(userProfile.userName);
      setValue("userName", userProfile.userName);
    }
    if (userProfile?.country) {
      setValue("country", userProfile.country);
    }
    if (userProfile?.firstName) {
      setValue("firstName", userProfile.firstName);
    }
    if (userProfile?.lastName) {
      setValue("lastName", userProfile.lastName);
    }
    if (userProfile?.bio) {
      setValue("bio", userProfile.bio);
    }
    if (userProfile?.primaryLanguageID) {
      setValue("primaryLanguageID", userProfile.primaryLanguageID);
    }
    if (userProfile?.muteNotifications !== undefined) {
      setValue("muteNotifications", userProfile.muteNotifications);
    }
    if (userProfile?.socials?.github) {
      setValue("socials.github", userProfile.socials.github);
    }
    if (userProfile?.socials?.twitter) {
      setValue("socials.twitter", userProfile.socials.twitter);
    }
    if (userProfile?.socials?.linkedin) {
      setValue("socials.linkedin", userProfile.socials.linkedin);
    }
  }, [userProfile, setValue]);

  // Check username availability
  useEffect(() => {
    if (debouncedUsername === userProfile?.userName || debouncedUsername === "") {
      setUsernameStatus("idle");
      setUsernameError("");
      setSuggestedUsernames([]);
      return;
    }

    const validate = profileSchema.shape.userName.safeParse(debouncedUsername);
    if (!validate.success) {
      setUsernameError(validate.error.errors[0].message);
      setUsernameStatus("idle");
      setSuggestedUsernames([]);
      return;
    }

    setUsernameStatus("checking");
    setUsernameError("");

    axiosInstance
      .get("/users/username/available", {
        params: { username: debouncedUsername },
        headers: { "x-requires-auth": false },
      })
      .then((res) => {
        const data: { success: boolean; payload: { available: boolean } } = res.data;
        if (data.payload.available) {
          setUsernameStatus("available");
          setSuggestedUsernames([]);
        } else {
          setUsernameStatus("not_available");
          setSuggestedUsernames([
            `${debouncedUsername}${Math.floor(Math.random() * 100)}`,
            `${debouncedUsername}_x`,
            `${debouncedUsername}${Math.floor(Math.random() * 10)}`,
          ]);
        }
      })
      .catch(() => {
        setUsernameError("failed to check username");
        setUsernameStatus("idle");
        setSuggestedUsernames([]);
      });
  }, [debouncedUsername, userProfile?.userName]);

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUsername(e.target.value);
    setValue("userName", e.target.value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentUsername(suggestion);
    setValue("userName", suggestion);
    setUsernameError("");
  };

  // Handle form submission
  const onSubmit = (formData: {
    userName: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    country: string;
    primaryLanguageID?: string;
    muteNotifications?: boolean;
    socials?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  }) => {
    const profileData = {
      userID: userProfile?.userID,
      userName: formData.userName,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      country: formData.country,
      primaryLanguageID: formData.primaryLanguageID || "",
      muteNotifications: formData.muteNotifications || false,
      bio: formData.bio || "",
      socials: {
        github: formData.socials?.github || "",
        twitter: formData.socials?.twitter || "",
        linkedin: formData.socials?.linkedin || "",
      },
    };

    const validation = profileSchema.safeParse({
      userName: profileData.userName,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      country: profileData.country,
      primaryLanguageID: profileData.primaryLanguageID,
      muteNotifications: profileData.muteNotifications,
      socials: profileData.socials,
    });

    if (validation.success) {
      updateUser(profileData);
    } else {
      console.error(validation.error);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle crop completion
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Crop and upload image
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

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        setIsDialogOpen(false);
        updateProfileImage(croppedFile, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          },
        });
      }
    }, "image/jpeg", 0.9);
  }, [imageSrc, croppedAreaPixels, updateProfileImage, userProfile?.userID, queryClient]);

  // Get avatar initials
  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName)
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    if (userProfile?.userName)
      return userProfile.userName[0].toUpperCase();
    return "U";
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error Loading Profile</div>;

  return (
    <div className="space-y-6">
      {(isUpdating || isUpdatingImage) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <SimpleSpinLoader />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <AvatarFallback className="bg-green-900/30 text-green-500">{getInitials()}</AvatarFallback>
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
                    <Input id="firstName" {...register("firstName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    value={currentUsername}
                    onChange={handleUsernameChange}
                    className={usernameError ? "border-red-500" : ""}
                  />
                  <div className="space-y-2">
                    {usernameStatus === "checking" && (
                      <span className="text-sm text-gray-400 flex items-center">
                        <SimpleSpinLoader className="h-4 w-4 mr-1" /> checking...
                      </span>
                    )}
                    {usernameStatus === "available" && (
                      <span className="text-sm text-green-500 font-medium">available</span>
                    )}
                    {usernameStatus === "not_available" && (
                      <div className="space-y-2">
                        <span className="text-sm text-red-500 font-medium">not available</span>
                        <div className="flex flex-wrap gap-2 p-2 bg-zinc-800/50 rounded-md">
                          {suggestedUsernames.map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-zinc-700/50 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {usernameError && (
                      <span className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {usernameError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register("bio")} rows={4} />
                </div>
                <div className="space-y-2">
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountriesWithFlags value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm">{errors.country.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryLanguageID">Preferred Language</Label>
                  <select
                    id="primaryLanguageID"
                    {...register("primaryLanguageID")}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2 hover:border-green-500 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                  >
                    <option value="">Select Language</option>
                    <option value="js">JavaScript</option>
                    <option value="py">Python</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="muteNotifications" {...register("muteNotifications")} />
                  <Label htmlFor="muteNotifications">Mute Notifications</Label>
                </div>
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
              <Label htmlFor="socials.github">GitHub</Label>
              <Input id="socials.github" {...register("socials.github")} />
              {errors.socials?.github && (
                <p className="text-red-500 text-sm">{errors.socials.github.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="socials.twitter">Twitter</Label>
              <Input id="socials.twitter" {...register("socials.twitter")} />
              {errors.socials?.twitter && (
                <p className="text-red-500 text-sm">{errors.socials.twitter.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="socials.linkedin">LinkedIn</Label>
              <Input id="socials.linkedin" {...register("socials.linkedin")} />
              {errors.socials?.linkedin && (
                <p className="text-red-500 text-sm">{errors.socials.linkedin.message}</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
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