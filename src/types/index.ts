export type AppStatus = 'published' | 'draft';

export interface AppEntry {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  icon: string;
  playStoreUrl: string;
  category: string;
  platform: string[];
  status: AppStatus;
  featured: boolean;
  releaseDate?: string;
  version?: string;
  technologies?: string[];
  features?: string[];
  screenshots?: string[];
  developer?: string;
  badge?: string;
  displayOrder: number;
}

export interface AppsDataFile {
  version: number;
  lastUpdated: string;
  apps: AppEntry[];
}

export interface ReleaseEntry {
  id: string;
  appId?: string;
  appName: string;
  version?: string;
  date: string;
  type: 'launch' | 'update' | 'milestone';
  summary: string;
  playStoreUrl?: string;
}

export interface ReleasesDataFile {
  version: number;
  lastUpdated: string;
  releases: ReleaseEntry[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  version: number;
  brandName: string;
  alternateName?: string;
  tagline: string;
  institutionName: string;
  schoolName: string;
  departmentName: string;
  departmentBadge: string;
  seo: {
    title: string;
    description: string;
    canonicalUrl?: string;
  };
  hero: {
    headlineLines: string[];
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    headlineLines: string[];
    description: string;
  };
  department?: {
    heading: string;
    subheading?: string;
    description: string;
    extendedDescription?: string;
    ctaLabel?: string;
    vision: string;
    visionDetail?: string;
    mission: string;
    missionCommitments?: string[];
  };
  finalCta: {
    headline: string;
    description: string;
    ctaLabel: string;
  };
  features: {
    showCategories: boolean;
    showFeaturedSection: boolean;
    showReleasesSection: boolean;
    showLabProcessSection: boolean;
  };
  theme: {
    accentColor: string;
    secondaryAccent: string;
  };
  footer: {
    copyright: string;
    socialLinks?: SocialLink[];
  };
}

export type CmsSyncStatus = 'synced' | 'local-draft' | 'exported';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

