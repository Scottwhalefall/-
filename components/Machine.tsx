import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BALL_COLORS } from '../types';

interface MachineProps {
  isShaking: boolean;
  onDrawComplete: () => void;
  drawTrigger: number; // Increment to trigger animation
}

export const Machine: React.FC<MachineProps> = ({ isShaking, onDrawComplete, drawTrigger }) => {
  
  // Internal balls decoration
  const staticBalls = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    color: BALL_COLORS[i % BALL_COLORS.length],
    left: 10 + Math.random() * 60 + '%',
    top: 30 + Math.random() * 40 + '%',
    size: 20 + Math.random() * 15,
  }));

  return (
    <div className="relative w-80 h-auto flex flex-col items-center z-10">
      
      {/* --- GLOBE SECTION --- */}
      <motion.div 
        className="relative w-64 h-64 rounded-full border-8 border-gray-100 bg-white/40 backdrop-blur-sm shadow-xl overflow-hidden z-20"
        animate={isShaking ? {
          rotate: [0, -5, 5, -5, 5, 0],
          y: [0, -5, 0],
        } : {}}
        transition={{ duration: 0.3, repeat: isShaking ? Infinity : 0 }}
      >
        {/* Highlight/Reflection */}
        <div className="absolute top-4 left-4 w-16 h-8 bg-white/60 rounded-full rotate-[-45deg] z-30 pointer-events-none blur-[2px]" />
        
        {/* Balls Inside */}
        <div className="absolute inset-0 flex items-center justify-center">
            {staticBalls.map((ball) => (
              <motion.div
                key={ball.id}
                className={`absolute rounded-full ${ball.color.bg} shadow-inner border border-black/10`}
                style={{
                  left: ball.left,
                  top: ball.top,
                  width: ball.size,
                  height: ball.size,
                }}
                animate={isShaking ? {
                  x: [0, (Math.random() - 0.5) * 40, 0],
                  y: [0, (Math.random() - 0.5) * 40, 0],
                } : {}}
                transition={{
                  duration: 0.2,
                  repeat: isShaking ? Infinity : 0,
                  repeatType: 'mirror'
                }}
              />
            ))}
        </div>
        
        {/* Top Cap */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-400 rounded-t-full border-b-2 border-pink-500" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-red-500" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 shadow-lg" />
      </motion.div>

      {/* --- CONNECTOR --- */}
      <div className="w-32 h-6 bg-gray-200 -mt-2 z-10 border-x-4 border-gray-300" />

      {/* --- BASE SECTION --- */}
      <div className="relative w-56 h-64 bg-red-500 rounded-t-2xl rounded-b-lg shadow-2xl flex flex-col items-center pt-8 border-r-8 border-red-600 z-10">
        
        {/* Decorative Stars side stripe */}
        <div className="absolute left-3 top-0 bottom-0 w-6 flex flex-col items-center justify-around py-4 border-r-2 border-yellow-300/30">
             {'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-300 text-xs">{s}</span>)}
        </div>
         <div className="absolute right-3 top-0 bottom-0 w-6 flex flex-col items-center justify-around py-4 border-l-2 border-yellow-300/30">
             {'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-300 text-xs">{s}</span>)}
        </div>

        {/* Coin Mechanism Plate */}
        <div className="w-32 h-36 bg-pink-400 rounded-b-full rounded-t-lg border-4 border-yellow-400 shadow-md flex items-center justify-center relative">
          {/* Knob */}
          <motion.div 
            className="w-20 h-10 bg-yellow-300 rounded-full border-b-4 border-yellow-500 flex items-center justify-center shadow-lg cursor-pointer"
            animate={isShaking || drawTrigger > 0 ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
             <div className="w-16 h-2 bg-gray-400/20 rounded-full transform rotate-90" />
             <div className="w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-500" />
          </motion.div>
        </div>

        {/* Chute Door */}
        <div className="mt-auto mb-4 w-20 h-24 bg-yellow-300 rounded-t-full border-4 border-white/50 relative overflow-visible">
            <div className="absolute bottom-0 w-full h-2 bg-yellow-500" />
        </div>
        
        {/* Coin Slot (Decoration) */}
        <div className="absolute right-8 bottom-24 w-8 h-12 bg-yellow-400 border-2 border-yellow-600 rounded-md flex items-center justify-center shadow-inner">
            <div className="w-2 h-8 bg-black rounded-full" />
        </div>

      </div>

      {/* --- FALLING BALL ANIMATION --- */}
      <AnimatePresence>
        {drawTrigger > 0 && !isShaking && (
           <motion.div
             key={drawTrigger} // trigger new animation on change
             initial={{ y: -250, scale: 0.5, opacity: 0 }}
             animate={{ y: 0, scale: 1, opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 14,
                delay: 0.2 
             }}
             onAnimationComplete={onDrawComplete}
             className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 z-50"
           >
              <div className={`w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl border-2 border-white/30 flex items-center justify-center`}>
                  <span className="text-white font-bold text-2xl">?</span>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};