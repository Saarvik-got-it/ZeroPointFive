// ─────────────────────────────────────────────────────────
// IntelligencePulse — Signature visual element
// A glowing amber pulse with guest quotes that drift
// outward like signals from a knowledge network.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hoverReveals } from '@/features/podcasts/data/podcastsData';

const RING_COUNT = 3;

// Pre-computed quote pool — short enough to float elegantly
const QUOTE_POOL = [
  { quote: 'Nobody tells you about the 147 rejections before the first yes.', guest: 'Ritesh Agarwal' },
  { quote: 'AI will not replace humans. But humans using AI will replace humans not using AI.', guest: 'Sridhar Vembu' },
  { quote: 'Build in silence. Let your product make the noise.', guest: 'Kunal Shah' },
  { quote: 'Investors don\'t fund ideas. They fund inevitability.', guest: 'David Park' },
  { quote: 'Culture isn\'t what you write on the wall. It\'s what happens when the CEO leaves the room.', guest: 'Maria Garcia' },
  { quote: 'Your product is the best salesperson you\'ll ever hire.', guest: 'Sarah Williams' },
  { quote: 'Crisis reveals character. It doesn\'t build it.', guest: 'Deepinder Goyal' },
  { quote: 'India doesn\'t need to copy Silicon Valley. India needs to solve India.', guest: 'Bhavish Aggarwal' },
  { quote: 'The first 100 days define the next 10 years.', guest: 'Ritesh Agarwal' },
  { quote: 'Design thinking is just empathy with a deadline.', guest: 'Alex Turner' },
  { quote: 'AGI is coming. But not the way most people think.', guest: 'Dr. Priya Sharma' },
  { quote: 'Bootstrapping forces clarity. VC money can buy confusion.', guest: 'Sridhar Vembu' },
  { quote: 'A good pitch, like a good joke, is all about timing.', guest: 'Biswa Kalyan Rath' },
  { quote: 'Music is the original algorithm. Pattern, repetition, surprise.', guest: 'A.R. Rahman' },
  { quote: 'The brain-computer interface is the last interface.', guest: 'Dr. Neural Park' },
  { quote: 'Leadership is the loneliest job nobody warns you about.', guest: 'Kunal Shah' },
];

// 6 positions: 3 left, 3 right — staggered vertically
const SLOT_POSITIONS = [
  // Left side — positioned relative to center
  { side: 'left',  x: -68, y: -50 },
  { side: 'left',  x: -72, y:   0 },
  { side: 'left',  x: -65, y:  50 },
  // Right side
  { side: 'right', x:  68, y: -50 },
  { side: 'right', x:  72, y:   0 },
  { side: 'right', x:  65, y:  50 },
];

const CYCLE_DURATION = 5000; // ms per quote cycle
const STAGGER_OFFSET = 1200; // ms between each slot's cycle

export default function IntelligencePulse({ activeCategory, isPlaying }) {
  const ringSpeed = isPlaying ? '3s' : '4s';

  const statText = useMemo(() => {
    if (activeCategory === 'all') return { count: '156', label: 'conversations' };
    const map = {
      ai: { count: '128', label: 'AI conversations' },
      startups: { count: '112', label: 'startup stories' },
      technology: { count: '96', label: 'tech discussions' },
      leadership: { count: '89', label: 'leadership insights' },
      business: { count: '68', label: 'business dialogues' },
      innovation: { count: '74', label: 'innovation threads' },
      founders: { count: '134', label: 'founder journeys' },
      future: { count: '45', label: 'future visions' },
    };
    return map[activeCategory] || { count: '156', label: 'conversations' };
  }, [activeCategory]);

  // ── Flowing quotes state ────────────────────────────────
  // Each slot independently cycles through quotes with staggered timing
  const [slotQuotes, setSlotQuotes] = useState(() =>
    SLOT_POSITIONS.map((_, i) => ({
      ...QUOTE_POOL[i % QUOTE_POOL.length],
      key: i,
    }))
  );

  useEffect(() => {
    // Each slot gets its own interval, staggered
    const timers = SLOT_POSITIONS.map((_, slotIndex) => {
      const initialDelay = slotIndex * STAGGER_OFFSET;
      let counter = slotIndex;

      const startCycle = () => {
        return setInterval(() => {
          counter += SLOT_POSITIONS.length;
          const quoteIndex = counter % QUOTE_POOL.length;
          setSlotQuotes(prev => {
            const next = [...prev];
            next[slotIndex] = {
              ...QUOTE_POOL[quoteIndex],
              key: counter, // unique key forces AnimatePresence re-mount
            };
            return next;
          });
        }, CYCLE_DURATION);
      };

      // Stagger the start
      const delayTimer = setTimeout(() => {
        timers[slotIndex] = startCycle();
      }, initialDelay);

      return delayTimer;
    });

    return () => timers.forEach(t => {
      clearTimeout(t);
      clearInterval(t);
    });
  }, []);

  return (
    <motion.section
      className="intelligence-pulse hub-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      aria-label="Intelligence network pulse"
    >
      {/* ── Quote field — fills the width, quotes float around the core ── */}
      <div className="ip-quote-field">

        {/* Left quotes */}
        <div className="ip-quote-field__side ip-quote-field__side--left">
          {SLOT_POSITIONS.slice(0, 3).map((slot, i) => (
            <div
              key={i}
              className="ip-quote-slot"
              style={{ transform: `translateY(${slot.y}px)` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slotQuotes[i].key}
                  className="ip-quote"
                  initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -12, filter: 'blur(3px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ip-quote__text">{slotQuotes[i].quote}</span>
                  <span className="ip-quote__guest">— {slotQuotes[i].guest}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Core */}
        <div className="intelligence-pulse__core">
          {Array.from({ length: RING_COUNT }, (_, i) => (
            <div
              key={i}
              className="intelligence-pulse__ring"
              style={{
                animationDuration: ringSpeed,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
          <div
            className="intelligence-pulse__dot"
            style={{ animationDuration: isPlaying ? '1.5s' : '3s' }}
          />
        </div>

        {/* Right quotes */}
        <div className="ip-quote-field__side ip-quote-field__side--right">
          {SLOT_POSITIONS.slice(3, 6).map((slot, i) => (
            <div
              key={i}
              className="ip-quote-slot"
              style={{ transform: `translateY(${slot.y}px)` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slotQuotes[i + 3].key}
                  className="ip-quote"
                  initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 12, filter: 'blur(3px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ip-quote__text">{slotQuotes[i + 3].quote}</span>
                  <span className="ip-quote__guest">— {slotQuotes[i + 3].guest}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="intelligence-pulse__label">
        The Conversation Network
      </div>
      <div className="intelligence-pulse__stat">
        <strong>{statText.count}</strong> {statText.label} · <strong>47</strong> founders · <strong>9</strong> domains
      </div>
    </motion.section>
  );
}
