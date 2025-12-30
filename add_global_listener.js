const fs = require('fs');

const layoutPath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\components\\\\Layout.tsx';
let layout = fs.readFileSync(layoutPath, 'utf8');

// Add import for GlobalQuizListener at the top
const importLine = "import GlobalQuizListener from './GlobalQuizListener';";
if (!layout.includes('GlobalQuizListener')) {
    // Add after first import
    layout = layout.replace(
        "import { Link, Outlet,",
        importLine + "\nimport { Link, Outlet,"
    );

    // Add component after Outlet
    layout = layout.replace(
        '<Outlet />',
        '<GlobalQuizListener />\n                    <Outlet />'
    );

    fs.writeFileSync(layoutPath, layout, 'utf8');
    console.log('✓ GlobalQuizListener added to Layout.tsx');
} else {
    console.log('GlobalQuizListener already exists in Layout.tsx');
}
