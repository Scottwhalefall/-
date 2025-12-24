import React, { useState, useEffect, useRef } from 'react';
import { useShake } from './hooks/useShake';
import { ConfettiBackground } from './components/Confetti';
import { Machine } from './components/Machine';
import { ResultModal } from './components/ResultModal';
import { motion } from 'framer-motion';

const TOTAL_NUMBERS = 80;

const App: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [drawTrigger, setDrawTrigger] = useState(0); // Used to coordinate animation
  const [isProcessing, setIsProcessing] = useState(false); // Prevents double draws
  
  // Audio refs (simulated for now, would be HTMLAudioElement)
  // const rattleSound = useRef(new Audio('/rattle.mp3'));
  
  // Handle the actual generation of the number
  const generateNumber = () => {
    // Generate random number 1-80
    // To make it fun, we allow repeats, but you could filter against history if needed.
    return Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
  };

  const handleShakeDetect = () => {
    if (isProcessing || currentNumber !== null) return;
    
    setIsShaking(true);
    
    // Stop shaking after a short duration and trigger the "draw" phase
    setTimeout(() => {
        setIsShaking(false);
        setIsProcessing(true);
        setDrawTrigger(prev => prev + 1);
    }, 1500);
  };

  const { requestPermission, permissionGranted } = useShake(handleShakeDetect);

  // Called when the ball animation physically drops out
  const handleDrawComplete = () => {
    const newNumber = generateNumber();
    setCurrentNumber(newNumber);
    setHistory(prev => [newNumber, ...prev]);
    setIsProcessing(false);
  };

  const closeResult = () => {
    setCurrentNumber(null);
  };

  // Manual trigger for testing or non-shake devices
  const handleManualTrigger = () => {
    if (!permissionGranted) {
        requestPermission();
    }
    handleShakeDetect();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between py-6 overflow-hidden bg-slate-50">
      <ConfettiBackground />

      {/* Header */}
      <div className="text-center z-10 pt-4">
        <motion.h1 
          className="text-6xl md:text-7xl font-festive text-black drop-shadow-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          新年快乐
        </motion.h1>
        <motion.p 
          className="text-2xl font-bold text-gray-800 mt-2 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Happy New Year 2025
        </motion.p>
      </div>

      {/* Main Machine Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md scale-90 md:scale-100 transition-transform">
        <Machine 
          isShaking={isShaking} 
          drawTrigger={drawTrigger}
          onDrawComplete={handleDrawComplete} 
        />
      </div>

      {/* Controls / Info */}
      <div className="w-full max-w-md px-6 z-10 pb-8 flex flex-col items-center gap-4">
        
        {/* Helper Text or Shake Button */}
        {!isShaking && !isProcessing && (
           <motion.button
             onClick={handleManualTrigger}
             whileTap={{ scale: 0.95 }}
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-10 rounded-full shadow-lg text-lg flex items-center gap-2"
           >
             {!permissionGranted ? (
               <span>👆 Tap to Enable Shake</span>
             ) : (
               <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Shake or Tap to Draw!</span>
               </>
             )}
           </motion.button>
        )}

        {isShaking && (
           <div className="text-xl font-bold text-red-500 animate-pulse">
             Shaking...
           </div>
        )}

        {/* Recent History (Optional) */}
        {history.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 backdrop-blur rounded-xl">
             <span className="text-gray-500 text-sm self-center whitespace-nowrap mr-2">History:</span>
             {history.slice(0, 5).map((num, i) => (
               <span key={i} className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs">
                 {num}
               </span>
             ))}
          </div>
        )}
      </div>

      {/* Result Overlay */}
      <ResultModal number={currentNumber} onClose={closeResult} />
      
    </div>
  );
};

export default App;