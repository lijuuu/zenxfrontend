
import React from 'react';
import { UserProfile } from '@/api/types';
import ProfileSettingsTab from './ProfileSettingsTab';
import AccountSettingsTab from './AccountSettingsTab';
import NotificationsSettingsTab from './NotificationsSettingsTab';
import TwoFactorAuthTab from './TwoFactorAuthTab';

interface SettingsTabsProps {
  activeTab: string;
  profile: UserProfile;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, profile }) => {
  return (
    <div>
      {activeTab === 'profile' && <ProfileSettingsTab user={profile} />}
      {activeTab === 'account' && <AccountSettingsTab user={profile} />}
      {activeTab === 'notifications' && <NotificationsSettingsTab userProfile={profile} />}
      {activeTab === '2fa' && <TwoFactorAuthTab userProfile={profile} />}
    </div>
  );
};

export default SettingsTabs;
