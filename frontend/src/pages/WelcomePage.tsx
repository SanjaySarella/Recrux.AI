import React from 'react';
import { motion } from 'motion/react';

export default function WelcomePage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6 cursor-pointer" onClick={onNext}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-600 tracking-tight mb-4">
          Welcome to Recrux.ai
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-light">
          Redefining how the world discovers opportunities.
        </p>
        <div className="mt-12 text-slate-400 text-sm animate-pulse">Click anywhere to continue</div>
      </motion.div>
    </div>
  );
}
