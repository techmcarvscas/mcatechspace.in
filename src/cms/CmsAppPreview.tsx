import React, { useState } from 'react';
import { Monitor, Smartphone, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { AppEntry } from '../types';
import { AppIconGraphic } from '../components/AppCard';
import { isValidHttpUrl } from '../utils/validation';

interface CmsAppPreviewProps {
  app: AppEntry;
}

export const CmsAppPreview: React.FC<CmsAppPreviewProps> = ({ app }) => {
  const [mode, setMode] = useState<'card' | 'featured'>('card');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  const hasValidUrl = isValidHttpUrl(app.playStoreUrl);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-obsidian/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
        <span className="font-mono text-[11px] uppercase tracking-wider text-lime">
          Live Preview
        </span>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-white/10 bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setMode('card')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                mode === 'card' ? 'bg-lime text-obsidian font-bold' : 'text-zinc-400'
              }`}
            >
              App Card
            </button>
            <button
              type="button"
              onClick={() => setMode('featured')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                mode === 'featured' ? 'bg-lime text-obsidian font-bold' : 'text-zinc-400'
              }`}
            >
              Featured
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-white/10 bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Desktop preview"
              className={`p-1.5 rounded-md ${
                viewport === 'desktop' ? 'bg-white/15 text-white' : 'text-zinc-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Mobile preview"
              className={`p-1.5 rounded-md ${
                viewport === 'mobile' ? 'bg-white/15 text-white' : 'text-zinc-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center overflow-y-auto py-2">
        <div
          className={`transition-all duration-200 ${
            viewport === 'mobile' ? 'w-[320px] max-w-full' : 'w-full'
          }`}
        >
          {mode === 'card' ? (
            <div className="rounded-3xl border border-white/15 bg-charcoal p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <AppIconGraphic
                  icon={app.icon}
                  name={app.name || 'App'}
                  sizeClass="w-14 h-14"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-lime">
                      {app.category || 'Category'}
                    </span>
                    {app.badge && (
                      <span className="inline-flex items-center rounded-full bg-lime/15 border border-lime/30 px-2 py-0.5 font-mono text-[9px] text-lime">
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-lg font-bold text-white truncate">
                    {app.name || 'Application Name'}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate">
                    {app.tagline || 'Short tagline preview'}
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-zinc-300">
                {app.shortDescription || app.description || 'Short description will appear here.'}
              </p>

              {(app.platform?.length > 0 || app.version || (app.technologies?.length ?? 0) > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {app.platform?.map((p) => (
                    <span
                      key={p}
                      className="rounded border border-white/10 bg-surface px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                    >
                      {p}
                    </span>
                  ))}
                  {app.version && (
                    <span className="rounded border border-white/10 bg-surface px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      v{app.version.replace(/^v/i, '')}
                    </span>
                  )}
                  {app.technologies?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded border border-cyanlab/20 bg-cyanlab/5 px-2 py-0.5 font-mono text-[10px] text-cyanlab"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-white/10">
                <div
                  className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                    hasValidUrl
                      ? 'bg-lime text-obsidian'
                      : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  <span>VIEW ON PLAY STORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-lime/30 bg-gradient-to-br from-charcoal to-surface p-5 space-y-4">
              <div className="flex items-center gap-4">
                <AppIconGraphic
                  icon={app.icon}
                  name={app.name || 'App'}
                  sizeClass="w-16 h-16"
                />
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-lime/15 border border-lime/30 px-2.5 py-0.5 font-mono text-[10px] uppercase text-lime mb-1">
                    Featured
                  </span>
                  <h4 className="font-display text-xl font-bold text-white truncate">
                    {app.name || 'Application Name'}
                  </h4>
                  <p className="text-xs text-zinc-300 truncate">{app.tagline}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {app.description || app.shortDescription || 'Full description preview.'}
              </p>

              {app.features && app.features.length > 0 && (
                <div className="space-y-1.5">
                  {app.features.slice(0, 3).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-zinc-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {app.screenshots && app.screenshots.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {app.screenshots.map((s, idx) => (
                    <img
                      key={`${s}-${idx}`}
                      src={s}
                      alt={`Preview ${idx + 1}`}
                      className="h-28 w-auto rounded-lg border border-white/15 object-cover shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

