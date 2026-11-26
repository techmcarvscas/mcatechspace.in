import type {
  AppEntry,
  AppsDataFile,
  ReleasesDataFile,
  SiteConfig,
  ValidationResult,
} from '../types';

export const DEFAULT_CATEGORIES = [
  'Productivity',
  'Education',
  'Utility',
  'Lifestyle',
  'Social',
  'AI & Innovation',
  'Entertainment',
  'Other',
];

export function isValidHttpUrl(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isValidPlayStoreUrl(value: string): boolean {
  if (!isValidHttpUrl(value)) return false;
  try {
    const parsed = new URL(value.trim());
    return (
      parsed.hostname === 'play.google.com' ||
      parsed.hostname.endsWith('.play.google.com')
    );
  } catch {
    return false;
  }
}

export function isValidAssetOrUrl(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return true;
  }
  return isValidHttpUrl(trimmed);
}

export function validateAppEntry(app: Partial<AppEntry>): ValidationResult {
  const errors: string[] = [];

  if (!app.id || !app.id.trim()) {
    errors.push('Application ID is required.');
  } else if (!/^[a-z0-9-]+$/i.test(app.id.trim())) {
    errors.push('Application ID must use only letters, numbers, and hyphens.');
  }

  if (!app.name || !app.name.trim()) {
    errors.push('Application name is required.');
  }

  if (!app.tagline || !app.tagline.trim()) {
    errors.push('Tagline is required.');
  }

  if (!app.shortDescription || !app.shortDescription.trim()) {
    errors.push('Short description is required.');
  }

  if (!app.category || !app.category.trim()) {
    errors.push('Category is required.');
  }

  if (!app.playStoreUrl || !app.playStoreUrl.trim()) {
    errors.push('Google Play Store URL is required.');
  } else if (!isValidHttpUrl(app.playStoreUrl)) {
    errors.push('Google Play Store URL must be a valid https:// URL.');
  }

  if (app.icon && app.icon.trim() && !isValidAssetOrUrl(app.icon)) {
    errors.push('App icon must be a valid URL, /path, or image data URI.');
  }

  if (app.status !== 'published' && app.status !== 'draft') {
    errors.push('Status must be either "published" or "draft".');
  }

  if (app.displayOrder !== undefined && (Number.isNaN(Number(app.displayOrder)) || Number(app.displayOrder) < 0)) {
    errors.push('Display order must be a non-negative number.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAppsDataFile(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['JSON root must be an object.'] };
  }
  const obj = data as Partial<AppsDataFile>;
  if (typeof obj.version !== 'number') {
    errors.push('Missing numeric "version" field.');
  }
  if (!Array.isArray(obj.apps)) {
    errors.push('"apps" must be an array.');
    return { valid: false, errors };
  }

  const seenIds = new Set<string>();
  obj.apps.forEach((app, index) => {
    const res = validateAppEntry(app);
    if (!res.valid) {
      res.errors.forEach((e) => errors.push(`App #${index + 1} (${app?.name || 'unnamed'}): ${e}`));
    }
    if (app?.id) {
      if (seenIds.has(app.id)) {
        errors.push(`Duplicate application ID detected: "${app.id}".`);
      }
      seenIds.add(app.id);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSiteConfig(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Site config root must be an object.'] };
  }
  const cfg = data as Partial<SiteConfig>;
  if (!cfg.brandName?.trim()) errors.push('brandName is required.');
  if (!cfg.institutionName?.trim()) errors.push('institutionName is required.');
  if (!cfg.schoolName?.trim()) errors.push('schoolName is required.');
  if (!cfg.departmentName?.trim()) errors.push('departmentName is required.');
  if (!cfg.hero || !Array.isArray(cfg.hero.headlineLines) || cfg.hero.headlineLines.length === 0) {
    errors.push('hero.headlineLines must be a non-empty array.');
  }
  return { valid: errors.length === 0, errors };
}

export function validateReleasesDataFile(data: unknown): ValidationResult {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Releases root must be an object.'] };
  }
  const rel = data as Partial<ReleasesDataFile>;
  if (!Array.isArray(rel.releases)) {
    errors.push('"releases" must be an array.');
  } else {
    rel.releases.forEach((item, idx) => {
      if (!item.id?.trim()) errors.push(`Release #${idx + 1}: id is required.`);
      if (!item.appName?.trim()) errors.push(`Release #${idx + 1}: appName is required.`);
      if (!item.summary?.trim()) errors.push(`Release #${idx + 1}: summary is required.`);
      if (item.playStoreUrl && !isValidHttpUrl(item.playStoreUrl)) {
        errors.push(`Release #${idx + 1}: playStoreUrl must be a valid http/https URL.`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

