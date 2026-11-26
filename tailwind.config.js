/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official RVS College of Arts and Science (rvscas.ac.in) Theme Tokens
        rvsmaroon: {
          DEFAULT: '#7C0201',
          dark: '#5C0101',
          light: '#9B1110',
        },
        rvsgold: {
          DEFAULT: '#FAAE53',
          dim: '#E39538',
        },
        rvsslate: {
          DEFAULT: '#1B242F',
          dark: '#111820',
          light: '#273342',
        },
        rvscream: {
          DEFAULT: '#EDE9DA',
          soft: '#F7F5EE',
        },
        // Keep CMS developer-console dark tokens
        obsidian: '#111820',
        charcoal: '#1B242F',
        surface: '#222D3B',
        elevated: '#2B3849',
        lime: {
          DEFAULT: '#FAAE53',
          dim: '#E39538',
        },
        cyanlab: '#38BDF8',
        mint: '#2EE59D',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        college: ['"Clearly"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
