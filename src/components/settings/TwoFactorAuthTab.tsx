import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LockIcon, ShieldAlert, EyeIcon, EyeOffIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';
import { UserProfile } from '@/store/slices/authSlice';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface TwoFactorAuthTabProps {
  userProfile: UserProfile;
  canUse2FA: boolean;
}

const TwoFactorAuthTab: React.FC<TwoFactorAuthTabProps> = ({ userProfile, canUse2FA }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    // Check if 2FA is enabled - only if userProfile is available
    if (userProfile?.email) {
      checkTwoFactorStatus();
    }
  }, [userProfile?.email]);

  const checkTwoFactorStatus = async () => {
    if (!userProfile?.email) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/auth/2fa/status?email=${userProfile.email}`);
      if (response.data.success) {
        setIsEnabled(response.data.payload.isEnabled);
      }
    } catch (error: any) {
      console.error('Error checking 2FA status:', error);
      // Check if this is a Google login user
      if (error.response?.data?.error?.type === "ERR_GOOGLELOGIN_NO2FA") {
        setIsGoogleUser(true);
        toast.error("Two-factor authentication is not available for Google login accounts");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/users/security/2fa/setup', { password });

      if (response.data.success) {
        setQrCode(response.data.payload.image || null);
        setSecret(response.data.payload.secret || null);
        toast.success(response.data.payload.message || 'QR code generated successfully');
      }
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      if (error.response?.data?.error?.type === "ERR_GOOGLELOGIN_NO2FA") {
        setIsGoogleUser(true);
        toast.error("Two-factor authentication is not available for Google login accounts");
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to generate QR code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verifyCode) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/users/security/2fa/verify', {
        otp: verifyCode
      });

      if (response.data.success) {
        if (response.data.payload.verified) {
          toast.success(response.data.payload.message || 'Two-factor authentication verified successfully');
          setIsVerified(true);
          setIsEnabled(true);
          setQrCode(null);
          setSecret(null);
          checkTwoFactorStatus();
        } else {
          toast.error(response.data.payload.message || 'Verification failed');
        }
      }
    } catch (error: any) {
      console.error('Error verifying 2FA:', error);
      if (error.response?.data?.error?.type === "ERR_GOOGLELOGIN_NO2FA") {
        setIsGoogleUser(true);
        toast.error("Two-factor authentication is not available for Google login accounts");
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to verify two-factor authentication');
      }
    } finally {
      setLoading(false);
      setVerifyCode('');
    }
  };

  const handleDisable2FA = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    if (!twoFactorCode) {
      toast.error('Please enter your two-factor code');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.delete('/users/security/2fa/setup', {
        data: {
          password,
          otp: twoFactorCode
        }
      });

      if (response.data.success) {
        toast.success(response.data.payload.message || 'Two-factor authentication disabled successfully');
        setIsEnabled(false);
        setIsVerified(false);
        setQrCode(null);
        setSecret(null);
        setPassword('');
        setTwoFactorCode('');
        checkTwoFactorStatus();
      }
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      if (error.response?.data?.error?.type === "ERR_GOOGLELOGIN_NO2FA") {
        setIsGoogleUser(true);
        toast.error("Two-factor authentication is not available for Google login accounts");
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to disable two-factor authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If user is a Google login user, show a notification instead of the 2FA settings
  if (!canUse2FA) {
    return (
      <div className="space-y-6">
        <Card className="border-zinc-800 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Two-Factor Authentication (2FA)
            </CardTitle>
            <CardDescription>
              Additional security for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Shield className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-400">Two-Factor Authentication Not Available</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Two-factor authentication is not available for accounts created using Google login.
                  Your Google account already has its own security features like 2FA.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/60">
              <h3 className="font-medium mb-2">Security Recommendations</h3>
              <ul className="text-sm text-zinc-400 space-y-2">
                <li>• Ensure your Google account has 2FA enabled</li>
                <li>• Use a strong, unique password for your Google account</li>
                <li>• Regularly check your Google account's security settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-green-500" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-zinc-500'}`}></div>
              <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={checkTwoFactorStatus}
              disabled={loading}
            >
              Refresh Status
            </Button>
          </div>

          {!isEnabled ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/60">
                <h3 className="font-medium mb-2">Enable Two-Factor Authentication</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Two-factor authentication adds an additional layer of security to your account by requiring a code from your mobile device in addition to your password.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateQRCode}
                    className="w-full"
                    disabled={loading || !password}
                  >
                    {loading ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </div>

                {qrCode && (
                  <div className="mt-6 space-y-4">
                    <div className="border border-zinc-800 rounded-lg p-4 flex flex-col items-center bg-zinc-900/80">
                      <h4 className="text-green-500 font-medium mb-2">Scan this QR Code</h4>
                      <p className="text-sm text-zinc-400 mb-4 text-center">
                        Use a two-factor authentication app like Google Authenticator to scan this QR code
                      </p>
                      <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="Two-factor authentication QR code"
                        className="w-48 h-48 mb-2"
                      />
                      {secret && (
                        <div className="text-sm text-zinc-400 mt-2">
                          <p>Secret key: <span className="font-mono">{secret}</span></p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center p-4 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-200">
                        Please scan this QR code with your authentication app. For security reasons, it will only be shown once.
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="verify-code">Verification Code</Label>
                        <p className="text-sm text-zinc-400">
                          Enter the 6-digit code from your authentication app to verify setup
                        </p>
                        <Input
                          id="verify-code"
                          type="text"
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value)}
                          placeholder="Enter the 6-digit code"
                          maxLength={6}
                          className="text-center font-mono text-lg"
                        />
                      </div>

                      <Button
                        onClick={handleVerify2FA}
                        className="w-full"
                        disabled={loading || !verifyCode || verifyCode.length !== 6}
                      >
                        {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/60">
                <h3 className="font-medium mb-2">Disable Two-Factor Authentication</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Warning: Disabling two-factor authentication will make your account less secure.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="disable-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="disable-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="two-factor-code">Two-Factor Code</Label>
                    <Input
                      id="two-factor-code"
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="Enter the 6-digit code"
                      maxLength={6}
                      className="text-center font-mono text-lg"
                    />
                  </div>

                  <Button
                    onClick={handleDisable2FA}
                    variant="destructive"
                    className="w-full"
                    disabled={loading || !password || !twoFactorCode || twoFactorCode.length !== 6}
                  >
                    {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <LockIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-200">
                  Two-factor authentication is enabled for your account. Your account is more secure.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuthTab;
