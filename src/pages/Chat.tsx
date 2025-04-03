import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Send, 
  User, 
  Plus, 
  Users, 
  Filter, 
  Settings, 
  ChevronDown, 
  Search,
  MessageSquare,
  Video,
  Phone,
  Info,
  Image,
  Paperclip,
  Code,
  Smile,
  UserPlus
} from "lucide-react";

import MainNavbar from "@/components/MainNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useToast } from "@/hooks/use-toast";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import ChallengeBattleInvite from "@/components/chat/ChallengeBattleInvite";
import ChatChallengeDialog from "@/components/chat/ChatChallengeDialog";
import { 
  getChannels, 
  getMessages, 
  sendMessage,
  createDirectChannel
} from "@/api/chatApi";
import { ChatChannel, ChatMessage as MessageType } from "@/api/types";

const Chat = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState<ChatChannel | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  
  // Fetch chats
  const { 
    data: chats,
    isLoading: chatsLoading,
    refetch: refetchChats
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChannels,
  });
  
  // Fetch messages for selected chat
  const { 
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ["chatMessages", selectedChat?.id],
    queryFn: () => selectedChat ? getMessages(selectedChat.id) : Promise.resolve([]),
    enabled: !!selectedChat,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { chatId: string; content: string }) => 
      sendMessage(data.chatId, data.content),
    onSuccess: () => {
      refetchMessages();
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });
  
  // Handle selecting a chat
  const handleSelectChat = (chat: ChatChannel) => {
    setSelectedChat(chat);
    // We don't have a markAsRead function available, so we'll just skip that part
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!selectedChat || !message.trim()) return;
    
    sendMessageMutation.mutate({
      chatId: selectedChat.id,
      content: message,
    });
  };
  
  // Filter chats based on search query
  const filteredChats = chats ? chats.filter((chat: ChatChannel) => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.participants && chat.participants.some(participant => 
      participant.username.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  ) : [];
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <div className="min-h-screen  text-white">
      <MainNavbar />
      
      <main className="pt-16  h-[calc(100vh-64px)]">
        <div className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[350px_1fr]">
          {/* Chats Sidebar */}
          <div className="border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Messages</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Filter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-zinc-800 border-zinc-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1">
              <div className="px-2 pt-2 border-b border-zinc-800">
                <TabsList className="w-full bg-zinc-800">
                  <TabsTrigger 
                    value="all" 
                    className="flex-1 data-[state=active]:bg-green-500"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    className="flex-1 data-[state=active]:bg-green-500"
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger 
                    value="groups" 
                    className="flex-1 data-[state=active]:bg-green-500"
                  >
                    Groups
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="flex-1 mt-0">
                <ScrollArea className="h-[calc(100vh-190px)]">
                  <div className="px-2 py-2 space-y-1">
                    {chatsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-pulse text-zinc-500">Loading chats...</div>
                      </div>
                    ) : filteredChats.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500">
                        {searchQuery ? "No matching conversations" : "No conversations yet"}
                      </div>
                    ) : (
                      filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedChat?.id === chat.id
                              ? "bg-green-500/10 hover:bg-green-500/20"
                              : "hover:bg-zinc-800"
                          }`}
                          onClick={() => handleSelectChat(chat)}
                        >
                          <div className="flex items-center gap-3">
                            {chat.type === 'public' ? (
                              <div className="relative">
                                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-zinc-400" />
                                </div>
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10">
                                {chat.participants && chat.participants[0] && (
                                  <AvatarImage src={chat.participants[0].profileImage} />
                                )}
                                <AvatarFallback>
                                  {chat.name ? chat.name.substring(0, 2).toUpperCase() : 'CH'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">
                                  {chat.name || (chat.participants && chat.participants[0] ? chat.participants[0].username : 'Chat')}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {new Date(chat.lastMessageTime || '').toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-zinc-400 truncate">
                                  {chat.lastMessage || "No messages yet"}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <Badge className="bg-green-500 text-white">
                                    {chat.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="unread" className="flex-1 mt-0">
                <ScrollArea className="h-[calc(100vh-190px)]">
                  <div className="px-2 py-2 space-y-1">
                    {(filteredChats || []).filter(chat => chat.unreadCount && chat.unreadCount > 0).length === 0 ? (
                      <div className="text-center py-8 text-zinc-500">
                        No unread messages
                      </div>
                    ) : (
                      filteredChats
                        .filter(chat => chat.unreadCount && chat.unreadCount > 0)
                        .map((chat) => (
                          <div
                            key={chat.id}
                            className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedChat?.id === chat.id
                                ? "bg-green-500/10 hover:bg-green-500/20"
                                : "hover:bg-zinc-800"
                            }`}
                            onClick={() => handleSelectChat(chat)}
                          >
                            {/* Chat entry content (same as above) */}
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                {chat.participants && chat.participants[0] && (
                                  <AvatarImage src={chat.participants[0].profileImage} />
                                )}
                                <AvatarFallback>
                                  {chat.name ? chat.name.substring(0, 2).toUpperCase() : 'CH'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate">
                                    {chat.name || (chat.participants && chat.participants[0] ? chat.participants[0].username : 'Chat')}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {new Date(chat.lastMessageTime || '').toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-zinc-400 truncate">
                                    {chat.lastMessage || "No messages yet"}
                                  </p>
                                  <Badge className="bg-green-500 text-white">
                                    {chat.unreadCount}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="groups" className="flex-1 mt-0">
                <ScrollArea className="h-[calc(100vh-190px)]">
                  <div className="px-2 py-2 space-y-1">
                    {(filteredChats || []).filter(chat => chat.type === 'public').length === 0 ? (
                      <div className="text-center py-8 text-zinc-500">
                        No group conversations
                      </div>
                    ) : (
                      filteredChats
                        .filter(chat => chat.type === 'public')
                        .map((chat) => (
                          <div
                            key={chat.id}
                            className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedChat?.id === chat.id
                                ? "bg-green-500/10 hover:bg-green-500/20"
                                : "hover:bg-zinc-800"
                            }`}
                            onClick={() => handleSelectChat(chat)}
                          >
                            {/* Group chat entry content */}
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-zinc-400" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate">
                                    {chat.name}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {new Date(chat.lastMessageTime || '').toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-zinc-400 truncate">
                                    {chat.lastMessage || "No messages yet"}
                                  </p>
                                  {chat.unreadCount > 0 && (
                                    <Badge className="bg-green-500 text-white">
                                      {chat.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Chat Area */}
          {selectedChat ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedChat.type === 'public' ? (
                    <div className="relative">
                      <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-zinc-400" />
                      </div>
                    </div>
                  ) : (
                    <Avatar className="h-10 w-10">
                      {selectedChat.participants && selectedChat.participants[0] && (
                        <AvatarImage src={selectedChat.participants[0].profileImage} />
                      )}
                      <AvatarFallback>
                        {selectedChat.name ? selectedChat.name.substring(0, 2).toUpperCase() : 'CH'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    <h3 className="font-medium">
                      {selectedChat.name || (selectedChat.participants && selectedChat.participants[0] ? selectedChat.participants[0].username : 'Chat')}
                    </h3>
                    <div className="text-xs text-zinc-400">
                      {selectedChat.type === 'public' 
                        ? `${selectedChat.participants ? selectedChat.participants.length : 0} members` 
                        : selectedChat.participants && selectedChat.participants[0] && selectedChat.participants[0].isOnline 
                          ? "Online" 
                          : "Offline"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => setChallengeDialogOpen(true)}
                  >
                    <Code className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-pulse text-zinc-500">Loading messages...</div>
                    </div>
                  ) : messages?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <>
                      {messages?.map((msg: MessageType) => (
                        <ChatMessage 
                          key={msg.id} 
                          message={msg}
                        />
                      ))}
                      
                      {/* Sample challenge invite - this will be handled separately */}
                      {selectedChat.id === 'general' && (
                        <div className="border rounded-md p-3 mt-2 border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50">
                          <p className="text-sm">Challenge invite will appear here</p>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Code className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type a message..."
                      className="bg-zinc-800 border-zinc-700 pr-10"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button 
                    size="icon" 
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Challenge Dialog */}
              {challengeDialogOpen && (
                <ChatChallengeDialog
                  isOpen={challengeDialogOpen}
                  onClose={() => setChallengeDialogOpen(false)}
                  onCreateChallenge={(challenge) => {
                    // Handle the created challenge, for example:
                    toast({
                      title: "Challenge Created",
                      description: `Your challenge "${challenge.title}" has been created successfully.`,
                    });
                    refetchMessages();
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-zinc-800/50 rounded-full p-6 mb-4">
                <MessageSquare className="h-12 w-12 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-zinc-400 mb-6 max-w-md">
                Choose an existing conversation or start a new one to begin messaging.
              </p>
              <Button className="bg-green-500 hover:bg-green-600">
                <UserPlus className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
