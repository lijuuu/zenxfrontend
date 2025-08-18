import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, History, Lock, Filter, PlusCircle, ArrowRight, ChevronRight } from "lucide-react";
import ChallengeCard from "@/components/challenges/ChallengeCard";

interface ChallengeListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setOpenJoinPrivateModal: (open: boolean) => void;
  activeOpenChallenges: any;
  activeOpenChallengesLoading: boolean;
  publicChallengeHistory: any;
  publicHistoryLoading: boolean;
  privateChallengeHistory: any;
  privateHistoryLoading: boolean;
  yourChallenges: any;
  yourChallengesLoading: boolean;
  creatorProfiles: Record<string, any>;
  isLoadingCreators: boolean;
  creatorError: any;
  handleJoinChallenge: (challenge: any) => void;
  setActiveChallengeId: (id: string | null) => void;
  copyRoomUrl: (challenge: any) => void;
  navigate: ReturnType<typeof useNavigate>;
}

const ChallengeList: React.FC<ChallengeListProps> = ({
  activeTab,
  setActiveTab,
  setOpenJoinPrivateModal,
  activeOpenChallenges,
  activeOpenChallengesLoading,
  publicChallengeHistory,
  publicHistoryLoading,
  privateChallengeHistory,
  privateHistoryLoading,
  yourChallenges,
  yourChallengesLoading,
  creatorProfiles,
  isLoadingCreators,
  creatorError,
  handleJoinChallenge,
  setActiveChallengeId,
  copyRoomUrl,
  navigate,
}) => {
  const renderChallengeSection = (tab: string, title: string, challenges: any, isLoading: boolean, icon: JSX.Element, color: string, buttonProps: (challenge: any) => JSX.Element) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2 text-gray-200 text-lg">
          {icon}
          {title}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"
          aria-label={`Filter ${title.toLowerCase()}`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Filter
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className={`h-10 w-10 animate-spin text-${color}-400`} aria-label={`Loading ${title.toLowerCase()}`} />
        </div>
      ) : challenges?.challenges?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              creatorProfile={creatorProfiles[challenge.creatorId] || { userName: null, avatarURL: null }}
              isLoadingCreators={isLoadingCreators}
              creatorError={creatorError}
              loadChallenge={setActiveChallengeId}
              copyRoomUrl={copyRoomUrl}
              actions={buttonProps(challenge)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm">No {title.toLowerCase()} found</p>
          {tab === "active" && (
            <Button
              size="lg"
              className="mt-4 bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
              onClick={() => navigate("/create-challenges")}
              aria-label="Create new challenge"
              disabled={yourChallengesLoading || (yourChallenges?.challenges?.length > 0)}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">Create Challenge</span>
            </Button>
          )}
          {tab === "public" && (
            <p className="text-xs text-gray-400 mt-2">Join public challenges to see them here</p>
          )}
          {tab === "private" && (
            <p className="text-xs text-gray-400 mt-2">Join private challenges to see them here</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200">Challenges</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-gray-100 text-sm px-4 py-2 rounded-md"
            aria-label="Join private challenge"
            onClick={() => setOpenJoinPrivateModal(true)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Join Private
          </Button>
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
            onClick={() => navigate("/create-challenges")}
            aria-label="Create new challenge"
            disabled={yourChallengesLoading || (yourChallenges?.challenges?.length > 0)}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
            <span className="relative z-10">Create Challenge</span>
          </Button>
        </div>
      </div>
      <div className="md:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full p-2 pr-10 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
          aria-label="Select challenge category"
        >
          <option value="active">Active Public Challenges</option>
          <option value="public">Public History</option>
          <option value="private">Private History</option>
        </select>
      </div>
      <div className="hidden md:block">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/50 border-gray-600 rounded-md">
            <TabsTrigger
              value="active"
              className="text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400 rounded-md"
            >
              Active Public Challenges
            </TabsTrigger>
            <TabsTrigger
              value="public"
              className="text-gray-300 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400 rounded-md"
            >
              Public History
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="text-gray-300 data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-400 rounded-md"
            >
              Private History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {renderChallengeSection(
              "active",
              "Active Public Challenges",
              activeOpenChallenges,
              activeOpenChallengesLoading,
              <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
              "green",
              (challenge) => (
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinChallenge(challenge);
                  }}
                  aria-label={`Join ${challenge.title || "challenge"} challenge`}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">Join Challenge</span>
                </Button>
              )
            )}
          </TabsContent>
          <TabsContent value="public">
            {renderChallengeSection(
              "public",
              "Public Challenge History",
              publicChallengeHistory,
              publicHistoryLoading,
              <History className="h-4 w-4 text-blue-400" aria-hidden="true" />,
              "blue",
              (challenge) => (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/challenge-results/${challenge.challengeId}`);
                  }}
                  aria-label={`View results for ${challenge.title || "challenge"}`}
                >
                  View Results
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )
            )}
          </TabsContent>
          <TabsContent value="private">
            {renderChallengeSection(
              "private",
              "Private Challenge History",
              privateChallengeHistory,
              privateHistoryLoading,
              <Lock className="h-4 w-4 text-yellow-400" aria-hidden="true" />,
              "yellow",
              (challenge) => (
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/challenge-results/${challenge.challengeId}`);
                  }}
                  aria-label={`View results for ${challenge.title || "challenge"}`}
                >
                  View Results
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="md:hidden">
        {activeTab === "active" &&
          renderChallengeSection(
            "active",
            "Active Public Challenges",
            activeOpenChallenges,
            activeOpenChallengesLoading,
            <History className="h-4 w-4 text-green-400" aria-hidden="true" />,
            "green",
            (challenge) => (
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 relative group py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinChallenge(challenge);
                }}
                aria-label={`Join ${challenge.title || "challenge"} challenge`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArrowRight className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">Join Challenge</span>
              </Button>
            )
          )}
        {activeTab === "public" &&
          renderChallengeSection(
            "public",
            "Public Challenge History",
            publicChallengeHistory,
            publicHistoryLoading,
            <History className="h-4 w-4 text-blue-400" aria-hidden="true" />,
            "blue",
            (challenge) => (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/challenge-results/${challenge.challengeId}`);
                }}
                aria-label={`View results for ${challenge.title || "challenge"}`}
              >
                View Results
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )
          )}
        {activeTab === "private" &&
          renderChallengeSection(
            "private",
            "Private Challenge History",
            privateChallengeHistory,
            privateHistoryLoading,
            <Lock className="h-4 w-4 text-yellow-400" aria-hidden="true" />,
            "yellow",
            (challenge) => (
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/challenge-results/${challenge.challengeId}`);
                }}
                aria-label={`View results for ${challenge.title || "challenge"}`}
              >
                View Results
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )
          )}
      </div>
    </div>
  );
};

export default ChallengeList;