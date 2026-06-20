import React from 'react';
import { Plane, Package, CheckCircle2 } from 'lucide-react';

const ChooseRole: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-white" id="choose-role">
      <div className="container-flyora max-w-[1000px]">
        
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/10 border border-flyora-teal/20 text-flyora-teal-dark font-bold text-[10px] uppercase tracking-widest mb-3">
            CHOOSE YOUR ROLE
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-flyora-navy mb-3 leading-tight tracking-tight">
            Built for Travellers and Senders
          </h2>
          <p className="text-sm md:text-base text-flyora-gray-600 max-w-xl mx-auto leading-relaxed">
            Whether you're flying internationally or sending a package, Flyora gives each user a clear and secure workflow.
          </p>
        </div>

        {/* ─── Cards Container ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: For Travellers */}
          <div className="group relative bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-flyora-gray-200 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-flyora-teal/30 rounded-[2rem] transition-colors duration-300 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-flyora-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-flyora-teal/10 flex items-center justify-center shrink-0 border border-flyora-teal/20 group-hover:scale-105 transition-transform duration-300">
                  <Plane size={24} className="text-flyora-teal" />
                </div>
                <span className="py-1 px-2.5 rounded-md bg-flyora-gray-100 text-flyora-gray-600 font-bold text-[10px] uppercase tracking-wider">
                  Earn Money
                </span>
              </div>

              <h3 className="text-xl font-black text-flyora-navy mb-2">For Travellers</h3>
              <p className="text-sm text-flyora-gray-500 leading-relaxed mb-6">
                Turn unused luggage space into earnings during trips you already take.
              </p>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-flyora-teal shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">List Your Trip</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-flyora-teal shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">Accept Parcel Requests</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-flyora-teal shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">Deliver & Earn</span>
                </div>
              </div>

              <button className="w-full py-3 bg-flyora-navy text-white font-bold text-sm rounded-xl hover:bg-flyora-navy-light hover:shadow-md transition-all group-hover:bg-flyora-teal">
                Post Your Trip
              </button>
            </div>
          </div>

          {/* Card 2: For Senders */}
          <div className="group relative bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-flyora-gray-200 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-flyora-teal/30 rounded-[2rem] transition-colors duration-300 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-flyora-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-flyora-blue/10 flex items-center justify-center shrink-0 border border-flyora-blue/20 group-hover:scale-105 transition-transform duration-300">
                  <Package size={24} className="text-blue-500" />
                </div>
                <span className="py-1 px-2.5 rounded-md bg-flyora-gray-100 text-flyora-gray-600 font-bold text-[10px] uppercase tracking-wider">
                  Save Money
                </span>
              </div>

              <h3 className="text-xl font-black text-flyora-navy mb-2">For Senders</h3>
              <p className="text-sm text-flyora-gray-500 leading-relaxed mb-6">
                Send packages globally through verified travellers on trusted routes.
              </p>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">List Your Package</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">Get Matched</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-flyora-navy">Track & Receive</span>
                </div>
              </div>

              <button className="w-full py-3 bg-white text-flyora-navy font-bold text-sm rounded-xl border border-flyora-gray-200 hover:border-flyora-teal hover:text-flyora-teal hover:shadow-md transition-all group-hover:border-blue-500 group-hover:text-blue-600">
                Send a Package
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ChooseRole;
