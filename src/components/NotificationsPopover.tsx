
import React, { useState } from 'react';
import { Bell, Calendar, Code, Trophy, MessageSquare, UserPlus, X, Check, Info, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ChatBattleNotification from './chat/ChatBattleNotification';

type NotificationType = 'message' | 'challenge' | 'follow' | 'contest' | 'achievement' | 'system' | 'battle';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar: string;
  };
  challenge?: {
    id: string;
    title: string;
    isPrivate: boolean;
  };
  battle?: {
    id: string;
    title: string;
    isPrivate: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    expiresIn: string;
    sender: {
      name: string;
      avatar: string;
    };
    timestamp: string;
  };
}

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n6',
      type: 'battle',
      title: 'Coding Battle Challenge',
      message: 'Alex has challenged you to a coding battle!',
      time: 'Just now',
      read: false,
      actionUrl: '#',
      battle: {
        id: 'b1',
        title: 'Algorithm Masters Duel',
        isPrivate: true,
        difficulty: 'medium',
        expiresIn: '1 hour',
        sender: {
          name: 'Alex Johnson',
          avatar: 'https://i.pravatar.cc/300?img=11'
        },
        timestamp: new Date().toISOString()
      }
    },
    {
      id: 'n1',
      type: 'challenge',
      title: 'Challenge Invitation',
      message: 'Sophie invited you to join "Algorithm Sprint"',
      time: '2 hours ago',
      read: false,
      actionUrl: '#',
      sender: {
        name: 'Sophie Williams',
        avatar: 'https://i.pravatar.cc/300?img=9'
      },
      challenge: {
        id: 'c1',
        title: 'Algorithm Sprint',
        isPrivate: false
      }
    },
    {
      id: 'n2',
      type: 'contest',
      title: 'Weekly Contest #42',
      message: 'Starts in 1 hour. Get ready!',
      time: '3 hours ago',
      read: true,
      actionUrl: '#'
    },
    {
      id: 'n3',
      type: 'message',
      title: 'New Message',
      message: 'Taylor sent you a message',
      time: '1 day ago',
      read: false,
      actionUrl: '#',
      sender: {
        name: 'Taylor Smith',
        avatar: 'https://i.pravatar.cc/300?img=5'
      }
    },
    {
      id: 'n4',
      type: 'follow',
      title: 'New Follower',
      message: 'Mike started following you',
      time: '2 days ago',
      read: true,
      actionUrl: '#',
      sender: {
        name: 'Mike Chen',
        avatar: 'https://i.pravatar.cc/300?img=3'
      }
    },
    {
      id: 'n5',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You earned "10-Day Streak" badge',
      time: '3 days ago',
      read: true,
      actionUrl: '#'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'challenge':
        return <Code className="h-4 w-4 text-green-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'contest':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-zinc-500" />;
      case 'battle':
        return <Sword className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="accent-color absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 relative ${notification.read ? '' : 'bg-accent/5'}`}
                >
                  {notification.type === 'battle' && notification.battle ? (
                    <div className="mb-2">
                      <ChatBattleNotification 
                        challenge={notification.battle}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        
                        {notification.type === 'challenge' && notification.challenge && (
                          <div className="mt-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="w-full justify-between accent-color border-accent-color/20"
                            >
                              <span className="flex items-center">
                                <Trophy className="mr-1 h-3 w-3" />
                                {notification.challenge.title}
                              </span>
                              <span>Join</span>
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <Separator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
