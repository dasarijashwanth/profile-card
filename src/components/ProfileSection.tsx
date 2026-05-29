import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Share2, Sparkles, Volume2, VolumeX, BarChart2 } from 'lucide-react';
import SoundManager from '../utils/SoundManager';
import confetti from 'canvas-confetti';

interface ProfileSectionProps {
  name: string;
  verified: boolean;
  avatarUrl?: string;
  bios: string[];
  totalViews: number;
  totalClicks: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenQR: () => void;
  onOpenAnalytics: () => void;
  onShowToast: (message: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  verified,
  avatarUrl,
  bios,
  totalViews,
  totalClicks,
  soundEnabled,
  onToggleSound,
  onOpenQR,
  onOpenAnalytics,
  onShowToast,
}) => {
  // Bio typing animation state
  const [currentBioIndex, setCurrentBioIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = bios[currentBioIndex];

    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(80);

        if (currentText === fullText) {
          // Pause at the end of typing
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        // Deleting
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(40);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentBioIndex((prev) => (prev + 1) % bios.length);
          setTypingSpeed(300);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentBioIndex, bios, typingSpeed]);

  // Copy Profile Link handler
  const handleCopyLink = () => {
    SoundManager.playChime();
    navigator.clipboard.writeText(window.location.href).then(() => {
      onShowToast("Copied profile link!");
      // Confetti burst!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#3b82f6', '#10b981'],
      });
    }).catch(() => {
      onShowToast("Failed to copy link");
    });
  };

  return (
    <div className="flex flex-col items-center text-center px-4 pt-10 pb-6 w-full max-w-md mx-auto">
      {/* Sound Toggle (Top Right Float in Profile Section) */}
      <div className="flex justify-end w-full gap-2 mb-4">
        <button
          onClick={() => {
            SoundManager.playClick();
            onToggleSound();
          }}
          className="p-2.5 rounded-xl glass-card text-text-muted hover:text-primary hover:scale-105 active:scale-95 transition-all focus:outline-none"
          aria-label={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
          title={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          onClick={() => {
            SoundManager.playClick();
            onOpenQR();
          }}
          className="p-2.5 rounded-xl glass-card text-text-muted hover:text-primary hover:scale-105 active:scale-95 transition-all focus:outline-none"
          aria-label="Share QR Code"
          title="Share QR Code"
        >
          <Share2 size={18} />
        </button>
        <button
          onClick={() => {
            SoundManager.playClick();
            onOpenAnalytics();
          }}
          className="p-2.5 rounded-xl glass-card text-text-muted hover:text-primary hover:scale-105 active:scale-95 transition-all focus:outline-none"
          aria-label="View Analytics Dashboard"
          title="View Analytics Dashboard"
        >
          <BarChart2 size={18} />
        </button>
      </div>

      {/* Avatar Container with glowing rounded-square border */}
      <motion.div 
        className="relative group mb-6 cursor-pointer"
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 250, damping: 15 }}
      >
        <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-primary-glow rounded-3xl blur opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 animate-pulse-slow" />
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden p-1 bg-bg-base flex items-center justify-center border border-card-border/10">
          {avatarUrl && !imageError ? (
            <img
              src={avatarUrl}
              alt={`${name}'s profile avatar`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top rounded-2xl transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            // Generative Premium SVG Avatar if no image
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/30 to-primary-glow/30 flex items-center justify-center relative overflow-hidden text-primary">
              <Sparkles className="w-12 h-12 animate-float-medium" />
              <div className="absolute w-24 h-24 rounded-2xl border border-primary/20 animate-pulse" />
              <div className="absolute w-16 h-16 rounded-2xl border border-dashed border-primary-glow/20 animate-pulse" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Name and Verified Badge */}
      <div className="flex items-center gap-2 mb-2 justify-center">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">
          {name}
        </h1>
        {verified && (
          <motion.div
            className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            title="Verified Creator Profile"
          >
            <Check size={12} strokeWidth={3} />
          </motion.div>
        )}
      </div>

      {/* Bio Typing Animation */}
      <div className="h-6 mb-6">
        <p className="text-sm md:text-base text-text-muted font-medium cursor-blink">
          {currentText}
        </p>
      </div>

      {/* Analytics Brief Dashboard */}
      <div className="grid grid-cols-2 gap-4 w-full glass-card p-3 rounded-2xl mb-6 text-xs text-text-muted font-medium divide-x divide-card-border/10">
        <div className="flex flex-col items-center justify-center">
          <span className="text-text-main font-bold text-lg font-mono tracking-tight">{totalViews}</span>
          <span>Profile Views</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-text-main font-bold text-lg font-mono tracking-tight">{totalClicks}</span>
          <span>Link Clicks</span>
        </div>
      </div>

      {/* Copy profile URL trigger */}
      <motion.button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 glass-card glass-card-hover rounded-2xl text-sm font-semibold hover:border-primary/50 text-text-main cursor-pointer active:scale-[0.98] transition-all"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Copy size={16} className="text-primary" />
        <span>Copy Profile Link</span>
      </motion.button>
    </div>
  );
};

export default ProfileSection;
