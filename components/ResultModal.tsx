import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BALL_COLORS } from '../types';

interface ResultModalProps {
  number: number | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ number, onClose }) => {
  if (!number) return null;

  // Deterministic color based on number
  const color = BALL_COLORS[number % BALL_COLORS.length];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center flex flex-col items-center overflow-hidden"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti inside modal */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-100/50 to-transparent" />
          </div>

          <h2 className="text-3xl font-festive text-gray-800 mb-6 relative z-10">Lucky Number!</h2>
          
          <div className={`w-40 h-40 rounded-full ${color.bg} shadow-2xl flex items-center justify-center border-8 border-white ring-4 ring-gray-100 mb-6 relative z-10`}>
             <div className="absolute top-4 left-6 w-10 h-6 bg-white/40 rounded-full rotate-[-45deg] blur-sm" />
             <span className="text-8xl font-black text-white drop-shadow-md">
                {number}
             </span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-6 rounded-xl shadow-lg transform transition active:scale-95 relative z-10"
          >
            Keep it!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};