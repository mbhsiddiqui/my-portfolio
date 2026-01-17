import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './App.css'
import PillNav from './components/PillNav';
import ReflectiveCard from './components/ReflectiveCard';
import GlassSurface from './components/GlassSurface';
import GlassIcons from './components/GlassIcons';
import assets from './assets/assets';
import ProjectsSection from './Projects/ProjectsSection';
import ExperienceSection from './Experience/ExperienceSection';
import {
  ArrowUp,
  Braces,
  BrainCircuit,
  Check,
  Coffee,
  Cloud,
  Code2,
  Cpu,
  Database,
  Github,
  GitBranch,
  Globe,
  Layers,
  Linkedin,
  LineChart,
  Mail,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  Sigma,
  TestTube,
  Wrench
} from 'lucide-react';

const SECTION_IDS = ['hero', 'skills', 'projects', 'resume'];

function App() {
  const [activeHref, setActiveHref] = useState('#hero');
  const [navDim, setNavDim] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [themeFadeActive, setThemeFadeActive] = useState(false);
  const [themeFadeToDark, setThemeFadeToDark] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem('theme');
    } catch {
      stored = null;
    }
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const emailAddress = 'maaz.haroon@gmail.com';
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailCopiedTarget, setEmailCopiedTarget] = useState<'card' | 'footer' | null>(null);
  const emailTimerRef = useRef<number | null>(null);
  const themeTimerRef = useRef<number | null>(null);
  const themeOverlayRef = useRef<number | null>(null);

  const handleCopyEmail = async (target: 'card' | 'footer') => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(emailAddress);
      setEmailCopied(true);
      setEmailCopiedTarget(target);
      if (emailTimerRef.current) {
        window.clearTimeout(emailTimerRef.current);
      }
      emailTimerRef.current = window.setTimeout(() => {
        setEmailCopied(false);
        setEmailCopiedTarget(null);
      }, 1600);
    } catch {
      // noop
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('theme-dark', isDarkMode);
    document.documentElement.classList.toggle('theme-light', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('perf-mode');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem('theme');
      } catch {
        stored = null;
      }
      if (stored) return;
      setIsDarkMode(event.matches);
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-switching');
      if (themeTimerRef.current) {
        window.clearTimeout(themeTimerRef.current);
      }
      if (themeOverlayRef.current) {
        window.clearTimeout(themeOverlayRef.current);
      }
      setThemeFadeToDark(next);
      setThemeFadeActive(false);
      requestAnimationFrame(() => setThemeFadeActive(true));
      themeOverlayRef.current = window.setTimeout(() => {
        setThemeFadeActive(false);
        themeOverlayRef.current = null;
      }, 800);
      themeTimerRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove('theme-switching');
        themeTimerRef.current = null;
      }, 900);
    }
    window.setTimeout(() => {
      try {
        window.localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // ignore storage errors
      }
      setIsDarkMode(next);
    }, 200);
  };

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));
    if (!elements.length) return;

    const isPhone = window.matchMedia('(max-width: 640px)').matches;
    const isProjectsCollapsing = () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('projects-collapsing');

    const heroElements = elements.filter(el => el.closest('#hero'));
    const otherElements = elements.filter(el => !el.closest('#hero'));

    elements.forEach(el => {
      const type = el.dataset.animate;
      const forceMobileUp = isPhone && el.dataset.mobile === 'up';
      if (type === 'fade-left' && !forceMobileUp) {
        gsap.set(el, { opacity: 0, x: -24, y: 0 });
      } else {
        gsap.set(el, { opacity: 0, y: 24, x: 0 });
      }
    });

    if (!isPhone && heroElements.length) {
      gsap.to(heroElements, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      heroElements.forEach(el => {
        el.dataset.animated = 'true';
      });
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const target = entry.target as HTMLElement;
          if (!entry.isIntersecting || target.dataset.animated === 'true') return;
          const section = target.closest('section');
          if (section?.id === 'resume' && isProjectsCollapsing()) return;

          const skipRatio = isPhone && section?.id === 'resume';
          if (!skipRatio) {
          const ratio = entry.intersectionRect.height / Math.max(1, entry.boundingClientRect.height);
          const threshold = section?.id === 'resume' && window.innerWidth <= 420 ? 0.15 : 0.3;
          if (ratio < threshold) return;
          }

          target.dataset.animated = 'true';
          const type = target.dataset.animate;
          const forceMobileUp = isPhone && target.dataset.mobile === 'up';
          gsap.to(target, {
            opacity: 1,
            x: type === 'fade-left' && !forceMobileUp ? 0 : 0,
            y: type === 'fade-left' && !forceMobileUp ? 0 : 0,
            duration: 0.6,
            ease: 'power2.out'
          });
          observer.unobserve(target);
        });
      },
      { threshold: [0, 0.3], rootMargin: '0px 0px -10% 0px' }
    );

    otherElements.forEach(element => observer.observe(element));
    if (isPhone) {
      heroElements.forEach(element => observer.observe(element));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    let ticking = false;

    const updateActive = () => {
      let currentId = sections[0].id;
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 140) {
          currentId = section.id;
        }
      });
      setActiveHref(`#${currentId}`);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const hero = document.getElementById('hero');
      const profileCard = document.querySelector('.reflective-card');
      const isPhone = window.matchMedia('(max-width: 640px)').matches;

      if (isPhone && profileCard instanceof HTMLElement) {
        const rect = profileCard.getBoundingClientRect();
        setShowScrollTop(rect.bottom < 0);
        ticking = false;
        return;
      }

      if (!hero) {
        setShowScrollTop(window.scrollY > 400);
        ticking = false;
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setShowScrollTop(window.scrollY > heroBottom - 120);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateDim = () => {
      if (isMobileMenuOpen) {
        setNavDim(false);
        ticking = false;
        return;
      }
      setNavDim(window.scrollY > 20);
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateDim);
    };

    updateDim();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (themeTimerRef.current) {
        window.clearTimeout(themeTimerRef.current);
      }
      if (themeOverlayRef.current) {
        window.clearTimeout(themeOverlayRef.current);
      }
    };
  }, []);

  const navItems = [
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Resume', href: '#resume' }
  ];

  const buildEmailIcon = (active: boolean, iconClass: string) => (
    <span className="relative w-4 h-4 transform-gpu">
      <Mail
        size={14}
        className={`absolute inset-0 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
          active ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${iconClass}`}
      />
      <Check
        size={14}
        className={`absolute inset-0 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
          active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } text-white`}
      />
      <span
        className={`email-tooltip absolute -top-8 left-1/2 -translate-x-1/2 rounded-full text-[10px] px-2 py-1 whitespace-nowrap ${
          active ? 'email-tooltip--visible' : ''
        }`}
      >
        Copied
      </span>
    </span>
  );

  const socialItems = [
    // {
    //   label: 'GitHub',
    //   icon: <Github size={14} className="text-white/80" />,
    //   color: 'rgba(255,255,255,0.12)',
    //   href: '#',
    //   customClass: 'w-[2.2em] h-[2.2em]'
    // },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={14} className="text-white/80" />,
      color: 'rgba(255,255,255,0.12)',
      href: 'https://www.linkedin.com/in/mbhsiddiqui/',
      target: '_blank' as const,
      rel: 'noopener noreferrer',
      customClass: 'w-[2.2em] h-[2.2em]'
    },
    {
      label: 'Email',
      icon: buildEmailIcon(emailCopied && emailCopiedTarget === 'card', 'text-white/80'),
      color: emailCopied && emailCopiedTarget === 'card' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.12)',
      isActive: emailCopied && emailCopiedTarget === 'card',
      onClick: () => handleCopyEmail('card'),
      customClass: 'w-[2.2em] h-[2.2em]'
    }
  ];

  const footerSocialItems = [
    {
      label: 'LinkedIn',
      icon: <Linkedin size={14} className="footer-icon" />,
      color: 'rgba(255,255,255,0.2)',
      href: 'https://www.linkedin.com/in/mbhsiddiqui/',
      target: '_blank' as const,
      rel: 'noopener noreferrer',
      customClass: 'w-[2.2em] h-[2.2em]'
    },
    {
      label: 'Email',
      icon: buildEmailIcon(emailCopied && emailCopiedTarget === 'footer', 'footer-icon'),
      color: emailCopied && emailCopiedTarget === 'footer' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.2)',
      isActive: emailCopied && emailCopiedTarget === 'footer',
      onClick: () => handleCopyEmail('footer'),
      customClass: 'w-[2.2em] h-[2.2em]'
    }
  ];

  const skillIconGroups = [
    {
      title: 'Languages',
      items: [
        { label: 'JavaScript', color: '#D4B400', icon: <Braces size={20} className="skill-icon" /> },
        { label: 'Python', color: '#3776AB', icon: <Code2 size={20} className="skill-icon" /> },
        { label: 'Java', color: '#E76F00', icon: <Coffee size={20} className="skill-icon" /> },
        { label: 'C/C++', color: '#8FA0FF', icon: <Cpu size={20} className="skill-icon" /> },
        { label: 'Kotlin', color: '#B18CFF', icon: <Layers size={20} className="skill-icon" /> },
        { label: 'C#', color: '#C074E3', icon: <ShieldCheck size={20} className="skill-icon" /> }
      ]
    },
    {
      title: 'Frameworks',
      items: [
        { label: 'React.js', color: '#3AB6FF', icon: <Globe size={20} className="skill-icon" /> },
        { label: 'Node.js', color: '#3C873A', icon: <Server size={20} className="skill-icon" /> },
        { label: 'Express.js', color: '#9AA3B2', icon: <GitBranch size={20} className="skill-icon" /> },
        { label: 'Angular', color: '#DD1B16', icon: <Monitor size={20} className="skill-icon" /> },
        { label: 'Tailwind CSS', color: '#38BDF8', icon: <Layers size={20} className="skill-icon" /> },
        { label: 'Spring Boot', color: '#6DB33F', icon: <ShieldCheck size={20} className="skill-icon" /> },
        { label: 'Mocha', color: '#C69A6A', icon: <TestTube size={20} className="skill-icon" /> },
        { label: 'JUnit', color: '#25A0D8', icon: <TestTube size={20} className="skill-icon" /> },
        { label: 'TensorFlow', color: '#FF6F00', icon: <BrainCircuit size={20} className="skill-icon" /> },
        { label: 'scikit-learn', color: '#F7931E', icon: <Network size={20} className="skill-icon" /> },
        { label: 'NumPy', color: '#4D77CF', icon: <Sigma size={20} className="skill-icon" /> },
        { label: 'Pandas', color: '#8A6AD9', icon: <LineChart size={20} className="skill-icon" /> },
        { label: 'Maven', color: '#E85A6B', icon: <Wrench size={20} className="skill-icon" /> }
      ]
    },
    {
      title: 'Tools & Platforms',
      items: [
        { label: 'AWS', color: '#FF9900', icon: <Cloud size={20} className="skill-icon" /> },
        { label: 'Docker', color: '#2496ED', icon: <Cpu size={20} className="skill-icon" /> },
        { label: 'Jenkins', color: '#D24939', icon: <Wrench size={20} className="skill-icon" /> },
        { label: 'Git', color: '#F05032', icon: <GitBranch size={20} className="skill-icon" /> },
        { label: 'GitHub Actions', color: '#98A7B8', icon: <Github size={20} className="skill-icon" /> },
        { label: 'Azure DevOps', color: '#0078D4', icon: <Cloud size={20} className="skill-icon" /> },
        { label: 'Kubernetes', color: '#326CE5', icon: <Layers size={20} className="skill-icon" /> },
        { label: 'MongoDB', color: '#47A248', icon: <Database size={20} className="skill-icon" /> },
        { label: 'MySQL', color: '#00758F', icon: <Database size={20} className="skill-icon" /> }
      ]
    }
  ];

  const skillTextGroups = [
    {
      title: 'Concepts',
      items: [
        'OOP',
        'REST APIs',
        'Web Services',
        'CI/CD',
        'Agile Methodologies',
        'MVC',
        'TDD',
        'SDLC',
        'Microservices',
        'Infrastructure as Code',
        'Secure Software Design',
        'Distributed Systems',
        'System Design'
      ]
    }
  ];

  const handleNavClick = (item: { href: string }) => {
    if (!item.href.startsWith('#')) return;
    const id = item.href.replace('#', '');
    const section = document.getElementById(id);
    if (!section) return;
    const offsetTop = section.getBoundingClientRect().top + window.scrollY - 96;
    setActiveHref(item.href);
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  const pageContent = (
    <main className="relative min-h-screen flex flex-col">
      <PillNav 
        items={navItems}
        logo={assets.personalLogo}
        logoHref="#hero"
        initialLoadAnimation
        activeHref={activeHref}
        pillGap="12px"
        dimmed={navDim}
        className={navDim && !isMobileMenuOpen ? 'pill-nav-dimmed' : ''}
        onMobileMenuToggle={setIsMobileMenuOpen}
        baseColor={isDarkMode ? 'rgba(248,248,255,0.85)' : 'rgba(14,13,21,0.92)'}
        pillColor={isDarkMode ? 'rgba(10,14,24,0.8)' : 'rgba(248,248,255,0.78)'}
        pillTextColor={isDarkMode ? '#F8F8FF' : '#0E0D15'}
        hoveredPillTextColor={isDarkMode ? '#0E0D15' : '#F8F8FF'}
        onItemClick={handleNavClick}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
          <div className="relative z-10 px-6 md:px-10 pt-28 pb-16">
            <div className="mx-auto w-full max-w-7xl md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-12 lg:gap-14">
              <aside
                data-animate="fade-left"
                data-mobile="up"
                className="lg:sticky lg:top-28 self-start flex justify-center md:justify-start mb-12 md:mb-0 w-full sm:max-w-[320px] md:max-w-none md:w-[280px] lg:w-[320px] lg:max-w-none xl:w-[380px] xl:max-w-none"
              >
                <div className="w-full h-[460px] sm:h-[520px] md:h-[520px] lg:h-[520px] xl:h-[580px]">
                  <ReflectiveCard
                    className="w-full h-full reflective-card"
                    name="MAAZ"
                    title="SOFTWARE ENGINEER"
                    subtitle="FULL-STACK APPS"
                    statusLabel="OPEN TO NEW GRAD ROLES"
                    locationLabel="LOCATION"
                    locationValue="Toronto, ON"
                    avatarSrc={assets.faviconShadow}
                    overlayColor={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(10,14,24,0.08)'}
                    color={isDarkMode ? 'white' : '#0b1220'}
                    socials={(
                      <GlassIcons
                        items={socialItems}
                        className="grid-cols-2 gap-4 py-0"
                        showLabels={false}
                        labelClassName="hidden sm:block"
                      />
                    )}
                  />
                </div>
              </aside>
              <div className="space-y-24">
                <section id="hero" className="w-full">
                  <div className="grid gap-6">
                    <div data-animate="fade-up">
                      <GlassSurface
                        width="100%"
                        height="auto"
                        borderRadius={32}
                        backgroundOpacity={0.08}
                        className="section-glass"
                      >
                        <div className="w-full h-full p-6 md:p-8 text-left space-y-5">
                          <div className="flex items-center gap-3">
                            <img src={assets.faviconShadow} alt="Maaz favicon" className="w-9 h-9 rounded-full" />
                            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                              Hi, I'm Maaz
                            </p>
                          </div>
                          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                            Aspiring software engineer focused on full-stack apps with thoughtful UX.
                          </h1>
                          <p className="text-base md:text-lg text-white/70 max-w-2xl">
                            I build modern interfaces and reliable backends that ship fast and scale cleanly.
                            My work blends engineering discipline with an eye for clear, human-centered design.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleNavClick({ href: '#projects' })}
                              className="px-5 py-3 rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hero-primary-btn"
                            >
                              View projects
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNavClick({ href: '#resume' })}
                              className="px-5 py-3 rounded-full border border-white/30 text-white font-medium cursor-pointer transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5"
                            >
                              Resume highlights
                            </button>
                          </div>
                        </div>
                      </GlassSurface>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div data-animate="fade-up">
                        <GlassSurface width="100%" height="auto" borderRadius={28} backgroundOpacity={0.08}>
                          <div className="w-full h-full p-6 text-left space-y-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Focus</p>
                            <h2 className="text-2xl font-semibold">Product-minded engineering</h2>
                            <p className="text-sm text-white/70">
                              I enjoy shipping features end-to-end, from UX decisions to backend architecture.
                            </p>
                          </div>
                        </GlassSurface>
                      </div>
                      <div data-animate="fade-up">
                        <GlassSurface width="100%" height="auto" borderRadius={28} backgroundOpacity={0.08}>
                          <div className="w-full h-full p-6 text-left space-y-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Currently</p>
                            <h2 className="text-2xl font-semibold">Open to new grad roles</h2>
                            <p className="text-sm text-white/70">
                              Seeking opportunities in frontend or full-stack development.
                            </p>
                          </div>
                        </GlassSurface>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="skills" className="w-full">
                  <div data-animate="fade-up">
                    <GlassSurface
                      width="100%"
                      height="auto"
                      borderRadius={32}
                      backgroundOpacity={0.08}
                      className="section-glass"
                    >
                      <div className="w-full h-full p-6 md:p-8 text-left space-y-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Skills</p>
                            <h2 className="text-3xl md:text-4xl font-semibold">Toolkit</h2>
                          </div>
                          <p className="text-white/70 max-w-md">
                            Core languages, frameworks, and tools I use to build production-ready products.
                          </p>
                        </div>
                        <div className="space-y-10">
                          {skillIconGroups.map(group => (
                            <div key={group.title} className="space-y-4">
                              <h3 className="text-xl font-semibold">{group.title}</h3>
                              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                {group.items.map(item => (
                                  <div
                                    key={item.label}
                                    className="flex flex-col items-center gap-2 text-center"
                                  >
                                    <span
                                      className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center skill-icon-wrap"
                                      style={{ color: item.color }}
                                    >
                                      {item.icon}
                                    </span>
                                    <span className="text-xs text-white/70">{item.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {skillTextGroups.map(group => (
                            <div key={group.title} className="space-y-4">
                              <h3 className="text-xl font-semibold">{group.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                {group.items.map(item => (
                                  <span
                                    key={item}
                                    className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassSurface>
                  </div>
                </section>

                <ProjectsSection />

                <ExperienceSection />

              </div>
            </div>
          </div>

        <footer id="footer" className="w-full mt-auto">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={0}
            backgroundOpacity={isDarkMode ? 0.04 : 0.26}
            saturation={isDarkMode ? 0.9 : 0.8}
            className="overflow-visible footer-glass"
          >
            <div className="w-full h-full py-5 md:py-6">
              <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center gap-3 text-center">
                <GlassIcons
                  items={footerSocialItems}
                  className="grid-cols-2 gap-4 py-0"
                  showLabels={false}
                  labelPosition="top"
                  labelClassName="hidden sm:block"
                />
                <p className="text-sm text-white/60">
                  Copyright © 2026 Maaz Siddiqui
                </p>
              </div>
            </div>
          </GlassSurface>
        </footer>
    </main>
  );

  return (
    <>
      {/* Background */}
        <div className="lp-bg lp-gradient" />

      {/* Page content */}
      {pageContent}
      <div
        className={`theme-fade-overlay ${themeFadeActive ? 'is-active' : ''}`}
        style={{ ['--theme-fade-color' as string]: themeFadeToDark ? '#0E0D15' : '#F8F8FF' }}
        aria-hidden="true"
      />
      <button
        type="button"
        aria-label="Scroll back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`scroll-top-btn ${showScrollTop ? 'is-visible' : ''}`}
      >
        <ArrowUp size={18} />
      </button>
    </>
  )
}

export default App
