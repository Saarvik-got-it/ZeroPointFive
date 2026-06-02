// ─────────────────────────────────────────────────────────
// ConversationTrails — Knowledge graph exploration
// Horizontal node chains showing connected ideas across
// conversations, with staggered reveal animations.
// ─────────────────────────────────────────────────────────

import { useRef } from 'react';
import { motion } from 'motion/react';
import { useInView } from '@/hooks/useInView';
import { conversationTrails } from '@/features/podcasts/data/podcastsData';

// ── Single trail row ──────────────────────────────────────
function Trail({ trail, index }) {
  const trailRef = useRef(null);
  const isVisible = useInView(trailRef, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={trailRef}
      className="conv-trail"
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
    >
      <div className="conv-trail__label">
        <span>{trail.title}</span>
        <span className="conv-trail__count">{trail.episodeCount} episodes</span>
      </div>

      <div className="conv-trail__nodes">
        {trail.nodes.map((node, i) => (
          <span key={`${trail.id}-node-${i}`}>
            <span className={`conv-trail__node conv-trail__node--${node.type}`}>
              {node.label}
            </span>
            {i < trail.nodes.length - 1 && (
              <span className="conv-trail__connector">→</span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────
export default function ConversationTrails() {
  const sectionRef = useRef(null);
  const isVisible = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className={`conv-trails hub-section hub-reveal${isVisible ? ' hub-reveal--visible' : ''}`}
    >
      <div className="conv-trails__header">
        <h2 className="conv-trails__title">Follow the Thread</h2>
        <p className="conv-trails__subtitle">
          Explore connected ideas across conversations
        </p>
      </div>

      <div className="conv-trails__list">
        {conversationTrails.map((trail, index) => (
          <Trail key={trail.id} trail={trail} index={index} />
        ))}
      </div>
    </section>
  );
}
