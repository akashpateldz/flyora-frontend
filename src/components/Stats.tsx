import React, { useEffect, useRef, useState } from 'react';
import { Users, Globe, Package, Shield, Star } from 'lucide-react';
import { STATS } from '../constants/stats';

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={22} />,
  globe: <Globe size={22} />,
  package: <Package size={22} />,
  shield: <Shield size={22} />,
  star: <Star size={22} />,
};

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-16 bg-white relative overflow-hidden"
      id="stats"
      aria-label="Flyora platform statistics"
    >
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flyora-teal/20 to-transparent" />

      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/40 via-white to-white pointer-events-none" />

      <div className="container-flyora relative z-10">
        {/* Section Label */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-flyora-navy/5 border border-flyora-navy/10 rounded-full px-4 py-1.5 mb-4 hover:bg-flyora-navy/10 transition-colors cursor-default">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-flyora-navy tracking-widest uppercase">
              Built on Trust
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-flyora-navy tracking-tight" id="stats-heading">
            Numbers That Speak for Themselves
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.id}
              id={stat.id}
              className={`
                relative flex flex-col items-center text-center p-5 lg:p-6
                rounded-3xl border border-flyora-gray-100 bg-white shadow-[0_5px_20px_rgba(10,22,40,0.02)]
                hover:-translate-y-1 transition-all duration-300 group overflow-hidden
                ${index === STATS.length - 1 ? 'col-span-2 lg:col-span-1' : ''}
                ${stat.color === 'teal'
                  ? 'hover:border-flyora-teal/30 hover:shadow-[0_15px_30px_rgba(20,184,166,0.12)]'
                  : 'hover:border-blue-500/30 hover:shadow-[0_15px_30px_rgba(59,130,246,0.12)]'}
                ${isVisible ? 'animate-slide-up' : 'opacity-0'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Glow on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-b ${stat.color === 'teal' ? 'from-flyora-teal to-transparent' : 'from-blue-500 to-transparent'}`} />

              {/* Icon */}
              <div className={`
                w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10
                group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 
                bg-flyora-gray-50 border border-flyora-gray-100 shadow-sm
                ${stat.color === 'teal' ? 'text-flyora-teal' : 'text-blue-500'}
              `}>
                {iconMap[stat.icon]}
              </div>

              {/* Value */}
              <div className={`text-3xl lg:text-4xl font-black mb-1 text-flyora-navy relative z-10 ${isVisible ? 'stat-number' : ''}`}
                style={{ animationDelay: `${index * 120}ms` }}>
                {stat.value}
              </div>

              {/* Label */}
              <p className="text-[11px] lg:text-xs font-black text-flyora-gray-800 tracking-wider uppercase mb-1 relative z-10">{stat.label}</p>
              <p className="text-[11px] text-flyora-gray-500 relative z-10 hidden sm:block">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Star Rating Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-8">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-flyora-gray-600 font-medium text-sm">
            <span className="font-bold text-flyora-navy text-lg">4.9/5</span> Average Rating from our community
          </p>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flyora-gray-200 to-transparent" />
    </section>
  );
};

export default Stats;
