import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Edit3,
  Eye,
  FileJson,
  LayoutDashboard,
  LogOut,
  Plus,
  Radio,
  Search,
  Settings,
  FlaskConical,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  AppEntry,
  AppsDataFile,
  CmsSyncStatus,
  ReleaseEntry,
  ReleasesDataFile,
  SiteConfig,
} from '../types';
import { AppCard, AppIconGraphic } from '../components/AppCard';
import { CmsAppEditorModal } from './CmsAppEditorModal';
import { CmsJsonManager } from './CmsJsonManager';
import { ConfirmModal } from './ConfirmModal';
import { sanitizeSlug } from '../utils/validation';

interface CmsDashboardProps {
  draftApps: AppsDataFile;
  draftConfig: SiteConfig;
  draftReleases: ReleasesDataFile;
  syncStatus: CmsSyncStatus;
  previewDraftsOnPublic: boolean;
  onTogglePreviewDrafts: (enabled: boolean) => void;
  onUpdateApps: (next: AppsDataFile) => void;
  onUpdateConfig: (next: SiteConfig) => void;
  onUpdateReleases: (next: ReleasesDataFile) => void;
  onMarkExported: () => void;
  onResetDrafts: () => void;
  onLogout: () => void;
  onClose: () => void;
}

type CmsTab = 'apps' | 'releases' | 'config' | 'json';

export const CmsDashboard: React.FC<CmsDashboardProps> = ({
  draftApps,
  draftConfig,
  draftReleases,
  syncStatus,
  previewDraftsOnPublic,
  onTogglePreviewDrafts,
  onUpdateApps,
  onUpdateConfig,
  onUpdateReleases,
  onMarkExported,
  onResetDrafts,
  onLogout,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('apps');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingApp, setEditingApp] = useState<AppEntry | null>(null);
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [previewingApp, setPreviewingApp] = useState<AppEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppEntry | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Releases quick add form state
  const [releaseForm, setReleaseForm] = useState<Omit<ReleaseEntry, 'id'>>({
    appName: '',
    version: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'launch',
    summary: '',
    playStoreUrl: '',
  });

  const sortedApps = useMemo(
    () => [...draftApps.apps].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [draftApps.apps]
  );

  const stats = useMemo(() => {
    const total = sortedApps.length;
    const published = sortedApps.filter((a) => a.status === 'published').length;
    const draft = sortedApps.filter((a) => a.status === 'draft').length;
    const featured = sortedApps.filter((a) => a.featured).length;
    return { total, published, draft, featured };
  }, [sortedApps]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    sortedApps.forEach((a) => set.add(a.category || 'Other'));
    return ['All', ...Array.from(set)];
  }, [sortedApps]);

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedApps.filter((app) => {
      if (categoryFilter !== 'All' && app.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q)
      );
    });
  }, [sortedApps, search, categoryFilter]);

  const handleSaveApp = (saved: AppEntry) => {
    const exists = draftApps.apps.some((a) => a.id === (editingApp?.id ?? saved.id));
    const nextList = exists
      ? draftApps.apps.map((a) => (a.id === (editingApp?.id ?? saved.id) ? saved : a))
      : [...draftApps.apps, saved];
    onUpdateApps({ ...draftApps, apps: nextList });
    setEditingApp(null);
    setIsCreatingApp(false);
  };

  const handleDeleteApp = () => {
    if (!deleteTarget) return;
    onUpdateApps({
      ...draftApps,
      apps: draftApps.apps.filter((a) => a.id !== deleteTarget.id),
    });
    setDeleteTarget(null);
  };

  const handleDuplicateApp = (app: AppEntry) => {
    const baseId = `${app.id}-copy`;
    let candidateId = baseId;
    let counter = 2;
    while (draftApps.apps.some((a) => a.id === candidateId)) {
      candidateId = `${baseId}-${counter++}`;
    }
    const duplicated: AppEntry = {
      ...app,
      id: candidateId,
      name: `${app.name} (Copy)`,
      status: 'draft',
      featured: false,
      displayOrder: sortedApps.length + 1,
    };
    onUpdateApps({ ...draftApps, apps: [...draftApps.apps, duplicated] });
  };

  const handleToggleFeatured = (app: AppEntry) => {
    onUpdateApps({
      ...draftApps,
      apps: draftApps.apps.map((a) =>
        a.id === app.id ? { ...a, featured: !a.featured } : a
      ),
    });
  };

  const handleToggleStatus = (app: AppEntry) => {
    onUpdateApps({
      ...draftApps,
      apps: draftApps.apps.map((a) =>
        a.id === app.id
          ? { ...a, status: a.status === 'published' ? 'draft' : 'published' }
          : a
      ),
    });
  };

  const handleMoveOrder = (app: AppEntry, dir: -1 | 1) => {
    const idx = sortedApps.findIndex((a) => a.id === app.id);
    const targetIdx = idx + dir;
    if (idx < 0 || targetIdx < 0 || targetIdx >= sortedApps.length) return;

    const reordered = [...sortedApps];
    [reordered[idx], reordered[targetIdx]] = [reordered[targetIdx], reordered[idx]];
    const normalized = reordered.map((item, i) => ({
      ...item,
      displayOrder: i + 1,
    }));
    onUpdateApps({ ...draftApps, apps: normalized });
  };

  const handleInsertDemoApp = () => {
    const demoId = `demo-app-${Date.now().toString().slice(-4)}`;
    const demoApp: AppEntry = {
      id: demoId,
      name: '[DEMO] Campus Utility Preview',
      tagline: 'Sample DEMO entry for previewing layout — delete before publishing',
      shortDescription:
        'Clearly labeled DEMO application entry to preview asymmetric cards, featured spotlight, and category filtering.',
      description:
        'This is a temporary DEMO entry inserted from the CMS console. Replace its fields with a real Google Play Store application or delete it before exporting production JSON.',
      icon: '/apps/icons/demo-app-icon.svg',
      playStoreUrl: 'https://play.google.com/store',
      category: 'Productivity',
      platform: ['Android'],
      status: 'published',
      featured: sortedApps.every((a) => !a.featured),
      releaseDate: new Date().toISOString().slice(0, 10),
      version: '0.1.0-demo',
      technologies: ['Kotlin', 'Jetpack Compose'],
      features: ['DEMO Preview Card', 'Live Category Filtering', 'Play Store CTA Check'],
      screenshots: ['/apps/screenshots/demo-screen-1.svg'],
      developer: 'DEMO Sandbox',
      badge: 'DEMO',
      displayOrder: sortedApps.length + 1,
    };
    onUpdateApps({ ...draftApps, apps: [...draftApps.apps, demoApp] });
  };

  const handleAddRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseForm.appName.trim() || !releaseForm.summary.trim()) return;
    const entry: ReleaseEntry = {
      id: `${sanitizeSlug(releaseForm.appName)}-${Date.now().toString().slice(-4)}`,
      appName: releaseForm.appName.trim(),
      version: releaseForm.version?.trim() || '',
      date: releaseForm.date,
      type: releaseForm.type,
      summary: releaseForm.summary.trim(),
      playStoreUrl: releaseForm.playStoreUrl?.trim() || '',
    };
    onUpdateReleases({
      ...draftReleases,
      releases: [entry, ...draftReleases.releases],
    });
    setReleaseForm({
      appName: '',
      version: '',
      date: new Date().toISOString().slice(0, 10),
      type: 'launch',
      summary: '',
      playStoreUrl: '',
    });
  };

  const handleDeleteRelease = (id: string) => {
    onUpdateReleases({
      ...draftReleases,
      releases: draftReleases.releases.filter((r) => r.id !== id),
    });
  };

  const statusPill =
    syncStatus === 'local-draft'
      ? {
          text: 'LOCAL DRAFT — NOT YET DEPLOYED',
          cls: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
        }
      : syncStatus === 'exported'
        ? {
            text: 'JSON EXPORTED — READY TO DEPLOY',
            cls: 'border-lime/40 bg-lime/10 text-lime',
          }
        : {
            text: 'SYNCED WITH PUBLIC JSON',
            cls: 'border-white/15 bg-white/5 text-zinc-300',
          };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian text-white flex flex-col overflow-hidden">
      {/* Top CMS Bar */}
      <header className="border-b border-white/10 bg-charcoal px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-base sm:text-lg font-bold tracking-wide text-white">
            MCA LAB <span className="text-lime">CMS</span>
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusPill.cls}`}
          >
            {statusPill.text}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-white/15 bg-surface px-3 py-2 text-xs text-zinc-200">
            <input
              type="checkbox"
              checked={previewDraftsOnPublic}
              onChange={(e) => onTogglePreviewDrafts(e.target.checked)}
              className="accent-[#C8FF2E]"
            />
            <span>Preview Drafts on Public Site</span>
          </label>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-white/35"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Site</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 bg-charcoal/50 px-4 sm:px-6 flex gap-2 overflow-x-auto">
        {(
          [
            { id: 'apps', label: 'Applications', icon: LayoutDashboard },
            { id: 'releases', label: 'Releases', icon: Radio },
            { id: 'config', label: 'Site Config', icon: Settings },
            { id: 'json', label: 'JSON & Export', icon: FileJson },
          ] as { id: CmsTab; label: string; icon: React.ElementType }[]
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-lime text-lime'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {activeTab === 'apps' && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Applications', value: stats.total, accent: 'text-white' },
                  { label: 'Published Apps', value: stats.published, accent: 'text-lime' },
                  { label: 'Featured Apps', value: stats.featured, accent: 'text-cyanlab' },
                  { label: 'Draft Apps', value: stats.draft, accent: 'text-amber-300' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-charcoal p-5"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                      {stat.label}
                    </p>
                    <p className={`mt-2 font-display text-3xl font-bold ${stat.accent}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Latest App Entries Bar */}
              {sortedApps.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-charcoal/70 px-5 py-3.5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono uppercase tracking-wider text-zinc-400">
                    Latest Entries:
                  </span>
                  {sortedApps.slice(-3).reverse().map((entry) => (
                    <span
                      key={entry.id}
                      className="rounded-full border border-white/10 bg-surface px-3 py-1 text-zinc-200"
                    >
                      {entry.name} ({entry.status})
                    </span>
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search apps by name or ID..."
                      className="w-full rounded-xl border border-white/15 bg-charcoal pl-10 pr-4 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by category"
                    className="rounded-xl border border-white/15 bg-charcoal px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleInsertDemoApp}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cyanlab/35 bg-cyanlab/10 px-4 py-2.5 text-xs font-semibold text-cyanlab hover:bg-cyanlab/20"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>Insert [DEMO] App</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingApp(null);
                      setIsCreatingApp(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian hover:bg-lime-dim"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Application</span>
                  </button>
                </div>
              </div>

              {/* Applications List */}
              {filteredApps.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-charcoal/50 p-12 text-center space-y-3">
                  <p className="font-display text-xl font-bold text-white">
                    {sortedApps.length === 0
                      ? 'No applications added yet'
                      : 'No applications match your filter'}
                  </p>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    {sortedApps.length === 0
                      ? 'Click "Add Application" to create your first Play Store entry, or insert a temporary [DEMO] entry to preview layouts.'
                      : 'Adjust your search query or category filter.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map((app, index) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-white/10 bg-charcoal p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(app, -1)}
                            disabled={index === 0}
                            aria-label="Move up"
                            className="p-1 rounded border border-white/10 text-zinc-400 hover:text-white disabled:opacity-25"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(app, 1)}
                            disabled={index === filteredApps.length - 1}
                            aria-label="Move down"
                            className="p-1 rounded border border-white/10 text-zinc-400 hover:text-white disabled:opacity-25"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-12 h-12" />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-bold text-white truncate">
                              {app.name}
                            </h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
                                app.status === 'published'
                                  ? 'bg-lime/15 text-lime border border-lime/30'
                                  : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                              }`}
                            >
                              {app.status}
                            </span>
                            {app.featured && (
                              <span className="rounded-full bg-cyanlab/15 border border-cyanlab/30 px-2.5 py-0.5 font-mono text-[10px] uppercase text-cyanlab">
                                Featured
                              </span>
                            )}
                            {app.badge && (
                              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                                {app.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            <span className="font-mono text-zinc-500">#{app.displayOrder}</span> ·{' '}
                            {app.category} · {app.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(app)}
                          className="rounded-xl border border-white/15 bg-surface px-3 py-2 text-xs font-medium text-zinc-200 hover:border-lime/40"
                        >
                          {app.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(app)}
                          className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium ${
                            app.featured
                              ? 'border-cyanlab/40 bg-cyanlab/15 text-cyanlab'
                              : 'border-white/15 bg-surface text-zinc-300'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{app.featured ? 'Featured' : 'Feature'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewingApp(app)}
                          title="Preview Card"
                          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-surface px-3 py-2 text-xs text-zinc-200 hover:border-white/35"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateApp(app)}
                          title="Duplicate App"
                          className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-surface px-3 py-2 text-xs text-zinc-200 hover:border-white/35"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingApp(false);
                            setEditingApp(app);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(app)}
                          aria-label={`Delete ${app.name}`}
                          className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'releases' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleAddRelease}
                className="lg:col-span-5 rounded-2xl border border-white/10 bg-charcoal p-6 space-y-4 h-fit"
              >
                <h2 className="font-display text-lg font-bold text-white">
                  Add Release / What&apos;s New Entry
                </h2>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={releaseForm.appName}
                    onChange={(e) =>
                      setReleaseForm((p) => ({ ...p, appName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white focus:border-lime focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                      Type
                    </label>
                    <select
                      value={releaseForm.type}
                      onChange={(e) =>
                        setReleaseForm((p) => ({
                          ...p,
                          type: e.target.value as ReleaseEntry['type'],
                        }))
                      }
                      className="w-full rounded-xl border border-white/15 bg-obsidian px-2.5 py-2.5 text-sm text-white"
                    >
                      <option value="launch">Launch</option>
                      <option value="update">Update</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={releaseForm.version}
                      onChange={(e) =>
                        setReleaseForm((p) => ({ ...p, version: e.target.value }))
                      }
                      placeholder="1.0.0"
                      className="w-full rounded-xl border border-white/15 bg-obsidian px-3 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={releaseForm.date}
                      onChange={(e) =>
                        setReleaseForm((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/15 bg-obsidian px-2.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={releaseForm.summary}
                    onChange={(e) =>
                      setReleaseForm((p) => ({ ...p, summary: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Play Store Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={releaseForm.playStoreUrl}
                    onChange={(e) =>
                      setReleaseForm((p) => ({ ...p, playStoreUrl: e.target.value }))
                    }
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-lime py-3 text-xs font-bold uppercase tracking-wider text-obsidian hover:bg-lime-dim"
                >
                  Add Release Entry
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {draftReleases.releases.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-charcoal/50 p-10 text-center text-sm text-zinc-400">
                    No release entries yet. The Releases section remains hidden on the landing page until at least one entry is added.
                  </div>
                ) : (
                  draftReleases.releases.map((rel) => (
                    <div
                      key={rel.id}
                      className="rounded-2xl border border-white/10 bg-charcoal p-5 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-cyanlab uppercase">{rel.type}</span>
                          {rel.version && <span className="text-lime">{rel.version}</span>}
                          <span className="text-zinc-500">{rel.date}</span>
                        </div>
                        <h3 className="font-display font-bold text-white mt-1">{rel.appName}</h3>
                        <p className="text-xs text-zinc-300 mt-1">{rel.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRelease(rel.id)}
                        aria-label={`Delete release ${rel.appName}`}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="rounded-2xl border border-white/10 bg-charcoal p-6 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Site Configuration (`site-config.json`)
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Customize branding, headlines, SEO metadata, and feature section visibility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={draftConfig.brandName}
                    onChange={(e) =>
                      onUpdateConfig({ ...draftConfig, brandName: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Alternate Name
                  </label>
                  <input
                    type="text"
                    value={draftConfig.alternateName ?? ''}
                    onChange={(e) =>
                      onUpdateConfig({ ...draftConfig, alternateName: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Hero Headline Lines (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={draftConfig.hero.headlineLines.join('\n')}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...draftConfig,
                        hero: {
                          ...draftConfig.hero,
                          headlineLines: e.target.value.split('\n').filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Hero Description
                  </label>
                  <textarea
                    rows={3}
                    value={draftConfig.hero.description}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, description: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    SEO Page Title
                  </label>
                  <input
                    type="text"
                    value={draftConfig.seo.title}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...draftConfig,
                        seo: { ...draftConfig.seo, title: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-zinc-400 mb-1">
                    Canonical URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={draftConfig.seo.canonicalUrl ?? ''}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...draftConfig,
                        seo: { ...draftConfig.seo, canonicalUrl: e.target.value },
                      })
                    }
                    placeholder="https://example.edu/mca-lab"
                    className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(
                  [
                    { key: 'showFeaturedSection', label: 'Show Featured Section' },
                    { key: 'showCategories', label: 'Show Category Filters' },
                    { key: 'showLabProcessSection', label: 'Show Lab Process Section' },
                    { key: 'showReleasesSection', label: 'Show Releases Section' },
                  ] as const
                ).map((toggle) => (
                  <label
                    key={toggle.key}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-obsidian p-3 cursor-pointer text-xs text-zinc-200"
                  >
                    <input
                      type="checkbox"
                      checked={draftConfig.features[toggle.key]}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...draftConfig,
                          features: {
                            ...draftConfig.features,
                            [toggle.key]: e.target.checked,
                          },
                        })
                      }
                      className="accent-[#C8FF2E]"
                    />
                    <span>{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <CmsJsonManager
              draftApps={draftApps}
              draftConfig={draftConfig}
              draftReleases={draftReleases}
              onImportApps={onUpdateApps}
              onImportConfig={onUpdateConfig}
              onImportReleases={onUpdateReleases}
              onExported={onMarkExported}
              onRequestReset={() => setConfirmResetOpen(true)}
            />
          )}
        </div>
      </main>

      {/* App Editor Modal */}
      {(isCreatingApp || editingApp) && (
        <CmsAppEditorModal
          initialApp={editingApp}
          nextOrder={sortedApps.length + 1}
          existingIds={draftApps.apps.map((a) => a.id)}
          onSave={handleSaveApp}
          onClose={() => {
            setIsCreatingApp(false);
            setEditingApp(null);
          }}
        />
      )}

      {/* Standalone Card Preview Modal */}
      {previewingApp && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewingApp(null)}
        >
          <div className="max-w-lg w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase text-lime">Card Preview</span>
              <button
                type="button"
                onClick={() => setPreviewingApp(null)}
                className="rounded-lg bg-surface p-1.5 text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <AppCard app={previewingApp} index={0} darkSurface />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This removes the application from your local CMS draft. Export updated JSON afterward to apply changes to deployment."
        confirmLabel="Delete Application"
        danger
        onConfirm={handleDeleteApp}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Reset Drafts Confirmation */}
      <ConfirmModal
        open={confirmResetOpen}
        title="Reset all local drafts?"
        message="This discards all unsaved local CMS edits for apps, site config, and releases, restoring the originally loaded JSON files."
        confirmLabel="Reset Drafts"
        danger
        onConfirm={() => {
          onResetDrafts();
          setConfirmResetOpen(false);
        }}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
};

