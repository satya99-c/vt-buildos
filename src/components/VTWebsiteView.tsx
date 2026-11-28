import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Loader2,
  Plus,
  Minus,
  ArrowRight,
  Compass,
  ClipboardCheck,
  IndianRupee,
  LayoutDashboard,
  Play,
} from 'lucide-react';

interface VTWebsiteViewProps {
  onEnterErp: () => void;
  onOpenSiteIntro: () => void;
}

const PLOT_PRESETS = [
  { label: '30 × 40', w: 30, d: 40 },
  { label: '30 × 50', w: 30, d: 50 },
  { label: '40 × 60', w: 40, d: 60 },
  { label: '50 × 80', w: 50, d: 80 },
  { label: '60 × 90', w: 60, d: 90 },
];

const FLOOR_OPTIONS = [
  { label: 'G', mult: 0.72 },
  { label: 'G+1', mult: 1.3867 },
  { label: 'G+2', mult: 2.08 },
  { label: 'G+3', mult: 2.75 },
  { label: 'G+4', mult: 3.42 },
];

const PARKING_OPTIONS = [
  { label: 'Stilt', rate: 2000 },
  { label: 'Part stilt', rate: 2100 },
  { label: 'No stilt', rate: 2200 },
];

const QUALITY_ROWS = [
  { stage: 'Footing', check: 'PCC bed level & thickness', when: 'Before rebar' },
  { stage: 'Columns', check: 'Cover block & stirrup spacing', when: 'Before pour' },
  { stage: 'Slab', check: 'Shuttering prop & plumb check', when: 'Before concrete' },
  { stage: 'Brick', check: 'Soaking & water absorption', when: 'Before laying' },
  { stage: 'Walls', check: 'Plumb and alignment', when: 'Before plaster' },
  { stage: 'Terrace', check: 'Waterproofing ponding test', when: 'Before tiling' },
  { stage: 'Plumbing', check: 'Line pressure test (6 bar)', when: 'Before tiling' },
];

const COMPARE_ROWS = [
  {
    what: 'Materials',
    typical: '"Good quality" materials, brand unspecified',
    vt: 'Named brands in contract (UltraTech, Tata Tiscon, Ashirvad)',
  },
  {
    what: 'Concrete',
    typical: 'Mixed on site, never slump-tested',
    vt: 'RMC with cube strength test at 7 & 28 days',
  },
  {
    what: 'Quality checks',
    typical: 'Supervisor visits once a week',
    vt: '700+ documented stage-wise checks before every pour',
  },
  {
    what: 'Progress updates',
    typical: 'Call the contractor to ask what happened',
    vt: 'Daily photo, passed checks & next-day plan on WhatsApp',
  },
  {
    what: 'Cost changes',
    typical: 'Extra bills added midway for basic items',
    vt: 'Itemized BOQ locked upfront; zero surprise escalations',
  },
  {
    what: 'Warranty',
    typical: 'Verbal promise until handover',
    vt: '10+ year structural & waterproofing written warranty',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Walk the plot',
    body: 'We visit your site, measure orientation, check soil and setback rules, and listen to how your family lives.',
  },
  {
    num: '02',
    title: 'Design & fixed BOQ',
    body: 'Floor plans, 3D elevation, structural drawings, and a line-by-line cost sheet with exact material brands.',
  },
  {
    num: '03',
    title: 'Disciplined build',
    body: 'Dedicated site engineer, bilingual SOP site book, 700+ quality checks, and daily WhatsApp updates.',
  },
  {
    num: '04',
    title: 'Handover & warranty',
    body: 'As-built drawings, pressure & electrical test logs, keys in hand, and a 10+ year written warranty.',
  },
];

const PROJECTS_GALLERY = [
  {
    name: 'VT Eden Enclave',
    meta: 'G+3 · Kakinada',
    type: 'Independent residence',
    img: '/intro-stage-4.jpg',
  },
  {
    name: 'ASM Elite',
    meta: 'G+2 · Rajahmundry',
    type: 'Modern family home',
    img: '/hero-night.jpg',
  },
  {
    name: 'Srinivasa Villa',
    meta: 'G+1 · Kakinada',
    type: 'Courtyard residence',
    img: '/hero-day.jpg',
  },
  {
    name: 'Lakshmi Residency',
    meta: 'G+4 · Visakhapatnam',
    type: 'Boutique apartments',
    img: '/site-hero.jpg',
  },
  {
    name: 'Godavari Crest',
    meta: 'G+2 · Kakinada',
    type: 'Contemporary duplex',
    img: '/intro-stage-3.jpg',
  },
  {
    name: 'Raghava Heights',
    meta: 'G+3 · Vijayawada',
    type: 'Turnkey residence',
    img: '/intro-stage-2.jpg',
  },
];

const FAQS = [
  {
    q: 'What is included in the ₹2,000 / sq ft starting rate?',
    a: 'Complete turnkey execution: architectural design, structural & MEP drawings, excavation, RCC frame with Tata/Vizag steel and UltraTech cement, brickwork, plastering, plumbing, electrical, vitrified tiling, and painting with named brands.',
  },
  {
    q: 'Can I track the construction if I live in another city?',
    a: 'Yes. Every evening our site engineer sends your daily site photo, completed quality checks, and next-day work plan directly on WhatsApp—plus full live access to the VT BuildOS client portal.',
  },
  {
    q: 'Are there any hidden charges after the contract is signed?',
    a: 'No. Your Bill of Quantities (BOQ) locks every material brand, specification, and stage-wise payment milestone before excavation begins. Changes only happen if you explicitly request an upgrade.',
  },
  {
    q: 'How long does a typical G+1 or G+2 home take to build?',
    a: 'A G+1 independent home takes 8 to 10 months from foundation to handover; a G+2 residence takes 11 to 14 months, tracked against our critical-path schedule.',
  },
  {
    q: 'Do you handle municipal approvals and structural testing?',
    a: 'Yes. We prepare the municipal submission drawings, conduct soil bearing tests, and perform 7-day and 28-day concrete cube compressive strength tests.',
  },
  {
    q: 'What does the 10-year warranty cover?',
    a: 'All structural RCC members (footings, columns, beams, slabs) and terrace/bathroom waterproofing systems are covered under our written 10+ year warranty.',
  },
];

export const VTWebsiteView: React.FC<VTWebsiteViewProps> = ({
  onEnterErp,
  onOpenSiteIntro,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [lensPos, setLensPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });
  const heroRef = useRef<HTMLDivElement>(null);

  // Quality log sequential pass animation
  const [passedCount, setPassedCount] = useState(3);
  useEffect(() => {
    const timer = setInterval(() => {
      setPassedCount((prev) => (prev >= QUALITY_ROWS.length ? 1 : prev + 1));
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  // Cost estimator state
  const [plotW, setPlotW] = useState(30);
  const [plotD, setPlotD] = useState(40);
  const [floorIdx, setFloorIdx] = useState(1); // G+1 default
  const [parkingIdx, setParkingIdx] = useState(0); // Stilt default

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y, active: true });
  };

  // Calculations for Cost Estimator
  const plotArea = Math.max(400, plotW * plotD);
  const builtUpArea = Math.round(plotArea * FLOOR_OPTIONS[floorIdx].mult);
  const rate = PARKING_OPTIONS[parkingIdx].rate;
  const totalEstimateLakhs = ((builtUpArea * rate) / 100000).toFixed(1);

  // Scroll-linked Day-to-Dusk progress in hero
  const duskProgress = Math.min(1, Math.max(0, (scrollY - 60) / 360));
  const isNavSolid = scrollY > 480;
  const isNavOnDark = !isNavSolid && duskProgress > 0.45;
  const showFloatingCta = scrollY > 650;

  const whatsappEstimateText = encodeURIComponent(
    `Hi VT Developers, I'd like an estimate for a ${FLOOR_OPTIONS[floorIdx].label} home on a ${plotW} × ${plotD} ft plot (${PARKING_OPTIONS[parkingIdx].label}, ~${builtUpArea.toLocaleString()} sq ft, starting ₹${totalEstimateLakhs} lakh).`
  );

  return (
    <div
      className="min-h-screen w-full selection:bg-[#16302b] selection:text-[#fcfaf6]"
      style={{
        backgroundColor: '#fcfaf6',
        color: '#16302b',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* =================================================================
          TOP FIXED NAVBAR
         ================================================================= */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-5 sm:px-8 py-3.5 flex items-center justify-between ${
          isNavSolid
            ? 'bg-[#ffffffdb] backdrop-blur-md border-b border-[#e6e1d9]'
            : 'bg-transparent'
        }`}
      >
        {/* Left: Arch Icon + Brand */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-colors"
            style={{ stroke: isNavOnDark ? '#fbf7ef' : '#16302b' }}
            strokeWidth="1.6"
          >
            <path d="M4 21V11a8 8 0 0 1 16 0v10" />
            <path d="M8.5 21v-9a3.5 3.5 0 0 1 7 0v9" />
            <line x1="2.5" y1="21" x2="21.5" y2="21" />
          </svg>
          <span
            className="text-base font-semibold tracking-tight transition-colors"
            style={{ color: isNavOnDark ? '#fbf7ef' : '#16302b' }}
          >
            VT Developers
          </span>
        </a>

        {/* Center Links */}
        <div
          className="hidden md:flex items-center gap-8 text-sm font-medium transition-colors"
          style={{ color: isNavOnDark ? 'rgba(251,247,239,0.85)' : 'rgba(22,48,43,0.72)' }}
        >
          <a href="#quality" className="hover:opacity-100 transition-opacity">
            Quality
          </a>
          <a href="#cost" className="hover:opacity-100 transition-opacity">
            Cost
          </a>
          <a href="#process" className="hover:opacity-100 transition-opacity">
            Process
          </a>
          <a href="#projects" className="hover:opacity-100 transition-opacity">
            Projects
          </a>
          <button
            onClick={onOpenSiteIntro}
            className="inline-flex items-center gap-1.5 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>3D Intro</span>
          </button>
        </div>

        {/* Right Actions: BuildOS ERP + Talk to us */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onEnterErp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition cursor-pointer"
            style={{
              borderColor: isNavOnDark ? 'rgba(251,247,239,0.3)' : '#e6e1d9',
              color: isNavOnDark ? '#fbf7ef' : '#16302b',
              backgroundColor: isNavOnDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)',
            }}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>BuildOS ERP</span>
          </button>

          <a
            href={`https://wa.me/918330972705?text=${whatsappEstimateText}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer"
            style={{
              backgroundColor: isNavOnDark ? '#fbf7ef' : '#16302b',
              color: isNavOnDark ? '#16302b' : '#ffffff',
            }}
          >
            Talk to us
          </a>
        </div>
      </nav>

      {/* =================================================================
          HERO SECTION (Interactive Day-to-Dusk Watercolor + Spotlight)
         ================================================================= */}
      <section
        id="top"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setLensPos((p) => ({ ...p, active: false }))}
        className="relative w-full min-h-[96vh] flex flex-col items-center justify-start pt-24 sm:pt-28 pb-24 overflow-hidden"
        style={{ backgroundColor: '#f8f4ec' }}
      >
        {/* Daylight Watercolor Background */}
        <img
          src="/hero-day.jpg"
          alt="Contemporary Indian residence architectural watercolor"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
        />

        {/* Scroll-driven Dusk/Twilight Layer */}
        <img
          src="/hero-night.jpg"
          alt="Residence lit up at twilight"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none transition-opacity duration-300"
          style={{ opacity: duskProgress }}
        />

        {/* Interactive Cursor Radial Spotlight Lens (lights up house windows on hover) */}
        {lensPos.active && (
          <img
            src="/hero-night.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
            style={{
              WebkitMaskImage: `radial-gradient(circle 190px at ${lensPos.x}% ${lensPos.y}%, black 20%, transparent 100%)`,
              maskImage: `radial-gradient(circle 190px at ${lensPos.x}% ${lensPos.y}%, black 20%, transparent 100%)`,
            }}
          />
        )}

        {/* Centered Editorial Copy Stack */}
        <div className="relative z-10 text-center px-5 max-w-2xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl md:text-[56px] leading-[1.08] tracking-[-0.025em] transition-colors duration-300"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: '"SOFT" 60, "WONK" 0',
              color: duskProgress > 0.45 ? '#fbf7ef' : '#16302b',
            }}
          >
            A better way
            <br />
            to build your home.
          </h1>

          <p
            className="mt-4 text-sm sm:text-base transition-colors duration-300"
            style={{
              color: duskProgress > 0.45 ? 'rgba(251,247,239,0.85)' : 'rgba(22,48,43,0.8)',
            }}
          >
            Transparent Processes. Elegant Design.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="#cost"
              className="px-6 py-3 rounded-lg text-sm font-medium transition shadow-sm"
              style={{
                backgroundColor: duskProgress > 0.45 ? '#fbf7ef' : '#16302b',
                color: duskProgress > 0.45 ? '#16302b' : '#ffffff',
              }}
            >
              Get my estimate
            </a>

            <div
              className="px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border"
              style={{
                backgroundColor: 'rgba(251, 248, 242, 0.85)',
                borderColor: 'rgba(22, 48, 43, 0.1)',
                color: '#16302b',
              }}
            >
              From <strong>₹2,000</strong> /sq ft · G to G+4
            </div>
          </div>
        </div>

        {/* Bottom-Left Interactive Micro-Cues */}
        <div className="hidden sm:flex flex-col items-start gap-2.5 absolute bottom-20 left-6 z-10 pointer-events-none">
          <div
            className="px-3.5 py-1.5 rounded-full text-[11px] font-medium border backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.82)',
              borderColor: '#e6e1d9',
              color: '#16302b',
            }}
          >
            Move over the house to light it up
          </div>
          <div
            className="flex items-center gap-2 text-[11px] pl-1"
            style={{ color: duskProgress > 0.5 ? '#fbf7ef' : 'rgba(22,48,43,0.7)' }}
          >
            <span className="w-px h-4 bg-current opacity-60"></span>
            <span>Scroll to watch the lights come on</span>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 1: OVERLAPPING 3-PILLAR PANEL (#how)
         ================================================================= */}
      <section id="how" className="relative z-20 max-w-6xl mx-auto px-5 -mt-14">
        <div
          className="rounded-xl border p-7 sm:p-10 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            borderColor: '#e6e1d9',
            boxShadow: '0 24px 48px -28px rgba(22, 48, 43, 0.16)',
          }}
        >
          <div
            className="text-[11px] font-medium uppercase tracking-[0.2em] mb-7"
            style={{ color: 'rgba(22, 48, 43, 0.5)' }}
          >
            HOW WE BUILD
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-[#e6e1d9]">
            {/* Pillar 01 */}
            <div className="md:pr-8">
              <Compass className="w-5 h-5 stroke-[1.4] mb-4" style={{ color: '#16302b' }} />
              <div
                className="text-[11px] font-medium uppercase tracking-[0.18em] mb-1.5"
                style={{ color: 'rgba(22, 48, 43, 0.5)' }}
              >
                01 / DESIGN
              </div>
              <h3
                className="text-2xl mb-2.5"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariationSettings: '"SOFT" 60, "WONK" 0',
                }}
              >
                Thoughtful Design
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(22,48,43,0.72)' }}>
                Contemporary architecture, intelligent space planning, Vastu alignment, and daylight-first interiors.
              </p>
            </div>

            {/* Pillar 02 */}
            <div className="md:px-8">
              <ClipboardCheck className="w-5 h-5 stroke-[1.4] mb-4" style={{ color: '#16302b' }} />
              <div
                className="text-[11px] font-medium uppercase tracking-[0.18em] mb-1.5"
                style={{ color: 'rgba(22, 48, 43, 0.5)' }}
              >
                02 / EXECUTION
              </div>
              <h3
                className="text-2xl mb-2.5"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariationSettings: '"SOFT" 60, "WONK" 0',
                }}
              >
                Process-led Construction
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(22,48,43,0.72)' }}>
                Systematic planning, stage-wise quality checks, and disciplined engineering execution on every slab.
              </p>
            </div>

            {/* Pillar 03 */}
            <div className="md:pl-8">
              <IndianRupee className="w-5 h-5 stroke-[1.4] mb-4" style={{ color: '#16302b' }} />
              <div
                className="text-[11px] font-medium uppercase tracking-[0.18em] mb-1.5"
                style={{ color: 'rgba(22, 48, 43, 0.5)' }}
              >
                03 / FINANCES
              </div>
              <h3
                className="text-2xl mb-2.5"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariationSettings: '"SOFT" 60, "WONK" 0',
                }}
              >
                Transparent Costing
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(22,48,43,0.72)' }}>
                Clear estimates, named material brands, documented costs, and milestone-linked payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 2: QUALITY LOG (#quality)
         ================================================================= */}
      <section id="quality" className="max-w-6xl mx-auto px-5 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Editorial + Stat Bar */}
          <div className="lg:col-span-5">
            <div
              className="text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: 'rgba(22, 48, 43, 0.5)' }}
            >
              QUALITY LOG
            </div>
            <h2
              className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontVariationSettings: '"SOFT" 60, "WONK" 0',
              }}
            >
              Every home, checked 700 times.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65]" style={{ color: 'rgba(22,48,43,0.72)' }}>
              Quality is not a final inspection—it is a checklist signed off before every pour and every tile. Here are seven checks from a G+2 in Kakinada.
            </p>

            {/* 3-Stat Bar */}
            <div className="mt-10 pt-7 border-t border-[#e6e1d9] grid grid-cols-3 divide-x divide-[#e6e1d9]">
              <div className="pr-4">
                <div
                  className="text-2xl sm:text-3xl tracking-[-0.03em]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  200k+
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(22,48,43,0.65)' }}>
                  sq ft built
                </div>
              </div>
              <div className="px-4">
                <div
                  className="text-2xl sm:text-3xl tracking-[-0.03em]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  700+
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(22,48,43,0.65)' }}>
                  checks per home
                </div>
              </div>
              <div className="pl-4">
                <div
                  className="text-2xl sm:text-3xl tracking-[-0.03em]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  10+ yr
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(22,48,43,0.65)' }}>
                  written warranty
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Quality Log Window */}
          <div className="lg:col-span-7">
            <div
              className="rounded-[10px] border bg-white overflow-hidden"
              style={{
                borderColor: '#e6e1d9',
                boxShadow: '0 30px 60px -40px rgba(22, 48, 43, 0.35)',
              }}
            >
              {/* Window Top Bar */}
              <div
                className="px-4 py-3 border-b border-[#e6e1d9] flex items-center justify-between text-xs"
                style={{ backgroundColor: '#faf8f4' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e0dcd3]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e0dcd3]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e0dcd3]"></span>
                  <span className="ml-2 font-medium text-[#16302b]">G+2 · Quality log</span>
                </div>
                <span className="tabular-nums font-medium" style={{ color: '#2f7a5b' }}>
                  {passedCount} of {QUALITY_ROWS.length} passed
                </span>
              </div>

              {/* Table Header */}
              <div
                className="grid grid-cols-12 px-4 py-2.5 border-b border-[#e6e1d9] text-[10px] font-medium uppercase tracking-[0.16em]"
                style={{ color: 'rgba(22,48,43,0.5)' }}
              >
                <div className="col-span-2">Stage</div>
                <div className="col-span-5">Check</div>
                <div className="col-span-3">When</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#e6e1d9]">
                {QUALITY_ROWS.map((row, idx) => {
                  const isPassed = idx < passedCount;
                  return (
                    <div
                      key={row.stage}
                      className="grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-[13px] hover:bg-[#f4f2ee] transition-colors"
                    >
                      <div className="col-span-2 font-medium text-[#16302b]">{row.stage}</div>
                      <div className="col-span-5" style={{ color: 'rgba(22,48,43,0.85)' }}>
                        {row.check}
                      </div>
                      <div className="col-span-3" style={{ color: 'rgba(22,48,43,0.55)' }}>
                        {row.when}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1.5 font-medium">
                        {isPassed ? (
                          <span className="inline-flex items-center gap-1" style={{ color: '#2f7a5b' }}>
                            <Check className="w-3.5 h-3.5 stroke-[2.4]" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1"
                            style={{ color: 'rgba(22,48,43,0.45)' }}
                          >
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Checking</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Window Footer */}
              <div
                className="px-4 py-3 border-t border-[#e6e1d9] flex items-center justify-between text-xs"
                style={{ backgroundColor: '#faf8f4' }}
              >
                <span style={{ color: 'rgba(22,48,43,0.55)' }}>+ 693 more checks in VT BuildOS</span>
                <button
                  onClick={onEnterErp}
                  className="font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                  style={{ color: '#16302b' }}
                >
                  <span>Open full checklist in ERP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 3: SITE UPDATES & PHONE MOCKUP (#updates)
         ================================================================= */}
      <section
        id="updates"
        className="border-y border-[#e6e1d9] py-20 sm:py-24"
        style={{ backgroundColor: '#faf8f4' }}
      >
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy & 3 Numbered Items */}
          <div className="lg:col-span-5">
            <div
              className="text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: 'rgba(22, 48, 43, 0.5)' }}
            >
              SITE UPDATES
            </div>
            <h2
              className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontVariationSettings: '"SOFT" 60, "WONK" 0',
              }}
            >
              Your site, on your phone.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65]" style={{ color: 'rgba(22,48,43,0.72)' }}>
              Every evening at 6 PM, our site engineer sends your home&apos;s live status straight to WhatsApp—so you never have to chase a contractor.
            </p>

            <div className="mt-8 space-y-5">
              {[
                { num: '1', title: 'Daily photo', desc: 'Timestamped visual of today’s structural or finishing work.' },
                { num: '2', title: 'Checks passed', desc: 'Verified tolerances and material tests signed off on site.' },
                { num: '3', title: "Tomorrow's plan", desc: 'Exact crew count, concrete volume, and next milestone.' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded border border-[#e6e1d9] bg-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{step.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(22,48,43,0.68)' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className="w-full max-w-[350px] rounded-[28px] border bg-white p-3.5"
              style={{
                borderColor: '#e6e1d9',
                boxShadow: '0 30px 60px -36px rgba(22, 48, 43, 0.25)',
              }}
            >
              {/* Phone Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#e6e1d9]">
                <div className="w-9 h-9 rounded-full bg-[#16302b] flex items-center justify-center text-white text-xs font-semibold">
                  VT
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#16302b]">VT Developers · Site engineer</div>
                  <div className="text-[11px] font-medium" style={{ color: '#2f7a5b' }}>
                    online
                  </div>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="py-3.5 space-y-2.5 text-xs">
                <div className="rounded-xl border border-[#e6e1d9] overflow-hidden bg-[#faf8f4]">
                  <img
                    src="/intro-stage-2.jpg"
                    alt="Daily site progress"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2.5 text-[11px]" style={{ color: 'rgba(22,48,43,0.85)' }}>
                    Second floor slab shuttering &amp; steel binding completed at 5:15 PM.
                  </div>
                </div>

                <div className="rounded-xl px-3 py-2 bg-[#f4f2ee] text-[#16302b] inline-flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" style={{ color: '#2f7a5b' }} />
                  <span className="font-medium">18 of 18 checks passed today</span>
                </div>

                <div className="rounded-xl px-3 py-2 bg-[#f4f2ee] text-[#16302b]">
                  <span className="font-semibold">Tomorrow:</span> M25 RMC pour (28 cum) at 8:30 AM.
                </div>

                <div className="flex justify-end pt-1">
                  <div
                    className="rounded-xl px-3 py-2 text-[#16302b]"
                    style={{ backgroundColor: '#eaf1ed' }}
                  >
                    Thanks, I&apos;ll come by at 10.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 4: INTERACTIVE COST ESTIMATOR (#cost)
         ================================================================= */}
      <section id="cost" className="max-w-6xl mx-auto px-5 py-20 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div
              className="text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: 'rgba(22, 48, 43, 0.5)' }}
            >
              COST
            </div>
            <h2
              className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontVariationSettings: '"SOFT" 60, "WONK" 0',
              }}
            >
              Know your number before we meet.
            </h2>
            <p className="mt-3 text-[15px] max-w-lg" style={{ color: 'rgba(22,48,43,0.72)' }}>
              Pick your plot, floors, and parking. This is a starting estimate—your final BOQ locks exact brands and finishes.
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg border border-[#e6e1d9] bg-white text-xs shrink-0">
            Homes from{' '}
            <strong
              className="text-lg ml-1"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              ₹2,000
            </strong>{' '}
            / sq ft
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs Card */}
          <div className="lg:col-span-7 rounded-xl border border-[#e6e1d9] bg-white p-6 sm:p-8 space-y-7">
            {/* Plot size */}
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-[#16302b]">Plot size</span>
                <span style={{ color: 'rgba(22,48,43,0.5)' }}>width × depth, in feet</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {PLOT_PRESETS.map((p) => {
                  const active = plotW === p.w && plotD === p.d;
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setPlotW(p.w);
                        setPlotD(p.d);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
                      style={{
                        backgroundColor: active ? '#16302b' : '#f4f2ee',
                        color: active ? '#ffffff' : '#16302b',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-11 items-center gap-2">
                <div className="col-span-5 flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#e6e1d9] bg-[#fcfaf6]">
                  <input
                    type="number"
                    min={15}
                    max={200}
                    value={plotW}
                    onChange={(e) => setPlotW(Number(e.target.value) || 20)}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none tabular-nums"
                  />
                  <span className="text-xs" style={{ color: 'rgba(22,48,43,0.5)' }}>
                    ft
                  </span>
                </div>
                <div className="col-span-1 text-center text-xs" style={{ color: 'rgba(22,48,43,0.5)' }}>
                  ×
                </div>
                <div className="col-span-5 flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#e6e1d9] bg-[#fcfaf6]">
                  <input
                    type="number"
                    min={20}
                    max={200}
                    value={plotD}
                    onChange={(e) => setPlotD(Number(e.target.value) || 30)}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none tabular-nums"
                  />
                  <span className="text-xs" style={{ color: 'rgba(22,48,43,0.5)' }}>
                    ft
                  </span>
                </div>
              </div>
            </div>

            {/* Floors */}
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-[#16302b]">Floors</span>
                <span style={{ color: 'rgba(22,48,43,0.5)' }}>above ground</span>
              </div>
              <div className="grid grid-cols-5 p-1 rounded-lg bg-[#f4f2ee] gap-1">
                {FLOOR_OPTIONS.map((fl, idx) => {
                  const active = floorIdx === idx;
                  return (
                    <button
                      key={fl.label}
                      onClick={() => setFloorIdx(idx)}
                      className="py-2 rounded-md text-xs font-medium transition cursor-pointer"
                      style={{
                        backgroundColor: active ? '#ffffff' : 'transparent',
                        color: '#16302b',
                        boxShadow: active ? '0 1px 3px rgba(22,48,43,0.1)' : 'none',
                      }}
                    >
                      {fl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parking */}
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-[#16302b]">Parking</span>
                <span style={{ color: 'rgba(22,48,43,0.5)' }}>ground configuration</span>
              </div>
              <div className="grid grid-cols-3 p-1 rounded-lg bg-[#f4f2ee] gap-1">
                {PARKING_OPTIONS.map((pk, idx) => {
                  const active = parkingIdx === idx;
                  return (
                    <button
                      key={pk.label}
                      onClick={() => setParkingIdx(idx)}
                      className="py-2 px-2 rounded-md text-xs font-medium transition cursor-pointer"
                      style={{
                        backgroundColor: active ? '#ffffff' : 'transparent',
                        color: '#16302b',
                        boxShadow: active ? '0 1px 3px rgba(22,48,43,0.1)' : 'none',
                      }}
                    >
                      <div>{pk.label}</div>
                      <div className="text-[10px]" style={{ color: 'rgba(22,48,43,0.55)' }}>
                        ₹{pk.rate.toLocaleString()}/sq ft
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Dark Forest-Green Summary Card */}
          <div
            className="lg:col-span-5 rounded-xl p-6 sm:p-8 flex flex-col justify-between text-white"
            style={{ backgroundColor: '#16302b' }}
          >
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                STARTING ESTIMATE
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-4xl sm:text-5xl tabular-nums tracking-[-0.03em]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  ₹{totalEstimateLakhs}
                </span>
                <span className="text-lg text-white/80">lakh</span>
              </div>

              <div className="mt-7 divide-y divide-white/15 border-t border-b border-white/15 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-white/65">Built-up area</span>
                  <span className="font-medium tabular-nums">{builtUpArea.toLocaleString()} sq ft</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/65">Rate</span>
                  <span className="font-medium tabular-nums">₹{rate.toLocaleString()} / sq ft</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/65">Home</span>
                  <span className="font-medium">
                    {FLOOR_OPTIONS[floorIdx].label} on {plotW} × {plotD} ft, {PARKING_OPTIONS[parkingIdx].label.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <a
                href={`https://wa.me/918330972705?text=${whatsappEstimateText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-white text-[#16302b] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#fcfaf6] transition"
              >
                <span>Send this to VT Developers</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-3 text-[11px] leading-relaxed text-white/55">
                Starting prices only. Includes design, working drawings, named materials, and structural warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 5: QUOTE COMPARISON TABLE (#compare)
         ================================================================= */}
      <section
        id="compare"
        className="border-y border-[#e6e1d9] py-20 sm:py-24"
        style={{ backgroundColor: '#faf8f4' }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <div
            className="text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: 'rgba(22, 48, 43, 0.5)' }}
          >
            BEFORE YOU COMPARE QUOTES
          </div>
          <h2
            className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em] max-w-xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: '"SOFT" 60, "WONK" 0',
            }}
          >
            A cheaper quote usually leaves one of these out.
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6e1d9] text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: 'rgba(22,48,43,0.5)' }}>
                  <th className="py-3 pr-4">What</th>
                  <th className="py-3 px-4">Typical quote</th>
                  <th className="py-3 pl-4">VT Developers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e1d9] text-sm">
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.what}>
                    <td className="py-4 pr-4 font-medium text-[#16302b] whitespace-nowrap">{r.what}</td>
                    <td className="py-4 px-4 line-through" style={{ color: 'rgba(22,48,43,0.45)' }}>
                      {r.typical}
                    </td>
                    <td className="py-4 pl-4">
                      <span className="inline-flex items-start gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                          style={{ backgroundColor: '#2f7a5b' }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="text-[#16302b]">{r.vt}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 6: 4-STEP PROCESS (#process)
         ================================================================= */}
      <section id="process" className="max-w-6xl mx-auto px-5 py-20 sm:py-24">
        <div
          className="text-[11px] font-medium uppercase tracking-[0.2em]"
          style={{ color: 'rgba(22, 48, 43, 0.5)' }}
        >
          PROCESS
        </div>
        <h2
          className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: '"SOFT" 60, "WONK" 0',
          }}
        >
          Four steps, one team.
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((st) => (
            <div key={st.num} className="pt-5 border-t border-[#e6e1d9]">
              <div className="text-xs font-medium" style={{ color: 'rgba(22,48,43,0.45)' }}>
                {st.num}
              </div>
              <h3
                className="text-xl mt-2 mb-2.5"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariationSettings: '"SOFT" 60, "WONK" 0',
                }}
              >
                {st.title}
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(22,48,43,0.72)' }}>
                {st.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================
          SECTION 7: RECENT WORK 3x2 PORTFOLIO GRID (#projects)
         ================================================================= */}
      <section
        id="projects"
        className="border-y border-[#e6e1d9] py-20 sm:py-24"
        style={{ backgroundColor: '#faf8f4' }}
      >
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div
                className="text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{ color: 'rgba(22, 48, 43, 0.5)' }}
              >
                RECENT WORK
              </div>
              <h2
                className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariationSettings: '"SOFT" 60, "WONK" 0',
                }}
              >
                200,000 sq ft, in and around Andhra Pradesh.
              </h2>
            </div>

            <button
              onClick={onEnterErp}
              className="px-4 py-2 rounded-lg border border-[#e6e1d9] bg-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#f4f2ee] transition cursor-pointer shrink-0"
            >
              <span>View live portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS_GALLERY.map((proj) => (
              <div
                key={proj.name}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#e6e1d9] bg-white"
              >
                <img
                  src={proj.img}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(22, 48, 43, 0.85) 0%, rgba(22, 48, 43, 0.15) 50%, transparent 100%)',
                  }}
                />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="text-[11px] text-white/75">{proj.type}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span
                      className="text-lg"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {proj.name}
                    </span>
                    <span className="text-[11px] text-white/80">{proj.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 8: FAQ ACCORDION (#faq)
         ================================================================= */}
      <section id="faq" className="max-w-6xl mx-auto px-5 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div
              className="text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: 'rgba(22, 48, 43, 0.5)' }}
            >
              QUESTIONS
            </div>
            <h2
              className="text-3xl sm:text-4xl mt-3 leading-[1.12] tracking-[-0.025em]"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontVariationSettings: '"SOFT" 60, "WONK" 0',
              }}
            >
              Asked before every home.
            </h2>
          </div>

          <div className="lg:col-span-7 divide-y divide-[#e6e1d9] border-t border-b border-[#e6e1d9]">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-base font-medium text-[#16302b]">{item.q}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 shrink-0" style={{ color: 'rgba(22,48,43,0.6)' }} />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" style={{ color: 'rgba(22,48,43,0.6)' }} />
                    )}
                  </button>
                  {isOpen && (
                    <p
                      className="mt-3 text-sm leading-relaxed pr-6"
                      style={{ color: 'rgba(22,48,43,0.72)' }}
                    >
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 9: NIGHT WATERCOLOR CLOSING CTA
         ================================================================= */}
      <section
        className="relative py-28 sm:py-36 overflow-hidden text-center text-[#fbf7ef]"
        style={{ backgroundColor: '#1a1e3a' }}
      >
        <img
          src="/hero-night.jpg"
          alt="Twilight house"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,30,58,0.75) 0%, rgba(26,30,58,0.55) 50%, rgba(26,30,58,0.92) 100%)',
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto px-5">
          <h2
            className="text-3xl sm:text-5xl tracking-[-0.025em]"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: '"SOFT" 60, "WONK" 0',
            }}
          >
            Tell us about your plot.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/80">
            Share your plot size and city, and our engineering team will send a tailored preliminary estimate.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/918330972705?text=${whatsappEstimateText}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#fbf7ef] text-[#16302b] text-sm font-medium inline-flex items-center gap-2 hover:bg-white transition"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={onEnterErp}
              className="px-6 py-3 rounded-lg border border-white/30 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition cursor-pointer"
            >
              Open VT BuildOS ERP →
            </button>
          </div>

          <div className="mt-4 text-xs text-white/60">or call +91 83309 72705</div>
        </div>
      </section>

      {/* =================================================================
          FOOTER
         ================================================================= */}
      <footer className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t border-[#e6e1d9]">
        <div className="flex items-center gap-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16302b"
            strokeWidth="1.6"
          >
            <path d="M4 21V11a8 8 0 0 1 16 0v10" />
            <path d="M8.5 21v-9a3.5 3.5 0 0 1 7 0v9" />
            <line x1="2.5" y1="21" x2="21.5" y2="21" />
          </svg>
          <span className="font-semibold text-[#16302b]">VT Developers</span>
          <span style={{ color: 'rgba(22,48,43,0.5)' }}>
            · Building Trust. Constructing Lives.
          </span>
        </div>

        <div className="flex items-center gap-6" style={{ color: 'rgba(22,48,43,0.68)' }}>
          <a href="#quality" className="hover:text-[#16302b]">Quality</a>
          <a href="#cost" className="hover:text-[#16302b]">Cost</a>
          <a href="#process" className="hover:text-[#16302b]">Process</a>
          <a href="#faq" className="hover:text-[#16302b]">FAQ</a>
          <button onClick={onEnterErp} className="hover:text-[#16302b] font-medium cursor-pointer">
            BuildOS ERP
          </button>
        </div>
      </footer>

      {/* =================================================================
          FLOATING BOTTOM PILL CTA (Appears on scroll)
         ================================================================= */}
      {showFloatingCta && (
        <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <a
            href="#cost"
            className="pointer-events-auto inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#e6e1d9] bg-white/95 backdrop-blur-md text-xs sm:text-sm shadow-lg hover:scale-[1.02] transition-transform"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16302b"
              strokeWidth="1.6"
            >
              <path d="M4 21V11a8 8 0 0 1 16 0v10" />
              <path d="M8.5 21v-9a3.5 3.5 0 0 1 7 0v9" />
              <line x1="2.5" y1="21" x2="21.5" y2="21" />
            </svg>
            <span className="font-medium text-[#16302b]">Start my home</span>
            <span className="h-3.5 w-px bg-[#e6e1d9]"></span>
            <span style={{ color: 'rgba(22,48,43,0.6)' }}>from ₹2,000/sq ft</span>
          </a>
        </div>
      )}
    </div>
  );
};
