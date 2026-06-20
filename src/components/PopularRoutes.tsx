import React from 'react';
import { 
  ArrowRight, Plane, MapPin, 
  ShieldCheck, Users, Activity, 
  Clock 
} from 'lucide-react';

interface RouteData {
  id: string;
  fromCity: string;
  fromFlag: string;
  toCity: string;
  toFlag: string;
  deliveryWindow: string;
  status: string;
  updatedAt: string;
}

const routes: RouteData[] = [
  {
    id: 'r1',
    fromCity: 'Ahmedabad',
    fromFlag: '🇮🇳',
    toCity: 'London',
    toFlag: '🇬🇧',
    deliveryWindow: '2–5 Days',
    status: 'Active',
    updatedAt: 'Updated Recently'
  },
  {
    id: 'r2',
    fromCity: 'Mumbai',
    fromFlag: '🇮🇳',
    toCity: 'Dubai',
    toFlag: '🇦🇪',
    deliveryWindow: '2–4 Days',
    status: 'Active',
    updatedAt: 'Updated Recently'
  },
  {
    id: 'r3',
    fromCity: 'Delhi',
    fromFlag: '🇮🇳',
    toCity: 'Toronto',
    toFlag: '🇨🇦',
    deliveryWindow: '3–6 Days',
    status: 'Active',
    updatedAt: 'Updated Recently'
  },
  {
    id: 'r4',
    fromCity: 'Bangalore',
    fromFlag: '🇮🇳',
    toCity: 'Singapore',
    toFlag: '🇸🇬',
    deliveryWindow: '1–3 Days',
    status: 'Active',
    updatedAt: 'Updated Recently'
  }
];

const PopularRoutes: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden" id="routes">
      
      {/* ─── Background Decorative Elements ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.03),transparent_70%)]" />
        <div className="absolute inset-0 world-map-bg opacity-5 mix-blend-overlay" />
      </div>

      <div className="container-flyora relative z-10">
        
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/10 border border-flyora-teal/20 text-flyora-teal-bright font-bold text-xs uppercase tracking-widest mb-4">
              Global Network
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-flyora-navy mb-4 leading-tight tracking-tight">
              Popular Routes Trusted by <br className="hidden md:block" />
              Our Community
            </h2>
            <p className="text-lg text-flyora-gray-600 leading-relaxed">
              Discover frequently travelled international routes where verified travellers actively help send packages securely across borders.
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-flyora-teal font-bold group hover:text-flyora-navy transition-colors shrink-0">
            View All Routes 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* ─── Routes Grid / Carousel ────────────────────────────────────── */}
        <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          
          {routes.map((route, idx) => (
            <div 
              key={route.id} 
              className="group relative flex flex-col bg-white rounded-[24px] border border-flyora-gray-200 shadow-sm hover:shadow-[0_20px_40px_rgba(10,22,40,0.08)] hover:-translate-y-2 hover:border-flyora-teal/30 transition-all duration-500 w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              
              {/* Top Graphic Area */}
              <div className="h-32 rounded-t-[24px] bg-gradient-to-br from-flyora-navy/5 to-flyora-teal/5 relative overflow-hidden flex items-center justify-center border-b border-flyora-gray-100">
                {/* Dotted curve and plane animation */}
                <div className="absolute inset-x-8 top-1/2 border-t-2 border-dashed border-flyora-teal/20" />
                <div className="absolute top-1/2 left-8 w-2 h-2 rounded-full bg-flyora-teal -translate-y-1/2 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                <div className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-blue-500 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                
                <div className="relative z-10 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:translate-x-32 transition-transform duration-1000 ease-in-out">
                  <Plane size={18} className="text-flyora-navy" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                
                {/* Cities & Flags */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{route.fromFlag}</span>
                    <span className="font-bold text-flyora-navy text-sm uppercase tracking-wide">{route.fromCity}</span>
                  </div>
                  
                  <div className="flex-1 px-4 text-center text-flyora-gray-400">
                     <Plane size={16} className="mx-auto text-flyora-teal opacity-50" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{route.toFlag}</span>
                    <span className="font-bold text-flyora-navy text-sm uppercase tracking-wide">{route.toCity}</span>
                  </div>
                </div>

                {/* Trust Points */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-flyora-gray-600 leading-tight">Verified Travellers Available</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-flyora-gray-600 leading-tight">Secure Matching</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-flyora-gray-600 leading-tight">Active Community Route</span>
                  </div>
                </div>

                <hr className="border-flyora-gray-100 mb-6" />

                {/* Delivery & Status */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <span className="text-xs font-bold text-flyora-gray-400 uppercase tracking-wider block mb-1">Est. Delivery</span>
                    <div className="flex items-center gap-1.5 text-flyora-navy font-bold">
                      <Clock size={14} className="text-flyora-teal" />
                      {route.deliveryWindow}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-flyora-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-100">
                      <Activity size={12} />
                      {route.status}
                    </div>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xs text-flyora-gray-400 font-medium">
                    {route.updatedAt}
                  </span>
                  <button 
                    className="text-sm font-bold text-flyora-navy flex items-center gap-1 group/btn"
                    aria-label={`Explore route from ${route.fromCity} to ${route.toCity}`}
                  >
                    Explore Route 
                    <ArrowRight size={16} className="text-flyora-teal group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default PopularRoutes;
