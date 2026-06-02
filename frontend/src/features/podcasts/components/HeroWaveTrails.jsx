// ─────────────────────────────────────────────────────────
// HeroWaveTrails — Glowing amber heartbeat waveforms
// Animated EKG-style trails flowing from the right edge
// of the viewport into the right side of the hero card.
// ─────────────────────────────────────────────────────────

import { useRef, useEffect } from 'react';

// Each trail: { y: vertical position (0-1), speed, amplitude, pattern }
const TRAILS = [
  { y: 0.15, speed: 0.6,  amp: 12, lineW: 1.2, opacity: 0.55, pattern: 'heartbeat' },
  { y: 0.38, speed: 0.45, amp: 8,  lineW: 1.0, opacity: 0.35, pattern: 'pulse' },
  { y: 0.55, speed: 0.55, amp: 14, lineW: 1.4, opacity: 0.50, pattern: 'heartbeat' },
  { y: 0.75, speed: 0.4,  amp: 6,  lineW: 0.8, opacity: 0.25, pattern: 'flat' },
  { y: 0.90, speed: 0.5,  amp: 10, lineW: 1.1, opacity: 0.40, pattern: 'pulse' },
];

const AMBER = [239, 170, 52];

export default function HeroWaveTrails() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      // Canvas covers the right ~35% of the hero area + overflow to the right
      canvas.width = rect.width * 0.45 * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width * 0.45}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);
      t += 0.016; // ~60fps frame time

      for (const trail of TRAILS) {
        const baseY = trail.y * h;
        drawTrail(ctx, w, h, baseY, t, trail);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-wave-trails"
      aria-hidden="true"
    />
  );
}

/**
 * Draw a single heartbeat trail line across the canvas width.
 * The line scrolls continuously via the time offset.
 */
function drawTrail(ctx, w, h, baseY, time, trail) {
  const { amp, lineW, opacity, pattern, speed } = trail;
  const scrollOffset = (time * speed * 30) % 400;

  // Glow pass
  ctx.beginPath();
  ctx.strokeStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${opacity * 0.3})`;
  ctx.lineWidth = lineW + 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  tracePath(ctx, w, baseY, amp, scrollOffset, pattern);
  ctx.stroke();

  // Sharp pass
  ctx.beginPath();
  ctx.strokeStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${opacity})`;
  ctx.lineWidth = lineW;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  tracePath(ctx, w, baseY, amp, scrollOffset, pattern);
  ctx.stroke();

  // Hot core pass (very thin, brighter)
  ctx.beginPath();
  ctx.strokeStyle = `rgba(255,220,160,${opacity * 0.4})`;
  ctx.lineWidth = Math.max(0.5, lineW * 0.4);
  tracePath(ctx, w, baseY, amp, scrollOffset, pattern);
  ctx.stroke();
}

/**
 * Trace the actual waveform path.
 * Pattern types create different EKG-like shapes.
 */
function tracePath(ctx, w, baseY, amp, scrollOffset, pattern) {
  const segmentWidth = 200; // px per heartbeat cycle

  for (let x = 0; x <= w; x += 0.8) {
    // Position in the repeating pattern (0-1)
    const pos = ((x + scrollOffset) % segmentWidth) / segmentWidth;
    let y = baseY;

    if (pattern === 'heartbeat') {
      y = baseY + heartbeatWave(pos) * amp;
    } else if (pattern === 'pulse') {
      y = baseY + pulseWave(pos) * amp;
    } else {
      // 'flat' — very subtle noise
      y = baseY + Math.sin((x + scrollOffset) * 0.03) * amp * 0.15;
    }

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

/** Classic EKG heartbeat shape: flat → small dip → sharp spike → dip → flat */
function heartbeatWave(pos) {
  // Flat baseline for most of the cycle
  if (pos < 0.30) return 0;
  if (pos < 0.35) return -0.15 * smoothPeak((pos - 0.30) / 0.05); // P wave (small bump)
  if (pos < 0.40) return 0;
  if (pos < 0.43) return -0.3 * smoothPeak((pos - 0.40) / 0.03);  // Q dip
  if (pos < 0.47) return 1.0 * smoothPeak((pos - 0.43) / 0.04);   // R spike (tall)
  if (pos < 0.51) return -0.5 * smoothPeak((pos - 0.47) / 0.04);  // S dip
  if (pos < 0.55) return 0;
  if (pos < 0.62) return 0.2 * smoothPeak((pos - 0.55) / 0.07);   // T wave (gentle bump)
  return 0;
}

/** Simpler pulse — a single sharp blip */
function pulseWave(pos) {
  if (pos < 0.40) return 0;
  if (pos < 0.44) return -0.2 * smoothPeak((pos - 0.40) / 0.04);
  if (pos < 0.50) return 0.7 * smoothPeak((pos - 0.44) / 0.06);
  if (pos < 0.55) return -0.25 * smoothPeak((pos - 0.50) / 0.05);
  return 0;
}

/** Smooth peak shape: 0→1→0 over normalized t (0-1) */
function smoothPeak(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return Math.sin(clamped * Math.PI);
}
