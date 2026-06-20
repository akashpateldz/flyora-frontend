/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        flyora: {
          navy: '#0A1628',
          'navy-light': '#1a2d4f',
          'navy-medium': '#162040',
          blue: '#1B4FD8',
          'blue-light': '#2563EB',
          'blue-muted': '#3B6FE8',
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-bright': '#2DD4BF',
          'teal-dark': '#0F766E',
          white: '#FFFFFF',
          'off-white': '#F8FAFC',
          'gray-50': '#F9FAFB',
          'gray-100': '#F3F4F6',
          'gray-200': '#E5E7EB',
          'gray-300': '#D1D5DB',
          'gray-500': '#6B7280',
          'gray-600': '#4B5563',
          'gray-700': '#374151',
          'gray-900': '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-lg': ['5.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'section': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'gradient-flyora': 'linear-gradient(135deg, #0A1628 0%, #1a2d4f 50%, #0F766E 100%)',
        'gradient-hero': 'linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        'gradient-cta': 'linear-gradient(135deg, #0A1628 0%, #162040 60%, #0F766E 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,253,250,0.8) 100%)',
        'world-map': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Ccircle cx='200' cy='150' r='2' fill='%230D9488' opacity='0.3'/%3E%3Ccircle cx='400' cy='100' r='2' fill='%230D9488' opacity='0.3'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.15)',
        'card': '0 4px 24px rgba(10, 22, 40, 0.08)',
        'card-hover': '0 12px 40px rgba(10, 22, 40, 0.16)',
        'teal': '0 8px 24px rgba(13, 148, 136, 0.3)',
        'blue': '0 8px 24px rgba(27, 79, 216, 0.3)',
        'hero': '0 32px 80px rgba(10, 22, 40, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'route-line': 'routeLine 2s ease-in-out infinite',
        'plane-fly': 'planeFly 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        routeLine: {
          '0%': { strokeDashoffset: '200' },
          '100%': { strokeDashoffset: '0' },
        },
        planeFly: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(8px) translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
