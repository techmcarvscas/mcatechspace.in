import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, ShieldCheck, X } from 'lucide-react';
import { SiteConfig } from '../types';

export type LegalDocType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  doc: LegalDocType;
  config: SiteConfig;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ doc, config, onClose }) => {
  useEffect(() => {
    if (!doc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [doc, onClose]);

  const isPrivacy = doc === 'privacy';

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-rvsslate/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-xl border border-rvsslate/20 bg-white text-rvsslate shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-rvsmaroon px-6 py-4 flex items-center justify-between gap-4 border-b border-rvsgold/35">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-white/10 border border-rvsgold/40 flex items-center justify-center text-rvsgold">
                  {isPrivacy ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-rvsgold">
                    {config.institutionName} · {config.brandName}
                  </span>
                  <h2 id="legal-modal-title" className="font-display text-lg font-bold text-white">
                    {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close legal document"
                className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-zinc-700">
              {isPrivacy ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rvsmaroon">
                    Effective Date: {new Date().getFullYear()}
                  </p>
                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      1. Portal Scope &amp; Zero Personal Data Collection
                    </h3>
                    <p>
                      This website showcases Android applications created as a student-led
                      initiative in the {config.departmentName}, {config.schoolName},{' '}
                      {config.institutionName}. It operates as a static informational showcase
                      and does not require user registration, logins, or personal data
                      submissions from visitors.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      2. Browser Storage
                    </h3>
                    <p>
                      Standard public browsing does not place advertising or third-party
                      tracking cookies. Browser storage (<code>localStorage</code> and{' '}
                      <code>sessionStorage</code>) is used exclusively when authorized
                      department administrators access the local content management console
                      to preview draft JSON updates prior to deployment.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      3. External Google Play Store Links &amp; Individual Apps
                    </h3>
                    <p>
                      Clicking &ldquo;VIEW ON PLAY STORE&rdquo; redirects you to Google Play.
                      Any downloads, device permissions, or data handling performed inside an
                      installed Android application are governed by Google Play&apos;s
                      Privacy Policy and the respective application&apos;s Play Store privacy
                      disclosure.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      4. Contact &amp; Updates
                    </h3>
                    <p>
                      Questions regarding listed student applications may be directed to the{' '}
                      {config.departmentName}, {config.schoolName}, {config.institutionName}.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rvsmaroon">
                    Effective Date: {new Date().getFullYear()}
                  </p>
                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      1. Purpose of the Platform
                    </h3>
                    <p>
                      This showcase highlights mobile applications designed and published by
                      MCA students at {config.institutionName} ({config.schoolName}). All
                      listings are presented for informational discovery and direct navigation
                      to official Google Play Store pages.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      2. Application Availability &amp; External Distribution
                    </h3>
                    <p>
                      Applications listed on this portal are distributed through Google Play
                      Store. Availability, supported Android versions, and store terms are
                      subject to Google Play policies and each application&apos;s respective
                      release status.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      3. Intellectual Property
                    </h3>
                    <p>
                      Application names, icons, and software concepts displayed belong to their
                      respective student creators and the {config.departmentName},{' '}
                      {config.institutionName}. Google Play and the Google Play logo are
                      trademarks of Google LLC.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-display text-base font-bold text-rvsslate">
                      4. Disclaimer
                    </h3>
                    <p>
                      This website and linked student-developed utilities are provided on an
                      &ldquo;as-is&rdquo; basis for academic demonstration and general use.{' '}
                      {config.institutionName} reserves the right to update, add, or remove
                      listed projects at any time.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-rvsslate/15 bg-rvscream-soft flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-rvsmaroon px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rvsmaroon-dark transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

