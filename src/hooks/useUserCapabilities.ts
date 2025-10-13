import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

interface UserCapabilities {
  canUse2FA: boolean;
  canChangePassword: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useUserCapabilities = (email?: string) => {
  const [capabilities, setCapabilities] = useState<UserCapabilities>({
    canUse2FA: false,
    canChangePassword: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!email) {
      setCapabilities({
        canUse2FA: false,
        canChangePassword: false,
        isLoading: false,
        error: 'No email provided',
      });
      return;
    }

    const checkCapabilities = async () => {
      try {
        setCapabilities(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Check 2FA capability using the same endpoint both tabs use
        const response = await axiosInstance.get(`/auth/2fa/status?email=${email}`);
        
        if (response.data.success) {
          // If successful, user can use both 2FA and change password
          setCapabilities({
            canUse2FA: true,
            canChangePassword: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error: any) {
        console.error('Error checking user capabilities:', error);
        
        // Check if this is a Google login user
        if (error.response?.data?.error?.type === "ERR_GOOGLELOGIN_NO2FA") {
          setCapabilities({
            canUse2FA: false,
            canChangePassword: false,
            isLoading: false,
            error: null, // This is expected for Google users, not an error
          });
        } else {
          setCapabilities({
            canUse2FA: false,
            canChangePassword: false,
            isLoading: false,
            error: 'Failed to check user capabilities',
          });
        }
      }
    };

    checkCapabilities();
  }, [email]);

  return capabilities;
};
