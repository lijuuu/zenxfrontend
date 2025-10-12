import React, { useRef, useEffect } from 'react';
import { ExecutionResult } from '@/api/types';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import ReactJson from 'react-json-view';

interface ConsoleProps {
  output: string[];
  executionResult: ExecutionResult | null;
  isMobile: boolean;
  onResetOutput: () => void;
}

//utility function to check if a string is JSON-like for output lines
const isJsonOutputLine = (str: string): any | null => {
  if (str.startsWith('executionResult: ')) {
    try {
      const jsonStr = str.replace('executionResult: ', '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const Console: React.FC<ConsoleProps> = ({
  output = [],
  executionResult,
  isMobile,
  onResetOutput,
}) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  return (
    <motion.div className="h-full overflow-hidden flex flex-col bg-zinc-900/30 border-t border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-white">Console</h3>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={onResetOutput}
            className="px-2 py-1 rounded-md flex items-center gap-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="h-4 w-4" /> Reset Output
          </motion.button>
        </div>
      </div>

      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-[#070809]">
        {output.length > 0 ? (
          <div className="space-y-1">
            {output.map((line, i) => {
              const jsonData = isJsonOutputLine(line);
              if (jsonData) {
                return (
                  <div key={i} className="whitespace-pre-wrap break-all">
                    <ReactJson
                      src={jsonData}
                      theme="monokai"
                      style={{ backgroundColor: 'transparent' }}
                      displayObjectSize={true}
                      displayDataTypes={false}
                      collapsed={false}
                      name={false}
                      enableClipboard={true}
                      indentWidth={2}
                    />
                  </div>
                );
              }
              return (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ? (
                    <span className="text-red-400">{line}</span>
                  ) : line.match(/problemId|language|isRunTestcase/) ? (
                    <span className="text-green-500">{line}</span>
                  ) : (
                    <span className="text-zinc-300">{line}</span>
                  )}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>
        ) : (
          <div className="text-zinc-500 italic">Run your code to see output here...</div>
        )}
      </div>
    </motion.div>
  );
};