import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AppEntry } from '../types';
import { DEFAULT_CATEGORIES, sanitizeSlug, validateAppEntry } from '../utils/validation';
import { readImageAsDataUrl } from '../utils/jsonIO';
import { CmsAppPreview } from './CmsAppPreview';
import { AppIconGraphic } from '../components/AppCard';

interface CmsAppEditorModalProps {
  initialApp: AppEntry | null;
  nextOrder: number;
  existingIds: string[];
  onSave: (app: AppEntry) => void;
  onClose: () => void;
}

function makeEmptyApp(nextOrder: number): AppEntry {
  return {
    id: '',
    name: '',
    tagline: '',
    shortDescription: '',
    description: '',
    icon: '',
    playStoreUrl: '',
    category: 'Productivity',
    platform: ['Android'],
    status: 'draft',
    featured: false,
    releaseDate: '',
    version: '',
    technologies: [],
    features: [],
    screenshots: [],
    developer: '',
    badge: '',
    displayOrder: nextOrder,
  };
}

export const CmsAppEditorModal: React.FC<CmsAppEditorModalProps> = ({
  initialApp,
  nextOrder,
  existingIds,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialApp);
  const [form, setForm] = useState<AppEntry>(() =>
    initialApp ? { ...initialApp } : makeEmptyApp(nextOrder)
  );
  const [platformInput, setPlatformInput] = useState(() =>
    (initialApp?.platform ?? ['Android']).join(', ')
  );
  const [techInput, setTechInput] = useState(() =>
    (initialApp?.technologies ?? []).join(', ')
  );
  const [featureInput, setFeatureInput] = useState('');
  const [screenshotUrlInput, setScreenshotUrlInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleField = <K extends keyof AppEntry>(key: K, value: AppEntry[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataUrl(file);
      handleField('icon', dataUrl);
      setUploadNotice(
        `Local preview loaded for "${file.name}". Before deploying, copy this file into public/apps/icons/ and set the path to /apps/icons/${file.name} (or use an HTTPS URL).`
      );
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Unable to read icon image.']);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataUrl(file);
      handleField('screenshots', [...(form.screenshots ?? []), dataUrl]);
      setUploadNotice(
        `Local screenshot preview added ("${file.name}"). Before deploying, place it in public/apps/screenshots/ and reference /apps/screenshots/${file.name}.`
      );
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Unable to read screenshot image.']);
    }
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    handleField('features', [...(form.features ?? []), trimmed]);
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    handleField(
      'features',
      (form.features ?? []).filter((_, i) => i !== idx)
    );
  };

  const addScreenshotUrl = () => {
    const trimmed = screenshotUrlInput.trim();
    if (!trimmed) return;
    handleField('screenshots', [...(form.screenshots ?? []), trimmed]);
    setScreenshotUrlInput('');
  };

  const moveScreenshot = (idx: number, dir: -1 | 1) => {
    const shots = [...(form.screenshots ?? [])];
    const target = idx + dir;
    if (target < 0 || target >= shots.length) return;
    [shots[idx], shots[target]] = [shots[target], shots[idx]];
    handleField('screenshots', shots);
  };

  const removeScreenshot = (idx: number) => {
    handleField(
      'screenshots',
      (form.screenshots ?? []).filter((_, i) => i !== idx)
    );
  };

  const buildNormalizedApp = (): AppEntry => {
    const platforms = platformInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const technologies = techInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      ...form,
      id: form.id.trim() || sanitizeSlug(form.name),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      icon: form.icon.trim(),
      playStoreUrl: form.playStoreUrl.trim(),
      category: form.category.trim(),
      platform: platforms.length > 0 ? platforms : ['Android'],
      technologies,
      releaseDate: form.releaseDate?.trim() || '',
      version: form.version?.trim() || '',
      developer: form.developer?.trim() || '',
      badge: form.badge?.trim() || '',
      displayOrder: Number(form.displayOrder) || 0,
    };
  };

  const livePreviewApp = buildNormalizedApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = buildNormalizedApp();
    const validation = validateAppEntry(candidate);
    const nextErrors = [...validation.errors];

    if (!isEditing && existingIds.includes(candidate.id)) {
      nextErrors.push(`Application ID "${candidate.id}" already exists.`);
    }
    if (isEditing && initialApp && candidate.id !== initialApp.id && existingIds.includes(candidate.id)) {
      nextErrors.push(`Application ID "${candidate.id}" already exists.`);
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave(candidate);
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border border-white/15 bg-charcoal shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-obsidian/70">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lime">
              Application Editor
            </span>
            <h2 id="editor-modal-title" className="font-display text-lg sm:text-xl font-bold text-white">
              {isEditing ? `Edit: ${initialApp?.name}` : 'Add New Application'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="rounded-xl border border-white/10 bg-surface p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6">
          {errors.length > 0 && (
            <div className="mb-5 rounded-2xl border border-red-500/35 bg-red-500/10 p-4 text-xs text-red-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span>Please fix the following before saving:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {uploadNotice && (
            <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-xs text-amber-200">
              {uploadNotice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form Fields */}
            <div className="lg:col-span-7 space-y-5">
              {/* Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleField('name', val);
                      if (!isEditing && !form.id) {
                        handleField('id', sanitizeSlug(val));
                      }
                    }}
                    placeholder="e.g., Campus Companion"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Application ID *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.id}
                      onChange={(e) => handleField('id', sanitizeSlug(e.target.value))}
                      placeholder="e.g., campus-companion"
                      className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 font-mono text-sm text-white focus:border-lime focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleField('id', sanitizeSlug(form.name))}
                      className="rounded-xl border border-white/15 bg-surface px-3 text-xs text-zinc-300 hover:text-white shrink-0"
                    >
                      Slug
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                  Tagline *
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => handleField('tagline', e.target.value)}
                  placeholder="One-line value proposition"
                  className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => handleField('shortDescription', e.target.value)}
                  placeholder="Concise summary displayed on app directory cards"
                  className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                  Full Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleField('description', e.target.value)}
                  placeholder="Detailed overview shown in Featured Spotlight and Specs modal"
                  className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                />
              </div>

              {/* Play Store & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Google Play Store URL *
                  </label>
                  <input
                    type="url"
                    value={form.playStoreUrl}
                    onChange={(e) => handleField('playStoreUrl', e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Category *
                  </label>
                  <input
                    list="mca-app-categories"
                    value={form.category}
                    onChange={(e) => handleField('category', e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                  <datalist id="mca-app-categories">
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Icon URL & Local Upload */}
              <div className="rounded-2xl border border-white/10 bg-obsidian/50 p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="font-mono text-[11px] uppercase text-zinc-400">
                    App Icon URL or Local Preview
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/15 bg-surface px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-lime/40">
                    <Upload className="w-3.5 h-3.5 text-lime" />
                    <span>Upload Preview</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <AppIconGraphic icon={form.icon} name={form.name || 'App'} sizeClass="w-12 h-12" />
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => handleField('icon', e.target.value)}
                    placeholder="/apps/icons/my-app.png or https://..."
                    className="flex-1 rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  For static JSON deployment, store icon files in <code className="text-zinc-300">public/apps/icons/</code> and reference <code className="text-zinc-300">/apps/icons/filename.png</code>.
                </p>
              </div>

              {/* Status, Featured, Display Order, Badge */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleField('status', e.target.value as 'published' | 'draft')}
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => handleField('displayOrder', Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Badge (Opt.)
                  </label>
                  <input
                    type="text"
                    value={form.badge ?? ''}
                    onChange={(e) => handleField('badge', e.target.value)}
                    placeholder="NEW / BETA"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 w-full">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => handleField('featured', e.target.checked)}
                      className="h-4 w-4 accent-[#C8FF2E]"
                    />
                    <span className="text-xs font-semibold text-white">Featured</span>
                  </label>
                </div>
              </div>

              {/* Optional Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Release Date (Opt.)
                  </label>
                  <input
                    type="date"
                    value={form.releaseDate ?? ''}
                    onChange={(e) => handleField('releaseDate', e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Version (Opt.)
                  </label>
                  <input
                    type="text"
                    value={form.version ?? ''}
                    onChange={(e) => handleField('version', e.target.value)}
                    placeholder="1.0.0"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Developer / Team (Opt.)
                  </label>
                  <input
                    type="text"
                    value={form.developer ?? ''}
                    onChange={(e) => handleField('developer', e.target.value)}
                    placeholder="Optional attribution"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
              </div>

              {/* Platform & Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Platforms (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value)}
                    placeholder="Android"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1.5">
                    Technology Stack (comma-separated, Opt.)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Kotlin, Jetpack Compose, Firebase"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
              </div>

              {/* Feature List */}
              <div className="rounded-2xl border border-white/10 bg-obsidian/50 p-4 space-y-3">
                <label className="block font-mono text-[11px] uppercase text-zinc-400">
                  Feature Highlights (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="Add a feature highlight..."
                    className="flex-1 rounded-xl border border-white/15 bg-obsidian px-3.5 py-2 text-sm text-white focus:border-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center gap-1 rounded-xl bg-surface border border-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:border-lime/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
                {(form.features ?? []).length > 0 && (
                  <ul className="space-y-1.5">
                    {form.features?.map((feat, idx) => (
                      <li
                        key={`${feat}-${idx}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-zinc-500 hover:text-red-400"
                          aria-label="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Screenshots */}
              <div className="rounded-2xl border border-white/10 bg-obsidian/50 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-mono text-[11px] uppercase text-zinc-400">
                    Screenshots (Optional)
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/15 bg-surface px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-lime/40">
                    <ImagePlus className="w-3.5 h-3.5 text-lime" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={screenshotUrlInput}
                    onChange={(e) => setScreenshotUrlInput(e.target.value)}
                    placeholder="/apps/screenshots/screen1.png or https://..."
                    className="flex-1 rounded-xl border border-white/15 bg-obsidian px-3.5 py-2 text-sm text-white focus:border-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addScreenshotUrl}
                    className="inline-flex items-center gap-1 rounded-xl bg-surface border border-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:border-lime/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {(form.screenshots ?? []).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {form.screenshots?.map((shot, idx) => (
                      <div
                        key={`${shot}-${idx}`}
                        className="rounded-xl border border-white/10 bg-surface p-2 space-y-2"
                      >
                        <img
                          src={shot}
                          alt={`Screenshot ${idx + 1}`}
                          className="h-28 w-full rounded-lg object-cover bg-obsidian"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveScreenshot(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                              aria-label="Move screenshot earlier"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveScreenshot(idx, 1)}
                              disabled={idx === (form.screenshots?.length ?? 0) - 1}
                              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                              aria-label="Move screenshot later"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeScreenshot(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-red-400"
                            aria-label="Remove screenshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Real-Time Preview Panel */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-0">
                <CmsAppPreview app={livePreviewApp} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-surface px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-lime px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian hover:bg-lime-dim"
            >
              {isEditing ? 'Save Changes to Draft' : 'Add to Draft'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

