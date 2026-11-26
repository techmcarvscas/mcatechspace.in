import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ChevronRight } from 'lucide-react';
import { AppEntry, SiteConfig } from '../types';
import { HeroFlowCanvas } from '../components/HeroFlowCanvas';

interface HeroSectionProps {
  config: SiteConfig;
  publishedApps: AppEntry[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, publishedApps }) => {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between pt-[80px] sm:pt-[90px] hero-contour-bg text-white border-b-4 border-rvsgold overflow-hidden"
    >
                    <div className="relative z-10 flex-1 flex items-center mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
                        {/* Left Editorial Column */}
                        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="border-l-4 border-rvsgold pl-3.5 py-0.5"
                          >
                            <span className="block text-[11px] sm:text-xs font-bold tracking-[0.18em] text-rvsgold uppercase">
                              {config.schoolName} · Student App Showcase
                            </span>
                          </motion.div>

                          <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                            className="font-display text-4xl sm:text-5xl md:text-[3.35rem] xl:text-[4rem] font-bold tracking-[-0.03em] leading-[0.98] text-white"
                          >
                            {config.hero.headlineLines.map((line, idx) => {
                              const isLast = idx === config.hero.headlineLines.length - 1;
                              return (
                                <span
                                  key={`${line}-${idx}`}
                                  className={`block ${isLast ? 'text-rvsgold' : 'text-white'}`}
                                >
                                  {line}
                                </span>
                          );
              })}
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.1 }}
                          className="max-w-xl text-sm sm:text-base leading-relaxed text-zinc-200"
                        >
                          {config.hero.description}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: 0.15 }}
                          className="flex flex-wrap items-center gap-3 pt-1"
                        >
                          <a
                            href="#apps"
                            className="group inline-flex items-center gap-2 rounded-md bg-rvsgold px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.08em] text-rvsslate hover:bg-rvsgold-dim transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <span>{config.hero.primaryCtaLabel}</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>

                            <a
                              href="#lab"
                              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-rvsslate-dark/70 px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-rvsgold hover:text-rvsgold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
                            >
                              <span>{config.hero.secondaryCtaLabel}</span>
                              <ChevronRight className="w-4 h-4 text-rvsgold" />
                            </a>
                          </motion.div>
                      </div>

                  {/* Right Column: Interactive 3D Mobile App Showcase (hidden on mobile/tablet so 1st screen shows hero wordings cleanly without a cut-off phone) */}
                  <div className="lg:col-span-6 hidden lg:flex justify-center">
                    <HeroFlowCanvas publishedApps={publishedApps} />
                  </div>
              </div>
            </div>

              {/* Institutional Metadata Strip in Official RVS Maroon */}
              <div className="relative z-10 border-t border-rvsgold/30 bg-rvsmaroon">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
                    {[
                      { label: 'INSTITUTION', value: config.institutionName },
                      { label: 'ACADEMIC DIVISION', value: config.schoolName },
                      { label: 'DEPARTMENT', value: config.departmentName },
                      { label: 'DISTRIBUTION PLATFORM', value: 'Google Play Store' },
                    ].map((cell) => (
                      <div key={cell.label} className="py-2.5 sm:py-3 px-2 sm:px-4 lg:first:pl-0 lg:last:pr-0">
                        <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-rvsgold font-semibold truncate">
                          {cell.label}
                        </p>
                        <p className="mt-0.5 text-[11px] sm:text-xs font-semibold text-white truncate">
                          {cell.value}
                        </p>
                      </div>
            ))}
                </div>
              </div>
            </div>

          <div className="sr-only">
            <a href="#apps">
              <ArrowDown className="w-4 h-4" />
              Scroll to Applications
            </a>
          </div>
        </section>
        );
};
