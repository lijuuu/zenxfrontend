import React from "react";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Share2,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Submission } from "@/api/types";
import { formatDistanceToNow } from "date-fns";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SubmissionDetailsProps extends Submission {
  onBack: () => void;
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  id,
  problemId,
  title,
  userCode,
  language,
  status,
  difficulty,
  submittedAt,
  score,
  isFirst,
  onBack,
}) => {
  const getSyntaxLanguage = (lang: string) => {
    const langMap: { [key: string]: string } = {
      javascript: "javascript",
      python: "python",
      cpp: "cpp",
      go: "go",
      c: "c",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
    };
    return langMap[lang.toLowerCase()] || "text";
  };

  const getDifficultyDisplay = (diff: string) => {
    switch (diff) {
      case "E":
        return {
          text: "Easy",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        };
      case "M":
        return {
          text: "Medium",
          className:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        };
      case "H":
        return {
          text: "Hard",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
      default:
        return {
          text: "Unknown",
          className: "bg-zinc-700/50 text-zinc-400",
        };
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          className: "text-green-400",
        };
      case "PROCESSING":
      case "PENDING":
        return {
          icon: <Clock className="h-5 w-5 text-blue-400" />,
          className: "text-blue-400",
        };
      case "FAILED":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          className: "text-red-400",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-zinc-400" />,
          className: "text-zinc-400",
        };
    }
  };

  const handleShareX = () => {
    const problemLink = `https://zenxbattle.space/playground?problem_id=${problemId}`;
    const shareText = `Check out this ZenxBattle problem: ${problemLink} 🚀 #Coding #ZenxBattle`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const getEncodedPrompt = () => {
    return encodeURIComponent(`
Review the following code submission:

Title: ${title}
Language: ${language}
Difficulty: ${difficulty}
Status: ${status}

Code:
\`\`\`${language}
${userCode}
\`\`\`

Provide the complete code and explain the logic behind it, the complexity and possible resource utilization as well.
`);
  };

  const handleAskPhind = () => {
    const url = `https://www.phind.com/search?q=${getEncodedPrompt()}`;
    window.open(url, "_blank");
  };

  const handleOpenChatGPT = () => {
    const url = `https://chat.openai.com/?q=${getEncodedPrompt()}`;
    window.open(url, "_blank");
  };

  const difficultyDisplay = getDifficultyDisplay(difficulty);
  const statusDisplay = getStatusDisplay(status);

  return (
    <Card className="border border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white">{title}</CardTitle>
            <CardDescription className="text-zinc-400">
              Submitted {formatDistanceToNow(new Date(submittedAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-zinc-800" onClick={handleShareX}>
              <Share2 className="h-4 w-4 mr-2" />
              Share on X
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-zinc-800" onClick={handleAskPhind}>
              <Bot className="h-4 w-4 mr-2" />
              AskPhind AI
            </Button>
            <Button variant="ghost" size="sm" className="text-teal-400 hover:bg-zinc-800" onClick={handleOpenChatGPT}>
              <Bot className="h-4 w-4 mr-2" />
              Ask ChatGPT
            </Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-zinc-800" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">Status</h3>
            <div className="flex items-center gap-2">
              {statusDisplay.icon}
              <span className={`font-medium ${statusDisplay.className}`}>
                {status}
                {isFirst && status === "SUCCESS" && (
                  <Award className="h-4 w-4 inline-block ml-2 text-yellow-400" />
                )}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">Difficulty</h3>
            <div className={`px-3 py-1 rounded-full inline-block ${difficultyDisplay.className}`}>
              {difficultyDisplay.text}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">Language</h3>
            <div className="px-3 py-1 bg-zinc-700/50 rounded-full inline-block">{language}</div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">Score</h3>
            <span className="text-white">{score} XP</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">First Submission</h3>
            <span className="text-white">{isFirst ? "Yes" : "No"}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">Submitted Code</h3>
          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4">
            <SyntaxHighlighter
              language={getSyntaxLanguage(language)}
              style={vscDarkPlus}
              customStyle={{
                background: "transparent",
                padding: "0",
                margin: "0",
                borderRadius: "0.5rem",
              }}
              showLineNumbers
            >
              {userCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionDetails;
