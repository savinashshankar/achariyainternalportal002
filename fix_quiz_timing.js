const fs = require('fs');

const filePath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\pages\\\\student\\\\StudentDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace 5000 with 30000 for auto-start window
content = content.replace(/timeSinceStart < 5000/g, 'timeSinceStart < 30000');
content = content.replace(/timeSinceStart >= 5000/g, 'timeSinceStart >= 30000');
content = content.replace(/< 5 seconds ago/g, '< 30 seconds ago');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Live Quiz auto-start window extended: 5s → 30s');
