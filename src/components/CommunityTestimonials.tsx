import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    role: "Verified Traveller",
    quote: "I turned my unused luggage space into extra earnings while helping someone receive an important package safely.",
    footer: "Traveller • Verified",
    avatar: "bg-flyora-teal/10 text-flyora-teal"
  },
  {
    role: "Verified Sender",
    quote: "Finding a trusted traveller was simple, transparent, and much more convenient than traditional alternatives.",
    footer: "Sender • Verified",
    avatar: "bg-blue-50 text-blue-500"
  },
  {
    role: "Community Member",
    quote: "The verification process and delivery updates gave me confidence throughout the entire journey.",
    footer: "Flyora Community • Verified",
    avatar: "bg-purple-50 text-purple-500"
  }
];

const badges = [
  "KYC Verified",
  "Escrow Protected",
  "Trusted Community",
  "Secure Deliveries"
];

const CommunityTestimonials: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden" id="testimonials">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#F0FDFA]/50 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container-flyora max-w-[1200px] relative z-10">
        
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-flyora-teal/10 border border-flyora-teal/20 text-flyora-teal-dark font-bold text-[10px] uppercase tracking-widest mb-4">
            REAL EXPERIENCES
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4 leading-tight tracking-tight">
            Trusted by Travellers. <br className="hidden sm:block" /> Loved by Senders.
          </h2>
          <p className="text-sm md:text-base text-flyora-gray-600 max-w-2xl mx-auto leading-relaxed">
            People use Flyora to make international shipping simpler, safer, and more affordable through trusted community connections.
          </p>
        </div>

        {/* ─── Testimonials Marquee ──────────────────────────────────────── */}
        <div className="relative flex overflow-hidden whitespace-nowrap marquee-container pause-on-hover py-6 w-[100vw] left-1/2 -translate-x-1/2 mb-8">
          <div className="animate-marquee flex gap-6 min-w-max pr-6">
            {testimonials.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-[20px] p-8 shadow-[0_10px_30px_rgba(10,22,40,0.03)] border border-flyora-gray-100 hover:border-flyora-teal/30 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(10,22,40,0.06)] transition-all duration-500 flex flex-col h-full w-[320px] md:w-[400px] shrink-0 whitespace-normal"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-300" 
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-flyora-navy font-medium leading-relaxed mb-8 flex-1">
                  "{item.quote}"
                </blockquote>

                {/* Footer Profile */}
                <div className="flex items-center gap-4 pt-6 border-t border-flyora-gray-100 mt-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border border-white/50 shadow-sm ${item.avatar}`}>
                    {item.role.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-flyora-navy mb-0.5">{item.role}</h4>
                    <p className="text-[11px] font-bold text-flyora-teal flex items-center gap-1 uppercase tracking-wide group-hover:animate-pulse">
                      <ShieldCheck size={12} />
                      {item.footer.split(' • ')[1]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Duplicate for infinite scroll */}
          <div className="animate-marquee flex gap-6 min-w-max pr-6" aria-hidden="true">
            {testimonials.map((item, idx) => (
              <div 
                key={`dup-${idx}`} 
                className="group relative bg-white rounded-[20px] p-8 shadow-[0_10px_30px_rgba(10,22,40,0.03)] border border-flyora-gray-100 hover:border-flyora-teal/30 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(10,22,40,0.06)] transition-all duration-500 flex flex-col h-full w-[320px] md:w-[400px] shrink-0 whitespace-normal"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform duration-300" 
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-flyora-navy font-medium leading-relaxed mb-8 flex-1">
                  "{item.quote}"
                </blockquote>

                {/* Footer Profile */}
                <div className="flex items-center gap-4 pt-6 border-t border-flyora-gray-100 mt-auto">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm border border-white/50 shadow-sm ${item.avatar}`}>
                    {item.role.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-flyora-navy mb-0.5">{item.role}</h4>
                    <p className="text-[11px] font-bold text-flyora-teal flex items-center gap-1 uppercase tracking-wide group-hover:animate-pulse">
                      <ShieldCheck size={12} />
                      {item.footer.split(' • ')[1]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom Trust Badges ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-flyora-gray-100/50 max-w-3xl mx-auto">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-flyora-gray-500 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={16} className="text-flyora-teal" />
              {badge}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CommunityTestimonials;
