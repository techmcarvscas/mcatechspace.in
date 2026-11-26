import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  FileCode2,
  RotateCcw,
  ShieldCheck,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { AppsDataFile, ReleasesDataFile, SiteConfig } from '../types';
import {
  validateAppsDataFile,
  validateReleasesDataFile,
  validateSiteConfig,
} from '../utils/validation';
import { copyJsonToClipboard, downloadJsonFile, readFileAsText } from '../utils/jsonIO';
import { ConfirmModal } from './ConfirmModal';

interface CmsJsonManagerProps {
  draftApps: AppsDataFile;
  draftConfig: SiteConfig;
  draftReleases: ReleasesDataFile;
  onImportApps: (data: AppsDataFile) => void;
  onImportConfig: (data: SiteConfig) => void;
  onImportReleases: (data: ReleasesDataFile) => void;
  onExported: () => void;
  onRequestReset: () => void;
}

type JsonTarget = 'apps' | 'site-config' | 'releases';

export const CmsJsonManager: React.FC<CmsJsonManagerProps> = ({
  draftApps,
  draftConfig,
  draftReleases,
  onImportApps,
  onImportConfig,
  onImportReleases,
  onExported,
  onRequestReset,
}) => {
  const [target, setTarget] = useState<JsonTarget>('apps');
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    target: JsonTarget;
    parsed: unknown;
  } | null>(null);

  const currentData =
    target === 'apps' ? draftApps : target === 'site-config' ? draftConfig : draftReleases;
  const filename = `${target}.json`;

  const handleCopy = async () => {
    const ok = await copyJsonToClipboard(currentData);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownload = (which: JsonTarget) => {
    const data =
      which === 'apps' ? draftApps : which === 'site-config' ? draftConfig : draftReleases;
    downloadJsonFile(`${which}.json`, data);
    onExported();
    setFeedback({
      type: 'success',
      message: `Exported ${which}.json. Replace public/data/${which}.json in the repository and redeploy.`,
    });
  };

  const handleExportAll = () => {
    downloadJsonFile('apps.json', draftApps);
    downloadJsonFile('site-config.json', draftConfig);
    downloadJsonFile('releases.json', draftReleases);
    onExported();
    setFeedback({
      type: 'success',
      message:
        'Exported apps.json, site-config.json, and releases.json. Replace the files in public/data/ and deploy.',
    });
  };

  const handleValidateCurrent = () => {
    const res =
      target === 'apps'
        ? validateAppsDataFile(draftApps)
        : target === 'site-config'
          ? validateSiteConfig(draftConfig)
          : validateReleasesDataFile(draftReleases);
    if (res.valid) {
      setFeedback({ type: 'success', message: `${filename} passed schema validation cleanly.` });
    } else {
      setFeedback({ type: 'error', message: res.errors.join(' ') });
    }
  };

  const validateAndQueueImport = (rawJson: string) => {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      const res =
        target === 'apps'
          ? validateAppsDataFile(parsed)
          : target === 'site-config'
            ? validateSiteConfig(parsed)
            : validateReleasesDataFile(parsed);

      if (!res.valid) {
        setFeedback({ type: 'error', message: `Validation failed: ${res.errors.join(' ')}` });
        return;
      }

      setPendingImport({ target, parsed });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? `Invalid JSON syntax: ${err.message}` : 'Invalid JSON.',
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      setImportText(text);
      validateAndQueueImport(text);
    } catch {
      setFeedback({ type: 'error', message: 'Unable to read selected JSON file.' });
    } finally {
      e.target.value = '';
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    if (pendingImport.target === 'apps') {
      onImportApps(pendingImport.parsed as AppsDataFile);
    } else if (pendingImport.target === 'site-config') {
      onImportConfig(pendingImport.parsed as SiteConfig);
    } else {
      onImportReleases(pendingImport.parsed as ReleasesDataFile);
    }
    setFeedback({
      type: 'success',
      message: `Imported ${pendingImport.target}.json into local draft storage.`,
    });
    setPendingImport(null);
    setImportText('');
  };

  return (
    <div className="space-y-6">
      {/* Workflow Guide */}
      <div className="rounded-2xl border border-lime/25 bg-lime/5 p-4 sm:p-5 text-xs text-zinc-300 space-y-2">
        <p className="font-mono uppercase tracking-wider text-lime font-semibold">
          Static JSON Deployment Workflow
        </p>
        <p className="leading-relaxed">
          Changes saved inside this CMS are stored only as <strong className="text-white">local drafts in your browser</strong>. To update the live website for all visitors, export the updated JSON files below, replace them inside <code className="text-lime">public/data/</code>, and redeploy.
        </p>
      </div>

      {/* Target selector & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-white/10 bg-obsidian p-1">
          {(['apps', 'site-config', 'releases'] as JsonTarget[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTarget(item);
                setFeedback(null);
              }}
              className={`rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                target === item
                  ? 'bg-lime text-obsidian font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item}.json
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleValidateCurrent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-lime/40"
          >
            <ShieldCheck className="w-4 h-4 text-lime" />
            <span>Validate</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-white/30"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload(target)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-4 py-2 text-xs font-bold uppercase tracking-wider text-obsidian hover:bg-lime-dim"
          >
            <Download className="w-4 h-4" />
            <span>Export {filename}</span>
          </button>
          <button
            type="button"
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-lime/40 bg-lime/10 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/20"
          >
            <Download className="w-4 h-4" />
            <span>Export All JSON</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs ${
            feedback.type === 'success'
              ? 'border-lime/35 bg-lime/10 text-lime'
              : 'border-red-500/35 bg-red-500/10 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Split View: Current JSON & Import/Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-obsidian p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-300">
              <FileCode2 className="w-4 h-4 text-lime" />
              Current {filename}
            </span>
            <button
              type="button"
              onClick={onRequestReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-300 hover:bg-red-500/20"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Local Drafts</span>
            </button>
          </div>
          <pre className="flex-1 max-h-[380px] overflow-auto rounded-xl bg-charcoal p-4 font-mono text-xs text-zinc-200 leading-relaxed">
            {JSON.stringify(currentData, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-white/10 bg-obsidian p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-zinc-300">
              Import / Restore {filename}
            </span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/15 bg-surface px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-lime/40">
              <Upload className="w-3.5 h-3.5 text-lime" />
              <span>Upload .json File</span>
              <input
                type="file"
                accept="application/json,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            rows={12}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={`Paste ${filename} content here to validate & import...`}
            className="flex-1 w-full rounded-xl border border-white/15 bg-charcoal p-3.5 font-mono text-xs text-white placeholder:text-zinc-600 focus:border-lime focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!importText.trim()}
              onClick={() => validateAndQueueImport(importText)}
              className="rounded-xl bg-surface border border-lime/40 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/10 disabled:opacity-40"
            >
              Validate &amp; Import JSON
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(pendingImport)}
        title={`Overwrite ${pendingImport?.target}.json draft?`}
        message="Importing this JSON will replace your current local draft for this file. You can reset back to the published JSON at any time."
        confirmLabel="Overwrite Draft"
        danger={false}
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  );
};

