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
  amber: '#efaa34',
  amberRgb: '239, 170, 52',
  warmAmber: '229, 140, 43',
  white: '245, 245, 245',
  midGray: '140, 140, 140',
  dimGray: '80, 80, 80',
  darkGray: '40, 40, 40',
  bg: '#050505',
  nodeFill: 'rgba(12, 12, 12, 0.88)',
  nodeFillHover: 'rgba(20, 18, 12, 0.92)',
  pillBg: 'rgba(14, 14, 14, 0.85)',
  pillBorder: 'rgba(239, 170, 52, 0.12)',
};

// ─── Primary Nodes (Large) ───────────────────
// Positions in normalized 3D space (-1 to 1)
// Arranged on/near sphere surface for orbital look
export const primaryNodes = [
  {
    id: 'ai',
    label: 'AI',
    type: NODE_TYPES.PRIMARY,
    x: -0.62, y: -0.38, z: 0.35,
    icon: 'ai',
    tooltip: { line1: '128 Conversations', line2: '24 Guests', badge: 'Trending Topic' },
  },
  {
    id: 'technology',
    label: 'Technology',
    type: NODE_TYPES.PRIMARY,
    x: 0.12, y: -0.58, z: 0.48,
    icon: 'technology',
    tooltip: { line1: '96 Episodes', line2: '18 Guests', badge: 'Core Theme' },
  },
  {
    id: 'innovation',
    label: 'Innovation',
    type: NODE_TYPES.PRIMARY,
    x: 0.65, y: 0.28, z: -0.18,
    icon: 'innovation',
    tooltip: { line1: '74 Episodes', line2: '15 Guests', badge: 'Hot Topic' },
  },
  {
    id: 'startups',
    label: 'Startups',
    type: NODE_TYPES.PRIMARY,
    x: 0.52, y: -0.52, z: -0.12,
    icon: 'startups',
    tooltip: { line1: '112 Conversations', line2: '32 Founders', badge: 'Most Discussed' },
  },
  {
    id: 'leadership',
    label: 'Leadership',
    type: NODE_TYPES.PRIMARY,
    x: 0.02, y: 0.12, z: 0.72,
    icon: 'leadership',
    tooltip: { line1: '89 Episodes', line2: '12 Founders', badge: 'Growing Category' },
  },
  {
    id: 'business',
    label: 'Business',
    type: NODE_TYPES.PRIMARY,
    x: 0.18, y: 0.68, z: 0.12,
    icon: 'business',
    tooltip: { line1: '68 Episodes', line2: '20 Guests', badge: 'Evergreen' },
  },
  {
    id: 'founders',
    label: 'Founders',
    type: NODE_TYPES.PRIMARY,
    x: -0.58, y: 0.32, z: -0.28,
    icon: 'founders',
    tooltip: { line1: '134 Conversations', line2: '42 Guests', badge: 'Signature Theme' },
  },
  {
    id: 'future',
    label: 'Future',
    type: NODE_TYPES.PRIMARY,
    x: 0.48, y: -0.12, z: 0.52,
    icon: 'future',
    tooltip: { line1: '45 Episodes', line2: '8 Guests', badge: 'Emerging' },
  },
  {
    id: 'conversations',
    label: 'Conversations',
    type: NODE_TYPES.PRIMARY,
    x: -0.32, y: 0.58, z: 0.32,
    icon: 'conversations',
    tooltip: { line1: '150+ Episodes', line2: 'All Guests', badge: 'The Core' },
  },
];

// ─── Secondary Nodes (Smaller) ───────────────
export const secondaryNodes = [
  { id: 'ml', label: 'Machine Learning', type: NODE_TYPES.SECONDARY, x: -0.48, y: -0.58, z: -0.12, icon: 'dot', tooltip: { line1: '32 Episodes' } },
  { id: 'product', label: 'Product', type: NODE_TYPES.SECONDARY, x: 0.38, y: 0.42, z: -0.38, icon: 'dot', tooltip: { line1: '28 Episodes' } },
  { id: 'saas', label: 'SaaS', type: NODE_TYPES.SECONDARY, x: 0.58, y: -0.22, z: -0.32, icon: 'dot', tooltip: { line1: '24 Episodes' } },
  { id: 'funding', label: 'Funding', type: NODE_TYPES.SECONDARY, x: 0.28, y: 0.48, z: -0.52, icon: 'dot', tooltip: { line1: '36 Episodes' } },
  { id: 'storytelling', label: 'Storytelling', type: NODE_TYPES.SECONDARY, x: -0.18, y: 0.38, z: -0.58, icon: 'dot', tooltip: { line1: '22 Episodes' } },
  { id: 'growth', label: 'Growth', type: NODE_TYPES.SECONDARY, x: 0.42, y: 0.58, z: 0.22, icon: 'dot', tooltip: { line1: '41 Episodes' } },
  { id: 'engineering', label: 'Engineering', type: NODE_TYPES.SECONDARY, x: -0.32, y: -0.32, z: -0.52, icon: 'dot', tooltip: { line1: '18 Episodes' } },
  { id: 'creativity', label: 'Creativity', type: NODE_TYPES.SECONDARY, x: -0.52, y: 0.08, z: 0.42, icon: 'dot', tooltip: { line1: '15 Episodes' } },
  { id: 'marketing', label: 'Marketing', type: NODE_TYPES.SECONDARY, x: 0.58, y: 0.52, z: -0.12, icon: 'dot', tooltip: { line1: '19 Episodes' } },
  { id: 'design', label: 'Design', type: NODE_TYPES.SECONDARY, x: -0.22, y: -0.12, z: -0.62, icon: 'dot', tooltip: { line1: '14 Episodes' } },
  { id: 'media', label: 'Media', type: NODE_TYPES.SECONDARY, x: -0.58, y: 0.52, z: -0.18, icon: 'dot', tooltip: { line1: '26 Episodes' } },
  { id: 'strategy', label: 'Strategy', type: NODE_TYPES.SECONDARY, x: 0.32, y: -0.08, z: -0.48, icon: 'dot', tooltip: { line1: '20 Episodes' } },
];

// ─── All nodes combined ──────────────────────
export const allNodes = [...primaryNodes, ...secondaryNodes];

// ─── Intentional Connections ─────────────────
// Each connection tells part of the network story
export const connections = [
  // Core storyline
  { from: 'ai', to: 'technology' },
  { from: 'technology', to: 'innovation' },
  { from: 'innovation', to: 'startups' },
  { from: 'startups', to: 'founders' },
  { from: 'founders', to: 'leadership' },
  { from: 'leadership', to: 'business' },
  { from: 'business', to: 'growth' },
  { from: 'growth', to: 'marketing' },

  // AI branch
  { from: 'ai', to: 'ml' },
  { from: 'ai', to: 'future' },
  { from: 'ai', to: 'engineering' },
  { from: 'ml', to: 'engineering' },

  // Innovation branch
  { from: 'future', to: 'innovation' },
  { from: 'innovation', to: 'engineering' },
  { from: 'innovation', to: 'design' },
  { from: 'innovation', to: 'creativity' },

  // Startup ecosystem
  { from: 'startups', to: 'funding' },
  { from: 'startups', to: 'saas' },
  { from: 'startups', to: 'product' },
  { from: 'saas', to: 'product' },
  { from: 'product', to: 'design' },

  // Leadership and people
  { from: 'founders', to: 'conversations' },
  { from: 'leadership', to: 'strategy' },
  { from: 'business', to: 'strategy' },
  { from: 'strategy', to: 'growth' },

  // Content and media
  { from: 'conversations', to: 'storytelling' },
  { from: 'conversations', to: 'media' },
  { from: 'storytelling', to: 'creativity' },
  { from: 'media', to: 'marketing' },
  { from: 'creativity', to: 'design' },

  // Cross-domain connections (make the web dense)
  { from: 'technology', to: 'startups' },
  { from: 'ai', to: 'leadership' },
  { from: 'future', to: 'business' },
  { from: 'founders', to: 'business' },
  { from: 'technology', to: 'engineering' },
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
  { radiusMult: 1.0, tiltX: 0.25, tiltZ: 0.1, speed: 0.008, opacity: 0.08 },
  { radiusMult: 0.82, tiltX: -0.15, tiltZ: 0.3, speed: -0.006, opacity: 0.05 },
  { radiusMult: 1.15, tiltX: 0.4, tiltZ: -0.2, speed: 0.004, opacity: 0.04 },
];
