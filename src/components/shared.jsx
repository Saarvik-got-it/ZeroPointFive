import { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';

export function SectionDivider() {
  return <div aria-hidden="true" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgb(26, 26, 26), transparent)', margin: '0 2.5rem' }} />;
}

export function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(36px)', transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s` }}
    >
      {children}
    </div>
  );
}

export function RevealText({ children, delay = 0, ready, className = '', style }) {
  return (
    <div
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function RevealHeading({ children, ready }) {
  return (
    <h1
      className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance"
      style={{
        color: 'rgb(245, 245, 245)',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
      }}
    >
      {children}
    </h1>
  );
}

export function AnimatedCounter({ end, suffix = '' }) {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-40px' });
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current || end <= 0) return undefined;
    started.current = true;

    let value = 0;
    const increment = end / (1800 / 16);
    let animationFrameId = 0;

    const tick = () => {
      value += increment;
      if (value >= end) {
        if (ref.current) ref.current.textContent = `${end.toLocaleString()}${suffix}`;
        return;
      }
      if (ref.current) ref.current.textContent = `${Math.floor(value).toLocaleString()}${suffix}`;
      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, isVisible, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
