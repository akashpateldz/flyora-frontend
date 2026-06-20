import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion, Users } from 'lucide-react';

const faqs = [
  {
    question: "How do you verify travellers?",
    answer: "Every traveller must complete a strict government ID verification, phone verification, and a live selfie check before they can accept any package requests."
  },
  {
    question: "Are my payments safe?",
    answer: "Absolutely. We use a secure escrow system. Your payment is securely held and only released to the traveller once you confirm successful delivery."
  },
  {
    question: "What items can I send?",
    answer: "You can send documents, electronics, gifts, and personal items. Prohibited items like dangerous goods, liquids, or illegal substances are strictly forbidden."
  },
  {
    question: "How is the delivery confirmed?",
    answer: "When the traveller arrives, they will ask for a unique OTP code provided to the receiver to ensure the package reaches the exact correct person."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-16 lg:py-20 bg-flyora-off-white relative overflow-hidden" id="faq">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-flyora-teal/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container-flyora relative z-10 max-w-[1100px]">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* ─── Left Side: FAQs ──────────────────────────────────────────── */}
          <div className="w-full lg:w-[55%]">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-flyora-teal/10 border border-flyora-teal/20 rounded-full px-3 py-1 mb-4">
                <MessageCircleQuestion size={14} className="text-flyora-teal-dark" />
                <span className="text-[10px] font-bold text-flyora-teal-dark tracking-widest uppercase">
                  Got Questions?
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-flyora-navy mb-4 leading-tight tracking-tight">
                Frequently Asked <br /> Questions
              </h2>
              <p className="text-sm text-flyora-gray-500 max-w-md">
                Everything you need to know about shipping and earning with the Flyora community.
              </p>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border ${isOpen ? 'border-flyora-teal/30 bg-white shadow-md' : 'border-flyora-gray-200 bg-transparent hover:border-flyora-teal/20 hover:bg-white/50'} rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <div className="px-5 py-4 flex items-center justify-between gap-4 select-none">
                      <h3 className={`font-bold text-sm ${isOpen ? 'text-flyora-teal-dark' : 'text-flyora-navy'}`}>
                        {faq.question}
                      </h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-flyora-teal/10 rotate-180' : 'bg-flyora-gray-50'}`}>
                        <ChevronDown size={16} className={isOpen ? 'text-flyora-teal' : 'text-flyora-gray-400'} />
                      </div>
                    </div>
                    
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0 pb-0'}`}
                    >
                      <div className="overflow-hidden px-5">
                        <p className="text-sm text-flyora-gray-500 leading-relaxed border-t border-flyora-gray-100 pt-3">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Right Side: Team Image ────────────────────────────────────── */}
          <div className="w-full lg:w-[45%] lg:pt-10 flex items-center justify-center">
            <div className="relative rounded-[2rem] overflow-hidden group w-full h-full flex items-center justify-center">
              
              {/* Custom FAQ Image */}
              <img 
                src="/images/FAQ SECTION.png" 
                alt="Flyora Global Support Team" 
                className="w-full h-auto max-h-[500px] object-contain object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Decorative Teal Border Line on Hover */}
              <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-flyora-teal group-hover:w-full transition-all duration-700 ease-out z-20" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
