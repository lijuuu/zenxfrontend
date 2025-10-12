import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";
import { ProblemMetadata, ExecutionResult } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRecentSubmissions } from '@/services/useGetSubmissionHistory';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import { DescriptionTab } from './tabs/DescriptionTab';
import { AIChatTab } from './tabs/AIChatTab';
import { AIChatInterfaceRef } from './tabs/AIChatInterface';
import { OutputTab } from './tabs/OutputTab';
import { TestCasesTab } from './tabs/TestCasesTab';
import { SubmissionHistoryTab } from './tabs/SubmissionHistoryTab';

interface ProblemTabsProps {
  problem: ProblemMetadata;
  executionResult: ExecutionResult | null;
  output: string[];
  hideBackButton?: boolean;
  code?: string;
  language?: string;
  setCode?: (code: string) => void;
}

type TabType = 'description' | 'aichat' | 'output' | 'testcases' | 'submission';

export const ProblemTabs: React.FC<ProblemTabsProps> = ({
  problem,
  executionResult,
  output,
  hideBackButton,
  code = '',
  language = 'javascript',
  setCode
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const { data: userProfile } = useGetUserProfile();
  const aiChatRef = useRef<AIChatInterfaceRef>(null);

  //fetch submissions for this problem
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useRecentSubmissions({
    userId: userProfile?.userId || '',
    limit: 100,
  });

  //auto switch tabs based on execution state
  useEffect(() => {
    if (output.length > 0) {
      //check if there is an error in the output
      const hasError = output.some(line => line.startsWith('[Error]'));

      if (hasError) {
        //switch to output tab to show error
        setActiveTab('output');
      } else if (executionResult) {
        //switch to test cases tab to show results
        setActiveTab('testcases');
      }
    }
  }, [output, executionResult]);

  //refetch submissions when any submission occurs (success or failure)
  useEffect(() => {
    if (executionResult && userProfile?.userId) {
      //check if this was a submission not just a run by looking at the output
      const isSubmission = output.some(line => line.includes('isRunTestcase: false'));

      if (isSubmission) {
        //refetch submissions to get the latest data for both successful and failed submissions
        refetchSubmissions();
      }
    }
  }, [executionResult, output, userProfile?.userId, refetchSubmissions]);

  //handle tab click with special logic for AI chat
  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);

    //if clicking on AI chat tab, scroll to latest message
    if (tabId === 'aichat') {
      //use setTimeout to ensure the tab is rendered before scrolling
      setTimeout(() => {
        aiChatRef.current?.scrollToLatest();
      }, 100);
    }
  };

  const tabs = [
    { id: 'description' as TabType, label: 'Description' },
    { id: 'aichat' as TabType, label: 'AI Chat' },
    { id: 'output' as TabType, label: 'Output' },
    { id: 'testcases' as TabType, label: 'Test Cases' },
    { id: 'submission' as TabType, label: 'Submission History' },
  ];

  const renderTabContent = () => {
    return (
      <div className="h-full">
        {/*render all tabs but only show the active one*/}
        <div className={`h-full ${activeTab === 'description' ? 'block' : 'hidden'}`}>
          <DescriptionTab problem={problem} />
        </div>
        <div className={`h-full ${activeTab === 'aichat' ? 'block' : 'hidden'}`}>
          <AIChatTab
            ref={aiChatRef}
            problem={problem}
            code={code}
            language={language}
            output={output}
            executionResult={executionResult}
            setCode={setCode}
          />
        </div>
        <div className={`h-full ${activeTab === 'output' ? 'block' : 'hidden'}`}>
          <OutputTab
            executionResult={executionResult}
            output={output}
            problem={problem}
            code={code}
            language={language}
          />
        </div>
        <div className={`h-full ${activeTab === 'testcases' ? 'block' : 'hidden'}`}>
          <TestCasesTab problem={problem} executionResult={executionResult} />
        </div>
        <div className={`h-full ${activeTab === 'submission' ? 'block' : 'hidden'}`}>
          <SubmissionHistoryTab
            submissions={submissions}
            isLoading={submissionsLoading}
            problemId={problem.problemId}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900/1 border-r border-zinc-800">
      {/*tab navigation*/}
      <div className="flex-shrink-0  pb-0">
        <div className="flex border-b border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/*tab content*/}
      <div className="flex-1 overflow-hidden relative">
        {renderTabContent()}
      </div>

      {/*back button*/}
      {!hideBackButton && (
        <div className="flex-shrink-0 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/problems")}
            className="w-full bg-zinc-800 text-green-500 hover:bg-zinc-700 hover:text-green-400 border-zinc-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problems
          </Button>
        </div>
      )}
    </div>
  );
};