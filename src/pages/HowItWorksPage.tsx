import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  PlaneTakeoff, PackageCheck, Wallet, 
  Box, Map, Smartphone, ShieldCheck, 
  Star, Globe, CreditCard
} from 'lucide-react';

const travelerSteps = [
  {
    id: '01',
    title: 'List Your Trip',
    description: "Tell us where you're flying, your departure date, and how much luggage space you have available. Your trip instantly becomes discoverable to verified senders.",
    icon: <PlaneTakeoff size={28} className="text-blue-500" />
  },
  {
    id: '02',
    title: 'Accept Parcel',
    description: "Review delivery requests that match your route. Accept only the packages you're comfortable carrying after reviewing details and verification.",
    icon: <PackageCheck size={28} className="text-flyora-teal" />
  },
  {
    id: '03',
    title: 'Deliver & Earn',
    description: "Meet the sender, complete pickup verification, carry the package during your trip, and deliver it safely. Once delivery is confirmed, receive your earnings.",
    icon: <Wallet size={28} className="text-emerald-500" />
  }
];

const senderSteps = [
  {
    id: '01',
    title: 'List Your Package',
    description: "Add pickup location, destination, package size, weight, and preferred delivery date in just a few clicks.",
    icon: <Box size={28} className="text-purple-500" />
  },
  {
    id: '02',
    title: 'We Match a Carrier',
    description: "Flyora intelligently connects your shipment with a verified traveler already flying to your destination.",
    icon: <Map size={28} className="text-orange-500" />
  },
  {
    id: '03',
    title: 'Track & Receive',
    description: "Track progress, receive status updates, and confirm delivery securely once your package arrives.",
    icon: <Smartphone size={28} className="text-flyora-navy" />
  }
];

const whyItWorks = [
  { title: 'Verified Travelers', icon: <ShieldCheck size={20} className="text-flyora-teal" /> },
  { title: 'Secure Escrow Payments', icon: <CreditCard size={20} className="text-blue-500" /> },
  { title: 'Transparent Reviews', icon: <Star size={20} className="text-amber-400" /> },
  { title: 'Live Tracking', icon: <Map size={20} className="text-orange-500" /> },
  { title: 'Affordable Delivery', icon: <Wallet size={20} className="text-emerald-500" /> },
  { title: 'Trusted Global Community', icon: <Globe size={20} className="text-purple-500" /> },
];

const HowItWorksPage: React.FC = () => {
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
          style={{ backgroundImage: 'url(/images/hiw_hero_bg.png)' }}
        >
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-flyora-navy/70" />
          
          <div className="container-flyora relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/20 border border-flyora-teal/30 text-flyora-teal-bright text-xs font-bold uppercase tracking-widest mb-6">
              How Flyora Works
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              One Journey. <br />
              <span className="text-gradient-teal">Endless Possibilities.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto font-medium">
              Whether you're flying abroad or sending a package internationally, Flyora connects verified travelers and senders through a secure, transparent, and trusted platform.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%' }} />
        </section>

        {/* ─── For Travelers Section ──────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container-flyora">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4 inline-flex items-center gap-3">
                <PlaneTakeoff size={36} className="text-blue-500" />
                For Travelers
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {travelerSteps.map((step, index) => (
                <div key={index} className="relative group p-8 rounded-3xl bg-flyora-gray-50 border border-flyora-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                   <div className="w-16 h-16 rounded-2xl bg-white border border-flyora-gray-200 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {step.icon}
                   </div>
                   <span className="text-5xl font-black text-flyora-navy/5 absolute top-6 right-8">{step.id}</span>
                   <h3 className="text-2xl font-bold text-flyora-navy mb-4">{step.title}</h3>
                   <p className="text-flyora-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── For Senders Section ────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-flyora-gray-50">
          <div className="container-flyora">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4 inline-flex items-center gap-3">
                <Box size={36} className="text-purple-500" />
                For Senders
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {senderSteps.map((step, index) => (
                <div key={index} className="relative group p-8 rounded-3xl bg-white border border-flyora-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                   <div className="w-16 h-16 rounded-2xl bg-flyora-gray-50 border border-flyora-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {step.icon}
                   </div>
                   <span className="text-5xl font-black text-flyora-navy/5 absolute top-6 right-8">{step.id}</span>
                   <h3 className="text-2xl font-bold text-flyora-navy mb-4">{step.title}</h3>
                   <p className="text-flyora-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why It Works Section ───────────────────────────────────────── */}
        <section className="py-20 lg:py-32 bg-flyora-navy relative overflow-hidden">
           {/* Decorative Background */}
           <div className="absolute inset-0 bg-[url('/images/srv_hero_bg.png')] bg-cover opacity-10 mix-blend-overlay" />
           <div className="container-flyora relative z-10 text-center">
              <h2 className="text-4xl font-black text-white mb-16">Why It Works</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                 {whyItWorks.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left hover:bg-white/15 transition-colors">
                       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          {item.icon}
                       </div>
                       <h4 className="text-white font-bold text-lg">{item.title}</h4>
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

export default HowItWorksPage;
