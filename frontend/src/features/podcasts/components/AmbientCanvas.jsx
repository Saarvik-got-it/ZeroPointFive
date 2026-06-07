import { useEffect, useRef } from 'react';

// ─── Particle factory ────────────────────────────────────
function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: 0.5 + Math.random() * 1.5,
    baseAlpha: 0.1 + Math.random() * 0.15,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.003 + Math.random() * 0.004,
  };
}

// ─── Gradient orb config ─────────────────────────────────
const ORBS = [
  { cx: 0.3, cy: 0.4, radius: 0.35 },
  { cx: 0.7, cy: 0.6, radius: 0.3 },
  { cx: 0.5, cy: 0.25, radius: 0.25 },
];

const PARTICLE_COUNT = 45;

export function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];

    // ── Resize handler ─────────────────────────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      const w = window.innerWidth;
      const h = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(w, h),
      );
    }

    // ── Draw loop ──────────────────────────────────────
    let t = 0;

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      t += 1;

      // ── Radial gradient orbs ───────────────────────
      for (let i = 0; i < ORBS.length; i++) {
        const orb = ORBS[i];
        const breathe = 0.02 + 0.02 * Math.sin(t * 0.008 + i * 2.1);
        const cx = orb.cx * w;
        const cy = orb.cy * h;
        const r = orb.radius * Math.min(w, h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(200, 165, 60, ${breathe})`);
        grad.addColorStop(1, 'rgba(200, 165, 60, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      // ── Particles ──────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        else if (p.y > h + 4) p.y = -4;

        const alpha = p.baseAlpha + 0.06 * Math.sin(p.phase);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 165, 60, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default AmbientCanvas;
