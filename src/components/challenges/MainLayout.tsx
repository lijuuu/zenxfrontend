import { motion, AnimatePresence } from "motion/react";
import MainNavbar from "@/components/common/MainNavbar";
import HoverModal from "@/components/challenges/HoverModal";
import ActiveChallengeModal from "@/components/challenges/ActiveChallengeModal";
import bgGradient from "@/assets/challengegradient.png";

interface MainLayoutProps {
  children: React.ReactNode;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  isHoverModalVisible: boolean;
  setIsHoverModalVisible: (value: boolean) => void;
  yourChallenges: any;
  yourChallengesLoading: boolean;
  activeChallengeId: string | null;
  setActiveChallengeId: (id: string | null) => void;
  handleJoinChallenge: (challenge: any) => void;
  handleAbandonChallenge: (challenge: any) => void;
  copyRoomUrl: (challenge: any) => void;
  creatorProfiles: Record<string, any>;
  isLoadingCreators: boolean;
  creatorError: any;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  avatarIcon: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isModalOpen,
  setIsModalOpen,
  isHoverModalVisible,
  setIsHoverModalVisible,
  yourChallenges,
  yourChallengesLoading,
  activeChallengeId,
  setActiveChallengeId,
  handleJoinChallenge,
  handleAbandonChallenge,
  copyRoomUrl,
  creatorProfiles,
  isLoadingCreators,
  creatorError,
  avatarIcon,
}) => {
  return (
    <div
      className="min-h-screen text-foreground pt-16 pb-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.2)), url(${bgGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MainNavbar />
      <AnimatePresence>
        {yourChallenges?.challenges?.length > 0 && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
            onMouseEnter={() => setIsHoverModalVisible(true)}
            onMouseLeave={() => setIsHoverModalVisible(false)}
          >
            <img
              src={avatarIcon || "https://via.placeholder.com/48"}
              alt="Active challenge"
              className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
              onError={() => console.error("Failed to load active challenge avatar")}
            />
            <HoverModal
              isVisible={isHoverModalVisible}
              onClick={() => setIsModalOpen(true)}
              challengeTitle={yourChallenges?.challenges[0]?.title || "Active Challenge"}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {activeChallengeId && isModalOpen && yourChallenges?.challenges?.length > 0 ? (
        <ActiveChallengeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setIsModalOpen={setIsModalOpen}
          challenge={yourChallenges?.challenges[0]}
          setActiveChallengeId={setActiveChallengeId}
          copyRoomInfo={copyRoomUrl}
          handleJoinChallenge={handleJoinChallenge}
          handleAbandonChallenge={handleAbandonChallenge}
          creatorProfile={creatorProfiles[yourChallenges?.challenges[0]?.creatorId] || { userName: null, avatarURL: null }}
          isLoadingCreator={isLoadingCreators}
          isCreatorError={creatorError}
        />
      ) : (
        <main className="page-container py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</main>
      )}
    </div>
  );
};

export default MainLayout;