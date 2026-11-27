import { useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useLabData } from './hooks/useLabData';
import { useSecretShortcut } from './hooks/useSecretShortcut';
import { isCmsSessionActive, setCmsSessionActive } from './utils/storage';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { AboutDepartmentSection } from './sections/AboutDepartmentSection';
import { VisionMissionSection } from './sections/VisionMissionSection';
import { FeaturedAppSection } from './sections/FeaturedAppSection';
import { AppDirectorySection } from './sections/AppDirectorySection';
import { LabProcessSection } from './sections/LabProcessSection';
import { ReleasesSection } from './sections/ReleasesSection';
import { FinalCtaSection } from './sections/FinalCtaSection';
import { Footer } from './components/Footer';
import { LegalDocType, LegalModal } from './components/LegalModal';
import { ErrorBoundaryState } from './components/ErrorBoundaryState';
import { SecretLoginModal } from './cms/SecretLoginModal';
import { CmsDashboard } from './cms/CmsDashboard';

export function App() {
  const {
    loading,
    error,
    activeConfig,
    activeApps,
    activeReleases,
    draftApps,
    draftConfig,
    draftReleases,
    syncStatus,
    previewDraftsOnPublic,
    reload,
    updateDraftApps,
    updateDraftConfig,
    updateDraftReleases,
    markExported,
    resetDraftsToPublished,
    togglePreviewDraftsOnPublic,
  } = useLabData();

  const [loginOpen, setLoginOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocType>(null);
  const [authenticated, setAuthenticated] = useState(() => isCmsSessionActive());

  useSecretShortcut(() => {
    if (authenticated) {
      setCmsOpen(true);
    } else {
      setLoginOpen(true);
    }
  });

  // Dynamically sync document SEO title, description, canonical URL from JSON
  useEffect(() => {
    if (!activeConfig?.seo) return;
    if (activeConfig.seo.title) {
      document.title = activeConfig.seo.title;
    }
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && activeConfig.seo.description) {
      descMeta.setAttribute('content', activeConfig.seo.description);
    }
    if (activeConfig.seo.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', activeConfig.seo.canonicalUrl);
    }
  }, [activeConfig]);

  const publishedApps = useMemo(() => {
    if (!activeApps?.apps) return [];
    return [...activeApps.apps]
      .filter((app) => app.status === 'published')
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [activeApps]);

  const featuredApps = useMemo(
    () => publishedApps.filter((app) => app.featured),
    [publishedApps]
  );

  const releases = useMemo(
    () => activeReleases?.releases ?? [],
    [activeReleases]
  );

  if (loading) {
    return (
        <div className="min-h-screen bg-rvscream flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-full border-2 border-rvsmaroon/20 border-t-rvsmaroon animate-spin" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-rvsslate">
                Loading MCA Digital Lab
              </p>
          </div>
        </div>
        );
  }

        if (error || !activeConfig || !activeApps || !activeReleases) {
    return (
        <ErrorBoundaryState
          message={error || 'Configuration JSON files could not be loaded.'}
          onRetry={() => void reload()}
        />
        );
  }

        const showReleases =
    activeConfig.features.showReleasesSection && releases.length > 0;

        return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-rvscream text-rvsslate relative overflow-x-clip">
              <ScrollProgress />

              {/* Subtle Admin Draft Banner ONLY when administrator explicitly toggles Preview Drafts */}
              {authenticated && previewDraftsOnPublic && !cmsOpen && (
                <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-charcoal/95 backdrop-blur px-4 py-2.5 text-xs shadow-2xl">
                  <span className="font-mono text-amber-300">DRAFT PREVIEW MODE</span>
                  <button
                    type="button"
                    onClick={() => setCmsOpen(true)}
                    className="rounded-lg bg-lime px-3 py-1 font-bold text-obsidian"
                  >
                    Open CMS
                  </button>
                </div>
              )}

              <Navbar config={activeConfig} hasReleases={showReleases} />

              <main>
                <HeroSection config={activeConfig} publishedApps={publishedApps} />

                <AboutDepartmentSection config={activeConfig} />

                <VisionMissionSection config={activeConfig} />

                {activeConfig.features.showFeaturedSection && featuredApps.length > 0 && (
                  <FeaturedAppSection featuredApps={featuredApps} />
                )}

                <AppDirectorySection
                  publishedApps={publishedApps}
                  showCategories={activeConfig.features.showCategories}
                />

                {activeConfig.features.showLabProcessSection && (
                  <LabProcessSection config={activeConfig} />
                )}

                {showReleases && <ReleasesSection releases={releases} />}

                <FinalCtaSection config={activeConfig} />
              </main>

              <Footer
          config={activeConfig}
          hasReleases={showReleases}
          onOpenLegal={setLegalDoc}
        />

        <LegalModal
          doc={legalDoc}
          config={activeConfig}
          onClose={() => setLegalDoc(null)}
        />

              <SecretLoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onAuthenticated={() => {
                  setCmsSessionActive(true);
                  setAuthenticated(true);
                  setLoginOpen(false);
                  setCmsOpen(true);
                }}
              />

              {cmsOpen && authenticated && draftApps && draftConfig && draftReleases && (
                <CmsDashboard
                  draftApps={draftApps}
                  draftConfig={draftConfig}
                  draftReleases={draftReleases}
                  syncStatus={syncStatus}
                  previewDraftsOnPublic={previewDraftsOnPublic}
                  onTogglePreviewDrafts={togglePreviewDraftsOnPublic}
                  onUpdateApps={updateDraftApps}
                  onUpdateConfig={updateDraftConfig}
                  onUpdateReleases={updateDraftReleases}
                  onMarkExported={markExported}
                  onResetDrafts={resetDraftsToPublished}
                  onLogout={() => {
                    setCmsSessionActive(false);
                    setAuthenticated(false);
                    setCmsOpen(false);
                    togglePreviewDraftsOnPublic(false);
                  }}
                  onClose={() => setCmsOpen(false)}
                />
              )}
            </div>
        </MotionConfig>
        );
}

        export default App;

