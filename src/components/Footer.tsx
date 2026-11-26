import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { SiteConfig } from '../types';
import { isValidHttpUrl } from '../utils/validation';

import { LegalDocType } from './LegalModal';

interface FooterProps {
  config: SiteConfig;
  hasReleases: boolean;
  onOpenLegal: (doc: Exclude<LegalDocType, null>) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, hasReleases, onOpenLegal }) => {
  const validSocialLinks = (config.footer.socialLinks ?? []).filter(
    (s) => s.label?.trim() && isValidHttpUrl(s.url)
  );

  return (
    <footer className="bg-rvsslate text-white py-14 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <LogoMark
              brandName={config.brandName}
              subLabel={config.schoolName}
              variant="dark"
            />
            <div className="space-y-1 text-sm text-zinc-300 pt-1">
              <p className="text-white font-semibold">{config.departmentName}</p>
              <p>{config.schoolName}</p>
              <p>{config.institutionName}</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-rvsgold">
              Directory
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <a href="#home" className="hover:text-rvsgold transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#apps" className="hover:text-rvsgold transition-colors">
                  Applications
                </a>
              </li>
              <li>
                <a href="#lab" className="hover:text-rvsgold transition-colors">
                  About the Lab
                </a>
              </li>
              {hasReleases && (
                <li>
                  <a href="#releases" className="hover:text-rvsgold transition-colors">
                    Releases
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-rvsgold">
              Academic Ecosystem
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <a href="#apps" className="hover:text-rvsgold transition-colors">
                  Google Play Store Showcase
                </a>
              </li>
              <li className="text-zinc-400 text-xs leading-relaxed">
                A student-led Android development initiative from the Department of MCA.
              </li>
              {validSocialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-rvsgold transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <p>
            © {new Date().getFullYear()} {config.footer.copyright || config.institutionName}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-rvsgold transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-zinc-600">
              •
            </span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-rvsgold transition-colors underline-offset-4 hover:underline"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
