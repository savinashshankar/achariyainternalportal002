const fs = require('fs');

const cssPath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Find and replace the colorful theme section
const oldColorful = /\/\* Colorful theme.*?\n\}/s;

const newColorful = `/* Colorful theme - BOLD, VIBRANT, ENERGETIC */
[data-theme="colorful"] {
  /* Bright, saturated backgrounds - CLEARLY DIFFERENT */
  --bg-primary: #ffe4f9;      /* Bright pink tint */
  --bg-secondary: #ccf2ff;    /* Vibrant sky blue */
  --bg-tertiary: #fff0db;     /* Bright peach */
  
  /* High contrast, vivid text */
  --text-primary: #9333ea;    /* Vibrant purple */
  --text-secondary: #ec4899;  /* Bright pink */
  --text-tertiary: #f97316;   /* Bold orange */
  
  /* Eye-catching borders and accents */
  --border-color: #f0abfc;    /* Bright fuchsia */
  --border-hover: #818cf8;    /* Vibrant indigo */
  --shadow: rgba(236, 72, 153, 0.3);
}`;

css = css.replace(oldColorful, newColorful);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ Colorful theme updated to VIBRANT colors');
