import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Smartphone } from 'lucide-react';
import { AppEntry } from '../types';
import { isValidHttpUrl } from '../utils/validation';

interface AppCardProps {
  app: AppEntry;
  index: number;
  variant?: 'standard' | 'editorial';
  onOpenDetails?: (app: AppEntry) => void;
  darkSurface?: boolean;
}

export const AppIconGraphic: React.FC<{
  icon?: string;
  name: string;
  sizeClass?: string;
}> = ({ icon, name, sizeClass = 'w-14 h-14' }) => {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (!icon || failed) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-rvsslate border border-rvsmaroon/40 flex items-center justify-center font-display font-bold text-rvsgold text-base shrink-0 select-none`}
      >
        {initials || <Smartphone className="w-5 h-5 text-rvsgold" />}
      </div>
    );
  }

  return (
    <img
      src={icon}
      alt={`${name} icon`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${sizeClass} rounded-lg object-cover border border-rvsslate/15 bg-white shrink-0 transition-transform duration-300 group-hover:scale-105`}
    />
  );
};

export const AppCard: React.FC<AppCardProps> = ({
  app,
  index,
  variant = 'standard',
  darkSurface = false,
}) => {
  const hasValidUrl = isValidHttpUrl(app.playStoreUrl);
  const isEditorial = variant === 'editorial';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.3) }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl border transition-shadow duration-300 ${
        darkSurface
          ? 'border-white/15 bg-charcoal text-white hover:border-rvsgold/60 hover:shadow-xl'
          : 'border-rvsslate/15 bg-white text-rvsslate shadow-sm hover:border-rvsmaroon/60 hover:shadow-[0_20px_44px_-18px_rgba(124,2,1,0.28)]'
      } ${isEditorial ? 'md:col-span-2 lg:flex-row lg:items-stretch' : ''}`}
    >
      {/* Visual Artwork Stage Header */}
      {!darkSurface && (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-rvsslate via-[#161E29] to-rvsmaroon-dark flex items-center justify-center ${
            isEditorial ? 'lg:w-72 p-8 shrink-0' : 'h-36 p-6'
          }`}
        >
          {/* Subtle Architectural Rings */}
          <div
            aria-hidden="true"
            className="absolute h-44 w-44 rounded-full border border-white/[0.07] transition-transform duration-500 group-hover:scale-110"
          />
          <div
            aria-hidden="true"
            className="absolute h-28 w-28 rounded-full border border-rvsgold/25 transition-transform duration-500 group-hover:scale-105"
          />

          <div className="relative z-10 flex items-center gap-4">
            <AppIconGraphic
              icon={app.icon}
              name={app.name}
              sizeClass="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-2xl border-2 border-white/20"
            />
          </div>

          <span className="absolute top-3.5 left-4 rounded bg-black/35 backdrop-blur-sm border border-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rvsgold">
            {app.category}
          </span>

          <span className="absolute top-3.5 right-4 text-[11px] font-bold text-white/50 tabular-nums">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className={`flex items-center gap-3.5 min-w-0 ${!darkSurface ? 'w-full' : ''}`}>
              {darkSurface && (
                <AppIconGraphic
                  icon={app.icon}
                  name={app.name}
                  sizeClass={isEditorial ? 'w-16 h-16' : 'w-14 h-14'}
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {darkSurface && (
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-rvsgold">
                      {app.category}
                    </span>
                  )}
                  {app.badge && (
                    <span className="inline-flex items-center rounded bg-rvsgold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rvsslate">
                      {app.badge}
                    </span>
                  )}
                </div>
                <h3
                  className={`font-display text-xl sm:text-2xl font-bold truncate ${
                    darkSurface ? 'text-white' : 'text-rvsslate'
                  }`}
                >
                  {app.name}
                </h3>
                <p
                  className={`text-xs sm:text-sm font-medium mt-0.5 ${
                    darkSurface ? 'text-zinc-300' : 'text-rvsmaroon'
                  }`}
                >
                  {app.tagline}
                </p>
              </div>
            </div>
          </div>

          <p
            className={`mt-3.5 text-sm leading-relaxed line-clamp-3 ${
              darkSurface ? 'text-zinc-300' : 'text-zinc-700'
            }`}
          >
            {app.shortDescription || app.description}
          </p>

          {(app.platform?.length > 0 ||
            app.version ||
            app.releaseDate ||
            (app.technologies && app.technologies.length > 0)) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {app.platform?.map((p) => (
                <span
                  key={p}
                  className={`rounded border px-2.5 py-0.5 text-[11px] font-semibold ${
                    darkSurface
                      ? 'border-white/15 bg-obsidian text-zinc-200'
                      : 'border-rvsslate/15 bg-rvscream-soft text-rvsslate'
                  }`}
                >
                  {p}
                </span>
              ))}
              {app.version && (
                <span
                  className={`rounded border px-2 py-0.5 text-[11px] ${
                    darkSurface
                      ? 'border-white/15 bg-obsidian text-zinc-300'
                      : 'border-rvsslate/15 bg-rvscream-soft text-zinc-600'
                  }`}
                >
                  v{app.version.replace(/^v/i, '')}
                </span>
              )}
              {app.releaseDate && (
                <span
                  className={`rounded border px-2 py-0.5 text-[11px] ${
                    darkSurface
                      ? 'border-white/15 bg-obsidian text-zinc-300'
                      : 'border-rvsslate/15 bg-rvscream-soft text-zinc-600'
                  }`}
                >
                  {app.releaseDate}
                </span>
              )}
              {app.technologies?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                    darkSurface
                      ? 'border-rvsgold/30 bg-rvsgold/10 text-rvsgold'
                      : 'border-rvsmaroon/25 bg-rvsmaroon/5 text-rvsmaroon'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {app.developer && (
            <p
              className={`mt-3 text-[11px] ${
                darkSurface ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Developer:{' '}
              <span className={darkSurface ? 'text-zinc-200' : 'text-rvsslate font-medium'}>
                {app.developer}
              </span>
            </p>
          )}
        </div>

        <div
          className={`relative z-10 flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t ${
            darkSurface ? 'border-white/10' : 'border-rvsslate/10'
          }`}
        >
          {hasValidUrl && (
            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors focus:outline-none focus-visible:ring-2 ${
                darkSurface
                  ? 'bg-rvsgold text-rvsslate hover:bg-rvsgold-dim focus-visible:ring-white'
                  : 'bg-rvsmaroon text-white hover:bg-rvsmaroon-dark focus-visible:ring-rvsgold'
              }`}
            >
              <span>VIEW ON PLAY STORE</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};
