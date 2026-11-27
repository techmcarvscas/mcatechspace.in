import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CheckCircle2, Layers, ShieldCheck, Smartphone } from 'lucide-react';
import { AppEntry } from '../types';
import { AppIconGraphic } from '../components/AppCard';
import { GooglePlayBadge } from '../components/GooglePlayBadge';
import { isValidHttpUrl } from '../utils/validation';

interface FeaturedAppSectionProps {
  featuredApps: AppEntry[];
}

export const FeaturedAppSection: React.FC<FeaturedAppSectionProps> = ({
  featuredApps,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (featuredApps.length === 0) {
    return null;
  }

  const activeApp = featuredApps[selectedIndex] ?? featuredApps[0];
  const hasValidUrl = isValidHttpUrl(activeApp.playStoreUrl);

  return (
    <section
      id="featured"
      className="relative py-12 sm:py-16 bg-white border-b border-rvsslate/15 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-6 border-b border-rvsslate/15"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-rvsmaroon font-bold">
              <Award className="w-3.5 h-3.5" />
              Featured Spotlight
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-rvsslate">
              Flagship Lab Release
            </h2>
          </div>

          {featuredApps.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {featuredApps.map((app, idx) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    idx === selectedIndex
                      ? 'bg-rvsmaroon text-white'
                      : 'border border-rvsslate/20 bg-rvscream text-rvsslate hover:border-rvsmaroon'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-2xl border border-rvsslate/15 bg-rvsslate text-white shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Editorial Details */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <AppIconGraphic
                        icon={activeApp.icon}
                        name={activeApp.name}
                        sizeClass="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg border-2 border-rvsgold/40"
                      />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="rounded bg-rvsmaroon border border-rvsgold/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rvsgold">
                          Featured Release
                        </span>
                        <span className="text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                          {activeApp.category}
                        </span>
                        {activeApp.badge && (
                          <span className="rounded bg-rvsgold px-2 py-0.5 text-[10px] font-bold uppercase text-rvsslate">
                            {activeApp.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                        {activeApp.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-rvsgold/90">
                        {activeApp.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200 max-w-2xl">
                    {activeApp.description || activeApp.shortDescription}
                  </p>

                  {/* Features or Architecture Highlights */}
                  {activeApp.features && activeApp.features.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeApp.features.slice(0, 4).map((feat, i) => (
                        <motion.div
                          key={feat}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs sm:text-sm text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 text-rvsgold shrink-0" />
                          <span className="truncate">{feat}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        { icon: Smartphone, label: 'Target', value: activeApp.platform?.join(', ') || 'Android' },
                        { icon: Layers, label: 'Category', value: activeApp.category },
                        { icon: ShieldCheck, label: 'Distribution', value: 'Google Play' },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rvsgold">
                              <Icon className="w-3.5 h-3.5" />
                              <span>{item.label}</span>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm font-semibold text-white">
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {hasValidUrl && (
                    <GooglePlayBadge href={activeApp.playStoreUrl} appName={activeApp.name} />
                  )}
                </div>
              </div>

              {/* Right Rich Visual Stage */}
              <div className="lg:col-span-5 bg-gradient-to-br from-rvsmaroon via-[#4B0202] to-[#131922] p-6 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
                {activeApp.screenshots && activeApp.screenshots.length > 0 ? (
                  <div className="flex items-center gap-4 overflow-x-auto pb-2 max-w-full">
                    {activeApp.screenshots.slice(0, 2).map((shot, idx) => (
                      <motion.img
                        key={`${shot}-${idx}`}
                        src={shot}
                        alt={`${activeApp.name} preview ${idx + 1}`}
                        loading="lazy"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: idx * 0.12 }}
                        className="h-64 sm:h-72 w-auto rounded-xl border border-white/20 bg-rvsslate-dark object-cover shrink-0 shadow-2xl"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full max-w-xs space-y-4">
                    {/* Stylized Interactive Feature Visual Card */}
                    <div className="rounded-2xl border border-white/20 bg-[#0F151D]/90 p-5 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rvsgold">
                          Play Store Listing
                        </span>
                        <span className="rounded-full bg-emerald-400/15 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase">
                          Android
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <AppIconGraphic
                          icon={activeApp.icon}
                          name={activeApp.name}
                          sizeClass="w-14 h-14 rounded-xl border border-white/20"
                        />
                        <div className="min-w-0">
                          <p className="font-display text-base font-bold text-white truncate">
                            {activeApp.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">{activeApp.category}</p>
                        </div>
                      </div>

                      {/* Animated Decorative Waveform Graphic */}
                      <div className="rounded-xl bg-black/35 border border-white/10 p-3">
                        <svg viewBox="0 0 220 44" className="w-full h-10">
                          <path
                            d="M0,22 L40,22 L54,22 L64,10 L74,36 L86,6 L98,32 L108,22 L152,22 L166,14 L176,30 L186,22 L220,22"
                            fill="none"
                            stroke="rgba(250,174,83,0.22)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <motion.path
                            d="M0,22 L40,22 L54,22 L64,10 L74,36 L86,6 L98,32 L108,22 L152,22 L166,14 L176,30 L186,22 L220,22"
                            fill="none"
                            stroke="#FAAE53"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            pathLength={100}
                            strokeDasharray="100 100"
                            animate={{ strokeDashoffset: [100, 0, -100] }}
                            transition={{
                              duration: 3.2,
                              times: [0, 0.55, 1],
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        </svg>
                      </div>

                      {(activeApp.version || activeApp.releaseDate || activeApp.developer) && (
                        <div className="pt-2 border-t border-white/10 space-y-1 text-[11px] text-zinc-300">
                          {activeApp.version && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Version</span>
                              <span>{activeApp.version}</span>
                            </div>
                          )}
                          {activeApp.releaseDate && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Released</span>
                              <span>{activeApp.releaseDate}</span>
                            </div>
                          )}
                          {activeApp.developer && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Team</span>
                              <span>{activeApp.developer}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
