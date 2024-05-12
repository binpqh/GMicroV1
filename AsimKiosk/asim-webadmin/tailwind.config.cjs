/** @type {import('tailwindcss').Config} */

module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      primary: '#ff2f48',
      primaryColorHover: '#FF5765',
      secondary: '#ecc94b',

      colorBgLayout: '#f3f4f6',
      colorBgItem: '#fafafa',
      colorBgContainer: '#ffffff',
      textWhite: '#ffffff',

      colorLink: '#13c2c2',

      successColor: '#52c41a',
      successColor1: '#00b96b',
      successColorHover: '#73d13d',
      infoColor: '#4096ff',
      infoColorHover: '#69b1ff',
      warningColor: '#faad14',
      warningColorHover: '#ffc53d',
      errorColor: '#e71f45',
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
