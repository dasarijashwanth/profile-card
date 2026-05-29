import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, TrendingUp, Laptop, Smartphone, Tablet } from 'lucide-react';
import SoundManager from '../utils/SoundManager';
import type { LinkItem } from './SocialLinkCard';

interface AnalyticsUIProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  totalViews: number;
  totalClicks: number;
}

export const AnalyticsUI: React.FC<AnalyticsUIProps> = ({
  isOpen,
  onClose,
  links,
  totalViews,
  totalClicks,
}) => {
  // Calculate CTR (Click Through Rate)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  // Sort links by clicks
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);

  // Mock traffic trend graph points
  // 7 days of views data
  const weeklyViews = [120, 150, 180, 140, 210, 245, totalViews > 250 ? totalViews : 280];
  const maxView = Math.max(...weeklyViews);
  const chartHeight = 80;
  const chartWidth = 320;
  
  // Calculate SVG line path
  const points = weeklyViews
    .map((val, idx) => {
      const x = (idx / (weeklyViews.length - 1)) * chartWidth;
      const y = chartHeight - (val / maxView) * (chartHeight - 15) - 5;
      return `${x},${y}`;
    })
    .join(' ');

  // SVG Area path for gradient fill under the line
  const areaPoints = `${points} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              SoundManager.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dashboard Container */}
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md glass-card p-6 rounded-3xl z-10 max-h-[85vh] overflow-y-auto"
          >
            {/* Close Trigger */}
            <button
              onClick={() => {
                SoundManager.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-primary transition-colors cursor-pointer hover:bg-card-border/10 focus:outline-none"
              aria-label="Close analytics"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6 text-primary">
              <BarChart2 size={22} className="animate-pulse" />
              <h3 className="text-lg font-extrabold tracking-tight text-text-main">
                Analytics Insights
              </h3>
            </div>

            {/* Stats Dashboard Row */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
              <div className="bg-slate-950/20 border border-card-border/10 rounded-2xl p-3">
                <span className="block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-semibold">Views</span>
                <span className="text-xl font-bold font-mono text-text-main">{totalViews}</span>
              </div>
              <div className="bg-slate-950/20 border border-card-border/10 rounded-2xl p-3">
                <span className="block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-semibold">Clicks</span>
                <span className="text-xl font-bold font-mono text-text-main">{totalClicks}</span>
              </div>
              <div className="bg-slate-950/20 border border-card-border/10 rounded-2xl p-3">
                <span className="block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-semibold">CTR</span>
                <span className="text-xl font-bold font-mono text-primary">{ctr}%</span>
              </div>
            </div>

            {/* Weekly Traffic SVG Chart */}
            <div className="bg-slate-950/30 border border-card-border/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-muted font-bold flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" />
                  <span>Views Trend (Last 7 Days)</span>
                </span>
                <span className="text-[10px] text-text-muted font-mono">+12.4% vs last week</span>
              </div>
              
              <div className="w-full h-20 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Background gridlines */}
                  <line x1="0" y1="5" x2={chartWidth} y2="5" stroke="var(--color-card-border)" strokeOpacity="0.05" strokeDasharray="3" />
                  <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="var(--color-card-border)" strokeOpacity="0.05" strokeDasharray="3" />
                  <line x1="0" y1="75" x2={chartWidth} y2="75" stroke="var(--color-card-border)" strokeOpacity="0.05" strokeDasharray="3" />

                  {/* Gradient Area Fill */}
                  <polygon points={areaPoints} fill="url(#chartGradient)" />

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Active node dot */}
                  <circle
                    cx={chartWidth}
                    cy={chartHeight - (weeklyViews[6] / maxView) * (chartHeight - 15) - 5}
                    r="4"
                    fill="var(--color-primary-glow)"
                    stroke="var(--color-bg-base)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[8px] text-text-muted font-bold mt-2 font-mono">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Devices & Referrals Split */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Devices Card */}
              <div className="space-y-3 bg-slate-950/20 border border-card-border/10 rounded-2xl p-4">
                <span className="text-xs text-text-muted font-bold block">Devices</span>
                <div className="space-y-2 text-xs font-semibold text-text-muted">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Smartphone size={10} /> Mobile</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary-glow h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Laptop size={10} /> Desktop</span>
                      <span>24%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-glow h-full rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Tablet size={10} /> Tablet</span>
                      <span>8%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-slate-500 h-full rounded-full" style={{ width: '8%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Referrals Card */}
              <div className="space-y-3 bg-slate-950/20 border border-card-border/10 rounded-2xl p-4">
                <span className="text-xs text-text-muted font-bold block">Referrals</span>
                <div className="space-y-2 text-xs font-semibold text-text-muted">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span>Instagram</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary-glow h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span>Direct / QR</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-glow h-full rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span>GitHub</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-slate-500 h-full rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Links Card */}
            <div className="bg-slate-950/20 border border-card-border/10 rounded-2xl p-4">
              <span className="text-xs text-text-muted font-bold block mb-3">Top Performing Links</span>
              <div className="space-y-2">
                {sortedLinks.length === 0 ? (
                  <p className="text-xs text-text-muted italic text-center py-2">No links created yet</p>
                ) : (
                  sortedLinks.slice(0, 3).map((link, i) => {
                    const ratio = totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0;
                    return (
                      <div key={link.id} className="flex items-center justify-between gap-4 text-xs font-semibold">
                        <span className="text-text-main truncate max-w-[180px]">
                          {i + 1}. {link.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[10px] text-text-muted bg-bg-base/60 px-1.5 py-0.5 rounded border border-card-border/5">
                            {link.clicks} clicks
                          </span>
                          <span className="text-[10px] text-primary shrink-0 w-8 text-right font-mono">
                            {ratio.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsUI;
