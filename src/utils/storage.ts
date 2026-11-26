import { AppsDataFile, ReleasesDataFile, SiteConfig } from '../types';

const KEYS = {
  APPS_DRAFT: 'mca_lab_draft_apps_v1',
  CONFIG_DRAFT: 'mca_lab_draft_config_v1',
  RELEASES_DRAFT: 'mca_lab_draft_releases_v1',
  CMS_STATUS: 'mca_lab_cms_status_v1',
  PREVIEW_DRAFTS: 'mca_lab_preview_drafts_v1',
  CMS_SESSION: 'mca_lab_cms_session_v1',
  LOGIN_RATE_LIMIT: 'mca_lab_rate_limit_v1',
} as const;

export function saveDraftApps(data: AppsDataFile): void {
  localStorage.setItem(KEYS.APPS_DRAFT, JSON.stringify(data));
}

export function loadDraftApps(): AppsDataFile | null {
  try {
    const raw = localStorage.getItem(KEYS.APPS_DRAFT);
    return raw ? (JSON.parse(raw) as AppsDataFile) : null;
  } catch {
    return null;
  }
}

export function saveDraftSiteConfig(data: SiteConfig): void {
  localStorage.setItem(KEYS.CONFIG_DRAFT, JSON.stringify(data));
}

export function loadDraftSiteConfig(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(KEYS.CONFIG_DRAFT);
    return raw ? (JSON.parse(raw) as SiteConfig) : null;
  } catch {
    return null;
  }
}

export function saveDraftReleases(data: ReleasesDataFile): void {
  localStorage.setItem(KEYS.RELEASES_DRAFT, JSON.stringify(data));
}

export function loadDraftReleases(): ReleasesDataFile | null {
  try {
    const raw = localStorage.getItem(KEYS.RELEASES_DRAFT);
    return raw ? (JSON.parse(raw) as ReleasesDataFile) : null;
  } catch {
    return null;
  }
}

export function clearAllDrafts(): void {
  localStorage.removeItem(KEYS.APPS_DRAFT);
  localStorage.removeItem(KEYS.CONFIG_DRAFT);
  localStorage.removeItem(KEYS.RELEASES_DRAFT);
  localStorage.removeItem(KEYS.CMS_STATUS);
}

export function getSavedSyncStatus(): 'synced' | 'local-draft' | 'exported' {
  const val = localStorage.getItem(KEYS.CMS_STATUS);
  if (val === 'local-draft' || val === 'exported') return val;
  return 'synced';
}

export function setSavedSyncStatus(status: 'synced' | 'local-draft' | 'exported'): void {
  localStorage.setItem(KEYS.CMS_STATUS, status);
}

export function getPreviewDraftsPref(): boolean {
  return localStorage.getItem(KEYS.PREVIEW_DRAFTS) === 'true';
}

export function setPreviewDraftsPref(enabled: boolean): void {
  localStorage.setItem(KEYS.PREVIEW_DRAFTS, String(enabled));
}

export function isCmsSessionActive(): boolean {
  return sessionStorage.getItem(KEYS.CMS_SESSION) === 'authorized';
}

export function setCmsSessionActive(active: boolean): void {
  if (active) {
    sessionStorage.setItem(KEYS.CMS_SESSION, 'authorized');
  } else {
    sessionStorage.removeItem(KEYS.CMS_SESSION);
  }
}

export interface RateLimitState {
  attempts: number;
  lockedUntil: number;
}

export function getLoginRateLimit(): RateLimitState {
  try {
    const raw = sessionStorage.getItem(KEYS.LOGIN_RATE_LIMIT);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    return JSON.parse(raw) as RateLimitState;
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

export function setLoginRateLimit(state: RateLimitState): void {
  sessionStorage.setItem(KEYS.LOGIN_RATE_LIMIT, JSON.stringify(state));
}

