import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SiteConfig } from '../types';

interface FinalCtaSectionProps {
  config: SiteConfig;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ config }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ['-2%', '3%']);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 sm:py-16 overflow-hidden maroon-wave-bg text-white border-t-4 border-rvsgold"
    >
      {/* Scroll-Driven Subtle Typographic Watermark (Sized cleanly so DEPT is fully visible) */}
      <motion.div
        aria-hidden="true"
        style={{ x: watermarkX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-[0.06] select-none"
      >
        <span className="font-display text-[clamp(2.25rem,7vw,5.75rem)] font-extrabold uppercase tracking-[0.12em] text-white whitespace-nowrap">
          {config.brandName} · RVS CAS · MCA
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          <div className="max-w-2xl space-y-3">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-rvsgold">
              {config.brandName} · {config.schoolName}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.06]">
              {config.finalCta.headline}
            </h2>
            <p className="text-sm sm:text-base text-rvscream/90 leading-relaxed">
              {config.finalCta.description}
            </p>
          </div>

          <div className="shrink-0">
            <motion.a
              href="#apps"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2.5 rounded-md bg-rvsgold px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.08em] text-rvsslate hover:bg-rvsgold-dim transition-colors shadow-lg"
            >
              <span>{config.finalCta.ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
