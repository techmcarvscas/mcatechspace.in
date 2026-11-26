import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Calendar, CheckCircle2, Code2, Layers, User, X } from 'lucide-react';
import { AppEntry } from '../types';
import { AppIconGraphic } from './AppCard';
import { isValidHttpUrl } from '../utils/validation';

interface AppDetailModalProps {
  app: AppEntry | null;
  onClose: () => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose }) => {
  useEffect(() => {
    if (!app) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [app, onClose]);

  return (
    <AnimatePresence>
      {app && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-rvsslate/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-rvsslate/20 bg-white text-rvsslate p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close application details"
              className="absolute top-5 right-5 rounded-md border border-rvsslate/15 bg-rvscream-soft p-2 text-rvsslate hover:border-rvsmaroon hover:text-rvsmaroon focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsmaroon"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pr-10">
              <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-20 h-20" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-rvsmaroon">
                      {app.category}
                    </span>
                    {app.badge && (
                    <span className="rounded bg-rvsgold px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-rvsslate">
                      {app.badge}
                    </span>
                  )}
                </div>
                <h2
                  id="app-modal-title"
                  className="mt-1 font-display text-2xl sm:text-3xl font-bold text-rvsslate"
                >
                  {app.name}
                </h2>
                <p className="text-sm text-zinc-600">{app.tagline}</p>
              </div>
              </div>

              <div className="mt-6 space-y-6">
                {(app.description || app.shortDescription) && (
                  <div>
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-rvsmaroon mb-2">
                        Overview
                      </h3>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-700 whitespace-pre-line">
                          {app.description || app.shortDescription}
                        </p>
                      </div>
              )}

                      {(app.developer || app.releaseDate || app.version || app.platform?.length > 0) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-md border border-rvsslate/15 bg-rvscream-soft p-4">
                            {app.developer && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <User className="w-4 h-4 text-rvsmaroon shrink-0" />
                                <span className="text-zinc-600">Developer:</span>
                                <span className="text-rvsslate font-semibold">{app.developer}</span>
                              </div>
                            )}
                            {app.releaseDate && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Calendar className="w-4 h-4 text-rvsmaroon shrink-0" />
                                <span className="text-zinc-600">Released:</span>
                                <span className="text-rvsslate font-semibold">{app.releaseDate}</span>
                              </div>
                            )}
                            {app.version && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Layers className="w-4 h-4 text-rvsmaroon shrink-0" />
                                <span className="text-zinc-600">Version:</span>
                                <span className="text-rvsslate font-semibold">{app.version}</span>
                              </div>
                            )}
                            {app.platform?.length > 0 && (
                              <div className="flex items-center gap-2.5 text-sm">
                                <Code2 className="w-4 h-4 text-rvsmaroon shrink-0" />
                                <span className="text-zinc-600">Platform:</span>
                                <span className="text-rvsslate font-semibold">{app.platform.join(', ')}</span>
                              </div>
                            )}
                          </div>
              )}

                          {app.features && app.features.length > 0 && (
                            <div>
                                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-rvsmaroon mb-3">
                                  Key Capabilities
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {app.features.map((feat) => (
                                    <li
                                      key={feat}
                                      className="flex items-start gap-2.5 rounded-md border border-rvsslate/15 bg-rvscream-soft px-3.5 py-2.5 text-sm text-rvsslate"
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-rvsmaroon shrink-0 mt-0.5" />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                            </div>
                          )}

                          {app.technologies && app.technologies.length > 0 && (
                            <div>
                                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-rvsmaroon mb-2">
                                  Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {app.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="rounded border border-rvsmaroon/25 bg-rvsmaroon/5 px-3 py-1 font-mono text-xs font-medium text-rvsmaroon"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                            </div>
                          )}

                          {app.screenshots && app.screenshots.length > 0 && (
                            <div>
                                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-rvsmaroon mb-3">
                                  Screenshots
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                  {app.screenshots.map((shot, idx) => (
                                    <img
                                      key={`${shot}-${idx}`}
                                      src={shot}
                                      alt={`${app.name} screenshot ${idx + 1}`}
                                      loading="lazy"
                                      className="h-64 w-auto rounded-lg border border-rvsslate/15 object-cover bg-rvscream shrink-0"
                                    />
                                  ))}
                                </div>
                            </div>
                          )}
                        </div>

            {isValidHttpUrl(app.playStoreUrl) && (
                          <div className="mt-8 pt-6 border-t border-rvsslate/15 flex justify-end">
                            <a
                              href={app.playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-md bg-rvsmaroon px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-rvsmaroon-dark transition-colors"
                            >
                              <span>VIEW ON PLAY STORE</span>
                              <ArrowUpRight className="w-4 h-4 text-rvsgold" />
                            </a>
                          </div>
            )}
                        </motion.div>
        </motion.div>
      )}
                  </AnimatePresence>
                );
};
