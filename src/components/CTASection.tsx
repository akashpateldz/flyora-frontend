import React from 'react';
import { 
  ShieldCheck, Lock, CheckCircle, 
  LifeBuoy, Plane, Package, 
  CheckCircle2 
} from 'lucide-react';

const trustCards = [
  {
    title: 'Verified Users',
    description: 'Every traveller and sender completes identity verification before using Flyora.',
    icon: <ShieldCheck size={28} className="text-flyora-teal" />
  },
  {
    title: 'Secure Escrow',
    description: 'Payments are held safely and released only after successful delivery confirmation.',
    icon: <Lock size={28} className="text-blue-500" />
  },
  {
    title: 'Delivery Proof',
    description: 'Pickup and delivery are confirmed with OTP, status updates, and proof of handover.',
    icon: <CheckCircle size={28} className="text-emerald-500" />
  },
  {
    title: 'Dispute Protection',
    description: 'Our support team helps resolve shipment issues fairly, quickly, and transparently.',
    icon: <LifeBuoy size={28} className="text-purple-500" />
  }
];

const badges = [
  'KYC Verified',
  'Escrow Protected',
  'Delivery Confirmed',
  'Support Available'
];

const CTASection: React.FC = () => {
  return (
    <section className="py-8 lg:py-12 bg-white relative" id="trust-safety">
      <div className="container-flyora">
        
        {/* ─── Ultra-Compact Promo Banner ────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#F0FDFA]/50 to-white border border-flyora-teal/10 rounded-[2.5rem] p-3 lg:p-4 shadow-[0_20px_50px_rgba(10,22,40,0.06)] flex flex-col lg:flex-row items-center gap-6 lg:gap-10 overflow-hidden">
          
          {/* Decorative Map */}
          <div className="absolute inset-0 world-map-bg opacity-[0.03] mix-blend-overlay pointer-events-none" />

          {/* ─── Left Side: Image (Shorter Aspect Ratio) ──────────────────── */}
          <div className="w-full lg:w-[40%] h-[300px] lg:h-[420px] rounded-[2rem] overflow-hidden relative shrink-0 group flex items-center justify-center">
            <img 
              src="/images/Built for Safe Global Shipping.png" 
              alt="Safe Global Shipping" 
              className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Overlay Badge */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl py-2 px-4 shadow-lg flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-flyora-navy">100% Verified</span>
            </div>
          </div>

          {/* ─── Right Side: Compact Content ───────────────────────────────── */}
          <div className="w-full lg:w-[60%] py-4 lg:py-6 pr-4 lg:pr-8 relative z-10">
            
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center py-1 px-2.5 rounded-lg bg-flyora-teal/10 text-flyora-teal-dark font-bold text-[10px] uppercase tracking-widest">
                TRUST & SAFETY
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-black text-flyora-navy mb-2 leading-tight tracking-tight">
              Built for Safe Global Shipping
            </h2>
            <p className="text-sm text-flyora-gray-600 leading-relaxed mb-6 max-w-xl">
              Every package, traveller, and payment is protected through verification, escrow, and delivery confirmation.
            </p>

            {/* Micro Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {trustCards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl p-3 shadow-sm border border-flyora-gray-100 hover:border-flyora-teal/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-flyora-gray-50 flex items-center justify-center shrink-0 border border-flyora-gray-100 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-flyora-navy mb-0.5">{card.title}</h3>
                    <p className="text-flyora-gray-500 text-[11px] leading-snug">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions Inline */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-flyora-navy text-white font-bold text-sm rounded-xl hover:bg-flyora-navy-light hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                  <Plane size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Post Trip
                </button>
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-flyora-navy font-bold text-sm rounded-xl border border-flyora-gray-200 hover:border-flyora-teal hover:text-flyora-teal hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <Package size={16} />
                  Send Package
                </button>
              </div>

              {/* Badges simplified */}
              <div className="hidden xl:flex items-center gap-3 border-l border-flyora-gray-200 pl-4 ml-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-flyora-gray-500"><CheckCircle2 size={12} className="text-flyora-teal" /> Escrow</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-flyora-gray-500"><CheckCircle2 size={12} className="text-flyora-teal" /> Support</span>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CTASection;
