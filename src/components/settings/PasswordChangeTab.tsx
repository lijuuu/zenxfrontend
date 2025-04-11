
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, EyeIcon, EyeOffIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the validation schema using Zod
const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const PasswordChangeTab = () => {
  const [loading, setLoading] = React.useState(false);
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = async (values: PasswordChangeFormValues) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/users/security/password/change', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      }, {
        headers: {
          'X-Requires-Auth': 'true'
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.payload.message || 'Password changed successfully');
        // Reset form fields
        form.reset();
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
                {/* Old Password */}
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Current Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showOldPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Confirm New Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Confirm New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Confirm your new password"
                            {...field}
                          />
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="flex items-center p-4 bg-amber-400/10 border border-amber-400/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-200">
              <p className="font-medium">Password requirements:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>At least 8 characters long</li>
                <li>Include at least one letter and one number</li>
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
