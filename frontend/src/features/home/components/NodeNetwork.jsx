// ─────────────────────────────────────────────────────────────
// NodeNetwork — Premium interactive node-network visualization
// A living ecosystem of interconnected ideas rendered on Canvas
// with 3D projection, orbital rings, signal pulses, and more.
//
// Usage: <NodeNetwork />        (full mode)
//        <NodeNetwork compact /> (mobile compact cluster)
//
// This component is fully standalone and portable.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import {
  allNodes, primaryNodes, connections, discoveryPaths,
  adjacencyMap, orbitalRings, COLORS,
} from './networkData';
import {
  projectTo2D, getConnectionGlowT, getSignalPulseState,
  getDiscoveryState, updateParticle, hashString, dist2D,
  lerp, clamp, smoothstep,
} from './animations';
import './NodeNetwork.css';

// ─── Constants ───────────────────────────────────────────────
const HIT_RADIUS_PADDING = 16;
const ROTATION_SPEED = 0.012;
const TILT_X = 0.18;
const PARTICLE_COUNT = 50;
const PARTICLE_COUNT_COMPACT = 18;

// ─── Icon Drawers ────────────────────────────────────────────
const iconDrawers = {
  ai(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    const g = s * 0.30;
    const pts = [[-g, -g], [g, -g], [-g, g], [g, g]];
    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(x + px, y + py, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(x - g, y - g); ctx.lineTo(x + g, y - g);
    ctx.lineTo(x + g, y + g); ctx.lineTo(x - g, y + g);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - g, y - g); ctx.lineTo(x + g, y + g);
    ctx.moveTo(x + g, y - g); ctx.lineTo(x - g, y + g);
    ctx.stroke();
  },

  technology(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(x, y, s * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, s * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * s * 0.28, y + Math.sin(a) * s * 0.28);
      ctx.lineTo(x + Math.cos(a) * s * 0.45, y + Math.sin(a) * s * 0.45);
      ctx.stroke();
    }
  },

  innovation(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    const d = s * 0.35;
    ctx.beginPath();
    ctx.moveTo(x, y - d); ctx.lineTo(x + d * 0.6, y);
    ctx.lineTo(x, y + d); ctx.lineTo(x - d * 0.6, y);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  },

  startups(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const h = s * 0.35;
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + h * 0.5, y - h * 0.1);
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - h * 0.5, y - h * 0.1);
    ctx.moveTo(x, y - h);
    ctx.lineTo(x, y + h * 0.55);
    ctx.stroke();
  },

  leadership(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    const r = s * 0.30;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const ra = i % 2 === 0 ? r : r * 0.45;
      const px = x + Math.cos(a) * ra;
      const py = y + Math.sin(a) * ra;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  },

  business(ctx, x, y, s, color) {
    ctx.fillStyle = color;
    const bw = s * 0.11;
    const gap = s * 0.07;
    const heights = [0.4, 0.65, 0.5];
    heights.forEach((h, i) => {
      const bx = x + (i - 1) * (bw + gap) - bw / 2;
      const bh = s * h;
      ctx.fillRect(bx, y + s * 0.18 - bh, bw, bh);
    });
  },

  founders(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.14, s * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + s * 0.32, s * 0.22, Math.PI + 0.4, -0.4);
    ctx.stroke();
  },

  future(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const d = s * 0.18;
    [-d * 0.5, d * 0.5].forEach(ox => {
      ctx.beginPath();
      ctx.moveTo(x + ox - d * 0.3, y - d);
      ctx.lineTo(x + ox + d * 0.3, y);
      ctx.lineTo(x + ox - d * 0.3, y + d);
      ctx.stroke();
    });
  },

  conversations(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    const r = s * 0.28;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.04, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.3, y + r * 0.65);
    ctx.lineTo(x - r * 0.7, y + r * 1.2);
    ctx.lineTo(x + r * 0.1, y + r * 0.75);
    ctx.stroke();
  },

  dot(ctx, x, y, s, color) {
    ctx.beginPath();
    ctx.arc(x, y, s * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  },
};

// ─── Drawing Helpers ─────────────────────────────────────────

function drawBackgroundSphere(ctx, cx, cy, radius, w, h) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.4);
  grad.addColorStop(0, `rgba(${COLORS.warmAmber}, 0.03)`);
  grad.addColorStop(0.35, `rgba(${COLORS.warmAmber}, 0.015)`);
  grad.addColorStop(0.65, `rgba(${COLORS.warmAmber}, 0.006)`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawOrbitalRingsLayer(ctx, cx, cy, radius, time) {
  orbitalRings.forEach(ring => {
    const angle = time * ring.speed;
    const r = radius * ring.radiusMult;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * (0.35 + ring.tiltX * 0.3), ring.tiltZ, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${ring.opacity})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  });
}

function drawConnectionLine(ctx, x1, y1, x2, y2, alpha, glowStrength, lineWidth) {
  if (alpha < 0.008) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha})`;
  ctx.lineWidth = lineWidth;
  if (glowStrength > 0.02) {
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${glowStrength})`;
    ctx.shadowBlur = 8;
  }
  ctx.stroke();
  ctx.restore();
}

function drawTravelingGlow(ctx, x1, y1, x2, y2, t, alpha) {
  if (t < 0 || t > 1 || alpha < 0.02) return;
  const gx = lerp(x1, x2, t);
  const gy = lerp(y1, y2, t);
  ctx.save();
  ctx.beginPath();
  ctx.arc(gx, gy, 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${COLORS.amberRgb}, ${alpha * 0.5})`;
  ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${alpha * 0.8})`;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

// ─── HOVER AURA — radial glow emanating from hovered node ───
function drawHoverAura(ctx, x, y, time, hoverProgress) {
  const breathe = Math.sin(time * 2) * 0.15;
  const baseRadius = 100 + breathe * 40;
  const alpha = hoverProgress * 0.08;

  // Primary aura
  const grad = ctx.createRadialGradient(x, y, 0, x, y, baseRadius);
  grad.addColorStop(0, `rgba(${COLORS.amberRgb}, ${alpha})`);
  grad.addColorStop(0.4, `rgba(${COLORS.amberRgb}, ${alpha * 0.35})`);
  grad.addColorStop(0.7, `rgba(${COLORS.amberRgb}, ${alpha * 0.08})`);
  grad.addColorStop(1, 'transparent');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Pulsing ring
  const ringPhase = (time * 2.5) % (Math.PI * 2);
  const ringRadius = 45 + 20 * Math.sin(ringPhase);
  const ringAlpha = hoverProgress * (0.12 + 0.06 * Math.sin(ringPhase));
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${ringAlpha})`;
  ctx.lineWidth = 1;
  ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${ringAlpha * 1.5})`;
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.restore();
}

function drawNodeCircle(ctx, proj, isHovered, hoverProgress, isNeighborHovered, time) {
  const { screenX: x, screenY: y, nodeRadius: baseR, opacity, icon, label, fontSize } = proj;

  // Scale: hovered = 1.5x, neighbor = 1.15x, normal = 1x
  const r = isHovered
    ? baseR * (1 + 0.5 * hoverProgress)
    : isNeighborHovered
      ? baseR * (1 + 0.15 * hoverProgress)
      : baseR;
  const alpha = isHovered ? 1 : isNeighborHovered ? Math.max(opacity, 0.7) : opacity;

  // ── Outer glow ──
  if (alpha > 0.12) {
    const glowR = proj.glowRadius * (isHovered ? 2.2 : isNeighborHovered ? 1.4 : 1);
    const glowAlpha = alpha * (isHovered ? 0.12 : isNeighborHovered ? 0.05 : 0.025);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r + glowR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${isHovered || isNeighborHovered ? COLORS.amberRgb : COLORS.idleRgb}, ${glowAlpha})`;
    ctx.fill();
    ctx.restore();
  }

  // ── Hover: animated double ring ──
  if (isHovered && hoverProgress > 0.3) {
    const ringTime = time * 3;
    // Outer rotating dashed ring
    const outerR = r * 1.7;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ringTime * 0.4);
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${0.2 * hoverProgress})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Inner pulsing ring
    const pulseScale = 1 + 0.08 * Math.sin(ringTime * 1.5);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r * 1.35 * pulseScale, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${0.25 * hoverProgress})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${0.3 * hoverProgress})`;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  // ── Neighbor: subtle ring ──
  if (isNeighborHovered && hoverProgress > 0.3) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${0.08 * hoverProgress})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.restore();
  }

  // ── Node circle fill ──
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = isHovered ? COLORS.nodeFillHover : COLORS.nodeFill;
  ctx.fill();

  // Border
  const borderAlpha = isHovered ? 0.85 : isNeighborHovered ? 0.55 : alpha * 0.35;
  ctx.strokeStyle = `rgba(${isHovered ? COLORS.brightRgb : isNeighborHovered ? COLORS.amberRgb : COLORS.idleRgb}, ${borderAlpha})`;
  ctx.lineWidth = isHovered ? 2 : isNeighborHovered ? 1.5 : 1;
  if (isHovered) {
    ctx.shadowColor = `rgba(${COLORS.brightRgb}, 0.6)`;
    ctx.shadowBlur = 18;
  } else if (isNeighborHovered) {
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, 0.25)`;
    ctx.shadowBlur = 8;
  }
  ctx.stroke();
  ctx.restore();

  // ── Icon ──
  if (icon && iconDrawers[icon]) {
    const iconAlpha = isHovered ? 1 : isNeighborHovered ? 0.85 : alpha * 0.65;
    const iconColor = `rgba(${isHovered ? COLORS.brightRgb : isNeighborHovered ? COLORS.amberRgb : COLORS.idleRgb}, ${iconAlpha})`;
    ctx.save();
    ctx.globalAlpha = clamp(iconAlpha, 0, 1);
    iconDrawers[icon](ctx, x, y, r, iconColor);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── Label pill ──
  if (alpha > 0.2 || isHovered || isNeighborHovered) {
    const labelAlpha = isHovered ? 1 : isNeighborHovered ? 0.9 : clamp(alpha * 1.1, 0, 0.8);
    drawLabel(ctx, x, y + r + 18, label, fontSize, labelAlpha, isHovered, isNeighborHovered);
  }
}

function drawLabel(ctx, x, y, text, fontSize, alpha, isHovered, isNeighborHovered = false) {
  ctx.save();
  const fSize = isHovered ? fontSize * 1.15 : fontSize;
  ctx.font = `${fSize}px 'Space Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const padX = 10;
  const padY = 5;
  const pillW = tw + padX * 2;
  const pillH = fSize + padY * 2;
  const pillX = x - pillW / 2;
  const pillY = y - pillH / 2;
  const cornerR = pillH / 2;

  // Pill background
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, cornerR);
  ctx.fillStyle = isHovered
    ? `rgba(10, 18, 12, ${alpha * 0.92})`
    : `rgba(14, 14, 14, ${alpha * 0.85})`;
  ctx.fill();

  // Pill border
  const borderA = isHovered ? 0.35 : isNeighborHovered ? 0.2 : 0.1;
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha * borderA})`;
  ctx.lineWidth = isHovered ? 1 : 0.5;
  if (isHovered) {
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, 0.15)`;
    ctx.shadowBlur = 6;
  }
  ctx.stroke();

  // Text
  ctx.fillStyle = isHovered
    ? `rgba(${COLORS.brightRgb}, ${alpha})`
    : isNeighborHovered
      ? `rgba(${COLORS.amberRgb}, ${alpha * 0.8})`
      : `rgba(${COLORS.white}, ${alpha * 0.85})`;
  ctx.fillText(text, x, y + 0.5);
  ctx.restore();
}

function drawParticleField(ctx, particles, w, h) {
  particles.forEach(p => {
    updateParticle(p, w, h);
    const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${COLORS.warmAmber}, ${alpha})`;
    ctx.fill();
  });
}

function drawSignalPulse(ctx, projectedNodes, pulseState, nodeMap) {
  if (!pulseState || !pulseState.active) return;
  const { progress, sourceIndex } = pulseState;
  const sourceNode = projectedNodes[sourceIndex % projectedNodes.length];
  if (!sourceNode) return;

  const maxRadius = 280;
  const currentRadius = progress * maxRadius;
  const ringAlpha = (1 - progress) * 0.18;

  if (ringAlpha > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(sourceNode.screenX, sourceNode.screenY, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${ringAlpha})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${ringAlpha * 2})`;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  const neighbors = adjacencyMap[sourceNode.id];
  if (!neighbors) return;
  neighbors.forEach(neighborId => {
    const neighbor = nodeMap[neighborId];
    if (!neighbor) return;
    const d = dist2D(sourceNode.screenX, sourceNode.screenY, neighbor.screenX, neighbor.screenY);
    const arrivalT = d / maxRadius;
    if (progress > arrivalT && progress < arrivalT + 0.4) {
      const localProgress = (progress - arrivalT) / 0.4;
      const flashAlpha = (1 - localProgress) * 0.35;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sourceNode.screenX, sourceNode.screenY);
      ctx.lineTo(neighbor.screenX, neighbor.screenY);
      ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${flashAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${flashAlpha})`;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();
    }
  });
}

function drawDiscoveryPath(ctx, discoveryState, nodeMap) {
  if (!discoveryState || !discoveryState.active) return;
  const { progress, pathIndex } = discoveryState;
  const path = discoveryPaths[pathIndex % discoveryPaths.length];
  if (!path) return;
  const fromNode = nodeMap[path.from];
  const toNode = nodeMap[path.to];
  if (!fromNode || !toNode) return;

  let alpha;
  if (progress < 0.3) alpha = smoothstep(0, 0.3, progress) * 0.28;
  else if (progress > 0.7) alpha = (1 - smoothstep(0.7, 1, progress)) * 0.28;
  else alpha = 0.28;
  if (alpha < 0.01) return;

  ctx.save();
  ctx.setLineDash([5, 7]);
  ctx.beginPath();
  ctx.moveTo(fromNode.screenX, fromNode.screenY);
  ctx.lineTo(toNode.screenX, toNode.screenY);
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${alpha * 1.5})`;
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawLensFlare(ctx, cx, cy, radius, time) {
  const flareX = cx + radius * 0.3;
  const flareY = cy - radius * 0.25;
  const pulseAlpha = 0.025 + 0.012 * Math.sin(time * 0.3);
  const grad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, radius * 0.45);
  grad.addColorStop(0, `rgba(${COLORS.amberRgb}, ${pulseAlpha})`);
  grad.addColorStop(0.5, `rgba(${COLORS.amberRgb}, ${pulseAlpha * 0.3})`);
  grad.addColorStop(1, 'transparent');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(flareX - radius * 0.45, flareY - radius * 0.45, radius * 0.9, radius * 0.9);
  ctx.restore();
}

// ─── Main Component ──────────────────────────────────────────

export function NodeNetwork({ compact = false, onNodeDiscover }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [clickedNode, setClickedNode] = useState(null);
  const clickTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const tooltipHideRef = useRef(null); // delays tooltip CSS exit to sync with glow
  // Tooltip cache: keeps DOM mounted during CSS exit transition
  const [tooltipCache, setTooltipCache] = useState(null);
  const tooltipUnmountRef = useRef(null);

  const stateRef = useRef({
    mouse: { x: -9999, y: -9999 },
    hoveredId: null,
    lastHoveredId: null, // persists during outro fade
    hoverProgress: 0,
    time: 0,
    particles: [],
    width: 0,
    height: 0,
    projectedCache: [],
    nodeMap: {},
  });

  const activeNodes = compact ? primaryNodes : allNodes;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;

    // ─── Resize ────────────────────────
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pCount = compact ? PARTICLE_COUNT_COMPACT : PARTICLE_COUNT;
      state.particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 1.3 + 0.3,
        opacity: Math.random() * 0.22 + 0.03,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    // ─── Mouse handlers ────────────────
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
      // Symmetric outro — clear immediately, let hoverProgress decay handle visuals
      state.hoveredId = null;
      setHoveredNode(null);
      // Tooltip DOM unmount after CSS exit completes
      if (tooltipHideRef.current) clearTimeout(tooltipHideRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (tooltipUnmountRef.current) clearTimeout(tooltipUnmountRef.current);
      tooltipUnmountRef.current = setTimeout(() => {
        setTooltipCache(null);
        tooltipUnmountRef.current = null;
      }, 350);
    };

    // ─── Click / Double-click handlers ──
    const handleClick = () => {
      if (!onNodeDiscover || compact) return;
      const id = stateRef.current.hoveredId;
      if (!id) {
        setClickedNode(null);
        return;
      }
      // If already clicked and this is a quick second click, treat as double
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
        // Double-click: navigate
        setClickedNode(null);
        onNodeDiscover(id);
        return;
      }
      // Single click: show discover prompt
      setClickedNode(id);
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
      }, 500);
    };

    if (!compact) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('click', handleClick);
    }

    // ─── Animation Loop ────────────────
    let rafId;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      state.time += dt;

      const w = state.width;
      const h = state.height;
      if (w < 1 || h < 1) { rafId = requestAnimationFrame(animate); return; }

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w * (compact ? 0.5 : 0.725);
      const cy = h * 0.48;
      const sphereRadius = Math.min(w, h) * (compact ? 0.38 : 0.48);

      // ── 1. Project all nodes to 2D ──
      const projected = activeNodes.map(node =>
        projectTo2D(node, state.time, cx, cy, sphereRadius, ROTATION_SPEED, TILT_X)
      );
      projected.sort((a, b) => a.z - b.z);

      const nodeMap = {};
      projected.forEach(p => { nodeMap[p.id] = p; });
      state.projectedCache = projected;
      state.nodeMap = nodeMap;

      // ── 2. Hit test for hover ──
      if (!compact) {
        let closestId = null;
        let closestDist = Infinity;

        projected.forEach(p => {
          const d = dist2D(state.mouse.x, state.mouse.y, p.screenX, p.screenY);
          const hitR = p.nodeRadius + HIT_RADIUS_PADDING;
          if (d < hitR && d < closestDist) {
            closestDist = d;
            closestId = p.id;
          }
        });

        // ── Hit-test result handling ──
        if (closestId) {
          // Cursor is on a node
          if (closestId !== state.hoveredId) {
            // Moving onto a NEW node
            state.hoveredId = closestId;
            state.lastHoveredId = closestId;
            state.hoverProgress = 0;
            setHoveredNode(closestId);
            if (nodeMap[closestId]) {
              const np = nodeMap[closestId];
              setTooltipPos({
                x: np.screenX + np.nodeRadius + 20,
                y: np.screenY - 12,
              });
            }
            // Cache tooltip data for exit transition
            const nd = activeNodes.find(n => n.id === closestId);
            if (nd && nd.tooltip && nodeMap[closestId]) {
              const np = nodeMap[closestId];
              setTooltipCache({
                data: nd,
                pos: {
                  x: np.screenX + np.nodeRadius + 20,
                  y: np.screenY - 12,
                },
              });
            }
          }
          // Cancel any pending leave timers — cursor is on a node
          if (tooltipHideRef.current) {
            clearTimeout(tooltipHideRef.current);
            tooltipHideRef.current = null;
          }
          if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
          }
          if (tooltipUnmountRef.current) {
            clearTimeout(tooltipUnmountRef.current);
            tooltipUnmountRef.current = null;
          }
        } else if (state.hoveredId && !leaveTimerRef.current) {
          // Cursor just left a node (but still on canvas)
          // Symmetric outro — clear immediately, let decay handle visuals
          state.hoveredId = null;
          setHoveredNode(null);
          if (tooltipHideRef.current) clearTimeout(tooltipHideRef.current);
          if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
          if (tooltipUnmountRef.current) clearTimeout(tooltipUnmountRef.current);
          tooltipUnmountRef.current = setTimeout(() => {
            setTooltipCache(null);
            tooltipUnmountRef.current = null;
          }, 350);
        }

        // Smooth hover progress
        if (state.hoveredId) {
          state.hoverProgress = Math.min(1, state.hoverProgress + dt * 4.5);
        } else {
          // Symmetric decay — same rate as intro (dt * 4.5 ≈ 220ms)
          state.hoverProgress = Math.max(0, state.hoverProgress - dt * 4.5);
          // Clear lastHoveredId only when fully faded
          if (state.hoverProgress <= 0) {
            state.lastHoveredId = null;
          }
        }
      }

      // ── 3. Render layers ──

      // Layer 1: Background sphere glow
      drawBackgroundSphere(ctx, cx, cy, sphereRadius, w, h);

      // Layer 2: Orbital rings
      drawOrbitalRingsLayer(ctx, cx, cy, sphereRadius, state.time);

      // Layer 3: Lens flare
      drawLensFlare(ctx, cx, cy, sphereRadius, state.time);

      // Layer 4: Hover aura (behind connections and nodes)
      // Use lastHoveredId so aura fades with hoverProgress
      const activeRenderId = state.lastHoveredId;
      if (activeRenderId && nodeMap[activeRenderId] && state.hoverProgress > 0.05) {
        const hp = nodeMap[activeRenderId];
        drawHoverAura(ctx, hp.screenX, hp.screenY, state.time, state.hoverProgress);
      }

      // Layer 5: Connections
      connections.forEach((conn) => {
        const fromP = nodeMap[conn.from];
        const toP = nodeMap[conn.to];
        if (!fromP || !toP) return;

        const avgDepth = (fromP.depth + toP.depth) / 2;
        let baseAlpha = lerp(0.04, 0.22, avgDepth);
        let glowStrength = lerp(0.01, 0.1, avgDepth);
        let lineW = lerp(0.5, 1.2, avgDepth);

        // ── Hover: boost connected, dim unconnected ──
        if (activeRenderId && state.hoverProgress > 0.05) {
          const isConnected = conn.from === activeRenderId || conn.to === activeRenderId;
          if (isConnected) {
            baseAlpha = lerp(baseAlpha, 0.65, state.hoverProgress);
            glowStrength = lerp(glowStrength, 0.55, state.hoverProgress);
            lineW = lerp(lineW, 2.5, state.hoverProgress);
          } else {
            baseAlpha *= lerp(1, 0.2, state.hoverProgress);
            glowStrength *= lerp(1, 0.1, state.hoverProgress);
          }
        }

        drawConnectionLine(ctx, fromP.screenX, fromP.screenY, toP.screenX, toP.screenY, baseAlpha, glowStrength, lineW);

        // Traveling glow
        const seed = hashString(conn.from + conn.to);
        const glowT = getConnectionGlowT(state.time, seed, 0.08);
        if (glowT >= 0 && glowT <= 1) {
          drawTravelingGlow(ctx, fromP.screenX, fromP.screenY, toP.screenX, toP.screenY, glowT, baseAlpha * 1.5);
        }
      });

      // Layer 6: Discovery paths
      const discoveryState = getDiscoveryState(state.time);
      drawDiscoveryPath(ctx, discoveryState, nodeMap);

      // Layer 7: Signal pulse
      const pulseState = getSignalPulseState(state.time);
      drawSignalPulse(ctx, projected, pulseState, nodeMap);

      // Layer 8: Nodes (back to front)
      projected.forEach(proj => {
        const isHovered = proj.id === activeRenderId && state.hoverProgress > 0.05;
        const isNeighbor = activeRenderId && state.hoverProgress > 0.05 && adjacencyMap[activeRenderId]?.has(proj.id);
        let dimFactor = 1;

        // Dim unrelated nodes strongly
        if (activeRenderId && state.hoverProgress > 0.05 && !isHovered && !isNeighbor) {
          dimFactor = lerp(1, 0.12, state.hoverProgress);
        }

        ctx.save();
        if (dimFactor < 1) {
          ctx.globalAlpha = dimFactor;
        }
        drawNodeCircle(ctx, proj, isHovered, state.hoverProgress, isNeighbor && !isHovered, state.time);
        ctx.restore();
      });

      // Layer 9: Particles
      drawParticleField(ctx, state.particles, w, h);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      if (!compact) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('click', handleClick);
      }
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (tooltipHideRef.current) clearTimeout(tooltipHideRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (tooltipUnmountRef.current) clearTimeout(tooltipUnmountRef.current);
    };
  }, [compact, activeNodes]);

  const hoveredData = hoveredNode ? allNodes.find(n => n.id === hoveredNode) : null;
  const clickedData = clickedNode ? allNodes.find(n => n.id === clickedNode) : null;

  return (
    <div
      ref={containerRef}
      className={`node-network${compact ? ' node-network--compact' : ''}`}
    >
      <canvas ref={canvasRef} className="node-network__canvas" />
      {/* Tooltip — stays mounted via cache during CSS exit transition */}
      {tooltipCache && tooltipCache.data.tooltip && (
        <div
          className={`node-network__tooltip${hoveredNode ? ' node-network__tooltip--visible' : ''}`}
          style={{
            left: Math.min(tooltipCache.pos.x, (stateRef.current.width || 400) - 170),
            top: Math.max(10, tooltipCache.pos.y),
          }}
        >
          <div className="node-network__tooltip-label">{tooltipCache.data.label}</div>
          <div className="node-network__tooltip-divider" />
          <div className="node-network__tooltip-stat">{tooltipCache.data.tooltip.line1}</div>
          {tooltipCache.data.tooltip.line2 && (
            <div className="node-network__tooltip-stat">{tooltipCache.data.tooltip.line2}</div>
          )}
          {tooltipCache.data.tooltip.badge && (
            <div className="node-network__tooltip-badge">● {tooltipCache.data.tooltip.badge}</div>
          )}
        </div>
      )}
      {/* Discovery prompt — appears on click, invites double-click to navigate */}
      {clickedData && onNodeDiscover && (
        <div
          className="node-network__tooltip node-network__tooltip--visible"
          style={{
            left: Math.min(tooltipPos.x, (stateRef.current.width || 400) - 200),
            top: Math.max(10, tooltipPos.y + 50),
          }}
        >
          <div className="node-network__tooltip-label">Explore {clickedData.label}</div>
          <div className="node-network__tooltip-divider" />
          <div className="node-network__tooltip-stat">{clickedData.tooltip?.line1 || 'Conversations'}</div>
          <div className="node-network__tooltip-badge" style={{ cursor: 'pointer' }}>Double Click To Discover →</div>
        </div>
      )}
    </div>
  );
}

export default NodeNetwork;
