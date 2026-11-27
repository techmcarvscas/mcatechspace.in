import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Battery,
  CalendarDays,
  CheckCircle2,
  Leaf,
  Signal,
  Ticket,
  TrendingUp,
  Wallet,
  Wifi,
} from 'lucide-react';
import { AppEntry } from '../types';
import { AppIconGraphic } from './AppCard';
import { isValidHttpUrl } from '../utils/validation';

interface HeroFlowCanvasProps {
  publishedApps: AppEntry[];
}

const CALC_KEYS = [
  ['C', '÷', '×', '⌫'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
];

const DEMO_SEQUENCE = [
  { key: '2', expr: '2', result: '2' },
  { key: '5', expr: '25', result: '25' },
  { key: '×', expr: '25 ×', result: '25' },
  { key: '4', expr: '25 × 4', result: '100' },
  { key: '=', expr: '25 × 4 =', result: '100' },
];

const HealthTrackerScreen: React.FC<{ app: AppEntry; reducedMotion: boolean | null }> = ({
  app,
  reducedMotion,
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#0C1F1A] via-[#0B1518] to-[#0B0F14] text-white">
      {/* App Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-8 h-8 rounded-lg" />
          <div className="min-w-0">
            <p className="font-display text-xs font-bold text-white leading-tight truncate">
              {app.name}
            </p>
            <p className="font-mono text-[9px] text-emerald-400 uppercase tracking-wider">
              Daily Wellness
            </p>
          </div>
        </div>
        <span className="h-7 w-7 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
        </span>
      </div>

      {/* Live Animated ECG / Pulse Monitor Card */}
      <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono">
          <span className="text-zinc-400 uppercase">Pulse Rhythm</span>
          <span className="text-emerald-400 font-semibold">ACTIVE MONITOR</span>
        </div>
        <div className="h-16 sm:h-20 w-full flex items-center">
          <svg viewBox="0 0 220 56" className="w-full h-full overflow-visible">
            <path
              d="M0,30 L42,30 L56,30 L66,14 L76,46 L88,8 L100,42 L110,30 L150,30 L162,20 L172,38 L182,30 L220,30"
              fill="none"
              stroke="rgba(52,211,153,0.18)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M0,30 L42,30 L56,30 L66,14 L76,46 L88,8 L100,42 L110,30 L150,30 L162,20 L172,38 L182,30 L220,30"
              fill="none"
              stroke="#34D399"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="100 100"
              animate={reducedMotion ? undefined : { strokeDashoffset: [100, 0, -100] }}
              transition={{
                duration: 3.2,
                times: [0, 0.55, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </div>
      </div>

      {/* Animated Habit Progress Bars */}
      <div className="space-y-2.5">
        {[
          { label: 'Hydration Goal', pct: '78%', color: 'bg-emerald-400' },
          { label: 'Activity Streak', pct: '64%', color: 'bg-teal-400' },
          { label: 'Sleep Balance', pct: '86%', color: 'bg-rvsgold' },
        ].map((bar, idx) => (
          <div key={bar.label} className="space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-zinc-400">
              <span>{bar.label}</span>
              <span className="text-zinc-200">{bar.pct}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: bar.pct }}
                transition={{ duration: 1.1, delay: 0.2 + idx * 0.2, ease: 'easeOut' }}
                className={`h-full rounded-full ${bar.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      {isValidHttpUrl(app.playStoreUrl) && (
        <a
          href={app.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 py-2 text-[10px] font-bold uppercase tracking-wider text-rvsslate hover:bg-emerald-300 transition-colors"
        >
          <span>Open on Play Store</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};

const CalcProScreen: React.FC<{ app: AppEntry; reducedMotion: boolean | null }> = ({
  app,
  reducedMotion,
}) => {
  const [expr, setExpr] = useState('2');
  const [result, setResult] = useState('2');
  const [autoKey, setAutoKey] = useState<string | null>('2');
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (reducedMotion || manualMode) return;
    let step = 1;
    const timer = window.setInterval(() => {
      const current = DEMO_SEQUENCE[step % DEMO_SEQUENCE.length];
      setAutoKey(current.key);
      setExpr(current.expr);
      setResult(current.result);
      step += 1;
    }, 950);
    return () => window.clearInterval(timer);
  }, [reducedMotion, manualMode]);

  const handleKeyPress = (k: string) => {
    setManualMode(true);
    setAutoKey(k);
    if (k === 'C') {
      setExpr('0');
      setResult('0');
      return;
    }
    if (k === '⌫') {
      setExpr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (k === '=') {
      try {
        const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
        if (/^[0-9+\-*/.\s]+$/.test(sanitized)) {
          const val = Function(`"use strict"; return (${sanitized})`)();
          if (typeof val === 'number' && Number.isFinite(val)) {
            setResult(String(Number(val.toFixed(4))));
          }
        }
      } catch {
        setResult('Error');
      }
      return;
    }
    setExpr((prev) =>
      prev === '0' ? k : `${prev}${['+', '-', '×', '÷'].includes(k) ? ` ${k} ` : k}`
    );
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#11131E] via-[#0B0D14] to-[#080A0F] text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-8 h-8 rounded-lg" />
          <div className="min-w-0">
            <p className="font-display text-xs font-bold text-white leading-tight truncate">
              {app.name}
            </p>
            <p className="font-mono text-[9px] text-cyan-400 uppercase tracking-wider">
              Interactive Pad
            </p>
          </div>
        </div>
        {isValidHttpUrl(app.playStoreUrl) && (
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Calc Pro on Play Store"
            className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-1.5 text-cyan-300 hover:bg-cyan-400/20 transition-colors shrink-0"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Display */}
      <div className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-right">
        <p className="font-mono text-[11px] text-zinc-400 truncate min-h-[16px]">{expr}</p>
        <motion.p
          key={result}
          initial={{ opacity: 0.5, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5 truncate"
        >
          {result}
        </motion.p>
      </div>

      {/* Interactive Keypad */}
      <div className="grid grid-cols-4 gap-1.5">
        {CALC_KEYS.flat().map((k) => {
          const isOp = ['÷', '×', '-', '+'].includes(k);
          const isEq = k === '=';
          const isLit = autoKey === k;
          return (
            <motion.button
              key={k}
              type="button"
              onClick={() => handleKeyPress(k)}
              whileTap={{ scale: 0.9 }}
              className={`h-9 sm:h-10 rounded-lg font-mono text-xs sm:text-sm font-semibold transition-colors ${
                isEq
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : isOp
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                    : 'bg-white/[0.06] text-zinc-200 border border-white/10 hover:bg-white/15'
              } ${isLit ? 'ring-2 ring-cyan-300' : ''}`}
            >
              {k}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const PocketTrackScreen: React.FC<{ app: AppEntry; reducedMotion: boolean | null }> = ({
  app,
  reducedMotion,
}) => (
  <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#170F38] via-[#100B24] to-[#080910] text-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-8 h-8 rounded-lg" />
        <div className="min-w-0">
          <p className="font-display text-xs font-bold text-white leading-tight truncate">
            {app.name}
          </p>
          <p className="font-mono text-[9px] text-violet-300 uppercase tracking-wider">
            Smart Wallet
          </p>
        </div>
      </div>
      <span className="h-7 w-7 rounded-full bg-violet-500/20 border border-violet-400/35 flex items-center justify-center shrink-0">
        <Wallet className="w-3.5 h-3.5 text-violet-300" />
      </span>
    </div>

    <div className="rounded-2xl border border-violet-400/25 bg-white/[0.05] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between text-[9px] font-mono">
        <span className="text-zinc-400 uppercase">Spending Overview</span>
        <span className="inline-flex items-center gap-1 text-violet-300 font-semibold">
          <TrendingUp className="w-3 h-3" />
          TRACKED
        </span>
      </div>
      <div className="grid grid-cols-5 items-end gap-1.5 h-14 pt-1">
        {[42, 68, 52, 84, 64].map((hPct, i) => (
          <motion.div
            key={i}
            initial={reducedMotion ? { height: `${hPct}%` } : { height: 0 }}
            animate={{ height: `${hPct}%` }}
            transition={{ duration: 0.65, delay: 0.1 + i * 0.08 }}
            className={`rounded-t-md ${
              i === 3 ? 'bg-violet-400' : 'bg-indigo-400/45'
            }`}
          />
        ))}
      </div>
    </div>

    <div className="space-y-2">
      {[
        { label: 'Daily Expense Log', tag: 'Organized' },
        { label: 'Category Budgets', tag: 'Synced' },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px]"
        >
          <span className="text-zinc-200 font-medium">{row.label}</span>
          <span className="font-mono text-[9px] text-violet-300">{row.tag}</span>
        </div>
      ))}
    </div>

    {isValidHttpUrl(app.playStoreUrl) && (
      <a
        href={app.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-500 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-violet-400 transition-colors"
      >
        <span>Open on Play Store</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);

const GatherlyScreen: React.FC<{ app: AppEntry }> = ({ app }) => (
  <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#251042] via-[#140B26] to-[#0A0812] text-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-8 h-8 rounded-lg" />
        <div className="min-w-0">
          <p className="font-display text-xs font-bold text-white leading-tight truncate">
            {app.name}
          </p>
          <p className="font-mono text-[9px] text-rvsgold uppercase tracking-wider">
            Event Planner
          </p>
        </div>
      </div>
      <span className="h-7 w-7 rounded-full bg-rvsgold/15 border border-rvsgold/35 flex items-center justify-center shrink-0">
        <CalendarDays className="w-3.5 h-3.5 text-rvsgold" />
      </span>
    </div>

    <div className="rounded-2xl border border-rvsgold/30 bg-white/[0.05] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase text-rvsgold">Event Schedule</span>
        <Ticket className="w-3.5 h-3.5 text-rvsgold" />
      </div>
      <p className="text-xs font-semibold text-white leading-snug">
        Coordinate sessions, passes, and event timelines effortlessly.
      </p>
      <div className="flex items-center gap-1.5 pt-0.5">
        {['Dates', 'Passes', 'Guests'].map((pill) => (
          <span
            key={pill}
            className="rounded-md bg-purple-500/25 border border-purple-400/30 px-2 py-0.5 text-[9px] font-semibold text-purple-200"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      {[
        { title: 'Timeline & Agenda', meta: 'Ready' },
        { title: 'Pass Coordination', meta: 'Active' },
      ].map((item) => (
        <div
          key={item.title}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px]"
        >
          <span className="text-zinc-200 font-medium">{item.title}</span>
          <span className="font-mono text-[9px] text-rvsgold">{item.meta}</span>
        </div>
      ))}
    </div>

    {isValidHttpUrl(app.playStoreUrl) && (
      <a
        href={app.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rvsgold py-2 text-[10px] font-bold uppercase tracking-wider text-rvsslate hover:bg-rvsgold-dim transition-colors"
      >
        <span>Open on Play Store</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);

const HabitFlowScreen: React.FC<{ app: AppEntry; reducedMotion: boolean | null }> = ({
  app,
  reducedMotion,
}) => (
  <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#171928] via-[#121620] to-[#0B0F14] text-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-8 h-8 rounded-lg" />
        <div className="min-w-0">
          <p className="font-display text-xs font-bold text-white leading-tight truncate">
            {app.name}
          </p>
          <p className="font-mono text-[9px] text-emerald-300 uppercase tracking-wider">
            Daily Flow
          </p>
        </div>
      </div>
      <span className="h-7 w-7 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0">
        <Leaf className="w-3.5 h-3.5 text-emerald-300" />
      </span>
    </div>

    <div className="space-y-2">
      {[
        { habit: 'Morning Focus Routine', done: true },
        { habit: 'Daily Reading Habit', done: true },
        { habit: 'Evening Reflection', done: false },
      ].map((item, idx) => (
        <motion.div
          key={item.habit}
          initial={reducedMotion ? undefined : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.12 }}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5"
        >
          <span className="text-[11px] font-medium text-zinc-100 truncate pr-2">{item.habit}</span>
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${
              item.done ? 'text-emerald-400' : 'text-violet-300/60'
            }`}
          />
        </motion.div>
      ))}
    </div>

    <div className="rounded-xl border border-violet-300/20 bg-violet-400/10 p-2.5 space-y-1.5">
      <div className="flex justify-between font-mono text-[9px] text-violet-200">
        <span>CONSISTENCY LOOP</span>
        <span className="text-emerald-300 font-semibold">STEADY</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={reducedMotion ? { width: '76%' } : { width: 0 }}
          animate={{ width: '76%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-400"
        />
      </div>
    </div>

    {isValidHttpUrl(app.playStoreUrl) && (
      <a
        href={app.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 py-2 text-[10px] font-bold uppercase tracking-wider text-rvsslate hover:bg-emerald-300 transition-colors"
      >
        <span>Open on Play Store</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);

const GenericAppScreen: React.FC<{ app: AppEntry }> = ({ app }) => (
  <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-b from-rvsslate via-rvsslate-dark to-[#0B0F14] text-white">
    <div className="flex items-center gap-2.5">
      <AppIconGraphic icon={app.icon} name={app.name} sizeClass="w-10 h-10 rounded-xl" />
      <div className="min-w-0">
        <p className="font-display text-sm font-bold text-white truncate">{app.name}</p>
        <p className="font-mono text-[9px] text-rvsgold uppercase tracking-wider">{app.category}</p>
      </div>
    </div>
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-2">
      <p className="text-xs font-semibold text-white leading-snug">{app.tagline}</p>
      <p className="text-[10px] text-zinc-300 leading-relaxed line-clamp-3">
        {app.shortDescription}
      </p>
    </div>
    {isValidHttpUrl(app.playStoreUrl) && (
      <a
        href={app.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rvsgold py-2 text-[10px] font-bold uppercase tracking-wider text-rvsslate"
      >
        <span>Open on Play Store</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);

export const HeroFlowCanvas: React.FC<HeroFlowCanvasProps> = ({ publishedApps }) => {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cursor-reactive 3D tilt springs
  const mouseX = useMotionValue(-0.15);
  const mouseY = useMotionValue(-0.1);

  const springConfig = { stiffness: 160, damping: 22, mass: 0.6 };
  const rotateY = useSpring(mouseX, springConfig);
  const rotateX = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (reducedMotion) return;
    rotateY.set(-6);
    rotateX.set(3);
  }, [reducedMotion, rotateX, rotateY]);

  // Automatically switch mobile UI every 6 seconds so both app animations complete smoothly
  useEffect(() => {
    if (publishedApps.length <= 1 || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % publishedApps.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [publishedApps.length, reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(nx * 14 - 3);
    rotateX.set(-ny * 10 + 2);
  };

  const handleMouseLeave = () => {
    rotateY.set(-6);
    rotateX.set(3);
  };

  const safeIdx = publishedApps.length > 0 ? activeIndex % publishedApps.length : 0;
  const activeApp = publishedApps[safeIdx] ?? null;

  const renderScreen = (app: AppEntry) => {
    const idLower = app.id.toLowerCase();
    const nameLower = app.name.toLowerCase();
    if (idLower.includes('health') || nameLower.includes('health')) {
      return <HealthTrackerScreen app={app} reducedMotion={reducedMotion} />;
    }
    if (idLower.includes('calc') || nameLower.includes('calc')) {
      return <CalcProScreen app={app} reducedMotion={reducedMotion} />;
    }
    if (idLower.includes('pocket') || nameLower.includes('pocket')) {
      return <PocketTrackScreen app={app} reducedMotion={reducedMotion} />;
    }
    if (idLower.includes('gatherly') || nameLower.includes('gatherly')) {
      return <GatherlyScreen app={app} />;
    }
    if (idLower.includes('habit') || nameLower.includes('habit')) {
      return <HabitFlowScreen app={app} reducedMotion={reducedMotion} />;
    }
    return <GenericAppScreen app={app} />;
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Tilted Android Phone Frame sized cleanly to fit all screen heights */}
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-[248px] sm:w-[272px] rounded-[2.4rem] bg-gradient-to-b from-[#2E3A4A] via-[#1C2430] to-[#121820] p-[8px] shadow-[0_24px_50px_-15px_rgba(0,0,0,0.65)] border border-white/10"
      >
        {/* Subtle Metallic Hardware Side Buttons */}
        <div
          aria-hidden="true"
          className="absolute -right-[3px] top-24 h-11 w-[3px] rounded-r bg-[#3E4C5E]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-[3px] top-40 h-7 w-[3px] rounded-r bg-[#3E4C5E]"
        />

        {/* Inner Bezel & Screen */}
        <div className="relative rounded-[1.95rem] bg-[#090C10] overflow-hidden border border-black/80">
          {/* Android Status Bar + Camera Cutout */}
          <div className="relative z-20 px-4 pt-2.5 pb-1.5 bg-black/50 flex items-center justify-between text-[9px] font-mono text-zinc-300">
            <span>MCA LAB</span>
            <div className="h-3 w-3 rounded-full bg-[#11151C] border border-white/15 flex items-center justify-center">
              <span className="h-1 w-1 rounded-full bg-rvsgold/60" />
            </div>
            <div className="flex items-center gap-1 text-zinc-300">
              <Signal className="w-2.5 h-2.5" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* Interactive Animated App Screen */}
          <div className="relative h-[430px] sm:h-[465px] lg:h-[min(485px,60vh)] min-h-[410px] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeApp ? (
                <motion.div
                  key={activeApp.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className="h-full"
                >
                  {renderScreen(activeApp)}
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center text-xs text-zinc-400">
                  MCA Android Studio Ready
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Android Gesture Navigation Pill */}
          <div className="py-1.5 flex justify-center bg-[#090C10]">
            <span className="h-1 w-16 rounded-full bg-white/25" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
