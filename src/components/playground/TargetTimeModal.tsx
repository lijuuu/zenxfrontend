import React, { useState } from 'react';
import { Clock, X, Play, Info, Timer, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TargetTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetTargetTime: (minutes: number) => void;
  currentTargetTime: number | null;
}

export const TargetTimeModal: React.FC<TargetTimeModalProps> = ({
  isOpen,
  onClose,
  onSetTargetTime,
  currentTargetTime
}) => {
  const [selectedTime, setSelectedTime] = useState<number>(currentTargetTime || 15);

  if (!isOpen) return null;

  const timeOptions = [
    { value: 1, label: '1 minute', description: 'Quick practice' },
    { value: 2, label: '2 minutes', description: 'Fast coding' },
    { value: 5, label: '5 minutes', description: 'Quick challenge' },
    { value: 10, label: '10 minutes', description: 'Short problem' },
    { value: 15, label: '15 minutes', description: 'Medium problem' },
    { value: 20, label: '20 minutes', description: 'Standard problem' },
    { value: 30, label: '30 minutes', description: 'Complex problem' },
    { value: 45, label: '45 minutes', description: 'Advanced challenge' },
    { value: 60, label: '60 minutes', description: 'Extended session' },
  ];

  const handleStartTimer = () => {
    onSetTargetTime(selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden p-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Target Time</h3>
              <p className="text-sm text-zinc-400">Set a time limit for problem solving</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left Column - Settings */}
            <div className="space-y-3 overflow-y-auto">
              <div>
                <h4 className="text-base font-medium text-white mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Time Settings
                </h4>

                {/* Time Selection */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-zinc-300 mb-2">Select Time Limit</h5>
                  <div className="grid grid-cols-3 gap-1">
                    {timeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedTime(option.value)}
                        className={`p-3 rounded border text-left transition-all duration-200 ${selectedTime === option.value
                          ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/70'
                          }`}
                      >
                        <div className="font-medium text-xs">{option.label}</div>
                        <div className="text-xs text-zinc-400">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Time Input */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1 block">
                    Custom time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter minutes"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Details & Benefits */}
            <div className="space-y-3 overflow-y-auto">
              {/* What is Target Time Section */}
              <div className="bg-blue-900/20 border border-blue-800/50 rounded p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-2">What is Target Time?</h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Set a time limit for problem solving. When time expires, your code automatically submits.
                      Simulates real interview conditions and improves problem-solving speed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-green-400" />
                  Benefits
                </h4>
                <ul className="space-y-1 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Practice under time pressure like real interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Improve problem-solving speed and efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Prevent overthinking and analysis paralysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Automatic submission ensures no lost attempts</span>
                  </li>
                </ul>
              </div>

              {/* How it Works */}
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4">
                <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                  <Play className="h-3 w-3 text-purple-400" />
                  How it Works
                </h4>
                <ol className="space-y-1 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Set your desired time limit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Timer starts counting down immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Code automatically submits when time expires</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800">
          <div className="text-xs text-zinc-500">
            Timer will start immediately and auto-submit when time expires
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-zinc-700 text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartTimer}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
