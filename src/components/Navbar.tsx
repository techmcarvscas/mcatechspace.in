import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
  hasReleases: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ config, hasReleases }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const headerDepartmentLabel =
    !config.brandName || /^dept\.?\s*of\s*mca$/i.test(config.brandName.trim())
      ? 'Department of MCA'
      : config.brandName;

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About Dept', href: '#department' },
    { label: 'Vision & Mission', href: '#vision-mission' },
    { label: 'Applications', href: '#apps' },
    { label: 'Our Lab', href: '#lab' },
    ...(hasReleases ? [{ label: 'Releases', href: '#releases' }] : []),
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      {/* Official RVS Crimson Maroon Header Matching rvscas.ac.in */}
      <div
        className={`border-b border-rvsgold/40 transition-all duration-300 ${
          scrolled
            ? 'bg-rvsmaroon/95 backdrop-blur-md py-2 shadow-lg'
            : 'bg-rvsmaroon py-2.5 shadow-md'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <a
            href="#home"
            className="shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
            aria-label={`${config.institutionName} - ${headerDepartmentLabel} Home`}
          >
            <LogoMark
              brandName={config.institutionName}
              subLabel={headerDepartmentLabel}
              variant="dark"
              logoSize="lg"
              collegeTitle
            />
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 2xl:gap-9"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center text-[13px] xl:text-sm font-semibold tracking-wide text-white/95 hover:text-rvsgold transition-colors relative group py-1.5 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold rounded"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-rvsgold transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#apps"
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-rvsgold px-3.5 xl:px-4 py-2 xl:py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-rvsslate hover:bg-rvsgold-dim transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Explore Apps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/25 bg-rvsmaroon-dark p-2 text-white hover:border-rvsgold hover:text-rvsgold focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden border-b border-rvsgold/40 bg-rvsmaroon-dark px-4 py-5 shadow-xl"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col divide-y divide-white/15 border border-white/15 rounded-md overflow-hidden bg-rvsmaroon"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 text-sm font-semibold text-white hover:bg-rvsmaroon-dark hover:text-rvsgold transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="#apps"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-rvsgold px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-rvsslate"
            >
              <span>Explore Apps</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
