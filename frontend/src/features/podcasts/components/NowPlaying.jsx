// ─────────────────────────────────────────────────────────
// NowPlaying — Signature floating player
// Canvas-based liquid gold waveform with interactive
// mouse tracking, layered glow, and breathing aura.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { nowPlayingDefault } from '@/features/podcasts/data/podcastsData';

const W = 120;
const H = 28;

export default function NowPlaying({ track, onClose }) {
  const data = track || nowPlayingDefault;

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(data.isPlaying ?? false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseX = useRef(-1);
  const hoveringRef = useRef(false);

  // ── Auto-show after 3 s ─────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Simulated progress ──────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 0.5));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // ── Canvas waveform animation ───────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const layers = [
      { freq: 2.4, amp: 5,   phase: 0,    color: 'rgba(245,245,245,0.7)',  line: 1.8, glow: 4 },
      { freq: 3.2, amp: 3.5, phase: 1.2,  color: 'rgba(154,217,74,0.35)',  line: 1.4, glow: 3 },
      { freq: 1.8, amp: 2.5, phase: 2.5,  color: 'rgba(154,217,74,0.12)', line: 1.5, glow: 0 },
    ];

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const speed = isPlaying ? 0.035 : 0.008;
      const ampScale = isPlaying ? 1 : 0.12;
      t += speed;

      const mx = mouseX.current;
      const glowBoost = hoveringRef.current ? 1.15 : 1;

      for (const l of layers) {
        const ampFinal = l.amp * ampScale * glowBoost;
        drawWaveInteractive(ctx, W, H, t, l.freq, ampFinal, l.phase, l.color, l.line, l.glow, mx);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, isPlaying]);

  // ── Handlers ────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setIsPlaying(false);
    onClose?.();
  }, [onClose]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.current = e.clientX - rect.left;
  }, []);

  const onMouseEnter = useCallback(() => { hoveringRef.current = true; }, []);
  const onMouseLeave = useCallback(() => {
    mouseX.current = -1;
    hoveringRef.current = false;
  }, []);

  return (
    <div className="now-playing">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`now-playing__bar${isPlaying ? ' now-playing__bar--playing' : ''}`}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            <div className="now-playing__collapsed">
              <img className="now-playing__thumb" src={data.image} alt={data.title} />

              <div className="now-playing__info">
                <div className="now-playing__track-title">{data.title}</div>
                <div className="now-playing__track-guest">{data.guest}</div>
              </div>

              {/* Living Waveform */}
              <canvas
                ref={canvasRef}
                className="now-playing__waveform-canvas"
                width={W}
                height={H}
                style={{ width: W, height: H }}
                onMouseMove={onMouseMove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />

              {/* Transport controls */}
              <div className="now-playing__controls">
                <button className="now-playing__btn" aria-label="Skip back">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10 3L5 7L10 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="4" y1="3" x2="4" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>

                <button className="now-playing__btn now-playing__btn--play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="2.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
                      <rect x="8.5" y="2.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4 2.5L11.5 7L4 11.5V2.5Z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                <button className="now-playing__btn" aria-label="Skip forward">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M4 3L9 7L4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="3" x2="10" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <button className="now-playing__close" onClick={handleClose} aria-label="Dismiss player">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="now-playing__progress-mini">
              <div className="now-playing__progress-mini-bar" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Draw a wave with per-point cursor attraction. */
function drawWaveInteractive(ctx, w, h, t, freq, amp, phase, color, lineW, glowW, mx) {
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const nx = x / w;
    let y = h / 2 + Math.sin(nx * Math.PI * freq + t + phase) * amp
      + Math.sin(nx * Math.PI * freq * 0.6 + t * 0.7) * amp * 0.3;

    // Cursor attraction — subtle ±3px pull
    if (mx >= 0) {
      const dist = Math.abs(x - mx);
      const influence = Math.max(0, 1 - dist / 30);
      y += influence * 3 * Math.sign(h / 2 - y || 1) * -1;
    }
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }

  // Glow pass
  if (glowW) {
    ctx.strokeStyle = color;
    ctx.lineWidth = glowW;
    ctx.globalAlpha = 0.25;
    ctx.stroke();
  }
  // Sharp pass
  ctx.strokeStyle = color;
  ctx.lineWidth = lineW;
  ctx.globalAlpha = 1;
  ctx.stroke();
}
