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

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Applications', href: '#apps' },
    { label: 'About the Lab', href: '#lab' },
    ...(hasReleases ? [{ label: 'Releases', href: '#releases' }] : []),
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      {/* Main Warm Cream RVS Navigation Bar with crisp RVS Maroon top rule */}
      <div
        className={`border-t-[3px] border-t-rvsmaroon border-b transition-all duration-300 ${
          scrolled
            ? 'bg-rvscream/95 backdrop-blur-md border-b-rvsslate/15 py-2.5 shadow-sm'
            : 'bg-rvscream border-b-rvsslate/15 py-3'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <a
            href="#home"
            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsmaroon"
            aria-label={`${config.brandName} Home`}
          >
            <LogoMark
              brandName={config.brandName}
              subLabel={config.institutionName}
              variant="light"
            />
          </a>

          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-semibold tracking-wide text-rvsslate hover:text-rvsmaroon transition-colors relative group py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsmaroon rounded"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-rvsmaroon transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#apps"
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-rvsmaroon px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-rvsmaroon-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold"
            >
              <span>Explore Apps</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-rvsgold" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center rounded-md border border-rvsslate/20 bg-white p-2 text-rvsslate hover:border-rvsmaroon hover:text-rvsmaroon focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsmaroon"
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
            className="md:hidden border-b border-rvsslate/15 bg-rvscream px-4 py-5 shadow-xl"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col divide-y divide-rvsslate/10 border border-rvsslate/15 rounded-md overflow-hidden bg-white"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 text-sm font-semibold text-rvsslate hover:bg-rvscream-soft hover:text-rvsmaroon transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href="#apps"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-rvsmaroon px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              <span>Explore Apps</span>
              <ArrowUpRight className="w-4 h-4 text-rvsgold" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
