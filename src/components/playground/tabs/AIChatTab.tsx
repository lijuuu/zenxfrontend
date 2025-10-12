import React, { forwardRef } from 'react';
import { ProblemMetadata, ExecutionResult } from '@/api/types';
import { AIChatInterface, AIChatInterfaceRef } from './AIChatInterface';

interface AIChatTabProps {
  problem: ProblemMetadata;
  code?: string;
  language?: string;
  output?: string[];
  executionResult?: ExecutionResult | null;
  setCode?: (code: string) => void;
}

export const AIChatTab = forwardRef<AIChatInterfaceRef, AIChatTabProps>(({
  problem,
  code = '',
  language = 'javascript',
  output = [],
  executionResult,
  setCode
}, ref) => {
  return (
    <div className="h-full">
      <AIChatInterface
        ref={ref}
        problem={problem}
        code={code}
        language={language}
        output={output}
        executionResult={executionResult}
        setCode={setCode}
      />
    </div>
  );
});
