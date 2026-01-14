import { useEffect, useRef, useState } from 'react'
import './App.css'
import PillNav from './components/PillNav';
import ReflectiveCard from './components/ReflectiveCard';
import GlassSurface from './components/GlassSurface';
import GlassIcons from './components/GlassIcons';
import ClickSpark from './components/ClickSpark';
import assets from './assets/assets';
import ProjectsSection from './Projects/ProjectsSection';
import ExperienceSection from './Experience/ExperienceSection';
import {
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
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        window.localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-animate]'));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    const revealInView = () => {
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          element.classList.add('is-visible');
        } else {
          observer.observe(element);
        }
      });
    };

    requestAnimationFrame(revealInView);
    return () => observer.disconnect();
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
    let timeoutId: number | null = null;

    const handleScroll = () => {
      setNavDim(true);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => setNavDim(false), 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
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
        className={`absolute inset-0 transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
          active ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${iconClass}`}
      />
      <Check
        size={14}
        className={`absolute inset-0 transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${
          active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } text-white`}
      />
      {active ? (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-black/80 text-white text-[10px] px-2 py-1 whitespace-nowrap">
          Copied
        </span>
      ) : null}
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
      rel: 'noreferrer',
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
      icon: <Linkedin size={14} className="text-black/70" />,
      color: 'rgba(255,255,255,0.2)',
      href: 'https://www.linkedin.com/in/mbhsiddiqui/',
      target: '_blank' as const,
      rel: 'noreferrer',
      customClass: 'w-[2.2em] h-[2.2em]'
    },
    {
      label: 'Email',
      icon: buildEmailIcon(emailCopied && emailCopiedTarget === 'footer', 'text-black/70'),
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
        { label: 'JavaScript', icon: <Braces size={20} className="text-white/80" /> },
        { label: 'Python', icon: <Code2 size={20} className="text-white/80" /> },
        { label: 'Java', icon: <Coffee size={20} className="text-white/80" /> },
        { label: 'C/C++', icon: <Cpu size={20} className="text-white/80" /> },
        { label: 'Kotlin', icon: <Layers size={20} className="text-white/80" /> },
        { label: 'C#', icon: <ShieldCheck size={20} className="text-white/80" /> }
      ]
    },
    {
      title: 'Frameworks',
      items: [
        { label: 'React.js', icon: <Globe size={20} className="text-white/80" /> },
        { label: 'Node.js', icon: <Server size={20} className="text-white/80" /> },
        { label: 'Express.js', icon: <GitBranch size={20} className="text-white/80" /> },
        { label: 'Angular', icon: <Monitor size={20} className="text-white/80" /> },
        { label: 'Tailwind CSS', icon: <Layers size={20} className="text-white/80" /> },
        { label: 'Spring Boot', icon: <ShieldCheck size={20} className="text-white/80" /> },
        { label: 'Mocha', icon: <TestTube size={20} className="text-white/80" /> },
        { label: 'JUnit', icon: <TestTube size={20} className="text-white/80" /> },
        { label: 'TensorFlow', icon: <BrainCircuit size={20} className="text-white/80" /> },
        { label: 'scikit-learn', icon: <Network size={20} className="text-white/80" /> },
        { label: 'NumPy', icon: <Sigma size={20} className="text-white/80" /> },
        { label: 'Pandas', icon: <LineChart size={20} className="text-white/80" /> },
        { label: 'Maven', icon: <Wrench size={20} className="text-white/80" /> }
      ]
    },
    {
      title: 'Tools & Platforms',
      items: [
        { label: 'AWS', icon: <Cloud size={20} className="text-white/80" /> },
        { label: 'Docker', icon: <Cpu size={20} className="text-white/80" /> },
        { label: 'Jenkins', icon: <Wrench size={20} className="text-white/80" /> },
        { label: 'Git', icon: <GitBranch size={20} className="text-white/80" /> },
        { label: 'GitHub Actions', icon: <Github size={20} className="text-white/80" /> },
        { label: 'Azure DevOps', icon: <Cloud size={20} className="text-white/80" /> },
        { label: 'Kubernetes', icon: <Layers size={20} className="text-white/80" /> },
        { label: 'MongoDB', icon: <Database size={20} className="text-white/80" /> },
        { label: 'MySQL', icon: <Database size={20} className="text-white/80" /> }
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

  return (
    <>
      {/* Background */}
        <div className="lp-bg lp-gradient" />

      {/* Page content */}
      <ClickSpark sparkColor={isDarkMode ? '#F8F8FF' : '#0E0D15'}>
        <main className="relative min-h-screen flex flex-col">
          <PillNav 
            items={navItems}
            logo={assets.personalLogo}
            logoHref="#hero"
            initialLoadAnimation
            activeHref={activeHref}
            pillGap="12px"
            dimmed={navDim}
            baseColor="rgba(255,255,255,0.85)"
            pillColor="rgba(10,14,24,0.8)"
            pillTextColor="#f5f8ff"
            hoveredPillTextColor="#0b1220"
            onItemClick={handleNavClick}
            onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />
          <div className="relative z-10 px-6 md:px-10 pt-28 pb-16">
            <div className="mx-auto w-full max-w-7xl lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] gap-12 lg:gap-14">
              <aside
                data-animate="fade-left"
                className="fade-left fade-mobile-up lg:sticky lg:top-28 self-start flex justify-center lg:justify-start mb-12 lg:mb-0"
              >
                <div className="w-full h-[460px] sm:w-[320px] sm:h-[520px] md:w-[340px] md:h-[540px] lg:w-[360px] lg:h-[560px] xl:w-[380px] xl:h-[580px]">
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
                    <div data-animate="fade-up" className="fade-up">
                      <GlassSurface width="100%" height="auto" borderRadius={32} backgroundOpacity={0.08}>
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
                      <div data-animate="fade-up" className="fade-up">
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
                      <div data-animate="fade-up" className="fade-up">
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
                  <div data-animate="fade-up" className="fade-up">
                    <GlassSurface width="100%" height="auto" borderRadius={32} backgroundOpacity={0.08}>
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
                                    <span className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
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
      </ClickSpark>
    </>
  )
}

export default App
