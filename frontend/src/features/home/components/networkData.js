// ─────────────────────────────────────────────
// Network Data — Node definitions, connections,
// tooltip metadata for the Podcast Universe
// ─────────────────────────────────────────────

export const NODE_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};

// ─── Color tokens (matching site theme) ──────
export const COLORS = {
  amber: '#9AD94A',
  amberRgb: '154, 217, 74',
  warmAmber: '200, 165, 60',
  idleRgb: '100, 100, 100',
  brightRgb: '181, 233, 110',
  white: '245, 245, 245',
  midGray: '140, 140, 140',
  dimGray: '80, 80, 80',
  darkGray: '40, 40, 40',
  bg: '#050505',
  nodeFill: 'rgba(12, 12, 12, 0.88)',
  nodeFillHover: 'rgba(10, 20, 14, 0.94)',
  pillBg: 'rgba(14, 14, 14, 0.85)',
  pillBorder: 'rgba(154, 217, 74, 0.12)',
};

// ─── Primary Nodes (Large) ───────────────────
// STAR-SHAPED arrangement:
// Leadership at the center hub, all others
// radiating outward like points of a star/constellation.
export const primaryNodes = [
  {
    id: 'ai',
    label: 'AI',
    type: NODE_TYPES.PRIMARY,
    x: -0.78, y: -0.52, z: 0.18,
    icon: 'ai',
    tooltip: { line1: '128 Conversations', line2: '24 Guests', badge: 'Trending Topic' },
  },
  {
    id: 'technology',
    label: 'Technology',
    type: NODE_TYPES.PRIMARY,
    x: 0.05, y: -0.88, z: 0.32,
    icon: 'technology',
    tooltip: { line1: '96 Episodes', line2: '18 Guests', badge: 'Core Theme' },
  },
  {
    id: 'startups',
    label: 'Startups',
    type: NODE_TYPES.PRIMARY,
    x: 0.75, y: -0.50, z: -0.08,
    icon: 'startups',
    tooltip: { line1: '112 Conversations', line2: '32 Founders', badge: 'Most Discussed' },
  },
  {
    id: 'future',
    label: 'Future',
    type: NODE_TYPES.PRIMARY,
    x: 0.82, y: 0.18, z: 0.38,
    icon: 'future',
    tooltip: { line1: '45 Episodes', line2: '8 Guests', badge: 'Emerging' },
  },
  {
    id: 'innovation',
    label: 'Innovation',
    type: NODE_TYPES.PRIMARY,
    x: 0.58, y: 0.68, z: -0.18,
    icon: 'innovation',
    tooltip: { line1: '74 Episodes', line2: '15 Guests', badge: 'Hot Topic' },
  },
  {
    id: 'business',
    label: 'Business',
    type: NODE_TYPES.PRIMARY,
    x: -0.08, y: 0.85, z: 0.12,
    icon: 'business',
    tooltip: { line1: '68 Episodes', line2: '20 Guests', badge: 'Evergreen' },
  },
  {
    id: 'conversations',
    label: 'Conversations',
    type: NODE_TYPES.PRIMARY,
    x: -0.68, y: 0.55, z: 0.22,
    icon: 'conversations',
    tooltip: { line1: '150+ Episodes', line2: 'All Guests', badge: 'The Core' },
  },
  {
    id: 'founders',
    label: 'Founders',
    type: NODE_TYPES.PRIMARY,
    x: -0.85, y: 0.05, z: -0.12,
    icon: 'founders',
    tooltip: { line1: '134 Conversations', line2: '42 Guests', badge: 'Signature Theme' },
  },
  {
    id: 'leadership',
    label: 'Leadership',
    type: NODE_TYPES.PRIMARY,
    x: 0.0, y: 0.0, z: 0.68,
    icon: 'leadership',
    tooltip: { line1: '89 Episodes', line2: '12 Founders', badge: 'Growing Category' },
  },
];

// ─── Secondary Nodes (Smaller) ───────────────
// Positioned between the star tips, at moderate distances
export const secondaryNodes = [
  { id: 'ml', label: 'Machine Learning', type: NODE_TYPES.SECONDARY, x: -0.45, y: -0.50, z: -0.18, icon: 'dot', tooltip: { line1: '32 Episodes' } },
  { id: 'product', label: 'Product', type: NODE_TYPES.SECONDARY, x: 0.38, y: 0.38, z: -0.35, icon: 'dot', tooltip: { line1: '28 Episodes' } },
  { id: 'saas', label: 'SaaS', type: NODE_TYPES.SECONDARY, x: 0.55, y: -0.28, z: -0.28, icon: 'dot', tooltip: { line1: '24 Episodes' } },
  { id: 'funding', label: 'Funding', type: NODE_TYPES.SECONDARY, x: 0.32, y: 0.55, z: -0.42, icon: 'dot', tooltip: { line1: '36 Episodes' } },
  { id: 'storytelling', label: 'Storytelling', type: NODE_TYPES.SECONDARY, x: -0.28, y: 0.40, z: -0.48, icon: 'dot', tooltip: { line1: '22 Episodes' } },
  { id: 'growth', label: 'Growth', type: NODE_TYPES.SECONDARY, x: 0.42, y: 0.58, z: 0.18, icon: 'dot', tooltip: { line1: '41 Episodes' } },
  { id: 'engineering', label: 'Engineering', type: NODE_TYPES.SECONDARY, x: -0.38, y: -0.32, z: -0.42, icon: 'dot', tooltip: { line1: '18 Episodes' } },
  { id: 'creativity', label: 'Creativity', type: NODE_TYPES.SECONDARY, x: -0.52, y: 0.22, z: 0.32, icon: 'dot', tooltip: { line1: '15 Episodes' } },
  { id: 'marketing', label: 'Marketing', type: NODE_TYPES.SECONDARY, x: 0.55, y: 0.48, z: -0.10, icon: 'dot', tooltip: { line1: '19 Episodes' } },
  { id: 'design', label: 'Design', type: NODE_TYPES.SECONDARY, x: -0.18, y: -0.22, z: -0.55, icon: 'dot', tooltip: { line1: '14 Episodes' } },
  { id: 'media', label: 'Media', type: NODE_TYPES.SECONDARY, x: -0.52, y: 0.48, z: -0.15, icon: 'dot', tooltip: { line1: '26 Episodes' } },
  { id: 'strategy', label: 'Strategy', type: NODE_TYPES.SECONDARY, x: 0.28, y: -0.18, z: -0.40, icon: 'dot', tooltip: { line1: '20 Episodes' } },
];

// ─── All nodes combined ──────────────────────
export const allNodes = [...primaryNodes, ...secondaryNodes];

// ─── Intentional Connections ─────────────────
// Hub-and-spoke pattern radiating from Leadership (center),
// plus cross-links between the star tips.
export const connections = [
  // Leadership hub → all primary tips
  { from: 'leadership', to: 'ai' },
  { from: 'leadership', to: 'technology' },
  { from: 'leadership', to: 'startups' },
  { from: 'leadership', to: 'future' },
  { from: 'leadership', to: 'innovation' },
  { from: 'leadership', to: 'business' },
  { from: 'leadership', to: 'conversations' },
  { from: 'leadership', to: 'founders' },

  // Star tip cross-links (adjacent tips)
  { from: 'ai', to: 'technology' },
  { from: 'technology', to: 'startups' },
  { from: 'startups', to: 'future' },
  { from: 'future', to: 'innovation' },
  { from: 'innovation', to: 'business' },
  { from: 'business', to: 'conversations' },
  { from: 'conversations', to: 'founders' },
  { from: 'founders', to: 'ai' },

  // Diagonal star cross-links
  { from: 'ai', to: 'innovation' },
  { from: 'technology', to: 'business' },
  { from: 'startups', to: 'conversations' },
  { from: 'future', to: 'founders' },

  // Secondary connections (create the web density)
  { from: 'ai', to: 'ml' },
  { from: 'ai', to: 'engineering' },
  { from: 'ml', to: 'engineering' },
  { from: 'technology', to: 'engineering' },
  { from: 'technology', to: 'saas' },
  { from: 'startups', to: 'saas' },
  { from: 'startups', to: 'funding' },
  { from: 'startups', to: 'product' },
  { from: 'future', to: 'strategy' },
  { from: 'innovation', to: 'design' },
  { from: 'innovation', to: 'creativity' },
  { from: 'innovation', to: 'product' },
  { from: 'business', to: 'growth' },
  { from: 'business', to: 'marketing' },
  { from: 'business', to: 'strategy' },
  { from: 'conversations', to: 'storytelling' },
  { from: 'conversations', to: 'media' },
  { from: 'founders', to: 'creativity' },
  { from: 'growth', to: 'marketing' },
  { from: 'storytelling', to: 'creativity' },
  { from: 'media', to: 'marketing' },
  { from: 'product', to: 'design' },
  { from: 'saas', to: 'product' },
  { from: 'strategy', to: 'growth' },
  { from: 'leadership', to: 'strategy' },
];

// ─── Discovery Paths (hidden connections that flash) ──
export const discoveryPaths = [
  { from: 'ai', to: 'conversations' },
  { from: 'future', to: 'storytelling' },
  { from: 'design', to: 'leadership' },
  { from: 'ml', to: 'startups' },
  { from: 'creativity', to: 'founders' },
  { from: 'engineering', to: 'media' },
];

// ─── Build adjacency map for hover highlighting ──────
export function buildAdjacencyMap(conns) {
  const map = {};
  conns.forEach(({ from, to }) => {
    if (!map[from]) map[from] = new Set();
    if (!map[to]) map[to] = new Set();
    map[from].add(to);
    map[to].add(from);
  });
  return map;
}

// Pre-built adjacency
export const adjacencyMap = buildAdjacencyMap(connections);

// ─── Orbital Ring definitions ────────────────
// Each ring is a tilted circle in 3D space
export const orbitalRings = [
  { radiusMult: 1.05, tiltX: 0.25, tiltZ: 0.1, speed: 0.008, opacity: 0.09 },
  { radiusMult: 0.85, tiltX: -0.15, tiltZ: 0.3, speed: -0.006, opacity: 0.06 },
  { radiusMult: 1.22, tiltX: 0.4, tiltZ: -0.2, speed: 0.004, opacity: 0.045 },
];
