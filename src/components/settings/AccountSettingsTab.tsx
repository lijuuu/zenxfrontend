
import React, { useState } from "react";
import { Eye, EyeOff, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/api/types";
import { useMutation } from "@tanstack/react-query";
import { setUpTwoFactorAuth } from "@/api/userApi";
import { toast } from "sonner";

interface AccountSettingsTabProps {
  user: User;
}

const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // 2FA setup query
  const setup2FAMutation = useMutation({
    mutationFn: setUpTwoFactorAuth,
    onSuccess: (data) => {
      toast.success("2FA setup initiated. Scan the QR code with your authenticator app.");
      // In a real app, you would display the QR code here
      console.log("2FA setup data:", data);
    },
    onError: () => {
      toast.error("Failed to set up 2FA. Please try again.");
    },
  });

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    
    // In a real app, this would call a separate API to change the password
    toast.success("Password changed successfully!");
    
    // Reset password fields
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  
  const handle2FASetup = () => {
    setup2FAMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full">Update Password</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  {user?.is2FAEnabled 
                    ? "Two-factor authentication is enabled for your account."
                    : "Protect your account with an authenticator app."
                  }
                </p>
              </div>
              <Switch 
                checked={user?.is2FAEnabled} 
                onCheckedChange={handle2FASetup}
              />
            </div>
            
            {user?.is2FAEnabled ? (
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Authenticator App
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You're currently using an authenticator app for two-factor authentication.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Disable Two-Factor Authentication
                </Button>
              </div>
            ) : setup2FAMutation.isSuccess ? (
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                <h4 className="font-medium mb-2">Scan QR Code</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Scan this QR code with your authenticator app.
                </p>
                <div className="flex justify-center mb-3">
                  <div className="w-48 h-48 bg-white p-2 rounded-md">
                    {/* QR code would be displayed here */}
                    <div className="w-full h-full border-2 border-dashed border-zinc-300 rounded flex items-center justify-center">
                      QR Code Placeholder
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <Button className="w-full mt-3">Verify</Button>
              </div>
            ) : (
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Toggle the switch above to enable two-factor authentication for your account.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible account actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-md">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsTab;
