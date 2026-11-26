import { useCallback, useEffect, useState } from 'react';
import {
  AppsDataFile,
  CmsSyncStatus,
  ReleasesDataFile,
  SiteConfig,
} from '../types';
import {
  clearAllDrafts,
  getPreviewDraftsPref,
  getSavedSyncStatus,
  loadDraftApps,
  loadDraftReleases,
  loadDraftSiteConfig,
  saveDraftApps,
  saveDraftReleases,
  saveDraftSiteConfig,
  setPreviewDraftsPref,
  setSavedSyncStatus,
} from '../utils/storage';

export interface LabDataState {
  loading: boolean;
  error: string | null;
  publishedApps: AppsDataFile | null;
  publishedConfig: SiteConfig | null;
  publishedReleases: ReleasesDataFile | null;
  draftApps: AppsDataFile | null;
  draftConfig: SiteConfig | null;
  draftReleases: ReleasesDataFile | null;
  syncStatus: CmsSyncStatus;
  previewDraftsOnPublic: boolean;
}

export function useLabData() {
  const [state, setState] = useState<LabDataState>({
    loading: true,
    error: null,
    publishedApps: null,
    publishedConfig: null,
    publishedReleases: null,
    draftApps: null,
    draftConfig: null,
    draftReleases: null,
    syncStatus: getSavedSyncStatus(),
    previewDraftsOnPublic: getPreviewDraftsPref(),
  });

  const loadFromPublicJson = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const cacheBust = `?t=${Date.now()}`;
      const [configRes, appsRes, releasesRes] = await Promise.all([
        fetch(`/data/site-config.json${cacheBust}`),
        fetch(`/data/apps.json${cacheBust}`),
        fetch(`/data/releases.json${cacheBust}`),
      ]);

      if (!configRes.ok) {
        throw new Error(`Failed to load site-config.json (HTTP ${configRes.status})`);
      }
      if (!appsRes.ok) {
        throw new Error(`Failed to load apps.json (HTTP ${appsRes.status})`);
      }
      if (!releasesRes.ok) {
        throw new Error(`Failed to load releases.json (HTTP ${releasesRes.status})`);
      }

      const [publishedConfig, publishedApps, publishedReleases] = (await Promise.all([
        configRes.json(),
        appsRes.json(),
        releasesRes.json(),
      ])) as [SiteConfig, AppsDataFile, ReleasesDataFile];

      const localDraftApps = loadDraftApps();
      const localDraftConfig = loadDraftSiteConfig();
      const localDraftReleases = loadDraftReleases();

      const hasLocalDraft = Boolean(localDraftApps || localDraftConfig || localDraftReleases);

      setState({
        loading: false,
        error: null,
        publishedApps,
        publishedConfig,
        publishedReleases,
        draftApps: localDraftApps ?? publishedApps,
        draftConfig: localDraftConfig ?? publishedConfig,
        draftReleases: localDraftReleases ?? publishedReleases,
        syncStatus: hasLocalDraft ? getSavedSyncStatus() === 'exported' ? 'exported' : 'local-draft' : 'synced',
        previewDraftsOnPublic: getPreviewDraftsPref(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unable to load lab JSON configuration.',
      }));
    }
  }, []);

  useEffect(() => {
    void loadFromPublicJson();
  }, [loadFromPublicJson]);

  const updateDraftApps = useCallback((nextApps: AppsDataFile) => {
    const stamped: AppsDataFile = {
      ...nextApps,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    saveDraftApps(stamped);
    setSavedSyncStatus('local-draft');
    setState((prev) => ({
      ...prev,
      draftApps: stamped,
      syncStatus: 'local-draft',
    }));
  }, []);

  const updateDraftConfig = useCallback((nextConfig: SiteConfig) => {
    saveDraftSiteConfig(nextConfig);
    setSavedSyncStatus('local-draft');
    setState((prev) => ({
      ...prev,
      draftConfig: nextConfig,
      syncStatus: 'local-draft',
    }));
  }, []);

  const updateDraftReleases = useCallback((nextReleases: ReleasesDataFile) => {
    const stamped: ReleasesDataFile = {
      ...nextReleases,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    saveDraftReleases(stamped);
    setSavedSyncStatus('local-draft');
    setState((prev) => ({
      ...prev,
      draftReleases: stamped,
      syncStatus: 'local-draft',
    }));
  }, []);

  const markExported = useCallback(() => {
    setSavedSyncStatus('exported');
    setState((prev) => ({
      ...prev,
      syncStatus: 'exported',
    }));
  }, []);

  const resetDraftsToPublished = useCallback(() => {
    clearAllDrafts();
    setPreviewDraftsPref(false);
    setState((prev) => ({
      ...prev,
      draftApps: prev.publishedApps,
      draftConfig: prev.publishedConfig,
      draftReleases: prev.publishedReleases,
      syncStatus: 'synced',
      previewDraftsOnPublic: false,
    }));
  }, []);

  const togglePreviewDraftsOnPublic = useCallback((enabled: boolean) => {
    setPreviewDraftsPref(enabled);
    setState((prev) => ({
      ...prev,
      previewDraftsOnPublic: enabled,
    }));
  }, []);

  const activeConfig = state.previewDraftsOnPublic
    ? state.draftConfig ?? state.publishedConfig
    : state.publishedConfig;
  const activeApps = state.previewDraftsOnPublic
    ? state.draftApps ?? state.publishedApps
    : state.publishedApps;
  const activeReleases = state.previewDraftsOnPublic
    ? state.draftReleases ?? state.publishedReleases
    : state.publishedReleases;

  return {
    ...state,
    activeConfig,
    activeApps,
    activeReleases,
    reload: loadFromPublicJson,
    updateDraftApps,
    updateDraftConfig,
    updateDraftReleases,
    markExported,
    resetDraftsToPublished,
    togglePreviewDraftsOnPublic,
  };
}

