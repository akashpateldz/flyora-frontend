import React, { useState } from 'react';
import {
  Search, MapPin, Calendar, Weight, ArrowRight, Plane,
  Shield, Lock, Globe, Clock, Users, Package, CheckCircle, X
} from 'lucide-react';
import airportBackground from '../assets/airport-background.png';
import heroWomanCutout from '../assets/hero-woman-cutout.png';

const Hero: React.FC = () => {
  const [activeTab] = useState<'find' | 'post'>('find');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    from: '', to: '', date: '', weight: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchData);
  };

  return (
    <section
      className="relative overflow-hidden"
      id="hero"
      aria-label="Hero section"
    >

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 1 — Background: Airport (full bleed)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <img
          src={airportBackground}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-90"
          style={{ objectPosition: 'center center' }}
        />
      </div>



      {/* ══════════════════════════════════════════════════════════════════
          LAYER 2 — White gradient from left (for text legibility)
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(245,250,255,0.98) 0%, rgba(240,252,250,0.92) 30%, rgba(235,250,248,0.72) 50%, rgba(230,248,246,0.30) 68%, transparent 100%)',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 3 — World Map Dot Pattern overlay
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.18) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 4 — SVG Airplane + Route Lines
      ══════════════════════════════════════════════════════════════════ */}
      <svg
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >


        {/* ── Airplane SVG in top area ── */}
        <g transform="translate(610,158) rotate(-30)" className="plane-icon" opacity="0.85">
          {/* Fuselage */}
          <rect x="-28" y="-5" width="56" height="10" rx="5" fill="white" />
          {/* Wings */}
          <polygon points="0,-4 -22,14 22,14" fill="white" opacity="0.9" />
          {/* Tail */}
          <polygon points="26,-4 18,-14 34,-4" fill="white" opacity="0.9" />
          {/* Engine pods */}
          <ellipse cx="-10" cy="14" rx="8" ry="4" fill="white" opacity="0.75" />
          <ellipse cx="10" cy="14" rx="8" ry="4" fill="white" opacity="0.75" />
        </g>
      </svg>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 4.5 — Woman Cutout (Desktop Foreground Layer)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex absolute right-0 bottom-0 lg:inset-x-0 lg:top-10 z-[25] pointer-events-none justify-end lg:justify-center lg:translate-x-32 translate-y-2 lg:translate-y-6 items-end h-[55vh] lg:h-auto overflow-hidden sm:overflow-visible">
        <img
          src={heroWomanCutout}
          alt="Woman traveler"
          className="h-full w-auto object-contain object-bottom max-w-none origin-bottom-right scale-[1.15] lg:scale-100"
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 5 — Content
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 container-flyora pt-20 pb-0 lg:pt-36 lg:pb-16 flex flex-col justify-center" style={{ minHeight: '100vh' }}>
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-14 items-center">

          {/* ── LEFT: Text + Badges + CTAs + Stats ─────────────────────── */}
          <div className="max-w-lg w-full z-30 mt-4 lg:mt-0 pb-8 lg:pb-0">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-flyora-teal/25 rounded-full pl-3 pr-4 py-1.5 lg:py-2 mb-3 lg:mb-6 shadow-sm">
              <Plane size={13} className="text-flyora-teal -rotate-45" />
              <span className="text-[10px] lg:text-xs font-semibold text-flyora-teal-dark tracking-wide uppercase lg:normal-case">
                The smarter way to ship globally
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-black text-flyora-navy leading-[1.1] lg:leading-[1.07] tracking-tight mb-3 lg:mb-5 text-[2.1rem] sm:text-5xl lg:text-[clamp(3rem,4.5vw,4.5rem)]"
              id="hero-headline"
            >
              Your Journey
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Carries More
              </span>
              <br />
              Than You.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-flyora-gray-600 leading-relaxed mb-5 lg:mb-7 max-w-sm">
              Connect with verified travelers who have extra luggage space and ship your
              packages safely, affordably and reliably.
            </p>



            {/* ── CTA Buttons ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 lg:mb-10 w-full sm:w-auto">
              <button
                id="hero-find-traveler-btn"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 px-6 py-3.5 bg-flyora-navy text-white font-bold text-sm rounded-xl shadow-[0_6px_20px_rgba(10,22,40,0.30)] hover:bg-flyora-navy-light hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(10,22,40,0.38)] transition-all duration-300 w-full sm:w-auto"
              >
                Find a Traveler
                <ArrowRight size={16} />
              </button>
              <button
                id="hero-post-trip-btn"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 px-6 py-3.5 bg-white/85 backdrop-blur-sm text-flyora-navy font-bold text-sm rounded-xl border-2 border-flyora-gray-200 shadow-sm hover:border-flyora-teal/50 hover:text-flyora-teal hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
              >
                <Plane size={16} className="-rotate-45" />
                Post Your Trip
                <ArrowRight size={16} />
              </button>
            </div>

            {/* ── Stats Row ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 lg:gap-6">
              {[
                { icon: <Users size={16} />, value: '50K+', label: 'Happy Users' },
                { icon: <Globe size={16} />, value: '120+', label: 'Countries' },
                { icon: <Package size={16} />, value: '250K+', label: 'Shipments' },
                { icon: <CheckCircle size={16} />, value: '99.8%', label: 'Success Rate' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 lg:gap-2">
                  <span className="text-flyora-teal">{s.icon}</span>
                  <div>
                    <p className="text-sm lg:text-base font-black text-flyora-navy leading-none">{s.value}</p>
                    <p className="text-[9px] lg:text-[10px] text-flyora-gray-500 leading-none mt-0.5 whitespace-nowrap">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Desktop Spacer ────────────────────────── */}
          <div className="hidden lg:block pointer-events-none" />

        </div>

        {/* ── MOBILE ONLY: Image block directly in flow ────────────────────────── */}
        <div className="lg:hidden w-full flex justify-center items-end overflow-visible mt-4 sm:mt-8 -mb-16 relative left-1/2 -translate-x-1/2">
          <div className="w-[135%] sm:w-[110%] flex justify-center">
            <img
              src={heroWomanCutout}
              alt="Woman traveler"
              className="w-full max-w-[550px] h-auto object-contain object-bottom pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── FAB BUTTON & POPUP ────────────────────────────────────────── */}
      <div className="absolute bottom-8 right-4 lg:bottom-12 lg:right-12 z-[50] flex flex-col items-end">
        {/* The Search Form Popup */}
        {isSearchOpen && (
          <div
            className="mb-6 w-[360px] rounded-3xl shadow-[0_20px_60px_rgba(10,22,40,0.25)] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300"
            style={{ background: 'rgba(255,255,255,0.97)' }}
          >
            {/* Card Header */}
            <div className="px-6 pt-6 pb-4 border-b border-flyora-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-flyora-navy">Find a Traveler</h2>
                <p className="text-xs text-flyora-gray-500 mt-0.5">Ship your package with verified travelers</p>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-flyora-gray-100 flex items-center justify-center text-flyora-gray-500 hover:bg-flyora-gray-200 hover:text-flyora-navy transition-colors"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="px-6 py-5 space-y-4">
              {/* From / To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-flyora-gray-500 uppercase tracking-wider mb-1.5">
                    From
                  </label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-flyora-teal" />
                    <input
                      type="text"
                      id="search-from"
                      placeholder="Select origin"
                      value={searchData.from}
                      onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                      className="w-full pl-8 pr-2 py-2.5 text-xs bg-flyora-gray-50 border border-flyora-gray-200 rounded-xl text-flyora-navy placeholder-flyora-gray-400 transition-all"
                    />
                  </div>
                </div>

                {/* Swap icon */}
                <div>
                  <label className="block text-[10px] font-bold text-flyora-gray-500 uppercase tracking-wider mb-1.5">
                    To
                  </label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-flyora-blue" />
                    <input
                      type="text"
                      id="search-to"
                      placeholder="Select destination"
                      value={searchData.to}
                      onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                      className="w-full pl-8 pr-2 py-2.5 text-xs bg-flyora-gray-50 border border-flyora-gray-200 rounded-xl text-flyora-navy placeholder-flyora-gray-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Date / Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-flyora-gray-500 uppercase tracking-wider mb-1.5">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-flyora-teal" />
                    <input
                      type="text"
                      id="search-date"
                      placeholder="Select date"
                      value={searchData.date}
                      onFocus={(e) => { e.target.type = 'date'; }}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                      className="w-full pl-8 pr-2 py-2.5 text-xs bg-flyora-gray-50 border border-flyora-gray-200 rounded-xl text-flyora-navy placeholder-flyora-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-flyora-gray-500 uppercase tracking-wider mb-1.5">
                    Approx. Weight
                  </label>
                  <div className="relative">
                    <Weight size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-flyora-blue" />
                    <select
                      id="search-weight"
                      value={searchData.weight}
                      onChange={(e) => setSearchData({ ...searchData, weight: e.target.value })}
                      className="w-full pl-8 pr-6 py-2.5 text-xs bg-flyora-gray-50 border border-flyora-gray-200 rounded-xl text-flyora-navy appearance-none cursor-pointer transition-all"
                    >
                      <option value="">Select weight</option>
                      <option value="1-3">1–3 kg</option>
                      <option value="3-7">3–7 kg</option>
                      <option value="7-15">7–15 kg</option>
                      <option value="15+">15+ kg</option>
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-flyora-gray-400 pointer-events-none font-medium">kg ▾</span>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                id="hero-search-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-flyora-teal to-flyora-teal-light text-white font-bold text-sm rounded-xl shadow-teal hover:shadow-[0_12px_30px_rgba(13,148,136,0.48)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Search Travelers
                <ArrowRight size={16} />
              </button>

              {/* Escrow Note */}
              <div className="flex items-center justify-center gap-2">
                <Shield size={12} className="text-flyora-teal flex-shrink-0" />
                <p className="text-[11px] text-flyora-gray-500">
                  Every shipment is protected by{' '}
                  <span className="font-bold text-flyora-navy">Flyora Escrow</span>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* The FAB Icon */}
        {!isSearchOpen && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group flex items-center gap-3 bg-white pl-3 pr-5 py-3 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.18)] hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(10,22,40,0.25)] transition-all duration-300 border border-flyora-gray-100"
            aria-label="Open search form"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal">
              <Plane size={18} className="text-white -rotate-45" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-black text-flyora-navy tracking-wide group-hover:text-flyora-teal transition-colors">
                Find Traveler
              </span>
              <span className="block text-[10px] text-flyora-gray-500 font-bold uppercase tracking-widest mt-0.5">
                Ship Package
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-30" />
    </section>
  );
};

export default Hero;
