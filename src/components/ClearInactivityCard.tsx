
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClearInactivityCard: React.FC = () => {
  const [cleared, setCleared] = useState(false);
  const { toast } = useToast();

  const handleClearInactivity = () => {
    // Simulate API call
    setTimeout(() => {
      setCleared(true);
      toast({
        title: "Inactivity period cleared!",
        description: "Your streak has been maintained.",
      });
    }, 1000);
  };

  if (cleared) {
    return (
      <Card className="bg-green-900/20 border-green-800/50 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 rounded-full p-2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-green-400">Streak Protected</h3>
              <p className="text-sm text-green-300/80">
                Your coding streak is safe for today
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-900/20 border-amber-800/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 rounded-full p-2">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium text-amber-400">Protect Your Streak</h3>
              <p className="text-sm text-amber-300/80">
                You haven't coded today. Clear this inactivity to maintain your streak.
              </p>
            </div>
          </div>
          <Button 
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleClearInactivity}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClearInactivityCard;
