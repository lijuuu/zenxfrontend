
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/store/slices/authSlice";

interface NotificationsSettingsTabProps {
  userProfile: UserProfile;
}

const NotificationsSettingsTab: React.FC<NotificationsSettingsTabProps> = ({ userProfile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Notification Preferences</CardTitle>
        <CardDescription>
          Manage when and how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Email Notifications</h3>
            <Separator className="mb-4" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-challenges">Challenge Invites</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when someone invites you to a challenge
                  </p>
                </div>
                <Switch id="email-challenges" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-friends">Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails for new friend requests
                  </p>
                </div>
                <Switch id="email-friends" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-contests">Contests & Events</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about upcoming contests and events
                  </p>
                </div>
                <Switch id="email-contests" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-marketing">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
                <Switch id="email-marketing" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">In-App Notifications</h3>
            <Separator className="mb-4" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-messages">Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for new messages
                  </p>
                </div>
                <Switch id="app-messages" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-challenges">Challenges</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for challenge invites and updates
                  </p>
                </div>
                <Switch id="app-challenges" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-friends">Friend Activities</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for friend activities
                  </p>
                </div>
                <Switch id="app-friends" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-system">System Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show system notifications and announcements
                  </p>
                </div>
                <Switch id="app-system" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettingsTab;
