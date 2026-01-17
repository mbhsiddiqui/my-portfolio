import React from 'react';
import { BadgeCheck, GraduationCap } from 'lucide-react';
import GlassSurface from '../components/GlassSurface';

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  stack: string[];
  highlights: string[];
};

const workExperience: ExperienceItem[] = [
  {
    role: 'Software Developer (Co-op)',
    company: 'Air Miles (LoyaltyOne)',
    period: 'Sept 2022 - Dec 2022',
    location: 'Toronto, ON',
    stack: ['Spring Boot', 'JWT', 'AWS', 'Jenkins', 'Splunk'],
    highlights: [
      'Designed and deployed JWT authentication in SpringBoot microservice, increasing customer interaction with offers by 35%.',
      'Enhanced backend API performance by 600 ms using AWS CloudWatch and Splunk.',
      'Automated CI/CD pipelines in Jenkins, reducing release cycles from 3 days to 4 hours.'
    ]
  },
  {
    role: 'Software Developer (Co-op)',
    company: 'Air Miles (LoyaltyOne)',
    period: 'Jan 2022 - Apr 2022',
    location: 'Toronto, ON',
    stack: ['AWS', 'JUnit', 'Mocha', 'Agile'],
    highlights: [
      'Optimized system scalability by 20% through load balancing and auto-scaling mechanisms in AWS.',
      'Developed unit and integration tests in JUnit and Mocha, raising test coverage from 40% to 85%.',
      'Collaborated in Agile sprints, code reviews, and daily stand-ups to deliver features across the SDLC.'
    ]
  },
  {
    role: 'Information Technology Assistant',
    company: 'York University',
    period: 'Sept 2019 - Apr 2022',
    location: 'Toronto, ON',
    stack: ['Zoho HelpDesk', 'SSO', 'LMS'],
    highlights: [
      'Managed 80+ support tickets/month in Zoho HelpDesk, cutting average resolution time from 72h to 24h.',
      'Resolved 2FA, SSO, and LMS access issues for 500+ users, reducing recurring failures by 20 cases per week.',
      'Applied systems analysis to identify recurring issues and recommended preventative IT solutions.'
    ]
  }
];

const tagColors: Record<string, string> = {
  'AWS': '#FF9900',
  'Java': '#E76F00',
  'Spring Boot': '#6DB33F',
  'Jenkins': '#D24939',
  'Splunk': '#2AA8F2',
  'JUnit': '#25A0D8',
  'Mocha': '#C69A6A',
  'Agile': '#7C8DBA',
  'Zoho HelpDesk': '#7C8DBA',
  'SSO': '#2AA8F2',
  'LMS': '#9AA3B2'
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3
    ? normalized.split('').map(ch => ch + ch).join('')
    : normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

const getLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const getTagStyles = (label: string) => {
  const color = tagColors[label];
  const isLightTheme =
    typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light');
  if (!color) {
    return {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: isLightTheme ? '#0E0D15' : 'rgba(248, 248, 255, 0.7)',
      borderColor: 'rgba(255,255,255,0.16)'
    };
  }
  const isLight = getLuminance(color) > 0.55;
  return {
    backgroundColor: `${color}22`,
    color: isLightTheme ? '#0E0D15' : isLight ? '#0E0D15' : '#F8F8FF',
    borderColor: `${color}66`
  };
};

const ExperienceSection: React.FC = () => {
  return (
    <section id="resume" className="w-full">
      <div data-animate="fade-up">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={32}
          backgroundOpacity={0.08}
          className="section-glass"
        >
          <div className="w-full h-full p-6 md:p-8 text-left space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Resume</p>
                <h2 className="text-3xl md:text-4xl font-semibold">Highlights</h2>
              </div>
              <p className="text-white/70 max-w-md">
                Education, certifications, and work experience summarized from my resume.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Education</h3>
                  <p className="text-white/80">
                    Bachelor's of Engineering (B.Eng.) in Software Engineering
                  </p>
                  <p className="text-sm text-white/60">York University • September 2025</p>
                  <p className="text-sm text-white/60">Toronto, ON</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Certifications</h3>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center">
                      <BadgeCheck size={18} className="text-white/80" />
                    </span>
                    <div>
                      <p className="text-white/80">AWS Certified Cloud Practitioner</p>
                      <p className="text-sm text-white/60">2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center">
                      <GraduationCap size={18} className="text-white/80" />
                    </span>
                    <div>
                      <p className="text-white/80">Sololearn.com: C#, SQL, Core Java</p>
                      <p className="text-sm text-white/60">2020 - 2023</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {workExperience.map(role => (
                  <div
                    key={`${role.role}-${role.period}`}
                    className="experience-card rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold">{role.role}</h3>
                        <p className="text-sm text-white/60">{role.company}</p>
                        <p className="text-sm text-white/60">{role.location}</p>
                        <p className="text-sm text-white/60">{role.period}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-white/70">
                      {role.highlights.map(highlight => (
                        <li key={highlight} className="flex gap-2">
                          <span className="text-white/40">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {role.stack.map(item => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full text-xs border inline-flex items-center gap-2"
                          style={getTagStyles(item)}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: tagColors[item] ?? 'rgba(255,255,255,0.4)' }}
                          />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </section>
  );
};

export default ExperienceSection;
