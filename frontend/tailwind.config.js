/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "farmalink-blue": "#007FFF",
        "farmalink-blue-dark": "#0066CC",
        "farmalink-header": "#FFFFFF",
        "farmalink-body": "#F4F7FA",
      },
      textColor: {
        "farmalink-blue": "#007FFF",
        "farmalink-gray": "#555555",
        "farmalink-dark": "#333333",
      },
      borderColor: {
        "farmalink-blue": "#007FFF",
        "farmalink-gray-light": "#E0E0E0",
      },
    },
  },
  plugins: [],
};
