import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Plane, Package, Lock, ShieldCheck, 
  MapPin, Star, ArrowRight 
} from 'lucide-react';

const coreServices = [
  {
    title: 'Traveler Earnings',
    description: 'Earn additional income by utilizing extra baggage capacity on trips you are already taking.',
    icon: <Plane size={24} className="text-blue-500" />,
    image: '/images/srv_card_travelers_custom.png',
  },
  {
    title: 'International Package Delivery',
    description: 'Ship personal or business packages globally through verified travelers at competitive rates.',
    icon: <Package size={24} className="text-flyora-teal" />,
    image: '/images/srv_card_senders_custom.png',
  },
  {
    title: 'Secure Escrow Protection',
    description: 'Payments remain protected until successful delivery is confirmed.',
    icon: <Lock size={24} className="text-emerald-500" />,
    image: '/images/srv_card_escrow_custom.png',
  },
  {
    title: 'Identity Verification',
    description: 'KYC verification and community trust systems help create a safer marketplace.',
    icon: <ShieldCheck size={24} className="text-purple-500" />,
    image: '/images/srv_card_kyc_custom.png',
  },
  {
    title: 'Smart Route Matching',
    description: 'Automatically connect packages with travelers heading to the same destination.',
    icon: <MapPin size={24} className="text-orange-500" />,
    image: '/images/srv_card_matching_custom.png',
  },
  {
    title: 'Ratings & Reputation',
    description: 'Every completed shipment strengthens trust through transparent reviews.',
    icon: <Star size={24} className="text-amber-400" />,
    image: '/images/srv_card_reputation_custom.png',
  }
];

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section 
          className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-flyora-navy bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/srv_hero_bg.png)' }}
        >
          <div className="absolute inset-0 bg-flyora-navy/60 backdrop-blur-[2px]" />
          
          <div className="container-flyora relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/20 border border-flyora-teal/30 text-flyora-teal-bright text-xs font-bold uppercase tracking-widest mb-6">
              Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight max-w-4xl mx-auto">
              Smart Global Delivery, <br className="hidden md:block" />
              Powered by <span className="text-gradient-teal">Real Travelers</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
              Flyora transforms unused luggage space into secure international shipping opportunities.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%' }} />
        </section>

        {/* ─── Core Services Grid ────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white relative">
          <div className="container-flyora">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4">Our Core Services</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {coreServices.map((service, index) => (
                <div key={index} className="group rounded-[2rem] bg-flyora-gray-50 border border-flyora-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  {/* Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0 bg-flyora-gray-50">
                    <img src={service.image} alt={service.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-flyora-navy/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Body */}
                  <div className="p-8 bg-white flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-flyora-navy mb-3">{service.title}</h3>
                    <p className="text-lg text-flyora-gray-600 leading-relaxed mb-6 flex-1">
                      {service.description}
                    </p>
                    <button className="flex items-center gap-2 text-flyora-teal font-bold group/btn mt-auto">
                      Learn More 
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;
