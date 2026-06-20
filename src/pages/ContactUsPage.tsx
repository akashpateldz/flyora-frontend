import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  HelpCircle, Plane, Package, 
  ShieldAlert, Handshake, Mail, 
  Phone, User, MessageSquare,
  Clock, Globe, Lock, Headphones, ShieldCheck,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    title: 'General Support',
    description: 'Questions about Flyora, your account, or platform features.',
    icon: <HelpCircle size={24} className="text-blue-500" />
  },
  {
    title: 'Traveler Support',
    description: 'Assistance with posting trips, accepting parcels, earnings, or delivery verification.',
    icon: <Plane size={24} className="text-flyora-teal" />
  },
  {
    title: 'Sender Support',
    description: 'Help with package listings, matching, tracking, and successful delivery.',
    icon: <Package size={24} className="text-purple-500" />
  },
  {
    title: 'Trust & Safety',
    description: 'Report suspicious activity, disputes, prohibited items, or security concerns.',
    icon: <ShieldAlert size={24} className="text-red-500" />
  },
  {
    title: 'Partnerships',
    description: 'Business collaborations, enterprise shipping, universities, and logistics opportunities.',
    icon: <Handshake size={24} className="text-amber-500" />
  }
];

const promises = [
  { text: 'Fast Response Times', icon: <Clock size={20} className="text-flyora-teal" /> },
  { text: 'Global Customer Assistance', icon: <Globe size={20} className="text-blue-500" /> },
  { text: 'Secure Communication', icon: <Lock size={20} className="text-purple-500" /> },
  { text: '24/7 Critical Booking Support', icon: <Headphones size={20} className="text-orange-500" /> },
  { text: 'Dedicated Trust & Safety Team', icon: <ShieldCheck size={20} className="text-emerald-500" /> }
];

const ContactUsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        
        {/* ─── Hero Section ──────────────────────────────────────────────── */}
        <section 
          className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-flyora-navy bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/srv_hero_bg.png)' }}
        >
          <div className="absolute inset-0 bg-flyora-navy/80 backdrop-blur-sm" />
          
          <div className="container-flyora relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/20 border border-flyora-teal/30 text-flyora-teal-bright text-xs font-bold uppercase tracking-widest mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Need Help? <br className="hidden md:block" />
              <span className="text-gradient-teal">We're Here for You.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
              Whether you're sending your first package or posting your next journey, our support team is ready to assist.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ borderTopLeftRadius: '100%', borderTopRightRadius: '100%' }} />
        </section>

        {/* ─── Support Categories ───────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-white relative -mt-10">
          <div className="container-flyora relative z-20">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, idx) => (
                   <div key={idx} className="bg-white rounded-3xl p-8 border border-flyora-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-flyora-gray-50 flex items-center justify-center mb-6 border border-flyora-gray-100">
                         {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-flyora-navy mb-3">{category.title}</h3>
                      <p className="text-flyora-gray-600 leading-relaxed">
                         {category.description}
                      </p>
                   </div>
                ))}
                {/* Filler card to make grid even if needed, or an extra quick contact info card */}
                <div className="bg-gradient-to-br from-flyora-teal to-blue-500 rounded-3xl p-8 shadow-teal text-white flex flex-col justify-center">
                   <h3 className="text-2xl font-bold mb-4">Urgent Issue?</h3>
                   <p className="text-white/90 mb-6 leading-relaxed">
                      If you have an active booking issue, reach out to our emergency line.
                   </p>
                   <button className="py-3 px-6 bg-white text-flyora-navy font-bold rounded-xl w-fit hover:scale-105 transition-transform">
                      Call Support
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* ─── Contact Form & Promise Split Section ─────────────────────── */}
        <section className="py-12 lg:py-16 bg-flyora-gray-50">
          <div className="container-flyora">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
               
               {/* Left: Contact Form */}
               <div className="w-full lg:w-[55%] bg-white rounded-[2rem] p-6 lg:p-8 border border-flyora-gray-200 shadow-[0_15px_40px_rgba(10,22,40,0.04)]">
                  <h2 className="text-2xl font-black text-flyora-navy mb-6">Send a Message</h2>
                  
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-flyora-navy flex items-center gap-1.5">
                              <User size={14} className="text-flyora-gray-400" /> Full Name
                           </label>
                           <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-flyora-navy flex items-center gap-1.5">
                              <Mail size={14} className="text-flyora-gray-400" /> Email Address
                           </label>
                           <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-flyora-navy flex items-center gap-1.5">
                              <Phone size={14} className="text-flyora-gray-400" /> Phone Number
                           </label>
                           <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-flyora-navy flex items-center gap-1.5">
                              <User size={14} className="text-flyora-gray-400" /> User Type
                           </label>
                           <select className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all appearance-none text-flyora-gray-600">
                              <option value="traveler">Traveler</option>
                              <option value="sender">Sender</option>
                              <option value="both">Both</option>
                              <option value="other">Other</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-flyora-navy">Subject</label>
                        <input type="text" placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all" />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-flyora-navy flex items-center gap-1.5">
                           <MessageSquare size={14} className="text-flyora-gray-400" /> Message
                        </label>
                        <textarea rows={4} placeholder="Describe your issue or question in detail..." className="w-full px-4 py-3 rounded-xl bg-flyora-gray-50 border border-flyora-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-flyora-teal focus:border-transparent transition-all resize-none"></textarea>
                     </div>

                     <button className="w-full py-3.5 bg-flyora-navy text-white text-sm font-bold rounded-xl hover:bg-flyora-navy-light focus:outline-none focus:ring-4 focus:ring-flyora-navy/20 transition-all flex items-center justify-center gap-2 group">
                        Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </form>
               </div>

               {/* Right: Support Promise & Visuals */}
               <div className="w-full lg:w-[45%] flex flex-col justify-center">
                  <div className="mb-8">
                    <span className="inline-flex items-center gap-2 bg-flyora-navy/5 border border-flyora-navy/10 rounded-full px-3 py-1 mb-4">
                      <ShieldCheck size={14} className="text-flyora-navy" />
                      <span className="text-[10px] font-bold text-flyora-navy tracking-widest uppercase">
                        Our Promise
                      </span>
                    </span>
                    <h2 className="text-3xl font-black text-flyora-navy mb-4 leading-tight">World-Class <br /> Support 24/7</h2>
                    <p className="text-sm text-flyora-gray-600 leading-relaxed max-w-md">
                       International shipping and travel requires absolute reliability. Our dedicated support team is online around the clock.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {promises.map((promise, idx) => (
                        <div key={idx} className="flex flex-col gap-3 bg-white p-4 lg:p-5 rounded-2xl border border-flyora-gray-100 shadow-[0_5px_15px_rgba(10,22,40,0.02)] hover:shadow-md hover:border-flyora-teal/30 transition-all group">
                           <div className="w-10 h-10 rounded-xl bg-flyora-gray-50 flex items-center justify-center flex-shrink-0 border border-flyora-gray-100 group-hover:scale-110 group-hover:bg-flyora-teal/5 transition-all">
                              {promise.icon}
                           </div>
                           <span className="text-flyora-navy font-bold text-sm leading-tight">{promise.text}</span>
                        </div>
                     ))}
                     
                     {/* Contact Priority Card */}
                     <div className="flex flex-col justify-center items-center text-center p-5 rounded-2xl bg-gradient-to-br from-flyora-navy to-flyora-navy-light text-white shadow-lg border border-white/10 group cursor-pointer hover:-translate-y-1 transition-transform">
                        <Headphones size={24} className="mb-3 text-flyora-teal group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm tracking-wide">Live Chat <br /> Assistance</span>
                     </div>
                  </div>
               </div>

            </div>
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────────────────────────────── */}
        <section className="py-24 bg-flyora-teal relative overflow-hidden">
           <div className="absolute inset-0 world-map-bg opacity-10 mix-blend-overlay" />
           <div className="container-flyora relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                 Your Journey Carries <br className="hidden sm:block" /> More Than You.
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
                 Join thousands of verified travelers and senders building the future of smarter international delivery with Flyora.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                 <button className="px-8 py-4 bg-white text-flyora-teal font-bold rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    Get Started Now
                 </button>
              </div>
           </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUsPage;
