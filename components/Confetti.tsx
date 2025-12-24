import React from 'react';
import { motion } from 'framer-motion';

const shapes = ['circle', 'square', 'triangle', 'star'];
const colors = ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-pink-400', 'bg-purple-400'];

const RandomShape: React.FC<{ delay: number }> = ({ delay }) => {
  const size = Math.random() * 20 + 10;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const duration = Math.random() * 20 + 10;

  return (
    <motion.div
      className={`absolute ${color} opacity-60`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '4px' : '0',
        clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
        opacity: [0.6, 0.3, 0.6],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    />
  );
};

export const ConfettiBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <RandomShape key={i} delay={i * 0.5} />
      ))}
    </div>
  );
};