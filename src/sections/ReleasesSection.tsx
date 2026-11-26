import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Radio, Tag } from 'lucide-react';
import { ReleaseEntry } from '../types';
import { isValidHttpUrl } from '../utils/validation';

interface ReleasesSectionProps {
  releases: ReleaseEntry[];
}

export const ReleasesSection: React.FC<ReleasesSectionProps> = ({ releases }) => {
  if (!releases || releases.length === 0) {
    return null;
  }

  return (
    <section
      id="releases"
      className="relative py-12 sm:py-16 border-t border-rvsslate/15 bg-rvscream overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="pb-5 mb-6 border-b border-rvsslate/15"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-rvsmaroon">
            <Radio className="w-3.5 h-3.5" />
            Release Feed
          </span>
          <h2 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-rvsslate">
            What&apos;s New in the Lab
          </h2>
        </motion.div>

        <div className="divide-y divide-rvsslate/15 border border-rvsslate/15 rounded-xl bg-white shadow-sm overflow-hidden">
          {releases.map((rel, idx) => (
            <motion.article
              key={rel.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="group relative p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-rvscream-soft transition-colors"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-rvsmaroon scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded bg-rvsgold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rvsslate">
                    <Tag className="w-2.5 h-2.5" />
                    {rel.type}
                  </span>
                  {rel.date && (
                    <span className="text-xs text-zinc-500">{rel.date}</span>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-rvsslate">
                  {rel.appName}{' '}
                  {rel.version && (
                    <span className="text-xs font-semibold text-rvsmaroon ml-1.5">
                      {rel.version}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed max-w-2xl">{rel.summary}</p>
              </div>

              {rel.playStoreUrl && isValidHttpUrl(rel.playStoreUrl) && (
                <a
                  href={rel.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-rvsmaroon px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rvsmaroon-dark shrink-0 self-start md:self-center"
                >
                  <span>View on Play Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-rvsgold" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
