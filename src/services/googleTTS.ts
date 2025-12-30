// Google Cloud Text-to-Speech Service
// Provides high-quality Indian English and Tamil voices

const TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_API_KEY || '';
const TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

export interface TTSConfig {
    text: string;
    languageCode: 'en-IN' | 'ta-IN';
    voiceName?: string;
}

// Voice options - Using Neural2 (most natural sounding)
export const VOICES = {
    ENGLISH_FEMALE: { languageCode: 'en-IN', name: 'en-IN-Neural2-A', ssmlGender: 'FEMALE' },
    ENGLISH_MALE: { languageCode: 'en-IN', name: 'en-IN-Neural2-B', ssmlGender: 'MALE' },
    TAMIL_FEMALE: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A', ssmlGender: 'FEMALE' }, // Neural2 not available for Tamil
    TAMIL_MALE: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-B', ssmlGender: 'MALE' },
} as const;

// Check if TTS is available
export function isTTSAvailable(): boolean {
    return !!TTS_API_KEY && TTS_API_KEY.length > 10;
}

// Detect if text contains Tamil characters
export function isTamilText(text: string): boolean {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    return tamilRegex.test(text);
}

// Clean text for speech (remove markdown, emojis)
function cleanTextForSpeech(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers **text**
        .replace(/^\s*\*\s+/gm, '') // Remove bullet point asterisks at line start
        .replace(/\*\s+/g, ', ') // Replace remaining * bullets with pause
        // Remove ALL emojis and icons
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
        .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')
        .replace(/[\u{1FA00}-\u{1FAFF}]/gu, '')
        .replace(/[\u{231A}-\u{231B}]/gu, '')
        .replace(/[\u{23E9}-\u{23F3}]/gu, '')
        .replace(/[\u{23F8}-\u{23FA}]/gu, '')
        .replace(/[\u{25AA}-\u{25AB}]/gu, '')
        .replace(/[\u{25B6}]/gu, '')
        .replace(/[\u{25C0}]/gu, '')
        .replace(/[\u{25FB}-\u{25FE}]/gu, '')
        .replace(/[\u{2614}-\u{2615}]/gu, '')
        .replace(/[\u{2648}-\u{2653}]/gu, '')
        .replace(/[\u{267F}]/gu, '')
        .replace(/[\u{2693}]/gu, '')
        .replace(/[\u{26A1}]/gu, '')
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/•/g, ',') // Replace bullet with comma for pause
        .replace(/\s+/g, ' ')
        .trim();
}

// Synthesize speech using Google Cloud TTS
export async function synthesizeSpeech(text: string): Promise<string | null> {
    if (!isTTSAvailable()) {
        console.warn('Google TTS API key not configured');
        return null;
    }

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return null;

    // Auto-detect language
    const isTamil = isTamilText(text);
    const voice = isTamil ? VOICES.TAMIL_FEMALE : VOICES.ENGLISH_FEMALE;

    console.log(`🎤 TTS: Using ${isTamil ? 'Tamil' : 'English'} voice: ${voice.name}`);

    // Convert to SSML for better control
    // Replace "Achariya Intelligence" and remaining "AI" with phonetic pronunciation
    const ssmlText = cleanText
        .replace(/Achariya Intelligence/gi, 'Aachariyaa <break time="100ms"/> Intelligence')
        .replace(/ஆச்சாரியா Intelligence/gi, 'ஆச்சாரியா <break time="100ms"/> Intelligence')
        .replace(/\bAI\b/gi, 'Achariya Intelligence'); // Replace standalone AI with full brand name

    // Add 1s silence at start to cover audio fade-in artifact
    const ssml = `<speak><break time="800ms"/>${ssmlText}</speak>`;

    const requestBody = {
        input: { ssml: ssml },
        voice: {
            languageCode: voice.languageCode,
            name: voice.name,
            ssmlGender: voice.ssmlGender
        },
        audioConfig: {
            audioEncoding: 'OGG_OPUS', // Cleaner start than MP3
            speakingRate: 0.95, // Natural pace
            pitch: 0.0, // Natural pitch
        }
    };

    try {
        const response = await fetch(`${TTS_ENDPOINT}?key=${TTS_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('TTS API Error:', error);
            return null;
        }

        const data = await response.json();

        // Return audio as base64 data URL (OGG format)
        return `data:audio/ogg;base64,${data.audioContent}`;
    } catch (error) {
        console.error('TTS request failed:', error);
        return null;
    }
}

// Play audio from base64 data URL
export function playAudio(audioDataUrl: string): HTMLAudioElement {
    const audio = new Audio(audioDataUrl);
    audio.play();
    return audio;
}

// Create a combined speak function
export async function speak(text: string): Promise<HTMLAudioElement | null> {
    const audioUrl = await synthesizeSpeech(text);
    if (audioUrl) {
        return playAudio(audioUrl);
    }
    return null;
}
