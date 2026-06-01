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

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  allNodes, primaryNodes, connections, discoveryPaths,
  adjacencyMap, orbitalRings, COLORS,
} from './networkData';
import {
  projectTo2D, getConnectionGlowT, getSignalPulseState,
  getDiscoveryState, updateParticle, hashString, dist2D,
  lerp, clamp, smoothstep, easeInOutCubic,
} from './animations';
import './NodeNetwork.css';

// ─── Constants ───────────────────────────────────────────────
const HIT_RADIUS_PADDING = 12; // Extra px for easier hover targeting
const ROTATION_SPEED = 0.012;   // Radians per second (very slow)
const TILT_X = 0.18;            // Fixed X-axis tilt for 3D perspective
const PARTICLE_COUNT = 45;
const PARTICLE_COUNT_COMPACT = 15;

// ─── Icon Drawers ────────────────────────────────────────────
// Each draws a simple geometric icon at (x, y) with given size & color
const iconDrawers = {
  ai(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    const g = s * 0.32;
    // 2x2 grid of dots with connecting lines
    const pts = [[-g, -g], [g, -g], [-g, g], [g, g]];
    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(x + px, y + py, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    // Connect them
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
    ctx.lineWidth = 1.2;
    // Circuit: concentric circles with lines
    ctx.beginPath();
    ctx.arc(x, y, s * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    // Radial lines
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * s * 0.3, y + Math.sin(a) * s * 0.3);
      ctx.lineTo(x + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5);
      ctx.stroke();
    }
  },

  innovation(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    // Diamond/spark
    const d = s * 0.38;
    ctx.beginPath();
    ctx.moveTo(x, y - d);
    ctx.lineTo(x + d * 0.6, y);
    ctx.lineTo(x, y + d);
    ctx.lineTo(x - d * 0.6, y);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  },

  startups(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.3;
    // Upward arrow
    const h = s * 0.38;
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + h * 0.55, y - h * 0.15);
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - h * 0.55, y - h * 0.15);
    ctx.moveTo(x, y - h);
    ctx.lineTo(x, y + h * 0.6);
    ctx.stroke();
  },

  leadership(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    // Star/crown shape
    const r = s * 0.32;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
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
    // 3 bar chart
    const bw = s * 0.12;
    const gap = s * 0.08;
    const heights = [0.45, 0.7, 0.55];
    heights.forEach((h, i) => {
      const bx = x + (i - 1) * (bw + gap) - bw / 2;
      const bh = s * h;
      ctx.fillRect(bx, y + s * 0.2 - bh, bw, bh);
    });
  },

  founders(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    // Person icon: head circle + body arc
    ctx.beginPath();
    ctx.arc(x, y - s * 0.15, s * 0.14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + s * 0.35, s * 0.25, Math.PI + 0.4, -0.4);
    ctx.stroke();
  },

  future(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    // Double chevron >>
    const d = s * 0.2;
    [-d * 0.4, d * 0.4].forEach(ox => {
      ctx.beginPath();
      ctx.moveTo(x + ox - d * 0.3, y - d);
      ctx.lineTo(x + ox + d * 0.3, y);
      ctx.lineTo(x + ox - d * 0.3, y + d);
      ctx.stroke();
    });
  },

  conversations(ctx, x, y, s, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    // Speech bubble
    const r = s * 0.3;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.05, r, 0, Math.PI * 2);
    ctx.stroke();
    // Tail
    ctx.beginPath();
    ctx.moveTo(x - r * 0.3, y + r * 0.7);
    ctx.lineTo(x - r * 0.7, y + r * 1.3);
    ctx.lineTo(x + r * 0.1, y + r * 0.8);
    ctx.stroke();
  },

  dot(ctx, x, y, s, color) {
    ctx.beginPath();
    ctx.arc(x, y, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  },
};

// ─── Drawing Helpers ─────────────────────────────────────────

function drawBackgroundSphere(ctx, cx, cy, radius, w, h) {
  // Radial ambient glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.3);
  grad.addColorStop(0, `rgba(${COLORS.warmAmber}, 0.025)`);
  grad.addColorStop(0.4, `rgba(${COLORS.warmAmber}, 0.012)`);
  grad.addColorStop(0.7, `rgba(${COLORS.warmAmber}, 0.005)`);
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

    // Draw tilted ellipse
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * (0.35 + ring.tiltX * 0.3), ring.tiltZ, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${ring.opacity})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  });
}

function drawConnectionLine(ctx, x1, y1, x2, y2, alpha, glowStrength, lineWidth) {
  if (alpha < 0.01) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha})`;
  ctx.lineWidth = lineWidth;

  if (glowStrength > 0.02) {
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${glowStrength})`;
    ctx.shadowBlur = 6;
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
  ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${COLORS.amberRgb}, ${alpha * 0.5})`;
  ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${alpha * 0.8})`;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
}

function drawNodeCircle(ctx, proj, isHovered, hoverProgress) {
  const { screenX: x, screenY: y, nodeRadius: baseR, opacity, icon, label, type, fontSize } = proj;
  const r = isHovered ? baseR * (1 + 0.25 * hoverProgress) : baseR;
  const alpha = isHovered ? 1 : opacity;

  // Outer glow
  if (alpha > 0.15) {
    const glowR = proj.glowRadius * (isHovered ? 1.8 : 1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r + glowR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${COLORS.amberRgb}, ${alpha * (isHovered ? 0.06 : 0.025)})`;
    ctx.fill();
    ctx.restore();
  }

  // Node circle fill
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = isHovered ? COLORS.nodeFillHover : COLORS.nodeFill;
  ctx.fill();

  // Border
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha * (isHovered ? 0.7 : 0.35)})`;
  ctx.lineWidth = isHovered ? 1.5 : 1;

  if (isHovered) {
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, 0.5)`;
    ctx.shadowBlur = 12;
  }

  ctx.stroke();
  ctx.restore();

  // Icon
  if (icon && iconDrawers[icon]) {
    const iconAlpha = alpha * (isHovered ? 1 : 0.7);
    const iconColor = `rgba(${COLORS.amberRgb}, ${iconAlpha})`;
    ctx.save();
    ctx.globalAlpha = clamp(iconAlpha, 0, 1);
    iconDrawers[icon](ctx, x, y, r, iconColor);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Label pill
  if (alpha > 0.25 || isHovered) {
    const labelAlpha = isHovered ? 1 : clamp(alpha * 1.1, 0, 0.85);
    drawLabel(ctx, x, y + r + 14, label, fontSize, labelAlpha, isHovered);
  }
}

function drawLabel(ctx, x, y, text, fontSize, alpha, isHovered) {
  ctx.save();

  ctx.font = `${fontSize}px 'Space Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const padX = 8;
  const padY = 4.5;
  const pillW = tw + padX * 2;
  const pillH = fontSize + padY * 2;
  const pillX = x - pillW / 2;
  const pillY = y - pillH / 2;
  const cornerR = pillH / 2;

  // Pill background
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, cornerR);
  ctx.fillStyle = `rgba(14, 14, 14, ${alpha * 0.85})`;
  ctx.fill();

  // Pill border
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha * (isHovered ? 0.25 : 0.1)})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Text
  ctx.fillStyle = isHovered
    ? `rgba(${COLORS.amberRgb}, ${alpha})`
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

function drawSignalPulse(ctx, projectedNodes, connectionsData, pulseState, nodeMap) {
  if (!pulseState || !pulseState.active) return;

  const { progress, sourceIndex } = pulseState;
  const sourceNode = projectedNodes[sourceIndex % projectedNodes.length];
  if (!sourceNode) return;

  // Expanding ring from source
  const maxRadius = 180;
  const currentRadius = progress * maxRadius;
  const ringAlpha = (1 - progress) * 0.15;

  if (ringAlpha > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(sourceNode.screenX, sourceNode.screenY, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${ringAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${ringAlpha * 2})`;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  // Illuminate connections from source progressively
  const neighbors = adjacencyMap[sourceNode.id];
  if (!neighbors) return;

  neighbors.forEach(neighborId => {
    const neighbor = nodeMap[neighborId];
    if (!neighbor) return;

    const d = dist2D(sourceNode.screenX, sourceNode.screenY, neighbor.screenX, neighbor.screenY);
    const arrivalT = d / maxRadius; // When the pulse reaches this neighbor

    if (progress > arrivalT && progress < arrivalT + 0.4) {
      const localProgress = (progress - arrivalT) / 0.4;
      const flashAlpha = (1 - localProgress) * 0.3;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sourceNode.screenX, sourceNode.screenY);
      ctx.lineTo(neighbor.screenX, neighbor.screenY);
      ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${flashAlpha})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${flashAlpha})`;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }
  });
}

function drawDiscoveryPath(ctx, projectedNodes, discoveryState, nodeMap) {
  if (!discoveryState || !discoveryState.active) return;

  const { progress, pathIndex } = discoveryState;
  const path = discoveryPaths[pathIndex % discoveryPaths.length];
  if (!path) return;

  const fromNode = nodeMap[path.from];
  const toNode = nodeMap[path.to];
  if (!fromNode || !toNode) return;

  // Fade in and out
  let alpha;
  if (progress < 0.3) {
    alpha = smoothstep(0, 0.3, progress) * 0.25;
  } else if (progress > 0.7) {
    alpha = (1 - smoothstep(0.7, 1, progress)) * 0.25;
  } else {
    alpha = 0.25;
  }

  if (alpha < 0.01) return;

  // Draw the discovery line with a different style (dashed)
  ctx.save();
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(fromNode.screenX, fromNode.screenY);
  ctx.lineTo(toNode.screenX, toNode.screenY);
  ctx.strokeStyle = `rgba(${COLORS.amberRgb}, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.shadowColor = `rgba(${COLORS.amberRgb}, ${alpha * 1.5})`;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawLensFlare(ctx, cx, cy, radius, time) {
  // Very subtle lens flare / light bloom at top-right area
  const flareX = cx + radius * 0.35;
  const flareY = cy - radius * 0.3;
  const pulseAlpha = 0.02 + 0.01 * Math.sin(time * 0.3);

  const grad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, radius * 0.4);
  grad.addColorStop(0, `rgba(${COLORS.amberRgb}, ${pulseAlpha})`);
  grad.addColorStop(0.5, `rgba(${COLORS.amberRgb}, ${pulseAlpha * 0.3})`);
  grad.addColorStop(1, 'transparent');

  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(flareX - radius * 0.4, flareY - radius * 0.4, radius * 0.8, radius * 0.8);
  ctx.restore();
}

// ─── Main Component ──────────────────────────────────────────

export function NodeNetwork({ compact = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Mutable state for animation loop (no React re-renders)
  const stateRef = useRef({
    mouse: { x: -9999, y: -9999 },
    hoveredId: null,
    hoverProgress: 0,
    time: 0,
    particles: [],
    width: 0,
    height: 0,
    projectedCache: [],
    nodeMap: {},
  });

  // Choose which nodes to display
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

      // Init particles
      const pCount = compact ? PARTICLE_COUNT_COMPACT : PARTICLE_COUNT;
      state.particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.2 + 0.03,
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
      state.hoveredId = null;
      setHoveredNode(null);
    };

    if (!compact) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // ─── Animation Loop ────────────────
    let rafId;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1); // Cap delta to prevent jumps
      lastTime = now;
      state.time += dt;

      const w = state.width;
      const h = state.height;
      if (w < 1 || h < 1) { rafId = requestAnimationFrame(animate); return; }

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;
      const sphereRadius = Math.min(w, h) * (compact ? 0.35 : 0.40);

      // ── 1. Project all nodes to 2D ──
      const projected = activeNodes.map(node =>
        projectTo2D(node, state.time, cx, cy, sphereRadius, ROTATION_SPEED, TILT_X)
      );

      // Sort back-to-front (by z, ascending — most negative first)
      projected.sort((a, b) => a.z - b.z);

      // Build quick lookup map
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

        if (closestId !== state.hoveredId) {
          state.hoveredId = closestId;
          state.hoverProgress = 0;
          setHoveredNode(closestId);

          if (closestId && nodeMap[closestId]) {
            const np = nodeMap[closestId];
            setTooltipPos({
              x: np.screenX + np.nodeRadius + 16,
              y: np.screenY - 10,
            });
          }
        }

        // Animate hover progress
        if (state.hoveredId) {
          state.hoverProgress = Math.min(1, state.hoverProgress + dt * 5);
        }
      }

      // ── 3. Render layers ──

      // Layer 1: Background sphere glow
      drawBackgroundSphere(ctx, cx, cy, sphereRadius, w, h);

      // Layer 2: Orbital rings
      drawOrbitalRingsLayer(ctx, cx, cy, sphereRadius, state.time);

      // Layer 3: Lens flare
      drawLensFlare(ctx, cx, cy, sphereRadius, state.time);

      // Layer 4: Connections
      connections.forEach((conn, idx) => {
        const fromP = nodeMap[conn.from];
        const toP = nodeMap[conn.to];
        if (!fromP || !toP) return;

        // Depth-based alpha (average of both nodes)
        const avgDepth = (fromP.depth + toP.depth) / 2;
        let baseAlpha = lerp(0.03, 0.18, avgDepth);
        let glowStrength = lerp(0, 0.08, avgDepth);
        let lineW = lerp(0.4, 1, avgDepth);

        // Hover highlight
        if (state.hoveredId) {
          const isConnected =
            conn.from === state.hoveredId || conn.to === state.hoveredId;
          if (isConnected) {
            baseAlpha = lerp(baseAlpha, 0.45, state.hoverProgress);
            glowStrength = lerp(glowStrength, 0.35, state.hoverProgress);
            lineW = lerp(lineW, 1.8, state.hoverProgress);
          } else {
            baseAlpha *= lerp(1, 0.3, state.hoverProgress);
            glowStrength *= lerp(1, 0.2, state.hoverProgress);
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

      // Layer 5: Discovery paths
      const discoveryState = getDiscoveryState(state.time);
      drawDiscoveryPath(ctx, projected, discoveryState, nodeMap);

      // Layer 6: Signal pulse
      const pulseState = getSignalPulseState(state.time);
      drawSignalPulse(ctx, projected, connections, pulseState, nodeMap);

      // Layer 7: Nodes (back to front — already sorted)
      projected.forEach(proj => {
        const isHovered = proj.id === state.hoveredId;
        let dimFactor = 1;

        // Dim unrelated nodes on hover
        if (state.hoveredId && !isHovered) {
          const isNeighbor = adjacencyMap[state.hoveredId]?.has(proj.id);
          if (!isNeighbor) {
            dimFactor = lerp(1, 0.3, state.hoverProgress);
          }
        }

        ctx.save();
        if (dimFactor < 1) {
          ctx.globalAlpha = dimFactor;
        }
        drawNodeCircle(ctx, proj, isHovered, state.hoverProgress);
        ctx.restore();
      });

      // Layer 8: Particles
      drawParticleField(ctx, state.particles, w, h);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // ─── Cleanup ───────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      if (!compact) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [compact, activeNodes]);

  // ─── Find hovered node data for tooltip ────
  const hoveredData = hoveredNode ? allNodes.find(n => n.id === hoveredNode) : null;

  return (
    <div
      ref={containerRef}
      className={`node-network${compact ? ' node-network--compact' : ''}`}
    >
      <canvas ref={canvasRef} className="node-network__canvas" />

      {/* Tooltip overlay */}
      {hoveredData && hoveredData.tooltip && (
        <div
          className={`node-network__tooltip${hoveredData ? ' node-network__tooltip--visible' : ''}`}
          style={{
            left: Math.min(tooltipPos.x, (stateRef.current.width || 400) - 160),
            top: Math.max(10, tooltipPos.y),
          }}
        >
          <div className="node-network__tooltip-label">{hoveredData.label}</div>
          <div className="node-network__tooltip-divider" />
          <div className="node-network__tooltip-stat">{hoveredData.tooltip.line1}</div>
          {hoveredData.tooltip.line2 && (
            <div className="node-network__tooltip-stat">{hoveredData.tooltip.line2}</div>
          )}
          {hoveredData.tooltip.badge && (
            <div className="node-network__tooltip-badge">● {hoveredData.tooltip.badge}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default NodeNetwork;
