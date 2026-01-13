import React, { useState } from 'react';
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
  const featuredProjects = projects.filter(project => project.featured);
  const visibleProjects = showAllProjects ? projects : featuredProjects;
  const showToggleButton = projects.length > featuredProjects.length;

  return (
    <section id="projects" className="w-full">
      <div data-animate="fade-up" className="fade-up">
        <GlassSurface width="100%" height="auto" borderRadius={32} backgroundOpacity={0.08}>
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
            <div className="grid gap-6 lg:grid-cols-2">
              {visibleProjects.map(project => (
                <article
                  key={project.title}
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
            {showToggleButton && (
              <div>
                <button
                  className="px-5 py-3 rounded-full border border-white/30 text-white font-medium cursor-pointer transition-colors duration-300 hover:bg-white/10"
                  onClick={() => setShowAllProjects(prev => !prev)}
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
