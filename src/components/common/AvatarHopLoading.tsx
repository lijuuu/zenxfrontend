import React from 'react'
import { motion } from 'framer-motion';
import avatar from '@/assets/avatar.png';

const AvatarHopLoading = ({ message }: { message?: string }) => (
  <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative flex justify-center items-center"
        style={{ willChange: 'transform, opacity' }}
        initial={{ x: -150, opacity: 1 }}
        animate={{
          x: [-150, -100, -50, 0, 50, 100, 150, -150],
          y: [0, -10, 0, -10, 0, -10, 0, 0],
          opacity: [1, 1, 1, 1, 1, 0.5, 0, 1],
          scale: [1, 1, 1, 1, 1, 1.05, 1.1, 1],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
          repeat: Infinity,
        }}
      >
        <img
          src={avatar}
          alt="Loading Avatar"
          className="w-20 h-20 rounded-full shadow-2xl"
        />
      </motion.div>
      <motion.p
        className="text-zinc-400 text-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        {message || "Loading..."}
      </motion.p>
    </div>
  </div>
);

export default AvatarHopLoading
