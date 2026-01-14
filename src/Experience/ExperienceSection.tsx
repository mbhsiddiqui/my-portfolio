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

const ExperienceSection: React.FC = () => {
  return (
    <section id="resume" className="w-full">
      <div data-animate="fade-up" className="fade-up">
        <GlassSurface width="100%" height="auto" borderRadius={32} backgroundOpacity={0.08}>
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
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
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
          </div>
        </GlassSurface>
      </div>
    </section>
  );
};

export default ExperienceSection;
