/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IBM Design Language Colors
        ibm: {
          blue: {
            10: '#edf5ff',
            20: '#d0e2ff',
            30: '#a6c8ff',
            40: '#78a9ff',
            50: '#4589ff',
            60: '#0f62fe',
            70: '#0043ce',
            80: '#002d9c',
            90: '#001d6c',
            100: '#001141',
          },
          gray: {
            10: '#f4f4f4',
            20: '#e0e0e0',
            30: '#c6c6c6',
            40: '#a8a8a8',
            50: '#8d8d8d',
            60: '#6f6f6f',
            70: '#525252',
            80: '#393939',
            90: '#262626',
            100: '#161616',
          },
          teal: {
            20: '#9ef0f0',
            30: '#3ddbd9',
            40: '#08bdba',
            50: '#009d9a',
            60: '#007d79',
            70: '#005d5d',
          },
          green: {
            20: '#a7f0ba',
            30: '#6fdc8c',
            40: '#42be65',
            50: '#24a148',
            60: '#198038',
          },
          purple: {
            20: '#d4bbff',
            30: '#be95ff',
            40: '#a56eff',
            50: '#8a3ffc',
            60: '#6929c4',
          },
        },
        // Surf & Golf specific colors
        surf: {
          light: '#78a9ff',
          DEFAULT: '#0f62fe',
          dark: '#002d9c',
        },
        golf: {
          light: '#6fdc8c',
          DEFAULT: '#24a148',
          dark: '#005d5d',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

// Made with Bob
