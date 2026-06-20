import React from 'react';
import { Search, CreditCard, Briefcase, PackageCheck, Star, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS } from '../constants/features';

const iconMap: Record<string, React.ReactNode> = {
  search: <Search size={22} />,
  'credit-card': <CreditCard size={22} />,
  briefcase: <Briefcase size={22} />,
  'package-check': <PackageCheck size={22} />,
  star: <Star size={22} />,
};

const stepColors = [
  { bg: 'from-flyora-teal/15 to-flyora-teal-light/20', text: 'text-flyora-teal', border: 'border-flyora-teal/20', num: 'bg-flyora-teal' },
  { bg: 'from-flyora-blue/10 to-flyora-blue/15', text: 'text-flyora-blue', border: 'border-flyora-blue/20', num: 'bg-flyora-blue' },
  { bg: 'from-flyora-teal/15 to-flyora-teal-light/20', text: 'text-flyora-teal', border: 'border-flyora-teal/20', num: 'bg-flyora-teal' },
  { bg: 'from-flyora-blue/10 to-flyora-blue/15', text: 'text-flyora-blue', border: 'border-flyora-blue/20', num: 'bg-flyora-blue' },
  { bg: 'from-flyora-teal/15 to-flyora-teal-light/20', text: 'text-flyora-teal', border: 'border-flyora-teal/20', num: 'bg-flyora-teal' },
];

const HowItWorks: React.FC = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="how-it-works"
      aria-label="How Flyora works"
    >
      {/* Background accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-flyora-gray-200 to-transparent" />
      <div className="absolute -top-32 right-0 w-96 h-96 bg-flyora-teal/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-80 h-80 bg-flyora-blue/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container-flyora">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-flyora-teal/8 border border-flyora-teal/20 rounded-full px-4 py-2 mb-5">
            <span className="text-xs font-semibold text-flyora-teal tracking-wider uppercase">
              Simple. Secure. Smart.
            </span>
          </div>
          <h2 className="text-4xl font-black text-flyora-navy mb-4" id="how-it-works-heading">
            How Flyora Works
          </h2>
          <p className="text-lg text-flyora-gray-500 max-w-2xl mx-auto leading-relaxed">
            We make global shipping easy by connecting senders with trusted travelers in just a few steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-flyora-teal/20 via-flyora-blue/30 to-flyora-teal/20 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {HOW_IT_WORKS.map((step, index) => {
              const colors = stepColors[index];
              return (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  id={`step-${step.step}`}
                >
                  {/* Arrow between steps (desktop) */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-14 z-10 items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm border border-flyora-gray-200">
                      <ArrowRight size={12} className="text-flyora-teal" />
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className={`
                    relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.border} border
                    flex items-center justify-center mb-4 shadow-sm
                    group-hover:scale-110 group-hover:shadow-card transition-all duration-300
                    ${colors.text}
                  `}>
                    {iconMap[step.icon]}
                    {/* Step Number */}
                    <div className={`
                      absolute -top-2 -right-2 w-5 h-5 rounded-full ${colors.num} text-white
                      text-[10px] font-black flex items-center justify-center shadow-sm
                    `}>
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-bold text-flyora-navy mb-2 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-flyora-gray-500 leading-relaxed max-w-[170px] mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a
            href="#hero"
            className="inline-flex items-center gap-2 text-flyora-teal font-semibold text-sm hover:gap-3 transition-all duration-300 group"
            id="how-it-works-cta"
          >
            Start shipping today
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
