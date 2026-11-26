import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff, Lock, ShieldAlert, Terminal, X } from 'lucide-react';
import { getLoginRateLimit, setLoginRateLimit } from '../utils/storage';

const LAB_PIN = 'MCA2025';
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 15000;

interface SecretLoginModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const SecretLoginModal: React.FC<SecretLoginModalProps> = ({
  open,
  onClose,
  onAuthenticated,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setPin('');
      setError(null);
      setSuccess(false);
      return;
    }
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const checkCooldown = () => {
      const rl = getLoginRateLimit();
      const remaining = Math.ceil((rl.lockedUntil - Date.now()) / 1000);
      setCooldownSec(remaining > 0 ? remaining : 0);
    };
    checkCooldown();
    const interval = window.setInterval(checkCooldown, 500);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (success) return;

    const rl = getLoginRateLimit();
    if (rl.lockedUntil > Date.now()) {
      const remaining = Math.ceil((rl.lockedUntil - Date.now()) / 1000);
      setCooldownSec(remaining);
      setError(`Too many attempts. Try again in ${remaining}s.`);
      return;
    }

    if (pin.trim() === LAB_PIN) {
      setLoginRateLimit({ attempts: 0, lockedUntil: 0 });
      setError(null);
      setSuccess(true);
      window.setTimeout(() => {
        onAuthenticated();
      }, 650);
    } else {
      const nextAttempts = rl.attempts + 1;
      if (nextAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + COOLDOWN_MS;
        setLoginRateLimit({ attempts: 0, lockedUntil });
        setCooldownSec(Math.ceil(COOLDOWN_MS / 1000));
        setError('Maximum incorrect attempts reached. Console paused for 15 seconds.');
      } else {
        setLoginRateLimit({ attempts: nextAttempts, lockedUntil: 0 });
        setError(`Invalid access PIN. (${MAX_ATTEMPTS - nextAttempts} attempts remaining)`);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-login-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-lime/30 bg-charcoal p-7 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 console-dots-bg opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime/35 bg-lime/10 text-lime">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">
                      CMS CONSOLE
                    </span>
                    <h2
                      id="secret-login-title"
                      className="font-display text-lg font-bold tracking-wide text-white"
                    >
                      RESTRICTED LAB ACCESS
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close lab login modal"
                  className="rounded-xl border border-white/10 bg-surface p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-3 text-xs text-zinc-400">
                Authorized department administrators only.
              </p>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-8 flex flex-col items-center justify-center gap-3 py-4 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-lime" />
                  <p className="font-display text-lg font-bold text-white">
                    Access Granted
                  </p>
                  <p className="font-mono text-xs text-zinc-400">
                    Initializing MCA Lab Content Dashboard...
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="lab-pin-input"
                      className="block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 mb-2"
                    >
                      Administrator PIN
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        ref={inputRef}
                        id="lab-pin-input"
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        disabled={cooldownSec > 0}
                        placeholder="Enter Lab PIN"
                        autoComplete="off"
                        className="w-full rounded-xl border border-white/15 bg-obsidian pl-10 pr-11 py-3 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-lime focus:outline-none disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={cooldownSec > 0 || !pin.trim()}
                    className="w-full rounded-xl bg-lime py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-obsidian hover:bg-lime-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {cooldownSec > 0 ? `Locked (${cooldownSec}s)` : 'Unlock CMS Console'}
                  </button>

                  <p className="pt-2 text-[11px] leading-relaxed text-zinc-500 border-t border-white/10">
                    Note: This is a static frontend-only CMS convenience gate. Client-side PINs do not provide server-side authentication.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

