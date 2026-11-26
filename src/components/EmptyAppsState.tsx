import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Smartphone } from 'lucide-react';

const UPCOMING_TRACKS = [
  { code: '01', track: 'Productivity', scope: 'Campus workflow & academic utility tools' },
  { code: '02', track: 'Education', scope: 'Interactive learning & reference companions' },
  { code: '03', track: 'Utility', scope: 'Focused everyday Android problem-solvers' },
  { code: '04', track: 'AI & Innovation', scope: 'Applied intelligent & assistive mobile tools' },
];

export const EmptyAppsState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="rounded-lg border border-rvsslate/15 bg-white shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rvsslate/15">
        {/* Left Launch Notice */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded bg-rvsmaroon px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-rvsgold" />
              Release Queue Active
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-rvsslate">
              THE FIRST LAUNCH IS LOADING.
            </h3>

            <p className="text-sm sm:text-base leading-relaxed text-zinc-600 max-w-xl">
              New applications are currently being developed. Stay tuned for our next launch.
            </p>
          </div>

          <div className="pt-4 border-t border-rvsslate/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-600">
            <span className="inline-flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-rvsmaroon" />
              Platform: Android (Google Play Store)
            </span>
            <span className="inline-flex items-center gap-2">
              <Layers className="w-4 h-4 text-rvsmaroon" />
              School of Computer Studies · MCA
            </span>
          </div>
        </div>

        {/* Right Structured Track Manifest */}
        <div className="lg:col-span-5 bg-rvsslate text-white p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-rvsgold font-semibold mb-4">
            Development Focus Areas
          </p>
          <div className="divide-y divide-white/10 border border-white/10 rounded-md bg-rvsslate-dark">
            {UPCOMING_TRACKS.map((item) => (
              <div key={item.code} className="p-3.5 flex items-start gap-3">
                <span className="font-mono text-xs text-rvsgold font-semibold pt-0.5">
                  {item.code}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.track}</p>
                  <p className="text-xs text-zinc-300 mt-0.5">{item.scope}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
