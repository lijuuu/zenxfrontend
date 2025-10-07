import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Bell, Trophy } from "lucide-react";
import ChatPanel from "./ChatPanel";
import LeaderboardPanel from "./LeaderboardPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  message?: string;
  time?: number;
}

interface LeaderboardEntry {
  userId?: string;
  username?: string;
  score?: number;
  rank?: number;
}

interface ChatMessage {
  userId?: string;
  profilePic?: string;
  message?: string;
  Message?: string;
  time?: number;
  Time?: number;
}

interface ChallengeSidebarProps {
  notifications: NotificationItem[];
  leaderboard: LeaderboardEntry[];
  chatMessages: ChatMessage[];
  currentUserId?: string;
  onSendMessage: (text: string) => void;
}

const ChallengeSidebar: React.FC<ChallengeSidebarProps> = ({
  notifications,
  leaderboard,
  chatMessages,
  currentUserId,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  const unreadNotifications = notifications.length > 0;

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 bg-zinc-900 border-b border-zinc-800 rounded-none p-0">
          <TabsTrigger 
            value="chat" 
            className="data-[state=active]:bg-zinc-800 rounded-none py-3 relative"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-zinc-800 rounded-none py-3 relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadNotifications && (
              <Badge 
                variant="destructive" 
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-2xs"
              >
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard" 
            className="data-[state=active]:bg-zinc-800 rounded-none py-3"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Ranking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 m-0 p-0">
          <ChatPanel 
            messages={chatMessages} 
            onSend={onSendMessage}
            currentUserId={currentUserId}
          />
        </TabsContent>

        <TabsContent value="notifications" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300">{notif.message}</p>
                        {notif.time && (
                          <p className="text-2xs text-zinc-500 mt-1">
                            {new Date(notif.time * 1000).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No notifications yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="leaderboard" className="flex-1 m-0 p-0">
          <LeaderboardPanel 
            entries={leaderboard} 
            currentUserId={currentUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengeSidebar;
