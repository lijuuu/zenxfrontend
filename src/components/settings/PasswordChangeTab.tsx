
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, EyeIcon, EyeOffIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';

const PasswordChangeTab = () => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChangePassword = async () => {
    // Validate inputs
    if (!oldPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.post('/users/security/password/change', {
        oldPassword,
        newPassword,
        confirmPassword
      });
      
      if (response.data.success) {
        toast.success(response.data.payload.message || 'Password changed successfully');
        // Reset form fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-green-500" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your account password to maintain security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/60">
            <div className="space-y-4">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="old-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                  >
                    {showOldPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                  >
                    {showNewPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {newPassword && newPassword.length < 8 && (
                <div className="flex items-center p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-200">
                    Password must be at least 8 characters long
                  </p>
                </div>
              )}
              
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <div className="flex items-center p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-200">
                    Passwords do not match
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleChangePassword}
                className="w-full mt-2"
                disabled={loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-amber-400/10 border border-amber-400/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-200">
              <p className="font-medium">Password requirements:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>At least 8 characters long</li>
                <li>Include a mix of letters, numbers, and symbols for stronger security</li>
                <li>Avoid using personal information or common words</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordChangeTab;
