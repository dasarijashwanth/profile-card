import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Mail, 
  Phone, 
  MessageSquare, 
  Music, 
  GripVertical,
  Trash2,
  ChevronRight
} from 'lucide-react';
import SoundManager from '../utils/SoundManager';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  platform: string;
  clicks: number;
}

interface SocialLinkCardProps {
  link: LinkItem;
  index: number;
  dragIndex: number | null;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onLinkClick: (id: string) => void;
  onDeleteLink?: (id: string) => void;
  editMode: boolean;
}

// Brand SVG Components (Resolving Lucide missing brand icons)
const GithubIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.51a3.004 3.004 0 0 0-2.11 2.108C0 8.023 0 12 0 12s0 3.977.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.472 20.455 12 20.455 12 20.455s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.977 24 12 24 12s0-3.977-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitchIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

const GitlabIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.91 11.58l-2.73-8.38a.827.827 0 0 0-.31-.41.81.81 0 0 0-.51-.12.83.83 0 0 0-.49.2l-.01.01-3.7 3.7H7.83L4.13 2.88a.83.83 0 0 0-.49-.2.81.81 0 0 0-.51.12.827.827 0 0 0-.31.41L.09 11.58a.862.862 0 0 0 .07.69.83.83 0 0 0 .5.38l10.97 3.42 1.2.37 1.2-.37 10.97-3.42a.83.83 0 0 0 .5-.38.862.862 0 0 0 .07-.69z"/>
  </svg>
);

const WhatsappIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.986 14.145.966 11.517.966c-5.44 0-9.866 4.415-9.869 9.85-.001 1.945.508 3.842 1.474 5.513L2.128 22l5.83-1.511zM17.13 14.28c-.28-.14-1.65-.81-1.91-.9-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.1-.17.18-.34.2-.62.06-1.1-.55-1.91-.96-2.66-1.67-.57-.54-.95-1.2-1.07-1.4-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.14.03-.26-.02-.36-.05-.1-1.91-4.59-2.62-6.29-.69-1.66-1.4-1.43-1.91-1.43h-.82c-.28 0-.73.1-1.12.52-.39.42-1.5 1.47-1.5 3.59 0 2.12 1.54 4.17 1.76 4.46.22.28 3.03 4.63 7.34 6.5.99.43 1.83.69 2.47.89 1.03.33 1.97.28 2.71.17.82-.12 2.52-1.03 2.87-2.03.36-1 .36-1.87.26-2.05-.1-.18-.37-.28-.65-.42z"/>
  </svg>
);

// Icon Mapping
const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  switch (p) {
    case 'github': return <GithubIcon />;
    case 'gitlab': return <GitlabIcon />;
    case 'linkedin': return <LinkedinIcon />;
    case 'instagram': return <InstagramIcon />;
    case 'whatsapp': return <WhatsappIcon />;
    case 'twitter':
    case 'x': 
      return <TwitterIcon />;
    case 'youtube': return <YoutubeIcon />;
    case 'twitch': return <TwitchIcon />;
    case 'email':
    case 'mail': 
      return <Mail size={20} />;
    case 'phone': return <Phone size={20} />;
    case 'discord': return <MessageSquare size={20} />;
    case 'tiktok': return <Music size={20} />;
    default: return <Globe size={20} />;
  }
};

// Colors mapping for platform indicators
const getPlatformColors = (platform: string) => {
  const p = platform.toLowerCase();
  switch (p) {
    case 'github': return {
      glow: 'rgba(255, 255, 255, 0.15)',
      accent: 'border-slate-500/30 group-hover:border-slate-400 text-slate-100',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]'
    };
    case 'gitlab': return {
      glow: 'rgba(226, 67, 41, 0.25)',
      accent: 'border-orange-500/20 group-hover:border-orange-400 text-orange-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
    };
    case 'whatsapp': return {
      glow: 'rgba(37, 211, 102, 0.25)',
      accent: 'border-green-500/20 group-hover:border-green-400 text-green-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]'
    };
    case 'linkedin': return {
      glow: 'rgba(0, 119, 181, 0.25)',
      accent: 'border-blue-500/20 group-hover:border-blue-400 text-blue-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    };
    case 'instagram': return {
      glow: 'rgba(225, 48, 108, 0.25)',
      accent: 'border-pink-500/20 group-hover:border-pink-400 text-pink-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
    };
    case 'twitter':
    case 'x': 
      return {
        glow: 'rgba(29, 161, 242, 0.2)',
        accent: 'border-sky-400/20 group-hover:border-sky-400 text-sky-400',
        bgGlow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]'
      };
    case 'youtube': return {
      glow: 'rgba(255, 0, 0, 0.25)',
      accent: 'border-red-500/20 group-hover:border-red-500 text-red-500',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    };
    case 'twitch': return {
      glow: 'rgba(145, 70, 255, 0.25)',
      accent: 'border-purple-500/20 group-hover:border-purple-400 text-purple-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    };
    case 'discord': return {
      glow: 'rgba(88, 101, 242, 0.25)',
      accent: 'border-indigo-500/20 group-hover:border-indigo-400 text-indigo-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'
    };
    case 'tiktok': return {
      glow: 'rgba(255, 0, 80, 0.25)',
      accent: 'border-rose-500/20 group-hover:border-rose-400 text-rose-400',
      bgGlow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
    };
    case 'email':
    case 'mail': 
      return {
        glow: 'rgba(234, 67, 53, 0.2)',
        accent: 'border-emerald-500/20 group-hover:border-emerald-400 text-emerald-400',
        bgGlow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
      };
    default: return {
      glow: 'var(--color-primary-glow)',
      accent: 'border-primary/20 group-hover:border-primary text-primary',
      bgGlow: 'group-hover:shadow-[0_0_20px_var(--color-primary-glow)]'
    };
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 90, 
      damping: 14 
    } 
  }
};

export const SocialLinkCard: React.FC<SocialLinkCardProps> = ({
  link,
  index,
  dragIndex,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onLinkClick,
  onDeleteLink,
  editMode,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Platform styling helper
  const colors = getPlatformColors(link.platform);

  // Magnetic hover offset calculations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (editMode || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    // Subtle magnetic attraction factor
    const pull = 0.08; 
    setCoords({ x: offsetX * pull, y: offsetY * pull });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (editMode) {
      e.preventDefault();
      return;
    }
    
    // Play sound and record count
    SoundManager.playBubble();
    onLinkClick(link.id);

    // Give a short delay to allow click tracking before redirecting
    const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      variants={itemVariants}
      style={{ touchAction: 'none' }}
      animate={{ 
        x: coords.x, 
        y: coords.y,
        opacity: dragIndex === index ? 0.3 : 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20, 
        opacity: { duration: 0.15 } 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      draggable={editMode}
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group w-full max-w-md mx-auto mb-4 flex items-center justify-between glass-card p-4 rounded-2xl cursor-pointer ${colors.bgGlow} transition-all duration-300 relative`}
      onClick={handleClick}
    >
      {/* Platform Highlight Glow Border Overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          border: `1.5px solid ${colors.glow}`,
          boxShadow: `inset 0 0 12px ${colors.glow}`
        }}
      />

      <div className="flex items-center gap-4 z-10 w-full min-w-0">
        {/* Left Side: Drag Handle in Edit Mode OR Icon in View Mode */}
        {editMode ? (
          <div 
            className="p-1 cursor-grab text-text-muted hover:text-primary active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={18} />
          </div>
        ) : (
          <div className={`p-2.5 rounded-xl bg-bg-base border ${colors.accent} transition-colors duration-300 flex items-center justify-center shrink-0`}>
            {getPlatformIcon(link.platform)}
          </div>
        )}

        {/* Mid: Title & Subtitle */}
        <div className="flex flex-col min-w-0 text-left flex-grow">
          <span className="font-semibold text-text-main text-base tracking-tight truncate group-hover:text-primary transition-colors">
            {link.title}
          </span>
          <span className="text-xs text-text-muted truncate">
            {link.url.replace(/^https?:\/\/(www\.)?/, '')}
          </span>
        </div>

        {/* Right Side: Delete Button in Edit Mode OR Chevron/Counter in View Mode */}
        {editMode && onDeleteLink ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              SoundManager.playClick();
              onDeleteLink(link.id);
            }}
            className="p-2 text-text-muted hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
            title="Delete link"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-text-muted shrink-0 z-10">
            {/* Click Count Tracker HUD */}
            <span className="text-[10px] font-mono bg-bg-base border border-card-border/10 px-2 py-0.5 rounded-full text-text-muted flex items-center gap-1">
              <span>{link.clicks}</span>
              <span className="opacity-60 text-[8px]">CLICKS</span>
            </span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SocialLinkCard;
