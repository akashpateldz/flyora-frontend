import React from 'react';
import { Shield, Lock, Globe, Clock, Zap } from 'lucide-react';
import { TRUST_BADGES } from '../constants/features';

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield size={18} className="text-flyora-teal" />,
  lock: <Lock size={18} className="text-flyora-teal" />,
  globe: <Globe size={18} className="text-flyora-teal" />,
  clock: <Clock size={18} className="text-flyora-teal" />,
  zap: <Zap size={18} className="text-flyora-teal" />,
};

const TrustBadges: React.FC = () => {
  return (
    <section
      className="py-6 bg-white border-y border-flyora-gray-100 relative overflow-hidden"
      aria-label="Trust indicators"
      id="trust-badges"
    >
      {/* Subtle teal top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-flyora-teal/30 to-transparent" />

      <div className="container-flyora">
        <div className="relative flex overflow-hidden whitespace-nowrap marquee-container pause-on-hover py-2 w-full">
          <div className="animate-marquee flex gap-4 lg:gap-6 min-w-max pr-6">
            {TRUST_BADGES.map((badge, index) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-flyora-gray-100 rounded-2xl shadow-sm hover:shadow-card hover:border-flyora-teal/30 transition-all duration-300 group cursor-default shrink-0"
                id={badge.id}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-flyora-teal/10 to-flyora-teal-light/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[badge.icon]}
                </div>
                <div>
                  <p className="text-sm font-bold text-flyora-navy leading-tight">{badge.title}</p>
                  <p className="text-xs text-flyora-gray-500 leading-tight">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          {/* DUPLICATE FOR SEAMLESS SCROLLING */}
          <div className="animate-marquee flex gap-4 lg:gap-6 min-w-max pr-6" aria-hidden="true">
            {TRUST_BADGES.map((badge, index) => (
              <div
                key={`dup-${badge.id}`}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-flyora-gray-100 rounded-2xl shadow-sm hover:shadow-card hover:border-flyora-teal/30 transition-all duration-300 group cursor-default shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-flyora-teal/10 to-flyora-teal-light/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[badge.icon]}
                </div>
                <div>
                  <p className="text-sm font-bold text-flyora-navy leading-tight">{badge.title}</p>
                  <p className="text-xs text-flyora-gray-500 leading-tight">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-flyora-teal/30 to-transparent" />
    </section>
  );
};

export default TrustBadges;
