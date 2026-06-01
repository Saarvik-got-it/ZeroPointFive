// ─────────────────────────────────────────────
// Animation Utilities — Pure math functions
// for the node network visualization.
// No React, no DOM — just math.
// ─────────────────────────────────────────────

/** Linear interpolation */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Ease out cubic */
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease in-out cubic */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Smooth step (Hermite interpolation) */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Get perpetual drift offset for a node.
 * Returns { dx, dy } in the range of ±amplitude pixels.
 * Each node uses a unique seed for varied motion.
 */
export function getNodeDrift(time, seed, amplitude = 3.5) {
  const speed1 = 0.4 + (seed % 7) * 0.05;
  const speed2 = 0.3 + (seed % 11) * 0.04;
  const phase1 = seed * 1.37;
  const phase2 = seed * 2.51;

  return {
    dx: Math.sin(time * speed1 + phase1) * amplitude + Math.cos(time * speed2 * 0.7 + phase2) * amplitude * 0.4,
    dy: Math.cos(time * speed2 + phase2) * amplitude * 0.8 + Math.sin(time * speed1 * 0.6 + phase1) * amplitude * 0.3,
  };
}

/**
 * Get the traveling glow position along a connection (0 to 1).
 * Each connection has a unique seed for staggered timing.
 */
export function getConnectionGlowT(time, seed, speed = 0.12) {
  const offset = (seed * 0.618) % 1; // Golden ratio offset for nice distribution
  return ((time * speed + offset) % 1.4) / 1.4; // Slightly >1 so the glow "exits" the line
}

/**
 * Orbital ring rotation angle.
 * Returns angle in radians.
 */
export function getOrbitalAngle(time, speed) {
  return time * speed;
}

/**
 * Signal pulse state.
 * Returns { active, progress, sourceNodeIndex } or null.
 * A pulse fires every interval seconds and lasts for duration seconds.
 */
export function getSignalPulseState(time, interval = 18, duration = 3.5) {
  const cycle = time % interval;
  if (cycle > duration) return null;

  const progress = cycle / duration;
  // Which node to pulse from — cycles through nodes
  const sourceIndex = Math.floor(time / interval) % 9; // 9 primary nodes

  return { active: true, progress, sourceIndex };
}

/**
 * Discovery path state.
 * Returns { active, progress, pathIndex } or null.
 * A discovery flashes every interval seconds, lasting duration seconds.
 */
export function getDiscoveryState(time, interval = 28, duration = 2.5) {
  // Offset from signal pulse to avoid overlap
  const offsetTime = time + 10;
  const cycle = offsetTime % interval;
  if (cycle > duration) return null;

  const progress = cycle / duration;
  const pathIndex = Math.floor(offsetTime / interval) % 6; // 6 discovery paths

  return { active: true, progress, pathIndex };
}

/**
 * Particle drift update.
 * Modifies particle in-place for performance.
 */
export function updateParticle(particle, width, height) {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.pulse += 0.01;

  // Wrap around edges
  if (particle.x < 0) particle.x = width;
  if (particle.x > width) particle.x = 0;
  if (particle.y < 0) particle.y = height;
  if (particle.y > height) particle.y = 0;
}

/**
 * 3D rotation and perspective projection.
 * Takes a node's 3D position and projects to 2D screen coordinates.
 */
export function projectTo2D(node, time, cx, cy, sphereRadius, rotationSpeed = 0.015, tiltX = 0.15) {
  const { x: nx, y: ny, z: nz } = node;

  // Apply node drift in 3D (very subtle)
  const seed = hashString(node.id);
  const drift = getNodeDrift(time, seed, 0.012); // Very small 3D drift
  const x0 = nx + drift.dx * 0.01;
  const y0 = ny + drift.dy * 0.01;
  const z0 = nz;

  // Rotate around Y axis (slow horizontal rotation)
  const rotY = time * rotationSpeed;
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  let x = x0 * cosY + z0 * sinY;
  let z = -x0 * sinY + z0 * cosY;
  let y = y0;

  // Apply fixed tilt around X axis
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);
  const y2 = y * cosX - z * sinX;
  const z2 = y * sinX + z * cosX;
  y = y2;
  z = z2;

  // Perspective projection
  const fov = 2.8;
  const scale = fov / (fov + z);

  // 2D drift (screen-space, for subtle floating feel)
  const screenDrift = getNodeDrift(time, seed + 100, 3.5);

  const screenX = cx + x * sphereRadius * scale + screenDrift.dx;
  const screenY = cy + y * sphereRadius * scale + screenDrift.dy;

  // Depth-based visual properties
  const depthNormalized = clamp((z + 1.2) / 2.4, 0, 1); // 0=far, 1=near

  return {
    id: node.id,
    label: node.label,
    type: node.type,
    icon: node.icon,
    tooltip: node.tooltip,
    screenX,
    screenY,
    scale,
    z,
    depth: depthNormalized,
    opacity: lerp(0.2, 1.0, depthNormalized),
    nodeRadius: node.type === 'primary' ? lerp(16, 26, depthNormalized) : lerp(8, 14, depthNormalized),
    fontSize: node.type === 'primary' ? lerp(10, 13, depthNormalized) : lerp(7.5, 10, depthNormalized),
    glowRadius: node.type === 'primary' ? lerp(8, 22, depthNormalized) : lerp(4, 10, depthNormalized),
  };
}

/** Simple string hash for deterministic seeds */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Distance between two 2D points
 */
export function dist2D(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}
