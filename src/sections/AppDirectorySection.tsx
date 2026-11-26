import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Layers, Play, Search, Smartphone } from 'lucide-react';
import { AppEntry } from '../types';
import { AppIconGraphic } from '../components/AppCard';
import { EmptyAppsState } from '../components/EmptyAppsState';
import { isValidHttpUrl } from '../utils/validation';

interface AppDirectorySectionProps {
  publishedApps: AppEntry[];
  showCategories: boolean;
}

export const AppDirectorySection: React.FC<AppDirectorySectionProps> = ({
  publishedApps,
  showCategories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    publishedApps.forEach((app) => {
      const cat = app.category.trim() || 'Other';
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [publishedApps]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedApps.filter((app) => {
      const catMatch = selectedCategory === 'All' || app.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
      );
    });
  }, [publishedApps, selectedCategory, searchQuery]);

  return (
    <section id="apps" className="relative py-12 sm:py-16 cream-canvas-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Search */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 mb-6 border-b border-rvsslate/15"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-rvsmaroon">
              <Smartphone className="w-3.5 h-3.5" />
              Application Directory
            </span>
            <h2 className="mt-1.5 font-display text-3xl sm:text-5xl font-bold tracking-tight text-rvsslate">
              Published Applications
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-zinc-700">
              Mobile applications engineered by MCA students and published to the Google Play Store.
            </p>
          </div>

          {publishedApps.length > 1 && (
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications..."
                aria-label="Search published applications"
                className="w-full rounded-md border border-rvsslate/20 bg-white pl-10 pr-4 py-2.5 text-sm text-rvsslate placeholder:text-zinc-500 focus:border-rvsmaroon focus:outline-none"
              />
            </div>
          )}
        </motion.div>

        {/* Dynamic Category Filters */}
        {showCategories && publishedApps.length > 0 && categories.length > 0 && (
          <div
            role="tablist"
            aria-label="Filter applications by category"
            className="mb-8 flex flex-wrap items-center gap-2"
          >
            {[
              { name: 'All', count: publishedApps.length, label: 'All Apps' },
              ...categories.map((c) => ({ ...c, label: c.name })),
            ].map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`relative inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'text-white'
                      : 'border border-rvsslate/20 bg-white text-rvsslate hover:border-rvsmaroon'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="directory-category-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-md bg-rvsmaroon"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{cat.label}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-rvscream text-rvsslate'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {publishedApps.length === 0 ? (
          <EmptyAppsState />
        ) : filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-rvsslate/15 bg-white p-10 text-center shadow-sm"
          >
            <Layers className="w-7 h-7 text-rvsmaroon mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-rvsslate">
              No applications match this filter
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Try clearing your search or switching back to all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-5 rounded-md bg-rvsmaroon px-5 py-2 text-xs font-semibold text-white hover:bg-rvsmaroon-dark transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          /* Alternating Editorial Horizontal Showcase Rows */
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, index) => {
                const isReversed = index % 2 === 1;
                const hasValidUrl = isValidHttpUrl(app.playStoreUrl);

                return (
                  <motion.article
                    key={app.id}
                    layout
                    initial={{ opacity: 0, x: isReversed ? 24 : -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="group rounded-2xl border border-rvsslate/15 bg-white shadow-sm hover:shadow-xl hover:border-rvsmaroon/45 transition-all duration-300 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                      {/* Visual Icon Showcase Tile (Alternates Left / Right) */}
                      <div
                        className={`lg:col-span-4 relative flex flex-col items-center justify-center p-8 sm:p-10 bg-rvscream-soft border-b lg:border-b-0 border-rvsslate/10 overflow-hidden ${
                          isReversed
                            ? 'lg:order-2 lg:border-l'
                            : 'lg:order-1 lg:border-r'
                        }`}
                      >
                        {/* Large Subtle Watermark Index */}
                        <span
                          aria-hidden="true"
                          className="absolute top-3 left-5 font-display text-5xl font-extrabold text-rvsslate/[0.06] select-none tabular-nums"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="absolute top-4 right-4 rounded-full border border-rvsmaroon/25 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rvsmaroon">
                          {app.category}
                        </span>

                        {/* Concentric Frame Around App Icon */}
                        <div className="relative my-4 flex items-center justify-center">
                          <div
                            aria-hidden="true"
                            className="absolute h-36 w-36 rounded-3xl border border-rvsmaroon/15 rotate-6 transition-transform duration-500 group-hover:rotate-12"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute h-32 w-32 rounded-3xl border border-rvsgold/40 -rotate-3 transition-transform duration-500 group-hover:-rotate-6"
                          />
                          <motion.div
                            whileHover={{ scale: 1.06 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative z-10"
                          >
                            <AppIconGraphic
                              icon={app.icon}
                              name={app.name}
                              sizeClass="w-24 h-24 rounded-2xl shadow-xl border-2 border-white"
                            />
                          </motion.div>
                        </div>

                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white border border-rvsslate/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rvsslate">
                          <Play className="w-2.5 h-2.5 text-rvsmaroon fill-current shrink-0" />
                          <span>Available on Google Play</span>
                        </span>
                      </div>

                      {/* Editorial App Copy & Play Store Action */}
                      <div
                        className={`lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-rvsmaroon">
                              App #{String(index + 1).padStart(2, '0')}
                            </span>
                            {app.badge && (
                              <span className="rounded bg-rvsgold px-2.5 py-0.5 text-[10px] font-bold uppercase text-rvsslate">
                                {app.badge}
                              </span>
                            )}
                            {app.platform?.map((p) => (
                              <span
                                key={p}
                                className="rounded border border-rvsslate/15 bg-rvscream-soft px-2.5 py-0.5 text-[11px] font-semibold text-rvsslate"
                              >
                                {p}
                              </span>
                            ))}
                            {app.version && (
                              <span className="rounded border border-rvsslate/15 bg-rvscream-soft px-2.5 py-0.5 text-[11px] text-zinc-600">
                                v{app.version.replace(/^v/i, '')}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="font-display text-2xl sm:text-3xl font-bold text-rvsslate">
                              {app.name}
                            </h3>
                            <p className="mt-1 text-sm sm:text-base font-semibold text-rvsmaroon">
                              {app.tagline}
                            </p>
                          </div>

                          <p className="text-sm sm:text-base leading-relaxed text-zinc-700 max-w-2xl">
                            {app.description || app.shortDescription}
                          </p>

                          {app.technologies && app.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {app.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded border border-rvsmaroon/20 bg-rvsmaroon/5 px-2.5 py-1 text-xs font-medium text-rvsmaroon"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.developer && (
                            <p className="text-xs text-zinc-500">
                              Built by{' '}
                              <span className="font-semibold text-rvsslate">{app.developer}</span>
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-rvsslate/10 flex flex-wrap items-center justify-between gap-4">
                          {hasValidUrl && (
                            <a
                              href={app.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn inline-flex items-center gap-2.5 rounded-lg bg-rvsmaroon px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-rvsmaroon-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
                            >
                              <span>VIEW ON PLAY STORE</span>
                              <ArrowUpRight className="w-4 h-4 text-rvsgold transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </a>
                          )}

                          {app.releaseDate && (
                            <span className="text-xs text-zinc-500">
                              Released: {app.releaseDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
