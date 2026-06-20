import React from 'react';
import { 
  ShieldCheck, Lock, MapPin, 
  PackageCheck, Star, Globe, 
  CheckCircle2, Plane, Navigation,
  CreditCard, UserCheck, Check
} from 'lucide-react';

const trustCards = [
  {
    title: 'KYC Verified Travellers',
    description: 'Every traveller is identity verified before accepting parcel requests.',
    icon: <UserCheck size={20} className="text-flyora-teal" />
  },
  {
    title: 'Escrow Protected Payments',
    description: 'Payments stay protected until delivery is successfully confirmed.',
    icon: <Lock size={20} className="text-blue-500" />
  },
  {
    title: 'Smart Route Matching',
    description: 'Match packages with travellers already flying on the same route.',
    icon: <Navigation size={20} className="text-purple-500" />
  },
  {
    title: 'Secure Delivery Process',
    description: 'Pickup, transit, and delivery steps are tracked with confirmation.',
    icon: <PackageCheck size={20} className="text-emerald-500" />
  },
  {
    title: 'Transparent Reviews',
    description: 'Ratings and reviews help build a trusted global community.',
    icon: <Star size={20} className="text-amber-500" />
  },
  {
    title: 'Global Community',
    description: 'Connect with travellers and senders across international routes.',
    icon: <Globe size={20} className="text-indigo-500" />
  }
];

const timelineSteps = [
  'Traveller Verified',
  'Package Accepted',
  'Escrow Activated',
  'In Transit',
  'Delivered',
  'Payment Released'
];

const badges = [
  { label: 'Verified', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label: 'Protected', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'Live Tracking', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { label: 'Completed', color: 'text-flyora-teal bg-flyora-teal/10 border-flyora-teal/20' }
];

const WhyChoose: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden" id="why-choose">
      <div className="container-flyora relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          
          {/* ─── Left Side: Content & Cards ──────────────────────────────── */}
          <div className="w-full lg:w-[55%]">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/10 border border-flyora-teal/20 text-flyora-teal-dark font-bold text-[10px] uppercase tracking-widest mb-4">
              WHY FLYORA?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4 leading-tight tracking-tight">
              Built on Trust. <br className="hidden md:block" />
              Designed for Global Delivery.
            </h2>
            <p className="text-sm md:text-base text-flyora-gray-600 leading-relaxed mb-8 max-w-xl">
              Flyora connects verified travellers and senders through a secure, transparent, and technology-driven delivery experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trustCards.map((card, idx) => (
                <div key={idx} className="group p-4 md:p-5 rounded-2xl bg-white border border-flyora-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-flyora-gray-50 flex items-center justify-center mb-3 border border-flyora-gray-100 group-hover:scale-105 transition-transform">
                    {React.cloneElement(card.icon as React.ReactElement, { size: 16 })}
                  </div>
                  <h3 className="font-bold text-flyora-navy mb-1.5 text-sm">{card.title}</h3>
                  <p className="text-flyora-gray-500 text-xs leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Side: Timeline Mockup Card ────────────────────────── */}
          <div className="w-full lg:w-[45%] relative">
            {/* Abstract Gradient Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-flyora-teal/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            {/* The Card */}
            <div className="relative bg-white rounded-[1.5rem] p-6 md:p-8 border border-flyora-gray-200 shadow-[0_20px_50px_rgba(10,22,40,0.06)]">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-flyora-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-flyora-navy flex items-center justify-center shadow-sm">
                    <ShieldCheck size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-flyora-navy">Shipment Trust</h3>
                    <p className="text-flyora-gray-500 text-xs font-medium">NY (USA) <Plane size={10} className="inline mx-1 -mt-0.5" /> LHR (UK)</p>
                  </div>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mb-8">
                {badges.map((badge, idx) => (
                  <span key={idx} className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Timeline Steps */}
              <div className="relative">
                {/* Vertical Dotted Line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-px border-l border-dashed border-flyora-gray-200" />
                
                <div className="space-y-4">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 relative z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${idx === timelineSteps.length - 1 ? 'bg-emerald-500 shadow-sm' : 'bg-flyora-teal'}`}>
                        <Check size={12} className="text-white font-bold" />
                      </div>
                      <span className={`text-sm font-bold ${idx === timelineSteps.length - 1 ? 'text-flyora-navy' : 'text-flyora-gray-600'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decoration: Airplane moving on a dotted line below */}
              <div className="mt-8 pt-5 border-t border-flyora-gray-100 flex items-center justify-between relative overflow-hidden group">
                 <div className="w-full absolute top-1/2 left-0 border-t border-dashed border-flyora-gray-200" />
                 <MapPin size={16} className="text-flyora-gray-400 bg-white relative z-10" />
                 <div className="relative z-10 w-8 h-8 rounded-full bg-flyora-teal/10 flex items-center justify-center translate-x-2 transition-transform duration-1000 group-hover:translate-x-24">
                   <Plane size={14} className="text-flyora-teal" />
                 </div>
                 <MapPin size={16} className="text-flyora-teal bg-white relative z-10" />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
