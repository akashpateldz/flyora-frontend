import React from 'react';
import {
  Plane, Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight
} from 'lucide-react';
import { FOOTER_LINKS } from '../constants/routes';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-gradient text-white relative overflow-hidden" id="footer" role="contentinfo">
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-flyora-teal/40 to-transparent" />

      {/* Background dots */}
      <div className="absolute inset-0 world-map-bg opacity-5 pointer-events-none" />

      <div className="container-flyora relative z-10">
        {/* Main Footer Content */}
        <div className="pt-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 xl:gap-8">
            
            {/* ─── Brand Column ──────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <a href="/" className="inline-flex items-center gap-2 group mb-4 block" id="footer-logo">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-flyora-teal to-flyora-teal-light flex items-center justify-center shadow-teal group-hover:shadow-[0_4px_15px_rgba(13,148,136,0.4)] transition-all duration-300">
                  <Plane size={16} className="text-white -rotate-45" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-black tracking-tight text-white">
                    fly<span className="text-flyora-teal-bright">ora</span>
                  </span>
                  <span className="text-[8px] font-medium text-white/40 tracking-widest uppercase mt-0.5">
                    Ship Smarter
                  </span>
                </div>
              </a>

              <p className="text-white/55 text-xs leading-relaxed mb-5 max-w-xs">
                Flyora connects verified travelers and senders worldwide to share luggage space
                and ship packages globally. Simple. Safe. Smart.
              </p>

              {/* Contact */}
              <div className="space-y-2 mb-5">
                {[
                  { icon: <Mail size={12} />, text: 'hello@flyora.com' },
                  { icon: <Phone size={12} />, text: '+1 (800) FLYORA-1' },
                  { icon: <MapPin size={12} />, text: 'San Francisco, CA, USA' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/45 text-xs">
                    <span className="text-flyora-teal-bright flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-1.5">
                {[
                  { icon: <Twitter size={14} />, label: 'Twitter', id: 'footer-twitter' },
                  { icon: <Facebook size={14} />, label: 'Facebook', id: 'footer-facebook' },
                  { icon: <Instagram size={14} />, label: 'Instagram', id: 'footer-instagram' },
                  { icon: <Linkedin size={14} />, label: 'LinkedIn', id: 'footer-linkedin' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    id={social.id}
                    aria-label={`Flyora on ${social.label}`}
                    className="w-7 h-7 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center text-white/60 hover:text-flyora-teal-bright hover:bg-flyora-teal/15 hover:border-flyora-teal/30 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-2"></div>

            {/* ─── Link Columns ──────────────────────────────────────────────── */}
            {(
              [
                { title: 'Company', links: FOOTER_LINKS.company },
                { title: 'Support', links: FOOTER_LINKS.support },
              ] as { title: string; links: { label: string; href: string }[] }[]
            ).map((col) => (
              <div key={col.title} className="lg:col-span-1">
                <h3 className="text-sm font-bold text-white mb-4 tracking-wide">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/50 text-sm hover:text-flyora-teal-bright transition-colors duration-200 inline-flex items-center gap-1 group"
                      >
                        <ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-flyora-teal-bright" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom Bar ───────────────────────────────────────────────────── */}
        <div className="py-4 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/35 text-xs">
              © {currentYear} Flyora Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-white/35 text-xs">
              <span className="flex items-center gap-1">
                <span>Made with</span>
                <span className="text-red-400">♥</span>
                <span>for global travelers</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
