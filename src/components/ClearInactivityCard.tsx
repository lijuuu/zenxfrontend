
import React from 'react';
import { Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ClearInactivityCardProps {
  className?: string;
}

const ClearInactivityCard: React.FC<ClearInactivityCardProps> = ({ className }) => {
  const { toast } = useToast();
  const referralLink = "https://zenx.com/ref/ZENX-I";
  
  const handleCopyShare = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share it with your friends",
    });
  };
  
  return (
    <div className={`bg-green-900/30 backdrop-blur-sm border border-green-800/50 rounded-lg p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="bg-green-500 rounded-full p-1.5 text-white">
          <Plus size={18} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg">Clear Recent Inactivity</h3>
          <p className="text-green-300/80 text-sm mt-1">
            Refer a friend to instantly clean up your activity heatmap and earn bonus points
          </p>
          
          <p className="text-green-400/70 text-xs mt-3">
            Each successful referral will replace 5 inactive days with activity
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded px-3 py-2 text-zinc-400 text-sm flex-1 overflow-hidden text-ellipsis">
          {referralLink}
        </div>
        
        <Button 
          onClick={handleCopyShare}
          className="bg-green-500 hover:bg-green-600 text-white gap-2"
        >
          <Copy size={16} />
          Copy & Share
        </Button>
      </div>
    </div>
  );
};

export default ClearInactivityCard;
