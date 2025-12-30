const fs = require('fs');

const servicePath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\services\\\\liveQuizService.ts';
let content = fs.readFileSync(servicePath, 'utf8');

// Find and replace the listenForActiveQuiz function with a simpler version
const oldQuery = `const q = query(
        collection(db, 'liveQuizSessions'),
        where('classId', '==', classId),
        where('status', '==', 'active'),
        orderBy('startTime', 'desc'),
        limit(5) // Get last 5 to find non-expired one
    );`;

const newQuery = `// SIMPLIFIED: No orderBy to avoid needing Firestore index
    // We'll sort and filter client-side instead
    const q = query(
        collection(db, 'liveQuizSessions'),
        where('classId', '==', classId),
        where('status', '==', 'active')
    );`;

if (content.includes('orderBy(\'startTime\', \'desc\')')) {
    content = content.replace(
        /const q = query\(\s*collection\(db, 'liveQuizSessions'\),\s*where\('classId', '==', classId\),\s*where\('status', '==', 'active'\),\s*orderBy\('startTime', 'desc'\),\s*limit\(5\).*?\);/s,
        newQuery
    );

    // Also update the processing logic
    content = content.replace(
        `// Find the first NON-EXPIRED quiz
        const now = Date.now();
        for (const docSnap of querySnapshot.docs) {`,
        `// Find the NEWEST non-expired quiz (sort client-side)
        const now = Date.now();
        const sessions = querySnapshot.docs
            .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as LiveQuizSession))
            .sort((a, b) => b.startTime.toDate().getTime() - a.startTime.toDate().getTime());
        
        for (const session of sessions) {`
    );

    // Update the loop to use session directly
    content = content.replace(
        `for (const docSnap of querySnapshot.docs) {
            const session = { id: docSnap.id, ...docSnap.data() } as LiveQuizSession;`,
        `for (const session of sessions) {`
    );

    fs.writeFileSync(servicePath, content, 'utf8');
    console.log('✓ Simplified Firebase query (removed orderBy, sorting client-side)');
} else {
    console.log('Query already simplified or different format');
}
