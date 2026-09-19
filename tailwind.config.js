/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { colors: { ink: '#020806', panel: '#04100b', line: 'rgba(0,255,102,.18)', phosphor: '#00ff66', text: '#d9f7e5', muted: '#8baa97' } } },
  plugins: []
};
