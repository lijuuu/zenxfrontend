
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const ClearInactivityCard: React.FC = () => {
  return (
    <Card className="bg-yellow-500/10 border-yellow-500/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-md">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Clear Your Recent Inactivity</h3>
            <p className="text-sm text-zinc-400 mt-1">
              You've been inactive for 3 days. Solve a problem today to keep your streak alive!
            </p>
            <Button className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white">
              Solve a Problem
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClearInactivityCard;
