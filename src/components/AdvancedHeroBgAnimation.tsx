import React from 'react';
import { Plane, Box } from 'lucide-react';

const AdvancedHeroBgAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {/* Dynamic Glowing Core */}
      <div className="absolute w-[400px] h-[400px] bg-flyora-teal/30 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute w-[300px] h-[300px] bg-flyora-blue/20 blur-[80px] rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

      {/* Radar Pulses */}
      <div className="radar-pulse-ring"></div>
      <div className="radar-pulse-ring"></div>
      <div className="radar-pulse-ring"></div>

      {/* Global Network Nodes (Floating particles) */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="floating-particle"
          style={{
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 4 + 6}s`
          }}
        />
      ))}

      {/* Orbiting Plane */}
      <div className="orbit-plane-container">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 rotate-90 text-flyora-teal drop-shadow-[0_0_15px_rgba(13,148,136,0.8)] filter scale-125">
          <Plane size={24} className="animate-pulse" />
          {/* Plane trail */}
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-40 bg-gradient-to-t from-transparent to-flyora-teal/60 blur-[2px] -z-10 origin-top rotate-180" />
        </div>
      </div>
      
      {/* Orbiting Package (Delivery) */}
      <div className="orbit-plane-container" style={{ animationDuration: '22s', animationDirection: 'reverse' }}>
        <div className="absolute bottom-[10%] right-1/4 rotate-45 text-flyora-blue drop-shadow-[0_0_12px_rgba(27,79,216,0.7)] opacity-80 scale-110">
          <Box size={20} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedHeroBgAnimation;
