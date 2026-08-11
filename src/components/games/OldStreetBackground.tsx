import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import bgImage from '../../assets/images/regenerated_image_1784512474999.webp';

export type BgStyle = 'cyber' | 'oldstreet' | 'gradient' | 'none';

export default function OldStreetBackground() {
  const [bgStyle, setBgStyle] = useState<BgStyle>(() => {
    return (localStorage.getItem('game_bg_style') as BgStyle) || 'cyber';
  });

  useEffect(() => {
    // Ensure default is stored as cyber
    if (!localStorage.getItem('game_bg_style')) {
      localStorage.setItem('game_bg_style', 'cyber');
    }

    const handleBgChange = () => {
      const current = (localStorage.getItem('game_bg_style') as BgStyle) || 'cyber';
      setBgStyle(current);
    };

    window.addEventListener('game-bg-changed', handleBgChange);
    return () => {
      window.removeEventListener('game-bg-changed', handleBgChange);
    };
  }, []);

  // Base background style (Deep Cyber Tech default)
  const baseBgClass = bgStyle === 'cyber' 
    ? "absolute inset-0 w-full h-full bg-[#030712] transition-colors duration-500"
    : "absolute inset-0 w-full h-full bg-[#FFF1DC] transition-colors duration-500";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Base background color */}
      <div className={baseBgClass} />

      {/* 0. Cyber Tech Grid & Particle Background (Default) */}
      {bgStyle === 'cyber' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          {/* Ambient Cyber Color Glows */}
          <div className="absolute top-0 left-1/4 w-[50vw] h-[40vh] rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[40vh] rounded-full bg-emerald-600/15 blur-[160px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[50vh] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none" />
        </motion.div>
      )}

      {/* 1. Real Watercolor Old Street Background (if oldstreet mode) */}
      {bgStyle === 'oldstreet' && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          src={bgImage}
          alt="Watercolor Old Street Background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
      )}

      {/* 2. Soft Watercolor Sky Gradient Background (if gradient mode) */}
      {bgStyle === 'gradient' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#FFF5E6] via-[#FFF0E6] to-[#EBF3FC]"
        />
      )}

      {/* 3. Watercolor Paper Texture Overlay (Always active for tactical fidelity) */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.09] mix-blend-multiply z-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cfilter id='paper-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23paper-noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 4. Soft Watercolor Color Bleeds (for oldstreet and gradient modes) */}
      {bgStyle !== 'none' && (
        <>
          <div className="absolute top-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[#E57373]/10 blur-[130px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] rounded-full bg-[#FFB74D]/15 blur-[160px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute top-[25vh] left-[20vw] w-[45vw] h-[45vh] rounded-full bg-[#81C784]/8 blur-[140px] mix-blend-multiply pointer-events-none" />
        </>
      )}

      {/* 5. Hanging Red Lanterns (Only in oldstreet mode to maintain themed consistency) */}
      {bgStyle === 'oldstreet' && (
        <>
          <div className="absolute left-[4%] top-0 h-64 w-12 hidden md:block z-10">
            <svg className="w-full h-full" viewBox="0 0 100 300" fill="none">
              <line x1="50" y1="0" x2="50" y2="80" stroke="#4A3B32" strokeWidth="3" />
              <motion.g
                animate={{ opacity: [0.85, 1, 0.85], y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <rect x="30" y="80" width="40" height="55" rx="20" fill="#E74C3C" filter="drop-shadow(0px 0px 10px #FF0000)" />
                <rect x="38" y="75" width="24" height="6" fill="#F1C40F" />
                <rect x="38" y="133" width="24" height="6" fill="#F1C40F" />
                <line x1="50" y1="139" x2="50" y2="160" stroke="#FF0000" strokeWidth="3" />
                <line x1="45" y1="160" x2="55" y2="160" stroke="#F1C40F" strokeWidth="4" />
              </motion.g>
            </svg>
          </div>

          <div className="absolute right-[4%] top-0 h-64 w-12 hidden md:block z-10">
            <svg className="w-full h-full" viewBox="0 0 100 300" fill="none">
              <line x1="50" y1="0" x2="50" y2="100" stroke="#4A3B32" strokeWidth="3" />
              <motion.g
                animate={{ opacity: [1, 0.8, 1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              >
                <rect x="30" y="100" width="40" height="55" rx="20" fill="#E74C3C" filter="drop-shadow(0px 0px 10px #FF0000)" />
                <rect x="38" y="95" width="24" height="6" fill="#F1C40F" />
                <rect x="38" y="153" width="24" height="6" fill="#F1C40F" />
                <line x1="50" y1="159" x2="50" y2="180" stroke="#FF0000" strokeWidth="3" />
                <line x1="45" y1="180" x2="55" y2="180" stroke="#F1C40F" strokeWidth="4" />
              </motion.g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
