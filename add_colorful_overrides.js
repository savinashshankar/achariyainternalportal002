const fs = require('fs');

const cssPath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Add colorful theme overrides after the dark theme overrides
const colorfulOverrides = `

/* ============================================ */
/* COLORFUL THEME OVERRIDES - Apply to ALL elements */
/* ============================================ */

/* Colorful theme - Override ALL white backgrounds */
[data-theme="colorful"] [class*="bg-"]:not([class*="bg-gradient"]):not([class*="bg-blue"]):not([class*="bg-purple"]):not([class*="bg-green-5"]):not([class*="bg-red"]):not([class*="bg-orange"]):not([class*="bg-yellow"]) {
  background-color: var(--bg-primary) !important;
}

[data-theme="colorful"] .bg-white,
[data-theme="colorful"] div.bg-white,
[data-theme="colorful"] section.bg-white,
[data-theme="colorful"] main .bg-white {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

[data-theme="colorful"] .bg-gray-50,
[data-theme="colorful"] .bg-gray-100,
[data-theme="colorful"] div.bg-gray-50,
[data-theme="colorful"] div.bg-gray-100,
[data-theme="colorful"] main,
[data-theme="colorful"] body {
  background-color: var(--bg-secondary) !important;
}

[data-theme="colorful"] .bg-gray-200,
[data-theme="colorful"] div.bg-gray-200 {
  background-color: var(--bg-tertiary) !important;
}

/* Colorful theme text overrides */
[data-theme="colorful"] .text-gray-800,
[data-theme="colorful"] .text-gray-900,
[data-theme="colorful"] h1,
[data-theme="colorful"] h2,
[data-theme="colorful"] h3,
[data-theme="colorful"] h4 {
  color: var(--text-primary) !important;
}

[data-theme="colorful"] .text-gray-600,
[data-theme="colorful"] .text-gray-700,
[data-theme="colorful"] p,
[data-theme="colorful"] span {
  color: var(--text-secondary) !important;
}

[data-theme="colorful"] .text-gray-500,
[data-theme="colorful"] .text-sm {
  color: var(--text-tertiary) !important;
}

/* Colorful theme borders */
[data-theme="colorful"] .border-gray-200,
[data-theme="colorful"] .border-gray-300 {
  border-color: var(--border-color) !important;
}

`;

// Find the end of dark theme overrides and insert colorful overrides
const darkThemeEnd = css.indexOf('/* CRITICAL: Fix text contrast');
if (darkThemeEnd !== -1) {
    css = css.slice(0, darkThemeEnd) + colorfulOverrides + css.slice(darkThemeEnd);
} else {
    // Fallback - append at end
    css += colorfulOverrides;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ Colorful theme overrides added - WILL NOW APPLY TO ALL ELEMENTS');
