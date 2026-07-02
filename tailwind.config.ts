import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937',
        muted: '#6B7280',
        line: '#E5E7EB',
        page: '#F7F8FA',
        primary: '#2563EB',
        danger: '#DC2626',
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
