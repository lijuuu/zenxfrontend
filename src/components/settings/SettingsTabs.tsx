
import React from "react";
import { User, Lock, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettingsTab from "./ProfileSettingsTab";
import AccountSettingsTab from "./AccountSettingsTab";
import NotificationsSettingsTab from "./NotificationsSettingsTab";
import { UserProfile } from "@/api/types";

interface SettingsTabsProps {
  user: UserProfile;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ user }) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="border-b border-zinc-800 mb-6">
        <TabsList className="bg-transparent justify-start h-auto p-0 mb-[-1px]">
          <TabsTrigger 
            value="profile" 
            className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 rounded-none bg-transparent text-zinc-400"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 rounded-none bg-transparent text-zinc-400"
          >
            <Lock className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-400 rounded-none bg-transparent text-zinc-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="profile">
        <ProfileSettingsTab user={user} />
      </TabsContent>
      
      <TabsContent value="account">
        <AccountSettingsTab user={user} />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsSettingsTab userProfile={user} />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
