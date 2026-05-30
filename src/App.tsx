import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  User, 
  ChevronDown,
  ChevronUp,
  PlusCircle
} from 'lucide-react';
import BackgroundParticles from './components/BackgroundParticles';
import ProfileSection from './components/ProfileSection';
import SocialLinkCard from './components/SocialLinkCard';
import type { LinkItem } from './components/SocialLinkCard';
import ThemeCustomizer from './components/ThemeCustomizer';
import type { ThemeConfig } from './components/ThemeCustomizer';
import QRCodeModal from './components/QRCodeModal';
import AnalyticsUI from './components/AnalyticsUI';
import Toast from './components/Toast';
import SoundManager from './utils/SoundManager';


// Default mock values if localStorage is unpopulated
const DEFAULT_LINKS: LinkItem[] = [
  { id: 'lnk_1', title: 'Connect on LinkedIn', url: 'https://www.linkedin.com/in/jashwanthdasari2001', platform: 'linkedin', clicks: 245 },
  { id: 'lnk_2', title: 'Check my GitHub Repos', url: 'https://github.com/dasarijashwanth', platform: 'github', clicks: 198 },
  { id: 'lnk_3', title: 'Follow on Instagram', url: 'https://www.instagram.com/dasarijashwanth', platform: 'instagram', clicks: 120 },
  { id: 'lnk_4', title: 'View my Interactive Portfolio', url: 'https://dasarijashwanth.github.io/Portfolio-Website-1', platform: 'website', clicks: 174 },
  { id: 'lnk_5', title: 'Google Developer Profile', url: 'https://g.dev/JashwanthDasari', platform: 'website', clicks: 88 },
  { id: 'lnk_6', title: 'Book a Session on Topmate', url: 'https://topmate.io/jashwanth_dasari/', platform: 'website', clicks: 110 },
  { id: 'lnk_7', title: 'GitLab Projects', url: 'https://gitlab.com/jashwanthdasari143', platform: 'gitlab', clicks: 65 },
  { id: 'lnk_8', title: 'Read my Blogs on Medium', url: 'https://medium.com/@JashwanthDasari', platform: 'website', clicks: 92 },
  { id: 'lnk_9', title: 'Connect on Twitter / X', url: 'https://twitter.com/DasariJashwant4', platform: 'twitter', clicks: 76 },
  { id: 'lnk_10', title: 'Google Cloud Skills Profile', url: 'https://www.cloudskillsboost.google/public_profiles/30dbc57f-245e-46df-a964-855c83d250fd', platform: 'website', clicks: 135 },
  { id: 'lnk_11', title: 'Research Paper: Smart Parking', url: 'https://doi.org/10.22214/ijraset.2023.55497', platform: 'website', clicks: 54 },
  { id: 'lnk_12', title: 'Chat on WhatsApp', url: 'https://wa.me/15618433032', platform: 'whatsapp', clicks: 104 }
];

const DEFAULT_BIOS = [
  "Organizer at Google Developer Groups at FAU",
  "Data Analyst & Cloud Solutions Enthusiast",
  "Exploring Data Engineering, Analytics & ML"
];

const PLATFORMS = [
  { id: 'website', name: 'Website' },
  { id: 'github', name: 'GitHub' },
  { id: 'gitlab', name: 'GitLab' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'twitter', name: 'Twitter / X' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'twitch', name: 'Twitch' },
  { id: 'discord', name: 'Discord' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'email', name: 'Email Address' }
];

// Helper utility to update and retrieve real-time global analytics from Abacus API
const fetchGlobalCounter = async (action: 'get' | 'hit', key: 'views' | 'clicks'): Promise<number> => {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/${action}/jashwanth_dasari_profile_card/${key}`);
    if (!res.ok) throw new Error("Abacus API response error");
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (typeof data.value === 'number') return data.value;
      if (typeof data.count === 'number') return data.count;
      if (typeof data === 'number') return data;
    } catch {
      const num = parseInt(text.trim());
      if (!isNaN(num)) return num;
    }
    throw new Error("Invalid count response format");
  } catch (err) {
    console.error(`Failed to execute ${action} on global counter ${key}:`, err);
    const localVal = localStorage.getItem(`profile_${key}`);
    return localVal ? parseInt(localVal) : (key === 'views' ? 1 : 0);
  }
};

export const App: React.FC = () => {
  // --- Loading Screen State ---
  const [loading, setLoading] = useState(true);

  // --- Parallax Mouse Tracker State ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- Stagger Entrance Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  // --- Core Profile & Link States ---
  const [name, setName] = useState('Jashwanth Dasari');
  const [verified, setVerified] = useState(true);
  const [bios, setBios] = useState<string[]>(DEFAULT_BIOS);
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);
  
  // --- Analytics States ---
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  // --- Sound toggle State ---
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- Theme configuration State ---
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    theme: 'dark',
    preset: 'rainbow',
    customHue: null
  });

  // --- UI Interactivity Panel States ---
  const [editMode, setEditMode] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for adding links & modifying profile
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('website');
  
  const [newName, setNewName] = useState('Jashwanth Dasari');
  const [newBioInput, setNewBioInput] = useState(DEFAULT_BIOS.join('\n'));

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // --- Initial loading & localstorage read effect ---
  useEffect(() => {
    // Check if initialized for Jashwanth
    const initialized = localStorage.getItem('jashwanth_initialized_v3');
    if (!initialized) {
      localStorage.clear();
      localStorage.setItem('profile_name', 'Jashwanth Dasari');
      localStorage.setItem('profile_verified', 'true');
      localStorage.setItem('profile_bios', JSON.stringify(DEFAULT_BIOS));
      localStorage.setItem('profile_links', JSON.stringify(DEFAULT_LINKS));
      localStorage.setItem('profile_views', '1');
      localStorage.setItem('profile_clicks', '0');
      localStorage.setItem('profile_theme_config', JSON.stringify({
        theme: 'dark',
        preset: 'rainbow',
        customHue: null
      }));
      localStorage.setItem('jashwanth_initialized_v3', 'true');
    }

    // Read from localStorage
    const savedName = localStorage.getItem('profile_name');
    const savedVerified = localStorage.getItem('profile_verified');
    const savedBios = localStorage.getItem('profile_bios');
    const savedLinks = localStorage.getItem('profile_links');
    const savedViews = localStorage.getItem('profile_views');
    const savedClicks = localStorage.getItem('profile_clicks');
    const savedSound = localStorage.getItem('profile_sound');
    const savedTheme = localStorage.getItem('profile_theme_config');

    if (savedName) {
      setName(savedName);
      setNewName(savedName);
    }
    if (savedVerified) setVerified(savedVerified === 'true');
    if (savedBios) {
      const parsedBios = JSON.parse(savedBios);
      setBios(parsedBios);
      setNewBioInput(parsedBios.join('\n'));
    }
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    if (savedViews) setTotalViews(parseInt(savedViews));
    if (savedClicks) setTotalClicks(parseInt(savedClicks));
    if (savedSound) {
      const isSound = savedSound === 'true';
      setSoundEnabled(isSound);
      SoundManager.toggle(isSound);
    }
    if (savedTheme) setThemeConfig(JSON.parse(savedTheme));

    // Fetch and increment global counters in real-time
    const loadGlobalStats = async () => {
      // 1. Increment and get global views
      const views = await fetchGlobalCounter('hit', 'views');
      setTotalViews(views);
      localStorage.setItem('profile_views', views.toString());

      // 2. Get current global clicks
      const clicks = await fetchGlobalCounter('get', 'clicks');
      setTotalClicks(clicks);
      localStorage.setItem('profile_clicks', clicks.toString());
    };

    loadGlobalStats().finally(() => {
      // Ensure smooth loading screen transition
      setTimeout(() => setLoading(false), 800);
    });
  }, []);

  // --- Theme Application Effect ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeConfig.theme);
    document.documentElement.setAttribute('data-preset', themeConfig.preset);

    if (themeConfig.customHue !== null) {
      document.documentElement.style.setProperty('--primary', `${themeConfig.customHue} 95% 65%`);
      document.documentElement.style.setProperty('--primary-glow', `${(themeConfig.customHue + 30) % 360} 90% 60%`);
    } else {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-glow');
    }
    
    localStorage.setItem('profile_theme_config', JSON.stringify(themeConfig));
  }, [themeConfig]);

  // --- Audio configuration change toggler ---
  const handleToggleSound = () => {
    const nextState = SoundManager.toggle();
    setSoundEnabled(nextState);
    localStorage.setItem('profile_sound', nextState.toString());
    showToast(nextState ? "Sound FX Enabled" : "Sound FX Muted");
  };

  // --- Actions ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleLinkClick = (id: string) => {
    // Increment specific link clicks
    const updatedLinks = links.map(lnk => {
      if (lnk.id === id) {
        return { ...lnk, clicks: lnk.clicks + 1 };
      }
      return lnk;
    });
    setLinks(updatedLinks);
    localStorage.setItem('profile_links', JSON.stringify(updatedLinks));

    // Increment overall analytics globally in real-time
    fetchGlobalCounter('hit', 'clicks').then(clicks => {
      setTotalClicks(clicks);
      localStorage.setItem('profile_clicks', clicks.toString());
    });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    SoundManager.playChime();
    
    // Formatting url
    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newLinkItem: LinkItem = {
      id: `lnk_${Date.now()}`,
      title: newTitle.trim(),
      url: formattedUrl,
      platform: newPlatform,
      clicks: 0
    };

    const updated = [newLinkItem, ...links];
    setLinks(updated);
    localStorage.setItem('profile_links', JSON.stringify(updated));

    // Reset Form
    setNewTitle('');
    setNewUrl('');
    setShowAddForm(false);
    showToast("Added new link card!");
  };

  const handleDeleteLink = (id: string) => {
    SoundManager.playSwoosh();
    const updated = links.filter(lnk => lnk.id !== id);
    setLinks(updated);
    localStorage.setItem('profile_links', JSON.stringify(updated));
    showToast("Link card deleted");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    SoundManager.playChime();
    
    setName(newName.trim());
    const parsedBios = newBioInput
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);
    
    setBios(parsedBios.length > 0 ? parsedBios : DEFAULT_BIOS);
    
    localStorage.setItem('profile_name', newName.trim());
    localStorage.setItem('profile_bios', JSON.stringify(parsedBios.length > 0 ? parsedBios : DEFAULT_BIOS));
    localStorage.setItem('profile_verified', verified.toString());

    setShowProfileEditor(false);
    showToast("Profile configuration updated!");
  };

  const handleResetData = () => {
    if (window.confirm("Reset all custom profile settings to defaults?")) {
      SoundManager.playSwoosh();
      localStorage.clear();
      
      setName('Jashwanth Dasari');
      setVerified(true);
      setBios(DEFAULT_BIOS);
      setLinks(DEFAULT_LINKS);
      setTotalViews(1);
      setTotalClicks(0);
      setThemeConfig({
        theme: 'dark',
        preset: 'rainbow',
        customHue: null
      });

      setNewName('Jashwanth Dasari');
      setNewBioInput(DEFAULT_BIOS.join('\n'));
      
      showToast("Profile settings reset to default");
    }
  };

  // --- Drag and Drop implementation ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    SoundManager.playClick();
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setLinks(prev => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      return updated;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    SoundManager.playSwoosh();
    localStorage.setItem('profile_links', JSON.stringify(links));
  };

  return (
    <>
      {/* 1. Loading Entrance Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950 text-white"
          >
            <div className="relative flex flex-col items-center">
              {/* Rotating loader ring */}
              <div className="absolute -inset-4 rounded-full border border-t-primary border-r-primary-glow border-b-transparent border-l-transparent animate-spin" />
              <div className="w-24 h-24 rounded-full bg-slate-900 border border-card-border/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-sm font-semibold tracking-wider uppercase text-text-muted font-mono"
              >
                Loading Jashu's Profile...
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Ambient glowing blobs background */}
      <BackgroundParticles mousePos={mousePos} />

      {/* Main Container */}
      <div className="min-h-screen py-8 px-4 flex flex-col items-center select-none relative z-10">
        
        {/* Toggle Mode Top Header bar */}
        <div className={`w-full ${editMode ? 'max-w-5xl' : 'max-w-md'} flex justify-between items-center mb-6 glass-card p-3 rounded-2xl transition-all duration-300`}>
          <div className="flex items-center gap-1 text-primary">
            <Sparkles size={16} className="animate-spin-slow text-primary" />
            <span className="text-xs font-black tracking-tight text-text-main">
              LINKTREE<span className="text-primary font-mono text-[9px] ml-1 bg-primary/10 px-1 py-0.5 rounded">PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Indicator Button */}
            <button
              onClick={() => {
                SoundManager.playClick();
                setEditMode(!editMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all select-none ${
                editMode 
                  ? 'bg-primary text-white border border-primary/20 shadow-md shadow-primary/20' 
                  : 'glass-card text-text-muted hover:text-text-main'
              }`}
            >
              {editMode ? (
                <>
                  <Eye size={12} />
                  <span>Preview Page</span>
                </>
              ) : (
                <>
                  <Edit3 size={12} />
                  <span>Edit Links</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className={`w-full flex-grow flex flex-col items-center ${editMode ? 'max-w-5xl' : 'max-w-md'} transition-all duration-300`}>
          {!editMode ? (
            /* VIEW MODE: Standard Centered Column */
            <div className="w-full flex flex-col items-center">
              {/* Profile Details Container */}
              <ProfileSection
                name={name}
                verified={verified}
                avatarUrl={`${import.meta.env.BASE_URL}profile.jpg`}
                bios={bios}
                totalViews={totalViews}
                totalClicks={totalClicks}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                onOpenQR={() => setIsQRModalOpen(true)}
                onOpenAnalytics={() => setIsAnalyticsOpen(true)}
                onShowToast={showToast}
              />

              {/* Social Links Cards Wrapper */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full px-2"
              >
                {links.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto">
                    <p className="text-sm text-text-muted italic">
                      Link list is currently empty. Toggle "Edit Links" above to build your profile card!
                    </p>
                  </div>
                ) : (
                  links.map((link, idx) => (
                    <SocialLinkCard
                      key={link.id}
                      link={link}
                      index={idx}
                      dragIndex={draggedIndex}
                      onDragStart={handleDragStart}
                      onDragEnter={handleDragEnter}
                      onDragEnd={handleDragEnd}
                      onLinkClick={handleLinkClick}
                      onDeleteLink={handleDeleteLink}
                      editMode={false}
                    />
                  ))
                )}
              </motion.div>
            </div>
          ) : (
            /* EDIT MODE: Side-by-Side Split Dashboard (Controls Left, Live iPhone Mockup Right) */
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
              {/* Left Side: Editor Control Panel (7/12 width) */}
              <div className="md:col-span-7 space-y-6">
                {/* 1. Theme Customizer Panel */}
                <ThemeCustomizer config={themeConfig} onChange={setThemeConfig} />

                {/* 2. Profile Editor Dashboard Panel */}
                <div className="w-full glass-card p-5 rounded-3xl relative">
                  <button 
                    type="button"
                    onClick={() => {
                      SoundManager.playClick();
                      setShowProfileEditor(!showProfileEditor);
                    }}
                    className="w-full flex items-center justify-between text-xs font-bold text-text-main cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <span>Customize Profile Parameters</span>
                    </span>
                    {showProfileEditor ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence>
                    {showProfileEditor && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSaveProfile}
                        className="space-y-4 pt-4 mt-4 border-t border-card-border/10 overflow-hidden text-left"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Full Name</label>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-card-border/10 rounded-xl px-3 py-2 text-xs text-text-main focus:border-primary/50 focus:outline-none"
                            placeholder="Enter profile name"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Verified Creator Badge</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="verified-chk"
                              checked={verified}
                              onChange={(e) => setVerified(e.target.checked)}
                              className="accent-primary rounded cursor-pointer"
                            />
                            <label htmlFor="verified-chk" className="text-xs text-text-muted font-semibold cursor-pointer">
                              Display blue verified badge next to name
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Bio Slogans (one per line)</label>
                          <textarea
                            value={newBioInput}
                            onChange={(e) => setNewBioInput(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-900/50 border border-card-border/10 rounded-xl px-3 py-2 text-xs text-text-main focus:border-primary/50 focus:outline-none resize-none font-sans"
                            placeholder="Enter slogans/bios"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-98 transition-all"
                        >
                          Save Profile Configuration
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Link Cards Editor Form */}
                <div className="w-full glass-card p-5 rounded-3xl relative">
                  <button 
                    type="button"
                    onClick={() => {
                      SoundManager.playClick();
                      setShowAddForm(!showAddForm);
                    }}
                    className="w-full flex items-center justify-between text-xs font-bold text-text-main cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <PlusCircle size={14} className="text-primary" />
                      <span>Add New Link Card</span>
                    </span>
                    {showAddForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddLink}
                        className="space-y-4 pt-4 mt-4 border-t border-card-border/10 overflow-hidden text-left"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Platform / Icon Preset</label>
                          <select
                            value={newPlatform}
                            onChange={(e) => setNewPlatform(e.target.value)}
                            className="w-full bg-slate-900/50 border border-card-border/10 rounded-xl px-3 py-2 text-xs text-text-main focus:border-primary/50 focus:outline-none"
                          >
                            {PLATFORMS.map(p => (
                              <option key={p.id} value={p.id} className="bg-slate-950 text-text-main">{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Button Text / Title</label>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-slate-900/50 border border-card-border/10 rounded-xl px-3 py-2 text-xs text-text-main focus:border-primary/50 focus:outline-none"
                            placeholder="e.g. Subscribe on YouTube"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Target URL</label>
                          <input
                            type="text"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="w-full bg-slate-900/50 border border-card-border/10 rounded-xl px-3 py-2 text-xs text-text-main focus:border-primary/50 focus:outline-none"
                            placeholder="e.g. youtube.com/my-channel"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-98 transition-all"
                        >
                          Append Link Card
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Link Reordering List (Only visible in edit panel for mobile/tablet, as desktop uses the live phone mockup or handles edits here) */}
                <div className="w-full glass-card p-5 rounded-3xl relative">
                  <div className="text-xs font-bold text-text-main mb-4 flex items-center gap-2">
                    <Edit3 size={14} className="text-primary" />
                    <span>Manage & Reorder Links ({links.length})</span>
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-1"
                  >
                    {links.length === 0 ? (
                      <p className="text-xs text-text-muted italic text-center py-4">No links added yet.</p>
                    ) : (
                      links.map((link, idx) => (
                        <SocialLinkCard
                          key={`editor_${link.id}`}
                          link={link}
                          index={idx}
                          dragIndex={draggedIndex}
                          onDragStart={handleDragStart}
                          onDragEnter={handleDragEnter}
                          onDragEnd={handleDragEnd}
                          onLinkClick={handleLinkClick}
                          onDeleteLink={handleDeleteLink}
                          editMode={true}
                        />
                      ))
                    )}
                  </motion.div>
                </div>

                {/* 5. Reset Action Panel */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleResetData}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-500/80 hover:text-red-500 cursor-pointer select-none"
                  >
                    <RefreshCw size={12} />
                    <span>Reset Profile Data</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Sticky Live Mobile Mockup Preview (5/12 width) - Hidden on Mobile, Visible on Desktop/Laptops */}
              <div className="md:col-span-5 hidden md:block">
                <div className="sticky top-8 flex flex-col items-center">
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-3 self-start flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Live Device Mockup Preview</span>
                  </div>
                  
                  {/* Smartphone Frame Mockup */}
                  <div className="relative w-[335px] h-[645px] rounded-[50px] border-[12px] border-slate-900 bg-bg-base shadow-[0_30px_70px_-10px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col p-1 ring-4 ring-slate-800/10">
                    {/* Speaker Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-10 h-1.5 bg-slate-800 rounded-full mb-1" />
                    </div>

                    {/* Camera lens indicator inside notch */}
                    <div className="absolute top-1.5 right-[38%] w-2.5 h-2.5 rounded-full bg-slate-950/40 z-20" />
                    
                    {/* Phone Screen Viewport */}
                    <div className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden relative flex flex-col px-3 pt-6 pb-4 bg-grid-pattern">
                      <ProfileSection
                        name={name}
                        verified={verified}
                        avatarUrl={`${import.meta.env.BASE_URL}profile.jpg`}
                        bios={bios}
                        totalViews={totalViews}
                        totalClicks={totalClicks}
                        soundEnabled={soundEnabled}
                        onToggleSound={handleToggleSound}
                        onOpenQR={() => setIsQRModalOpen(true)}
                        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
                        onShowToast={showToast}
                      />
                      <div className="w-full px-1">
                        {links.map((link, idx) => (
                          <SocialLinkCard
                            key={`preview_${link.id}`}
                            link={link}
                            index={idx}
                            dragIndex={draggedIndex}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragEnd={handleDragEnd}
                            onLinkClick={handleLinkClick}
                            onDeleteLink={handleDeleteLink}
                            editMode={false} // Clickable inside mockup
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer info */}
        <footer className="mt-8 text-center text-[10px] text-text-muted font-medium select-none z-10 w-full max-w-md flex flex-col items-center gap-1">
          <motion.p 
            className="font-bold text-xs bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent tracking-wider"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Powered by Jashwanth
          </motion.p>
          <p className="opacity-60 text-[9px]">
            © 2026 Profile Matrix. All rights reserved.
          </p>
        </footer>

        {/* --- QR Code Share Overlay --- */}
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          name={name}
          url={window.location.href}
        />

        {/* --- Analytics UI Overlay --- */}
        <AnalyticsUI
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          links={links}
          totalViews={totalViews}
          totalClicks={totalClicks}
        />

        {/* --- Action Toast Notification --- */}
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </>
  );
};

export default App;
