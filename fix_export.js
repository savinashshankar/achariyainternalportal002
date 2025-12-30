const fs = require('fs');

// Fix the function name in liveQuizService.ts
const servicePath = 'E:\\\\AntiGravity-Assets\\\\frontend\\\\src\\\\services\\\\liveQuizService.ts';
let service = fs.readFileSync(servicePath, 'utf8');

// Add alias export for startLiveQuizSession
if (!service.includes('startLiveQuizSession')) {
    service = service.replace(
        'export async function startLiveQuiz(',
        'export const startLiveQuizSession = startLiveQuiz;\nexport async function startLiveQuiz('
    );
    fs.writeFileSync(servicePath, service, 'utf8');
    console.log('✓ Added startLiveQuizSession alias');
} else {
    console.log('startLiveQuizSession already exists');
}
