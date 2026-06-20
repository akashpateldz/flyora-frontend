import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShieldCheck, Eye, HeartHandshake,
  Lightbulb, Globe, Users,
  CheckCircle2, Network, Plane, UserCheck, Package, MapPin, PackageCheck
} from 'lucide-react';

const values = [
  { title: 'Trust First', icon: <ShieldCheck size={28} className="text-flyora-teal" /> },
  { title: 'Transparency', icon: <Eye size={28} className="text-blue-500" /> },
  { title: 'Safety', icon: <HeartHandshake size={28} className="text-emerald-500" /> },
  { title: 'Innovation', icon: <Lightbulb size={28} className="text-amber-500" /> },
  { title: 'Global Connectivity', icon: <Globe size={28} className="text-indigo-500" /> },
  { title: 'Community Collaboration', icon: <Users size={28} className="text-purple-500" /> },
];

const whyFlyora = [
  "Verified Global Network",
  "Modern Technology",
  "Escrow-Based Payments",
  "Secure Matching",
  "Real-Time Tracking",
  "Human-Centered Logistics"
];

const AboutUsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />

      <main className="flex-1">

        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-flyora-navy">
          {/* Abstract background nodes simulation */}
          <div className="absolute inset-0 world-map-bg opacity-10 mix-blend-overlay" />
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-flyora-teal/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container-flyora relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/20 border border-flyora-teal/30 text-flyora-teal-bright text-xs font-bold uppercase tracking-widest mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight max-w-5xl mx-auto">
              Building the Future of <br className="hidden md:block" />
              <span className="text-gradient-teal">Community-Powered Shipping</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
              At Flyora, every journey creates an opportunity to help someone else.
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%' }} />
        </section>

        {/* ─── Our Story ────────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white relative">
          <div className="container-flyora">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="/images/about_team_custom.png" alt="Flyora Team Discussing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-flyora-navy/10 mix-blend-overlay" />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-6">Our Story</h2>
                <p className="text-lg text-flyora-gray-600 leading-relaxed mb-6">
                  Millions of travelers fly every day with unused luggage capacity, while individuals and businesses pay expensive courier fees to ship items internationally.
                </p>
                <p className="text-lg text-flyora-gray-600 leading-relaxed">
                  Flyora bridges this gap by securely connecting verified travelers with senders, creating a smarter, more sustainable global delivery ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mission & Vision ─────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-flyora-gray-50">
          <div className="container-flyora">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

              <div className="bg-white rounded-3xl p-10 lg:p-12 border border-flyora-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-flyora-teal/10 flex items-center justify-center mb-8">
                  <Network size={32} className="text-flyora-teal" />
                </div>
                <h3 className="text-3xl font-black text-flyora-navy mb-4">Our Mission</h3>
                <p className="text-xl text-flyora-gray-600 leading-relaxed">
                  To make international shipping faster, more affordable, and community-driven through trusted travelers.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-10 lg:p-12 border border-flyora-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
                  <Plane size={32} className="text-blue-500" />
                </div>
                <h3 className="text-3xl font-black text-flyora-navy mb-4">Our Vision</h3>
                <p className="text-xl text-flyora-gray-600 leading-relaxed">
                  To become the world's most trusted peer-to-peer travel logistics platform where every flight creates value beyond transportation.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Our Values ───────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-flyora">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4">Our Values</h2>
              <p className="text-lg text-flyora-gray-600">The core principles that guide everything we build at Flyora.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-8 rounded-3xl bg-flyora-gray-50 border border-flyora-gray-100">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                    {val.icon}
                  </div>
                  <h4 className="text-xl font-bold text-flyora-navy">{val.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why Flyora? ──────────────────────────────────────────────── */}
        <section className="py-12 lg:py-16 bg-flyora-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/srv_hero_bg.png')] bg-cover opacity-10 mix-blend-overlay" />
          <div className="container-flyora relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Why Flyora?</h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  We are building a platform that puts people first. Experience a revolutionary way to ship globally while ensuring total security and trust.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {whyFlyora.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-flyora-teal flex-shrink-0" />
                      <span className="text-white font-medium text-lg">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[55%] relative h-[350px] sm:h-[450px] lg:min-h-[500px] flex items-center justify-center mt-10 lg:mt-0 overflow-hidden sm:overflow-visible">
                <div className="w-[500px] h-[500px] scale-[0.6] sm:scale-75 lg:scale-90 origin-center relative flex-shrink-0 flex items-center justify-center">
                  {/* The Sci-Fi Base Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-flyora-teal/10 rounded-full blur-[100px] pointer-events-none" />

                  {/* Orbital Rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white/5 animate-[spin_40s_linear_infinite]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-flyora-teal/20 border-dashed animate-[spin_30s_linear_infinite_reverse]">
                    {/* Animated Dot on ring */}
                    <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-flyora-teal rounded-full shadow-[0_0_15px_#14B8A6]" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />

                  {/* Central Globe */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-48 h-48 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.3)] backdrop-blur-sm z-10">
                    <Globe size={120} className="text-blue-400 opacity-60 animate-[spin_60s_linear_infinite]" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-flyora-teal/10 to-transparent" />
                    {/* Connection Dots on Globe */}
                    <div className="absolute top-10 left-10 w-2 h-2 bg-flyora-teal rounded-full shadow-[0_0_10px_#14B8A6] animate-pulse" />
                    <div className="absolute top-20 right-8 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34D399] animate-pulse" />
                    <div className="absolute bottom-12 left-16 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#C084FC] animate-pulse" />
                  </div>

                  {/* Futuristic Podium/Base */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-72 h-20 rounded-[100%] border-2 border-flyora-teal/40 bg-flyora-navy shadow-[0_0_50px_rgba(20,184,166,0.2)] flex items-center justify-center z-20">
                    <div className="w-56 h-12 rounded-[100%] border border-flyora-teal/20 bg-flyora-teal/5 flex items-center justify-center">
                      <div className="w-40 h-8 rounded-[100%] bg-flyora-teal/20 blur-sm" />
                    </div>
                  </div>

                  {/* 3D Box Representation */}
                  <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-24 h-24 bg-gradient-to-br from-[#c29867] to-[#8b653b] rounded-lg shadow-2xl border border-[#d4b087]/50 flex items-center justify-center relative overflow-hidden transform hover:scale-110 transition-transform cursor-pointer">
                      <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 skew-y-12 origin-top-left" />
                      <Package size={36} className="text-[#3b2a1a] opacity-80 z-10 mb-2" />
                      <div className="absolute bottom-3 font-black text-[9px] text-[#3b2a1a] uppercase tracking-widest opacity-90 z-10 flex items-center gap-1">
                        <Plane size={8} /> Flyora
                      </div>
                    </div>
                  </div>

                  {/* Floating Glass Panels */}

                  {/* Panel 1: Verified Travelers */}
                  <div className="absolute top-16 left-0 z-20 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -right-16 top-1/2 w-16 border-t border-dashed border-flyora-teal/50 hidden lg:block" />
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-flyora-teal/50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-flyora-teal/20 flex items-center justify-center text-flyora-teal">
                          <UserCheck size={16} />
                        </div>
                        <span className="text-white text-sm font-medium leading-tight">Verified <br />Travelers & Senders</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 2: Secure Escrow */}
                  <div className="absolute top-8 right-8 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -left-16 top-1/2 w-16 border-t border-dashed border-emerald-500/50 hidden lg:block" />
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-emerald-500/50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <ShieldCheck size={16} />
                        </div>
                        <span className="text-white text-sm font-medium leading-tight">Secure Escrow <br />Payments</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 3: Real-Time Tracking */}
                  <div className="absolute top-[45%] right-0 -translate-y-1/2 z-20 animate-float" style={{ animationDelay: '1.2s' }}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -left-16 top-1/2 w-16 border-t border-dashed border-blue-500/50 hidden lg:block" />
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-blue-500/50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <MapPin size={16} />
                        </div>
                        <span className="text-white text-sm font-medium leading-tight">Real-Time <br />Tracking</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 4: Safe Delivery */}
                  <div className="absolute bottom-32 right-12 z-20 animate-float" style={{ animationDelay: '0.8s' }}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -left-16 top-1/2 w-16 border-t border-dashed border-purple-500/50 hidden lg:block" />
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-purple-500/50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <PackageCheck size={16} />
                        </div>
                        <span className="text-white text-sm font-medium leading-tight">Safe <br />Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 5: Global Network */}
                  <div className="absolute bottom-40 left-8 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="relative group cursor-pointer">
                      <div className="absolute -right-16 top-1/2 w-16 border-t border-dashed border-indigo-500/50 hidden lg:block" />
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-indigo-500/50 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Globe size={16} />
                        </div>
                        <span className="text-white text-sm font-medium leading-tight">Global <br />Network</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
