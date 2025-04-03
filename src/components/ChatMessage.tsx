
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Reply, ThumbsUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage as MessageType } from "@/api/types";

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(message.liked || false);
  const [likeCount, setLikeCount] = useState(message.likeCount || 0);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const isCurrentUser = message.isCurrentUser || message.sender?.id === "1"; // Assuming current user ID is 1
  
  return (
    <div 
      className={`group flex gap-3 items-start mb-6 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={message.sender?.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"} 
          alt={message.sender?.username || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        {message.sender?.isOnline && (
          <span className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-zinc-900"></span>
        )}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isCurrentUser ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isCurrentUser && (
            <>
              <span className="font-medium">{message.sender?.username || "User"}</span>
              <span className="text-xs text-zinc-400">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </span>
            </>
          )}
          {isCurrentUser && (
            <>
              <span className="text-xs text-zinc-400 ml-auto">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </span>
              <span className="font-medium">You</span>
            </>
          )}
        </div>
        
        <div 
          className={`p-3 rounded-lg ${
            isCurrentUser 
              ? 'bg-green-500/20 text-white ml-auto' 
              : 'bg-zinc-800 border border-zinc-700/40'
          }`}
        >
          <p>{message.content}</p>
        </div>
        
        <div 
          className={`flex items-center gap-2 mt-1 text-xs ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {(showActions || likeCount > 0) && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 px-2 text-xs ${
                  liked ? 'text-green-400' : 'text-zinc-400 hover:text-white'
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {likeCount > 0 && likeCount}
              </Button>
              
              {showActions && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-zinc-400 hover:text-white"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-zinc-400 hover:text-white"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
