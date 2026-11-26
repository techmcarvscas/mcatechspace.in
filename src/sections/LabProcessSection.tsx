import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Code2, Compass, Figma, FlaskConical, Rocket } from 'lucide-react';
import { SiteConfig } from '../types';

interface LabProcessSectionProps {
  config: SiteConfig;
}

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'IDEA',
    summary: 'Identifying problems and exploring ideas.',
    detail:
      'Discovering campus, academic, and everyday friction points worth solving through focused mobile software.',
    deliverable: 'Problem Brief & Scope',
    icon: Compass,
    // Coordinates inside viewBox 0 0 580 420
    x: 68,
    y: 58,
  },
  {
    num: '02',
    title: 'DESIGN',
    summary: 'Creating intuitive user experiences.',
    detail:
      'Translating concepts into structured navigation flows, clear typography, and responsive mobile interfaces.',
    deliverable: 'Wireframes & UI System',
    icon: Figma,
    x: 512,
    y: 132,
  },
  {
    num: '03',
    title: 'DEVELOP',
    summary: 'Turning concepts into working applications.',
    detail:
      'Engineering modular Android applications by applying core computer applications architecture and modern tooling.',
    deliverable: 'Production Android Codebase',
    icon: Code2,
    x: 68,
    y: 210,
  },
  {
    num: '04',
    title: 'TEST',
    summary: 'Improving reliability and usability.',
    detail:
      'Verifying stability, edge cases, device compatibility, and performance before anything reaches users.',
    deliverable: 'QA & Device Verification',
    icon: FlaskConical,
    x: 512,
    y: 288,
  },
  {
    num: '05',
    title: 'LAUNCH',
    summary: 'Publishing applications and sharing them with the world.',
    detail:
      'Packaging signed release builds, preparing store assets, and shipping directly to the Google Play Store.',
    deliverable: 'Google Play Console Release',
    icon: Rocket,
    x: 110,
    y: 366,
  },
];

// Winding S-curve path connecting all 5 stations
const ROAD_PATH =
  'M68,58 C310,58 512,86 512,132 C512,178 68,162 68,210 C68,256 512,240 512,288 C512,338 250,366 110,366';

const ENGINEERING_PILLARS = [
  {
    code: 'TRACK A',
    title: 'Academic to Applied Engineering',
    description:
      'Coursework in data structures, databases, and mobile systems translates directly into maintainable applications.',
  },
  {
    code: 'TRACK B',
    title: 'Human-Centered Mobile Craft',
    description:
      'Every interface is structured for clarity, accessibility, and fast everyday utility on standard Android devices.',
  },
  {
    code: 'TRACK C',
    title: 'Open Play Store Distribution',
    description:
      'Applications are packaged and released publicly on Google Play so anyone can discover and install them.',
  },
];

export const LabProcessSection: React.FC<LabProcessSectionProps> = ({ config }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [manual, setManual] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const beaconRef = useRef<SVGCircleElement>(null);
  const stationLengthsRef = useRef<number[]>([]);
  const inView = useInView(sectionRef, { once: false, amount: 0.25 });
  const reducedMotion = useReducedMotion();

  // Precompute exact arc-length position of each station along ROAD_PATH
  useEffect(() => {
    const path = roadRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const samples = 250;
    stationLengthsRef.current = PROCESS_STEPS.map((step) => {
      let bestLen = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= samples; i++) {
        const len = (i / samples) * total;
        const pt = path.getPointAtLength(len);
        const d = Math.hypot(pt.x - step.x, pt.y - step.y);
        if (d < bestDist) {
          bestDist = d;
          bestLen = len;
        }
      }
      return bestLen;
    });

    const p0 = path.getPointAtLength(stationLengthsRef.current[0] ?? 0);
    beaconRef.current?.setAttribute('cx', String(p0.x));
    beaconRef.current?.setAttribute('cy', String(p0.y));
  }, []);

  // Snap beacon when user selects a milestone manually or reduced-motion is enabled
  useEffect(() => {
    const path = roadRef.current;
    const beacon = beaconRef.current;
    const lengths = stationLengthsRef.current;
    if (!path || !beacon || lengths.length !== PROCESS_STEPS.length) return;
    if (!manual && !reducedMotion) return;
    const targetLen = lengths[activeStep] ?? 0;
    const pt = path.getPointAtLength(targetLen);
    beacon.setAttribute('cx', String(pt.x));
    beacon.setAttribute('cy', String(pt.y));
  }, [activeStep, manual, reducedMotion]);

  // Synchronized dwell + glide loop: dot & highlighted word move 100% together
  useEffect(() => {
    const path = roadRef.current;
    const beacon = beaconRef.current;
    const lengths = stationLengthsRef.current;
    if (!path || !beacon || lengths.length !== PROCESS_STEPS.length) return;
    if (manual || reducedMotion || !inView) return;

    const DWELL_MS = 1800;
    const GLIDE_MS = 1600;
    const STEP_MS = DWELL_MS + GLIDE_MS;
    const TOTAL_MS = STEP_MS * PROCESS_STEPS.length;

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    let rafId = 0;
    let lastReportedStep = -1;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = (now - startTime) % TOTAL_MS;
      const stepIdx = Math.floor(elapsed / STEP_MS);
      const localMs = elapsed - stepIdx * STEP_MS;

      let currentLen = lengths[stepIdx];
      let displayStep = stepIdx;

      if (localMs > DWELL_MS && stepIdx < PROCESS_STEPS.length - 1) {
        const glideT = easeInOut((localMs - DWELL_MS) / GLIDE_MS);
        currentLen =
          lengths[stepIdx] + (lengths[stepIdx + 1] - lengths[stepIdx]) * glideT;
        if (glideT >= 0.85) {
          displayStep = stepIdx + 1;
        }
      }

      const pt = path.getPointAtLength(currentLen);
      beacon.setAttribute('cx', String(pt.x));
      beacon.setAttribute('cy', String(pt.y));

      if (displayStep !== lastReportedStep) {
        lastReportedStep = displayStep;
        setActiveStep(displayStep);
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [inView, manual, reducedMotion]);

  const current = PROCESS_STEPS[activeStep];
  const ActiveIcon = current.icon;

  return (
    <section
      id="lab"
      ref={sectionRef}
      className="relative py-12 sm:py-16 border-t border-rvsslate/15 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Top Intro + Active Stage Card + Winding S-Curve Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Narrative & Active Stage Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 space-y-5"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-rvsmaroon">
                Our Development Lab
              </span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-rvsslate leading-[1.08]">
                {config.about.headlineLines.map((line, idx) => (
                  <span key={`${line}-${idx}`} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-700">
                {config.about.description}
              </p>
            </div>

            {/* Synchronized Stage Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.num}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-rvsslate/20 bg-rvsslate text-white p-5 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="text-xs text-rvsgold font-bold uppercase tracking-[0.14em]">
                    {current.num} — {current.title}
                  </span>
                  <ActiveIcon className="w-4 h-4 text-rvsgold" />
                </div>
                <p className="font-display text-base font-bold text-white">{current.summary}</p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{current.detail}</p>
                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 font-semibold uppercase">Deliverable</span>
                  <span className="text-rvsgold font-semibold">{current.deliverable}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Interactive Animated Winding Road Map (Desktop/Tablet) + Clean Step List (Mobile) */}
          <div className="lg:col-span-7">
            {/* Desktop & Tablet Winding S-Curve Map */}
            <div className="hidden sm:block rounded-2xl border border-rvsslate/15 bg-rvscream-soft p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rvsmaroon">
                  Interactive Student App Journey
                </span>
                <span className="text-[11px] font-semibold text-zinc-600">
                  Click any milestone
                </span>
              </div>

              <div className="relative w-full aspect-[580/420]">
                <svg
                  viewBox="0 0 580 420"
                  className="w-full h-full overflow-visible"
                  role="img"
                  aria-label="5-step MCA student development pipeline from Idea to Play Store Launch"
                >
                  {/* Outer Road Cushion */}
                  <path
                    d={ROAD_PATH}
                    fill="none"
                    stroke="rgba(124,2,1,0.14)"
                    strokeWidth="30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Main Maroon Road */}
                  <path
                    ref={roadRef}
                    d={ROAD_PATH}
                    fill="none"
                    stroke="#7C0201"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Animated Dashed Center Line */}
                  <motion.path
                    d={ROAD_PATH}
                    fill="none"
                    stroke="#FAAE53"
                    strokeWidth="2.5"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                    animate={reducedMotion ? undefined : { strokeDashoffset: [44, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Synchronized Traveling Beacon Along the Road */}
                  {!reducedMotion && (
                    <circle
                      ref={beaconRef}
                      cx={PROCESS_STEPS[0].x}
                      cy={PROCESS_STEPS[0].y}
                      r="6.5"
                      fill="#FFFFFF"
                      stroke="#FAAE53"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* 5 Interactive Stations */}
                  {PROCESS_STEPS.map((step, idx) => {
                    const isSelected = idx === activeStep;
                    const isPassed = idx <= activeStep;
                    return (
                      <g
                        key={step.num}
                        onClick={() => {
                          setManual(true);
                          setActiveStep(idx);
                        }}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <motion.circle
                            cx={step.x}
                            cy={step.y}
                            r="26"
                            fill="none"
                            stroke="#FAAE53"
                            strokeWidth="2"
                            animate={
                              reducedMotion ? undefined : { scale: [1, 1.3], opacity: [0.8, 0] }
                            }
                            transition={{ duration: 1.6, repeat: Infinity }}
                            style={{ transformOrigin: `${step.x}px ${step.y}px` }}
                          />
                        )}
                        <circle
                          cx={step.x}
                          cy={step.y}
                          r={isSelected ? '22' : '18'}
                          fill={isSelected ? '#FAAE53' : isPassed ? '#1B242F' : '#FFFFFF'}
                          stroke={isSelected ? '#7C0201' : '#7C0201'}
                          strokeWidth="3"
                        />
                        <text
                          x={step.x}
                          y={step.y + 4}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="800"
                          fill={isSelected ? '#1B242F' : isPassed ? '#FFFFFF' : '#7C0201'}
                        >
                          {step.num}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Crisp HTML Labels Anchored Beside Each Station */}
                {PROCESS_STEPS.map((step, idx) => {
                  const isSelected = idx === activeStep;
                  const alignRight = idx === 1 || idx === 3;
                  return (
                    <button
                      key={`lbl-${step.num}`}
                      type="button"
                      onClick={() => {
                        setManual(true);
                        setActiveStep(idx);
                      }}
                      style={{
                        top: `${(step.y / 420) * 100}%`,
                        left: alignRight
                          ? undefined
                          : `${((step.x + 30) / 580) * 100}%`,
                        right: alignRight
                          ? `${((580 - (step.x - 30)) / 580) * 100}%`
                          : undefined,
                      }}
                      className={`absolute -translate-y-1/2 rounded-lg border px-3.5 py-2 text-left transition-all shadow-sm max-w-[260px] sm:max-w-[295px] ${
                        isSelected
                          ? 'border-rvsmaroon bg-rvsmaroon text-white scale-[1.03] z-10'
                          : 'border-rvsslate/15 bg-white text-rvsslate hover:border-rvsmaroon'
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-rvsgold' : 'text-rvsmaroon'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span
                        className={`hidden md:block text-[11px] leading-snug whitespace-normal mt-0.5 ${
                          isSelected ? 'text-white/95' : 'text-zinc-600'
                        }`}
                      >
                        {step.summary}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Step List */}
            <div className="sm:hidden space-y-2.5">
              {PROCESS_STEPS.map((step, idx) => {
                const isSelected = idx === activeStep;
                return (
                  <button
                    key={`mob-${step.num}`}
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setActiveStep(idx);
                    }}
                    className={`w-full text-left flex items-center gap-3.5 rounded-lg border p-3.5 transition-colors ${
                      isSelected
                        ? 'border-rvsmaroon bg-rvscream-soft'
                        : 'border-rvsslate/15 bg-white'
                    }`}
                  >
                    <span
                      className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-rvsmaroon text-white' : 'bg-rvscream text-rvsslate'
                      }`}
                    >
                      {step.num}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-rvsslate">{step.title}</p>
                      <p className="text-xs text-zinc-600 leading-snug">{step.summary}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Departmental Engineering Pillars with Staggered Scroll Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENGINEERING_PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-xl border border-rvsslate/15 bg-rvscream p-6 space-y-2 transition-shadow hover:shadow-md"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[3px] bg-rvsmaroon origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rvsmaroon">
                {pillar.code}
              </span>
              <h3 className="font-display text-lg font-bold text-rvsslate">{pillar.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-700">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
