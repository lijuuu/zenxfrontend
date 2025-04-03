
import React, { useState, useRef } from 'react';
import { 
  Smile, 
  Paperclip, 
  Image, 
  Mic, 
  MicOff,
  Send, 
  Code,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
  onCreateChallenge?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onCreateChallenge }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<{ type: string; file: File; preview?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() === '' && attachments.length === 0) return;
    
    // In a real app, you'd upload the files first and get URLs
    const attachmentData = attachments.map(att => ({
      type: att.type,
      url: URL.createObjectURL(att.file),
      name: att.file.name
    }));
    
    onSendMessage(message, attachmentData.length > 0 ? attachmentData : undefined);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      type,
      file,
      preview: type === 'image' ? URL.createObjectURL(file) : undefined
    }));
    
    setAttachments([...attachments, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    
    // Revoke object URL if it exists
    if (updatedAttachments[index].preview) {
      URL.revokeObjectURL(updatedAttachments[index].preview!);
    }
    
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // In a real app, you'd implement voice recording here
      toast({
        title: "Voice recording started",
        description: "Recording your message...",
      });
    } else {
      toast({
        title: "Voice recording stopped",
        description: "Processing your audio...",
      });
      
      // Simulate adding a voice attachment
      setTimeout(() => {
        toast({
          title: "Voice message ready",
          description: "Your voice message has been attached",
        });
      }, 1000);
    }
    
    setIsRecording(!isRecording);
  };

  const handleCreateChallenge = () => {
    if (onCreateChallenge) {
      onCreateChallenge();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2">
          {attachments.map((att, index) => (
            <div key={index} className="relative group">
              {att.type === 'image' ? (
                <div className="w-16 h-16 rounded overflow-hidden">
                  <img src={att.preview} alt="Attachment" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemoveAttachment(index)}
                    className="absolute top-0 right-0 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded p-2 pr-6">
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span className="text-xs truncate max-w-[100px]">{att.file.name}</span>
                  <button 
                    onClick={() => handleRemoveAttachment(index)}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={1}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()}>
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2" align="end">
              <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
                {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', 
                  '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪',
                  '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒',
                  '👍', '👎', '👏', '🙌', '👋', '🤝', '✌️', '🤘', '🤟', '🤙'].map((emoji, index) => (
                  <button 
                    key={index} 
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-accent/10 p-1 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isRecording ? "destructive" : "ghost"} 
                  size="icon"
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? "Stop recording" : "Voice message"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default"
                  className="accent-color flex gap-1 px-3 h-9"
                  onClick={handleCreateChallenge}
                >
                  <Code className="h-4 w-4" />
                  <span>Challenge</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a coding challenge</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="icon" 
                  onClick={handleSendMessage}
                  className="accent-color"
                  disabled={message.trim() === '' && attachments.length === 0}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileSelect(e, 'file')} 
          className="hidden"
          multiple
        />
        <input 
          type="file" 
          accept="image/*" 
          ref={imageInputRef} 
          onChange={(e) => handleFileSelect(e, 'image')} 
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

export default ChatInput;
