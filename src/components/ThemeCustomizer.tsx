import React from 'react';
// framer-motion not used in this file
import { Moon, Sun, Palette, Sliders, Check } from 'lucide-react';
import SoundManager from '../utils/SoundManager';

export interface ThemeConfig {
  theme: 'dark' | 'light';
  preset: 'default' | 'cyberpunk' | 'sakura' | 'emerald' | 'rainbow' | 'minimal';
  customHue: number | null; // Null if using preset default
}

interface ThemeCustomizerProps {
  config: ThemeConfig;
  onChange: (newConfig: ThemeConfig) => void;
}

const PRESETS = [
  { id: 'default', name: 'Interstellar', color: 'bg-indigo-500' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-pink-500' },
  { id: 'sakura', name: 'Sakura Dream', color: 'bg-rose-400' },
  { id: 'emerald', name: 'Forest Emerald', color: 'bg-emerald-500' },
  { id: 'rainbow', name: 'RGB Spectrum', color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
  { id: 'minimal', name: 'Glass Minimal', color: 'bg-slate-300' }
] as const;

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ config, onChange }) => {
  const toggleTheme = () => {
    SoundManager.playClick();
    const newTheme = config.theme === 'dark' ? 'light' : 'dark';
    onChange({ ...config, theme: newTheme });
  };

  const selectPreset = (preset: ThemeConfig['preset']) => {
    SoundManager.playClick();
    onChange({ ...config, preset, customHue: null });
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    onChange({ ...config, customHue: hue });
  };

  const clearCustomHue = () => {
    SoundManager.playClick();
    onChange({ ...config, customHue: null });
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-5 rounded-3xl mb-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Palette size={18} className="text-primary" />
        <h2 className="text-sm font-bold tracking-tight text-text-main">
          Theme Customization
        </h2>
      </div>

      <div className="space-y-4">
        {/* Row 1: Light/Dark and Preset Selection */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-text-muted font-medium">Core Mode</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-xs font-semibold hover:text-primary transition-colors cursor-pointer select-none"
          >
            {config.theme === 'dark' ? (
              <>
                <Moon size={14} className="text-indigo-400" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={14} className="text-amber-500" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Preset list */}
        <div className="space-y-2">
          <div className="text-xs text-text-muted font-medium">Presets</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  config.preset === preset.id && config.customHue === null
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-card-border/10 hover:border-card-border/30 text-text-muted hover:text-text-main'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${preset.color}`} />
                <span>{preset.name}</span>
                {config.preset === preset.id && config.customHue === null && (
                  <Check size={10} strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Hue Customizer Slider */}
        <div className="space-y-2 pt-2 border-t border-card-border/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium flex items-center gap-1">
              <Sliders size={12} className="text-primary" />
              <span>Custom Tint Accent</span>
            </span>
            {config.customHue !== null && (
              <button
                onClick={clearCustomHue}
                className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
              >
                Reset to Preset Color
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="360"
              value={config.customHue ?? 270}
              onChange={handleHueChange}
              className="w-full h-1.5 bg-card-border/10 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              style={{
                background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #6366f1, #a855f7, #ec4899, #ef4444)'
              }}
            />
            <span className="text-xs font-mono font-bold text-text-muted shrink-0 w-8 text-right">
              {config.customHue ?? 'Preset'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
