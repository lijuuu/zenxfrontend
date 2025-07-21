import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HoverModalProps {
  isVisible: boolean;
  onClick: () => void;
  challengeTitle: string;
}

const HoverModal: React.FC<HoverModalProps> = ({ isVisible, onClick, challengeTitle }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-16 right-4 bg-black/80 backdrop-blur-lg border border-gray-600/50 rounded-lg shadow-lg p-4 w-64"
        >
          <p className="text-gray-200 text-sm mb-3 font-medium">
            Challenge found: {challengeTitle || "Unknown Challenge"}
          </p>
          <Button
            size="sm"
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={onClick}
            aria-label="Rejoin challenge"
          >
            Rejoin
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoverModal;