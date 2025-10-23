import { useEffect, useState } from "react";

interface IntroOverlayProps {
  onDone?: () => void;
  minDurationMs?: number;
}

export function IntroOverlay({ onDone, minDurationMs = 1600 }: IntroOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, minDurationMs);
    return () => clearTimeout(t);
  }, [minDurationMs, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/90 animate-overlay-fade">
      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-elevated border border-white/20 animate-float">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/90 to-white/70 shadow-glow flex items-center justify-center">
            <span className="text-primary font-bold text-xl">SHV</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-white/90 tracking-wide font-medium animate-text-shimmer">
            Smart Home Valuation
          </p>
        </div>
      </div>
    </div>
  );
}
