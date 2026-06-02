import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NodeNetwork } from '../features/home/components/NodeNetwork';
import { useInView } from '../hooks/useInView';
import { useScrollState } from '../hooks/useScrollState';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  ExternalLinkIcon,
  LinkedInIcon,
  MenuIcon,
  PlayIcon,
  SpotifyIcon,
  InstagramIcon,
  YouTubeIcon,
} from './icons';
import { AnimatedCounter, RevealBlock, RevealHeading, RevealText, SectionDivider } from './shared';
import {
  asset,
  episodes,
  guests,
  headlineStats,
  journey,
  mentorshipStats,
  partners,
  sections,
  speakingEvents,
  stats,
} from '../data/siteData';

function scrollToId(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function SiteShell() {
  return <HomePage onNavigate={scrollToId} />;
}

function HomePage({ onNavigate }) {
  return (
    <div className="relative min-h-screen" style={{ background: '#050505' }}>
      <div
        className="fixed pointer-events-none z-0"
        aria-hidden="true"
        style={{
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 169, 60, 0.043) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          left: '70vw',
          top: '55vh',
        }}
      />
      <Header onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <SectionDivider />
      <PodcastSection />
      <SectionDivider />
      <GuestsSection />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <JourneySection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SpeakingSection />
      <SectionDivider />
      <PartnersSection />
      <Footer />
    </div>
  );
}

function Header({ onNavigate }) {
  const isScrolled = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled ? 'rgba(5, 5, 5, 0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgb(26, 26, 26)' : 'none',
        padding: isScrolled ? '10px 0' : '20px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <button
          onClick={() => onNavigate('top')}
          className="font-mono text-sm tracking-widest amber-text hover:opacity-80 transition-opacity"
          style={{ letterSpacing: '0.25em' }}
        >
          ZPF
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
            <button
              key={section.label}
              onClick={() => onNavigate(section.href.replace('#', ''))}
              className="font-mono text-[11px] tracking-widest uppercase transition-colors duration-300"
              style={{ color: 'rgb(102, 102, 102)' }}
            >
              {section.label}
            </button>
          ))}
          <Link
            to="/podcasts"
            className="font-mono text-[11px] tracking-widest uppercase transition-colors duration-300"
            style={{ color: 'rgb(102, 102, 102)' }}
          >
            Podcasts
          </Link>
          <button onClick={() => onNavigate('speaking')} className="cin-btn text-[10px]">
            Book
          </button>
        </nav>
        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          style={{ color: 'rgb(153, 153, 153)' }}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>
      {menuOpen ? (
        <div className="md:hidden overflow-hidden" style={{ background: 'rgba(5,5,5,0.98)', borderTop: '1px solid rgb(26, 26, 26)' }}>
          <div className="px-6 py-6 flex flex-col gap-5">
            {sections.map((section) => (
              <button
                key={section.label}
                onClick={() => {
                  onNavigate(section.href.replace('#', ''));
                  setMenuOpen(false);
                }}
                className="font-mono text-[11px] tracking-widest uppercase text-left"
                style={{ color: 'rgb(140, 140, 140)' }}
              >
                {section.label}
              </button>
            ))}
            <Link
              to="/podcasts"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[11px] tracking-widest uppercase text-left"
              style={{ color: 'rgb(140, 140, 140)' }}
            >
              Podcasts
            </Link>
            <button
              onClick={() => {
                onNavigate('speaking');
                setMenuOpen(false);
              }}
              className="cin-btn text-[10px] self-start mt-2"
            >
              Book
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({ onNavigate }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let animationFrameId = 0;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.55,
      }));
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.008;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const alpha = particle.opacity * (0.65 + 0.35 * Math.sin(particle.pulse));
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particle.warm ? `rgba(229,140,43,${alpha})` : `rgba(255,255,255,${alpha * 0.5})`;
        context.fill();
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.strokeStyle = `rgba(229,140,43,${0.045 * (1 - distance / 100)})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ opacity: 0.55 }} />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 0%, rgba(5, 5, 5, 0.55) 55%, rgba(5, 5, 5, 1) 100%)' }}
      />
      {/* Node Network — desktop: absolutely positioned, covering full screen for perfect interactivity */}
      <div
        className="hidden md:block absolute inset-0 z-[5]"
        aria-hidden="true"
      >
        <NodeNetwork onNodeDiscover={(categoryId) => navigate(`/podcasts?category=${categoryId}`)} />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center gap-8 pt-24 pb-16" style={{ minHeight: '100vh', pointerEvents: 'none' }}>
        {/* Left column: Hero text — unchanged content */}
        <div className="hero__text-block">
          <RevealText delay={0.1} ready={ready} className="eyebrow tracking-[0.35em]">
            Zero Point Five Show
          </RevealText>
          <RevealHeading ready={ready}>
            Some truths are only
            <br />
            spoken <span className="amber-text italic amber-glow-text">in the dark.</span>
          </RevealHeading>
          <RevealText delay={0.65} ready={ready} className="max-w-lg text-base md:text-lg leading-relaxed text-pretty" style={{ color: 'rgb(112, 112, 112)' }}>
            The podcast where founders share what they&apos;ve never said before.
          </RevealText>
          <div className="hero__button-group">
            <button onClick={() => onNavigate('podcast')} className="cin-btn">
              Uncover the Story <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
            <a href="https://youtube.com/@ZeroPointFiveShow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase transition-colors duration-300" style={{ color: 'rgb(97, 97, 97)' }}>
              <ExternalLinkIcon className="h-3.5 w-3.5" /> Watch on YouTube
            </a>
          </div>
        </div>
        {/* Compact Node Network — mobile only */}
        <div className="md:hidden w-full" style={{ height: 300, pointerEvents: 'auto' }}>
          <NodeNetwork compact />
        </div>
      </div>
      <button onClick={() => onNavigate('podcast')} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors duration-300 z-10" style={{ color: 'rgb(71, 71, 71)' }}>
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-px" aria-hidden="true" style={{ background: 'linear-gradient(to right, transparent, rgba(229,169,60,0.25), transparent)' }} />
    </section>
  );
}

function PodcastSection() {
  return (
    <section id="podcast" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
      <RevealBlock>
        <p className="eyebrow mb-4">The Show</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1]" style={{ color: 'rgb(245, 245, 245)' }}>
            Conversations that
            <br />
            <span className="amber-text italic">change minds.</span>
          </h2>
          <div className="flex items-center gap-5">
            <a href="https://youtube.com/@ZeroPointFiveShow" target="_blank" rel="noopener noreferrer" className="cin-btn text-[10px]">
              YouTube
            </a>
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="cin-btn text-[10px]">
              Spotify
            </a>
          </div>
        </div>
      </RevealBlock>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgb(26, 26, 26)' }}>
        {episodes.map((episode, index) => (
          <EpisodeCard key={episode.number} episode={episode} index={index} />
        ))}
      </div>
      <RevealBlock delay={0.2}>
        <div className="mt-10 flex justify-center">
          <button className="cin-btn">
            All Episodes <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </RevealBlock>
    </section>
  );
}

function EpisodeCard({ episode, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative overflow-hidden cursor-pointer group bg-black" style={{ minHeight: 420, opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(40px)', transition: `opacity 0.9s ease ${index * 0.12}s, transform 0.9s ease ${index * 0.12}s` }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="absolute inset-0">
        <img src={episode.image} alt={episode.guest} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(0.22) contrast(1.1) saturate(0.5)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(5,5,5) 20%, transparent 70%)' }} />
      </div>
      <div className="absolute top-5 left-5 z-10">
        <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-1" style={{ color: 'rgb(239, 170, 52)', border: '1px solid rgba(239, 170, 52, 0.4)' }}>
          {episode.tag}
        </span>
      </div>
      <div className="absolute top-5 right-5 z-10">
        <span className="font-mono text-[10px] tracking-widest" style={{ color: 'rgb(102, 102, 102)' }}>
          EP. {episode.number}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div style={{ transform: hovered ? 'translateY(-8px)' : 'translateY(0)', transition: 'transform 0.4s ease' }}>
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgb(122, 122, 122)' }}>
            {episode.company}
          </p>
          <h3 className="font-serif text-xl mb-2 leading-snug text-balance" style={{ color: 'rgb(242, 242, 242)' }}>
            {episode.title}
          </h3>
          <p className="text-sm font-medium" style={{ color: 'rgb(239, 170, 52)' }}>
            {episode.guest}
          </p>
        </div>
        {hovered ? (
          <div className="mt-4 flex items-center justify-between transition-all duration-300" style={{ display: 'flex' }}>
            <div className="flex items-center gap-4 font-mono text-[11px]" style={{ color: 'rgb(112, 112, 112)' }}>
              <span>{episode.duration}</span>
              <span>·</span>
              <span>{episode.plays} plays</span>
            </div>
            <button className="flex items-center justify-center w-9 h-9 border transition-all duration-300" style={{ borderColor: 'rgb(239, 170, 52)', color: 'rgb(239, 170, 52)' }}>
              <PlayIcon className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GuestsSection() {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="guests" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
      <div ref={ref} className="mb-12" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(36px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-4 text-balance" style={{ color: 'rgb(245, 245, 245)' }}>
          The minds that
          <br />
          <span className="amber-text italic">built India.</span>
        </h2>
        <p className="text-sm" style={{ color: 'rgb(97, 97, 97)' }}>
          Every guest has a story. Hover to reveal who they are.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgb(20, 20, 20)' }}>
        {guests.map((guest, index) => (
          <GuestCard key={guest.number} guest={guest} index={index} />
        ))}
      </div>
    </section>
  );
}

function GuestCard({ guest, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative overflow-hidden cursor-pointer" style={{ aspectRatio: '3 / 4', opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(32px)', transition: `opacity 0.85s ease ${index * 0.08}s, transform 0.85s ease ${index * 0.08}s` }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={guest.image} alt={guest.name} className="absolute inset-0 w-full h-full object-cover object-center" style={{ filter: hovered ? 'brightness(0.55) contrast(1.1) saturate(0.6)' : 'brightness(0.08) contrast(1.2) saturate(0.3)', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.65s ease, filter 0.65s ease' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 45%, transparent 100%)' }} />
      <div className="absolute top-4 left-4 z-10">
        <span className="font-mono text-[10px] tracking-widest" style={{ color: hovered ? 'rgb(115, 115, 115)' : 'rgb(64, 64, 64)' }}>
          # {guest.number}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10 rounded-full" style={{ width: 6, height: 6, background: 'rgb(239, 170, 52)', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.4)', transition: 'opacity 0.3s ease, transform 0.3s ease' }} />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <h3 className="font-serif leading-tight mb-1 text-balance" style={{ color: 'rgb(240, 240, 240)', opacity: hovered ? 1 : 0.25, transform: hovered ? 'translateY(0)' : 'translateY(8px)', fontSize: hovered ? '1.4rem' : '1.1rem', transition: 'opacity 0.45s ease, transform 0.45s ease, font-size 0.45s ease' }}>
          {guest.company}
        </h3>
        <p className="font-medium text-sm mb-1" style={{ color: 'rgb(239, 170, 52)', opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
          {guest.name}
        </p>
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgb(102, 102, 102)', opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s' }}>
          {guest.role}
        </p>
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ border: '1px solid transparent', boxShadow: hovered ? 'inset 0 0 40px rgba(239, 170, 52, 0.05)' : 'none', transition: 'box-shadow 0.4s ease, border-color 0.4s ease', borderColor: hovered ? 'rgba(239, 170, 52, 0.25)' : 'transparent' }} />
    </div>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="stats" className="py-20 md:py-28 px-6 md:px-10 max-w-7xl mx-auto">
      <RevealBlock>
        <div ref={ref} className="text-center mb-14" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(36px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
          <p className="eyebrow mb-3">By the Numbers</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.1]" style={{ color: 'rgb(245, 245, 245)' }}>
            The reach speaks <span className="amber-text italic">for itself.</span>
          </h2>
        </div>
      </RevealBlock>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgb(20, 20, 20)' }}>
        {stats.map((stat, index) => (
          <RevealBlock key={stat.label} delay={index * 0.1}>
            <div className="flex flex-col items-center py-10 px-6 text-center" style={{ background: '#050505' }}>
              <p className="font-serif text-4xl md:text-5xl font-bold mb-2 amber-text">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: 'rgb(97, 97, 97)' }}>
                {stat.label}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  const lineRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const isVisible = useInView(titleRef, { once: true, margin: '-60px' });

  useEffect(() => {
    const update = () => {
      if (!lineRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const height = rect.height;
      const visibleHeight = Math.min(viewportHeight - rect.top, height);
      const progress = Math.max(0, Math.min(1, visibleHeight / height));
      lineRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <section id="journey" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
      <div ref={titleRef} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(36px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <p className="eyebrow mb-4">The Origin</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-16" style={{ color: 'rgb(245, 245, 245)' }}>
          How we got here.
          <br />
          <span className="amber-text italic">The real story.</span>
        </h2>
      </div>
      <div ref={trackRef} className="relative max-w-2xl">
        <div className="absolute top-0 bottom-0 w-px" style={{ left: 11, background: 'rgb(26, 26, 26)' }} />
        <div ref={lineRef} className="absolute top-0 w-px origin-top" style={{ left: 11, height: '0%', background: 'rgb(239, 170, 52)', boxShadow: '0 0 8px rgba(239, 170, 52, 0.5)', transition: 'height 0.1s linear' }} />
        <div className="flex flex-col gap-12">
          {journey.map((item, index) => (
            <TimelineItem key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="pl-10 relative" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateX(-20px)', transition: `opacity 0.8s ease ${index * 0.05}s, transform 0.8s ease ${index * 0.05}s` }}>
      <div className="absolute left-0 top-1" style={{ width: 11, height: 11, border: '1px solid rgb(239, 170, 52)', background: '#050505', boxShadow: isVisible ? '0 0 12px rgba(239, 170, 52, 0.4)' : 'none', transform: isVisible ? 'scale(1)' : 'scale(0)', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }} />
      <span className="font-mono text-[11px] tracking-widest amber-text mb-2 block">{item.year}</span>
      <h3 className="font-serif text-xl mb-2" style={{ color: 'rgb(235, 235, 235)' }}>
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-pretty" style={{ color: 'rgb(112, 112, 112)' }}>
        {item.desc}
      </p>
    </div>
  );
}

function AboutSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <RevealBlock>
          <div className="relative" style={{ aspectRatio: '3 / 4', maxWidth: 380 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="absolute -inset-px border" style={{ borderColor: 'rgb(31, 31, 31)' }} />
            <div className="absolute -inset-3 border" style={{ borderColor: 'transparent' }} />
            <img src={asset('KLing_fef20073-410f-4297-9a86-7af3c24b7b81.jpg')} alt="Sourabh Chawdhary" className="w-full h-full object-cover absolute inset-0" style={{ filter: 'brightness(0.7) contrast(1.15) saturate(0.7)', opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.02)' : 'none', transition: 'opacity 0.5s ease, transform 0.5s ease' }} />
            <img src={asset('KLing_fd1db442-9313-4a76-b337-e8730c900e28.jpg')} alt="Sourabh Chawdhary speaking" className="w-full h-full object-cover absolute inset-0" style={{ filter: 'brightness(0.75) contrast(1.1) saturate(0.6)', opacity: hovered ? 1 : 0, transform: hovered ? 'none' : 'scale(1.02)', transition: 'opacity 0.5s ease, transform 0.5s ease' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 60%)' }} />
            <div className="absolute bottom-6 left-6 right-6" style={{ opacity: 1 }}>
              <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgb(71, 71, 71)' }}>
                Hover to meet him →
              </p>
            </div>
          </div>
        </RevealBlock>
        <div className="flex flex-col gap-8">
          <RevealBlock>
            <div>
              <p className="eyebrow mb-4">The Host</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-6" style={{ color: 'rgb(245, 245, 245)' }}>
                Sourabh
                <br />
                <span className="amber-text italic">Chawdhary.</span>
              </h2>
              <p className="leading-relaxed text-pretty mb-4" style={{ color: 'rgb(138, 138, 138)' }}>
                Podcast host. Speaker. Builder. He started Zero Point Five because he was tired of the highlight reel — the curated success stories and polished narratives. He wanted the messy middle.
              </p>
              <p className="leading-relaxed text-pretty" style={{ color: 'rgb(112, 112, 112)' }}>
                Three years, 50+ episodes, millions of views later — the mission hasn&apos;t changed. Every conversation is a chance to pull back the curtain on what building something real actually looks like.
              </p>
            </div>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <div className="grid grid-cols-3 gap-px" style={{ background: 'rgb(20, 20, 20)' }}>
              {headlineStats.map((stat) => (
                <div key={stat.label} className="p-5" style={{ background: 'rgb(5, 5, 5)' }}>
                  <p className="font-serif text-3xl amber-text font-bold">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-mono text-[11px] tracking-widest uppercase mt-1" style={{ color: 'rgb(102, 102, 102)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </RevealBlock>
          <RevealBlock delay={0.22}>
            <div className="flex flex-col gap-3">
              {['The story behind the story.', 'Zero to something worth a damn.'].map((line) => (
                <p key={line} className="text-sm flex items-start gap-3" style={{ color: 'rgb(148, 148, 148)' }}>
                  <span className="amber-text mt-1 shrink-0">—</span>
                  {line}
                </p>
              ))}
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

function SpeakingSection() {
  return (
    <section id="speaking" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <RevealBlock>
            <p className="eyebrow mb-4">On Stage</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-6" style={{ color: 'rgb(245, 245, 245)' }}>
              Speaking &
              <br />
              <span className="amber-text italic">Bookings.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-10 text-pretty" style={{ color: 'rgb(112, 112, 112)' }}>
              Sourabh speaks on founder psychology, AI & the future of work, and building companies in chaos. Available for keynotes, panels, and corporate sessions.
            </p>
          </RevealBlock>
          <RevealBlock>
            <div className="flex flex-col">
              {speakingEvents.map((event) => (
                <div key={event.event} className="flex items-start justify-between py-5 group" style={{ borderBottom: '1px solid rgb(20, 20, 20)' }}>
                  <div>
                    <p className="text-sm font-medium transition-colors duration-300" style={{ color: 'rgb(214, 214, 214)' }}>
                      {event.event}
                    </p>
                    <p className="font-mono text-[11px] mt-0.5" style={{ color: 'rgb(97, 97, 97)' }}>
                      {event.org} · {event.location}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] shrink-0 mt-0.5" style={{ color: 'rgb(71, 71, 71)' }}>
                    {event.year}
                  </span>
                </div>
              ))}
            </div>
          </RevealBlock>
          <div>
            <button className="cin-btn mt-10">
              Book Sourabh <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div id="mentorship">
          <RevealBlock delay={0.1}>
            <p className="eyebrow mb-4">AI Mentorship</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-6" style={{ color: 'rgb(245, 245, 245)' }}>
              Build with
              <br />
              <span className="amber-text italic">clarity.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-pretty" style={{ color: 'rgb(112, 112, 112)' }}>
              A 6-week intensive cohort for founders navigating AI integration, product-market fit, and the mental game of building. Limited to 20 founders per cohort.
            </p>
            <div className="grid grid-cols-2 gap-px mb-8" style={{ background: 'rgb(20, 20, 20)' }}>
              {mentorshipStats.map((stat) => (
                <div key={stat.label} className="px-5 py-4" style={{ background: 'rgb(5, 5, 5)' }}>
                  <p className="font-mono text-[11px] tracking-widest uppercase mb-1" style={{ color: 'rgb(87, 87, 87)' }}>
                    {stat.label}
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'rgb(214, 214, 214)' }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <button className="cin-btn">
              Apply Now <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="partners" className="py-16 md:py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <p className="eyebrow text-center mb-10">Trusted By</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {partners.map((partner) => (
            <div key={partner} className="group cursor-default">
              <p className="font-mono text-sm tracking-widest uppercase font-medium transition-colors duration-300" style={{ color: 'rgb(56, 56, 56)' }} onMouseEnter={(event) => {
                event.currentTarget.style.color = 'rgb(239, 170, 52)';
              }} onMouseLeave={(event) => {
                event.currentTarget.style.color = 'rgb(56, 56, 56)';
              }}>
                {partner}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgb(20, 20, 20)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="font-mono text-sm tracking-widest uppercase amber-text mb-1">Zero Point Five Show</p>
          <p className="font-mono text-[11px] tracking-widest" style={{ color: 'rgb(77, 77, 77)' }}>
            Conversations that change minds.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://youtube.com/@ZeroPointFiveShow" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors duration-300" style={{ color: 'rgb(77, 77, 77)' }} onMouseEnter={(event) => {
            event.currentTarget.style.color = 'rgb(239, 170, 52)';
          }} onMouseLeave={(event) => {
            event.currentTarget.style.color = 'rgb(77, 77, 77)';
          }}>
            <YouTubeIcon className="w-4 h-4" />
          </a>
          <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="transition-colors duration-300" style={{ color: 'rgb(77, 77, 77)' }} onMouseEnter={(event) => {
            event.currentTarget.style.color = 'rgb(239, 170, 52)';
          }} onMouseLeave={(event) => {
            event.currentTarget.style.color = 'rgb(77, 77, 77)';
          }}>
            <SpotifyIcon className="w-4 h-4" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors duration-300" style={{ color: 'rgb(77, 77, 77)' }} onMouseEnter={(event) => {
            event.currentTarget.style.color = 'rgb(239, 170, 52)';
          }} onMouseLeave={(event) => {
            event.currentTarget.style.color = 'rgb(77, 77, 77)';
          }}>
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors duration-300" style={{ color: 'rgb(77, 77, 77)' }} onMouseEnter={(event) => {
            event.currentTarget.style.color = 'rgb(239, 170, 52)';
          }} onMouseLeave={(event) => {
            event.currentTarget.style.color = 'rgb(77, 77, 77)' ;
          }}>
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>
        <p className="font-mono text-[11px] tracking-widest" style={{ color: 'rgb(61, 61, 61)' }}>
          © 2025 Sourabh Chawdhary
        </p>
      </div>
    </footer>
  );
}
