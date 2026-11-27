import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Compass, Eye, Target } from 'lucide-react';
import { SiteConfig } from '../types';

interface VisionMissionSectionProps {
  config: SiteConfig;
}

const DEFAULT_VISION_MISSION = {
  vision: 'Quality Education for Digital Era.',
  visionDetail:
    'To advance the School of Computer Studies and the Department of MCA as a premier center of excellence in MERN stack web architecture, mobile application development, and applied computing innovation.',
  mission:
    'To impart a need-based quality education through a comprehensive curriculum by adopting apt technologies and progressive teaching, learning, and research processes.',
  missionCommitments: [
    'Industry-aligned MCA syllabus grounded in the MERN Stack (MongoDB, Express.js, React, Node.js) and mobile application development.',
    'Project-driven studio training connecting RESTful backend architectures with responsive web and Android client experiences.',
    'Disciplined development practices emphasizing software architecture, usability testing, and live Google Play deployment.',
  ],
};

export const VisionMissionSection: React.FC<VisionMissionSectionProps> = ({ config }) => {
  const vision = config.department?.vision ?? DEFAULT_VISION_MISSION.vision;
  const visionDetail = config.department?.visionDetail ?? DEFAULT_VISION_MISSION.visionDetail;
  const mission = config.department?.mission ?? DEFAULT_VISION_MISSION.mission;
  const commitments =
    config.department?.missionCommitments && config.department.missionCommitments.length > 0
      ? config.department.missionCommitments
      : DEFAULT_VISION_MISSION.missionCommitments;

  return (
    <section
      id="vision-mission"
      className="relative lg:min-h-[calc(100svh-81px)] flex items-center py-10 sm:py-12 bg-white border-b border-rvsslate/15 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-4 border-b border-rvsslate/15"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.06em] sm:tracking-[0.18em] text-rvsmaroon whitespace-nowrap">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Institutional Direction · {config.brandName}</span>
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-rvsslate">
              Vision &amp; Mission
            </h2>
          </div>
          <p className="max-w-xl text-sm text-zinc-700 leading-relaxed">
            Guided by the academic charter of {config.institutionName}, shaping disciplined technologists for the modern digital ecosystem.
          </p>
        </motion.div>

        {/* Two Dedicated Vision & Mission Feature Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Vision Card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 rounded-2xl bg-rvsslate text-white p-6 shadow-xl border border-rvsslate flex flex-col justify-between gap-4"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-rvsmaroon text-rvsgold flex items-center justify-center shadow-md border border-rvsgold/30">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-rvsgold">
                  01 · Direction
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Our Vision
                </h3>
                <blockquote className="mt-2.5 font-display text-lg sm:text-xl font-bold text-rvsgold leading-snug">
                  &ldquo;{vision}&rdquo;
                </blockquote>
              </div>

              <p className="text-sm leading-relaxed text-zinc-300">
                {visionDetail}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {config.schoolName} · {config.departmentName}
            </div>
          </motion.article>

          {/* Mission Card */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-7 rounded-2xl bg-rvscream-soft text-rvsslate p-6 shadow-sm border border-rvsslate/15 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-rvsgold text-rvsslate flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-rvsmaroon">
                  02 · Commitment
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-rvsslate">
                  Our Mission
                </h3>
                <p className="mt-2 text-sm sm:text-base font-semibold text-rvsmaroon leading-relaxed">
                  {mission}
                </p>
              </div>

              <div className="pt-1 space-y-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Core Educational Pillars
                </p>
                <ul className="space-y-2">
                  {commitments.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-rvsmaroon shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};
