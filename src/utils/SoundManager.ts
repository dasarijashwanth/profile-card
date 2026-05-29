class SoundManager {
  private static enabled: boolean = true;
  private static audioCtx: AudioContext | null = null;

  public static toggle(enabled?: boolean) {
    if (enabled !== undefined) {
      this.enabled = enabled;
    } else {
      this.enabled = !this.enabled;
    }
    return this.enabled;
  }

  public static isEnabled() {
    return this.enabled;
  }

  private static initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public static playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Context blocked or not supported", e);
    }
  }

  public static playChime() {
    if (!this.enabled) return;
    try {
      const ctx = this.initContext();
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.10, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + duration);

        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.15); // C5
      playNote(659.25, now + 0.08, 0.25); // E5
    } catch (e) {
      console.warn("Audio Context blocked or not supported", e);
    }
  }

  public static playBubble() {
    if (!this.enabled) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context blocked or not supported", e);
    }
  }

  public static playSwoosh() {
    if (!this.enabled) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      console.warn("Audio Context blocked or not supported", e);
    }
  }
}

export default SoundManager;
