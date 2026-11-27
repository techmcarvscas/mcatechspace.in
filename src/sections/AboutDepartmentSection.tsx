import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Code2, Layers, ShieldCheck, Smartphone } from 'lucide-react';
import { SiteConfig } from '../types';

interface AboutDepartmentSectionProps {
  config: SiteConfig;
}

const DEFAULT_DEPARTMENT = {
  heading: 'About Our Department',
  subheading: 'Specialized in MERN Stack Web & Mobile Application Development',
  description:
    'Under the School of Computer Studies at RVS College of Arts and Science, the MCA curriculum blends full-stack web creation with mobile application development.',
  extendedDescription:
    'Learners pair MongoDB, Express.js, React, Node.js, and modern mobile architecture with core computer science foundations to ship production software.',
};

const STACK_MATRIX = [
  { tag: 'MERN', name: 'MongoDB', role: 'Data & Modeling' },
  { tag: 'API', name: 'Express & Node', role: 'Server Architecture' },
  { tag: 'WEB', name: 'React UI', role: 'Modern Frontend' },
  { tag: 'APP', name: 'Android / Mobile', role: 'Play Store Apps' },
];

const DEPARTMENT_PILLARS = [
  {
    step: '01',
    title: 'MERN Stack Web Development',
    summary:
      'Training across MongoDB, Express.js, React, and Node.js to build modular full-stack web platforms and RESTful services.',
    icon: Code2,
  },
  {
    step: '02',
    title: 'Mobile Application Development',
    summary:
      'Dedicated specialization in responsive Android and cross-platform mobile apps with clean UI/UX and local persistence.',
    icon: Smartphone,
  },
  {
    step: '03',
    title: 'Studio-Driven Collaboration',
    summary:
      'Faculty-mentored code reviews, agile sprint workflows, Git discipline, and collaborative software design practice.',
    icon: Layers,
  },
  {
    step: '04',
    title: 'Production & Store Readiness',
    summary:
      'End-to-end delivery spanning testing, performance tuning, Google Play policy compliance, and live app publishing.',
    icon: ShieldCheck,
  },
];

export const AboutDepartmentSection: React.FC<AboutDepartmentSectionProps> = ({ config }) => {
  const dept = { ...DEFAULT_DEPARTMENT, ...config.department };

  return (
    <section
      id="department"
      className="relative lg:min-h-[calc(100svh-81px)] flex items-center py-10 sm:py-12 bg-rvscream border-b border-rvsslate/15 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
        {/* Consistent Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-4 border-b border-rvsslate/15"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.18em] text-rvsmaroon whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{config.schoolName} · {config.brandName}</span>
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-rvsslate">
              {dept.heading}
            </h2>
          </div>
          <p className="max-w-xl text-sm text-zinc-700 leading-relaxed">
            {dept.description}
          </p>
        </motion.div>

        {/* Main Balanced Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Specialization Highlight Card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 rounded-2xl bg-rvsslate text-white p-6 sm:p-7 shadow-xl border border-rvsslate flex flex-col justify-between gap-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-block rounded bg-rvsmaroon border border-rvsgold/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-rvsgold">
                  MCA Syllabus Focus
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {config.institutionName.split(' ')[0]} CAS
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                {dept.subheading}
              </h3>

              <p className="text-sm leading-relaxed text-zinc-300">
                {dept.extendedDescription}
              </p>
            </div>

            {/* 2x2 Core Specialization Stack */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rvsgold">
                Core Technical Stack
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {STACK_MATRIX.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="font-mono text-[9px] font-bold text-rvsgold">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-400 truncate">{item.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          {/* Right Column: Structured Department Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {DEPARTMENT_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.step}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-2xl border border-rvsslate/15 bg-white p-5 sm:p-6 shadow-sm hover:border-rvsmaroon/50 hover:shadow-md transition-all flex flex-col justify-between gap-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-rvsmaroon text-rvsgold flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest text-rvsmaroon/75">
                      {pillar.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-rvsslate leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-700">
                      {pillar.summary}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
