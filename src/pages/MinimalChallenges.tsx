import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useUserChallengeHistory,
  useActiveOpenChallenges,
  useGetOwnersActiveChallenges,
  useAbandonChallenge,
} from "@/services/useChallenges";
import { useFetchCreatorProfiles } from "@/hooks/useUserProfiles";
import PrivateChallengeAccessModal from "@/components/challenges/PrivateChallengeAccessModal";
import ChallengeList from "@/components/challenges/ChallengeList";
import MainLayout from "@/components/challenges/MainLayout";
import avatarIcon from "@/assets/avatar.png";
import { Loader2 } from "lucide-react";

const MinimalChallenges = () => {
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoverModalVisible, setIsHoverModalVisible] = useState(false);
  const [openJoinPrivateModal, setOpenJoinPrivateModal] = useState(false);
  const navigate = useNavigate();

  const { mutate: abandonChallengeMutation, isPending: isAbandoning } = useAbandonChallenge();
  const { data: publicChallengeHistory, isLoading: publicHistoryLoading } = useUserChallengeHistory({
    isPrivate: false,
    page: 1,
    pageSize: 10,
  });
  const { data: privateChallengeHistory, isLoading: privateHistoryLoading } = useUserChallengeHistory({
    isPrivate: true,
    page: 1,
    pageSize: 10,
  });
  const { data: yourChallenges, isLoading: yourChallengesLoading } = useGetOwnersActiveChallenges({
    page: 1,
    pageSize: 10,
  });
  const { data: activeOpenChallenges, isLoading: activeOpenChallengesLoading } = useActiveOpenChallenges({
    page: 1,
    pageSize: 10,
  });

  const allChallenges = useMemo(() => {
    return [
      ...(activeOpenChallenges?.challenges || []),
      ...(yourChallenges?.challenges || []),
      ...(publicChallengeHistory?.challenges || []),
      ...(privateChallengeHistory?.challenges || []),
    ].filter((challenge) => challenge?.creatorId && challenge?.challengeId);
  }, [activeOpenChallenges, yourChallenges, publicChallengeHistory, privateChallengeHistory]);

  const creatorIds = useMemo(() => {
    return [...new Set(allChallenges.map((challenge) => challenge.creatorId).filter(Boolean))];
  }, [allChallenges]);

  const { profiles: creatorProfiles, isLoading: isLoadingCreators, error: creatorError } = useFetchCreatorProfiles(creatorIds);

  useEffect(() => {
    if (yourChallengesLoading) return;
    if (yourChallenges?.challenges?.length && !activeChallengeId && !isAbandoning) {
      const firstChallenge = yourChallenges.challenges[0];
      if (firstChallenge?.challengeId) {
        setActiveChallengeId(firstChallenge.challengeId);
        setIsModalOpen(true);
      }
    } else if (!yourChallenges?.challenges?.length && activeChallengeId) {
      setIsModalOpen(false);
      setActiveChallengeId(null);
    }
  }, [yourChallenges, yourChallengesLoading, activeChallengeId, isAbandoning]);

  useEffect(() => {
    if (activeChallengeId) {
      setIsHoverModalVisible(true);
      const timeoutId = setTimeout(() => {
        setIsHoverModalVisible(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [activeChallengeId]);

  const handleJoinChallenge = (challenge) => {
    if (!challenge?.challengeId || !challenge?.title) {
      toast.error("Invalid challenge", { duration: 1500 });
      return;
    }
    toast.success(`Joined challenge "${challenge.title}" successfully!`, { duration: 1500 });
    navigate(`/join-challenge/${challenge.challengeId}${challenge?.password ? `/${challenge.password}` : ""}`);
    setIsModalOpen(false);
  };

  const handleAbandonChallenge = async (challenge) => {
    if (!challenge?.creatorId || !challenge?.challengeId || !challenge?.title) {
      toast.error("Invalid challenge data", { duration: 1500 });
      return;
    }
    abandonChallengeMutation(
      { creatorId: challenge.creatorId, challengeId: challenge.challengeId },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setActiveChallengeId(null);
        },
      }
    );
  };

  const copyRoomUrl = (challenge) => {
    if (!challenge?.challengeId || !challenge?.title) {
      toast.error("Invalid challenge", { duration: 1500 });
      return;
    }
    const roomUrl =
      window.location.host +
      "/join-challenge/" +
      challenge.challengeId +
      (challenge.password ? "/" + challenge.password : "");
    navigator.clipboard.writeText(roomUrl).then(() => {
      toast.success("Copied room URL");
    }).catch(() => {
      toast.error("Failed to copy room information", { duration: 1500 });
    });
  };

  return (
    <MainLayout
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isHoverModalVisible={isHoverModalVisible}
      setIsHoverModalVisible={setIsHoverModalVisible}
      yourChallenges={yourChallenges}
      yourChallengesLoading={yourChallengesLoading}
      activeChallengeId={activeChallengeId}
      setActiveChallengeId={setActiveChallengeId}
      handleJoinChallenge={handleJoinChallenge}
      handleAbandonChallenge={handleAbandonChallenge}
      copyRoomUrl={copyRoomUrl}
      creatorProfiles={creatorProfiles}
      isLoadingCreators={isLoadingCreators}
      creatorError={creatorError}
      openModal={openJoinPrivateModal}
      setOpenModal={setOpenJoinPrivateModal}
      avatarIcon={avatarIcon}
    >
      <PrivateChallengeAccessModal isOpen={openJoinPrivateModal} onClose={() => setOpenJoinPrivateModal(false)} />
      {yourChallengesLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-green-400" aria-label="Loading challenges" />
        </div>
      ) : (
        <ChallengeList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setOpenJoinPrivateModal={setOpenJoinPrivateModal}
          activeOpenChallenges={activeOpenChallenges}
          activeOpenChallengesLoading={activeOpenChallengesLoading}
          publicChallengeHistory={publicChallengeHistory}
          publicHistoryLoading={publicHistoryLoading}
          privateChallengeHistory={privateChallengeHistory}
          privateHistoryLoading={privateHistoryLoading}
          yourChallenges={yourChallenges}
          yourChallengesLoading={yourChallengesLoading}
          creatorProfiles={creatorProfiles}
          isLoadingCreators={isLoadingCreators}
          creatorError={creatorError}
          handleJoinChallenge={handleJoinChallenge}
          setActiveChallengeId={setActiveChallengeId}
          copyRoomUrl={copyRoomUrl}
          navigate={navigate}
        />
      )}
    </MainLayout>
  );
};

export default MinimalChallenges;