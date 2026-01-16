import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import GlassSurface from '../components/GlassSurface';

type Project = {
  title: string;
  period: string;
  description: string;
  tags: string[];
  featured: boolean;
};

const projects: Project[] = [
  {
    title: 'AI Support Agent',
    period: 'March 2025 - Present',
    description:
      'Built a Python LLM-powered assistant with sub-1s response time, paired with a React UI optimized for multi-device usage and rapid iteration.',
    tags: ['Python', 'React.js', 'Tailwind CSS'],
    featured: true
  },
  {
    title: 'Metal 3D Printing Simulator',
    period: 'Sept 2024 - Apr 2025',
    description:
      'Led an Agile team to build a defect-prediction simulator that achieved under 5% error rate vs ANSYS benchmarks and reduced training time by half.',
    tags: ['Python', 'Git'],
    featured: true
  },
  {
    title: 'Auction System',
    period: 'Jan 2024 - Apr 2024',
    description:
      'Built a full-stack e-commerce platform using MVC and TDD, improving reliability with automated endpoint testing and Docker-driven CI workflows.',
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    featured: false
  },
  {
    title: 'Secure Chat System',
    period: 'Sept 2022 - Dec 2022',
    description:
      'Designed a secure client-server chat system with user authentication, key exchange, encryption, and replay-attack protection.',
    tags: ['Python'],
    featured: false
  }
];

const ProjectsSection: React.FC = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingCollapse, setPendingCollapse] = useState(false);
  const gridWrapRef = useRef<HTMLDivElement | null>(null);
  const expandFromHeightRef = useRef<number | null>(null);
  const collapsedHeightRef = useRef<number | null>(null);
  const extraCardRefs = useRef<HTMLElement[]>([]);
  const scrollTimeoutRef = useRef<number | null>(null);
  const featuredProjects = projects.filter(project => project.featured);
  const visibleProjects = showAllProjects ? projects : featuredProjects;
  const showToggleButton = projects.length > featuredProjects.length;
  extraCardRefs.current = [];

  useLayoutEffect(() => {
    const wrap = gridWrapRef.current;
    if (!wrap) return;
    if (!showAllProjects) {
      collapsedHeightRef.current = wrap.scrollHeight;
      return;
    }

    const fromHeight = expandFromHeightRef.current;
    const toHeight = wrap.scrollHeight;

    if (fromHeight !== null) {
      wrap.style.height = `${fromHeight}px`;
      gsap.to(wrap, {
        height: toHeight,
        duration: 0.8,
        ease: 'power1.out',
        onComplete: () => {
          wrap.style.height = '';
        }
      });
      expandFromHeightRef.current = null;
    }

    const extras = extraCardRefs.current;
    if (extras.length) {
      const tl = gsap.timeline();
      tl.fromTo(
        extras,
        { scale: 0.3, opacity: 0 },
        {
          scale: 1.04,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
          stagger: { each: 0.12 },
          delay: 0.08,
          overwrite: 'auto'
        }
      ).to(
        extras,
        {
          scale: 1,
          duration: 0.22,
          ease: 'power1.out',
          stagger: { each: 0.05 },
          overwrite: 'auto'
        },
        '-=0.12'
      );
    }
  }, [showAllProjects, pendingCollapse]);

  const handleToggle = () => {
    if (isAnimating) return;
    const wrap = gridWrapRef.current;

    if (!showAllProjects) {
      if (wrap) {
        expandFromHeightRef.current = wrap.offsetHeight;
      }
      setShowAllProjects(true);
      return;
    }

    setIsAnimating(true);
    const extras = extraCardRefs.current;

    if (wrap) {
      const section = wrap.closest<HTMLElement>('section');
      const anchorTop = section
        ? section.getBoundingClientRect().top + window.scrollY - 96
        : null;
      const fromHeight = wrap.offsetHeight;
      const toHeight = collapsedHeightRef.current ?? fromHeight;
      let scrollTriggered = false;

      wrap.style.height = `${fromHeight}px`;
      setPendingCollapse(true);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('projects-collapsing');
      }

      gsap.to(wrap, {
        height: toHeight,
        duration: 0.6,
        ease: 'power1.out',
        onUpdate: () => {
          if (scrollTriggered || anchorTop === null) return;
          if ((gsap.getProperty(wrap, 'height') as number) <= fromHeight * 0.82) {
            scrollTriggered = true;
            if (scrollTimeoutRef.current) {
              window.clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = window.setTimeout(() => {
              window.scrollTo({ top: anchorTop, behavior: 'smooth' });
            }, 90);
          }
        },
        onComplete: () => {
          setShowAllProjects(false);
          requestAnimationFrame(() => {
            wrap.style.height = '';
            setPendingCollapse(false);
            setIsAnimating(false);
            if (typeof document !== 'undefined') {
              document.documentElement.classList.remove('projects-collapsing');
            }
          });
        }
      });
    }

    if (extras.length) {
      gsap.killTweensOf(extras);
      gsap.to(extras, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power1.out',
        stagger: { each: 0.12, from: 'end' },
        overwrite: 'auto'
      });
    }
  };

  return (
    <section id="projects" className="w-full">
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
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">SHIPPED</p>
                <h2 className="text-3xl md:text-4xl font-semibold">Projects</h2>
              </div>
              <p className="text-white/70 max-w-md">
                Highlighted builds plus a few extra projects that show my range.
              </p>
            </div>
            <div
              ref={gridWrapRef}
              className={`projects-grid-wrap ${isAnimating ? 'is-collapsing' : ''} ${
                pendingCollapse ? 'is-pending' : ''
              }`}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {visibleProjects.map(project => (
                  <article
                    key={project.title}
                    ref={el => {
                      if (!project.featured && el) {
                        extraCardRefs.current.push(el);
                      }
                    }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
                  >
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-xs text-white/50 mt-1">{project.period}</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{project.description}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* <a
                    href={project.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View repository
                    <span aria-hidden="true">→</span>
                  </a> */}
                  </article>
                ))}
              </div>
            </div>
            {showToggleButton && (
              <div>
                <button
                  className="projects-toggle-btn px-5 py-3 rounded-full border border-white/30 text-white font-medium cursor-pointer transition-colors duration-300"
                  onClick={handleToggle}
                  disabled={isAnimating}
                >
                  {showAllProjects ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>
        </GlassSurface>
      </div>
    </section>
  );
};

export default ProjectsSection;
