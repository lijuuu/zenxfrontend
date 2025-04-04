
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const MonthlyActivityHeatmap: React.FC = () => {
  return (
    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Monthly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="text-sm text-zinc-400">
            Heatmap visualization of coding activity will be displayed here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyActivityHeatmap;
