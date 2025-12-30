const fs = require('fs');

const servicePath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\services\\\\liveQuizService.ts';
let content = fs.readFileSync(servicePath, 'utf8');

// Find and replace the endQuizSession function
const oldEndQuiz = `/**
 * Teacher: End quiz session
 */
export async function endQuizSession(sessionId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'liveQuizSessions', sessionId), {
            status: 'completed'
        });
    } catch (error) {
        console.error('Error ending quiz session:', error);
    }
}`;

const newEndQuiz = `/**
 * Teacher: End quiz session - marks as completed and updates endTime
 */
export async function endQuizSession(sessionId: string): Promise<void> {
    console.log('🛑 Ending quiz session:', sessionId);
    
    if (!sessionId) {
        console.error('❌ No sessionId provided');
        throw new Error('No session ID provided');
    }
    
    try {
        const sessionRef = doc(db, 'liveQuizSessions', sessionId);
        await updateDoc(sessionRef, {
            status: 'completed',
            endTime: Timestamp.now() // Update endTime to now
        });
        console.log('✅ Quiz session ended successfully');
    } catch (error) {
        console.error('❌ Error ending quiz session:', error);
        throw error; // Re-throw so caller knows it failed
    }
}`;

if (content.includes('export async function endQuizSession')) {
    content = content.replace(
        /\/\*\*\s*\n\s*\* Teacher: End quiz session\s*\n\s*\*\/\s*\nexport async function endQuizSession\(sessionId: string\): Promise<void> \{[\s\S]*?\n\}/,
        newEndQuiz
    );
    fs.writeFileSync(servicePath, content, 'utf8');
    console.log('✓ Updated endQuizSession with better error handling');
} else {
    console.log('Function not found');
}
