
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ReferralBanner = () => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText("https://zenx.com/ref/ZENX-MDJYWA");
    toast({
      title: "Referral link copied!",
      description: "Share it with your friends to earn points",
    });
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500/20 to-green-900/20 border border-green-500/30 p-6">
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                +
              </span>
              Clear Recent Inactivity
            </h3>
            <p className="text-zinc-300 mt-1">
              Refer a friend to instantly clean up your activity heatmap and earn bonus points
            </p>
            <p className="text-sm text-green-400 mt-2">
              Each successful referral will replace 5 inactive days with activity
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value="https://zenx.com/ref/ZENX-MDJYWA"
                readOnly
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <Button 
              className="bg-green-500 hover:bg-green-600 flex-nowrap whitespace-nowrap" 
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy & Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralBanner;
