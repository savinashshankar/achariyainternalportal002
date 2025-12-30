// Text Normalizer - Reduces bypass tricks
import { NormalizedInput } from './types';
import { LEETSPEAK_MAP } from './guardrailConfig';

/**
 * Normalizes user input to catch bypass attempts
 * - Handles leetspeak (s3x → sex)
 * - Handles spacing tricks (f l i r t → flirt)
 * - Handles repeated characters (sexxxx → sexx)
 */
export function normalizeInput(rawText: string): NormalizedInput {
    let text = rawText;

    // 1. Trim and lowercase
    text = text.trim().toLowerCase();

    // 2. Remove zero-width and control characters
    text = text.replace(/[\u200B-\u200D\uFEFF\u0000-\u001F]/g, '');

    // 3. Normalize Unicode to NFKC
    text = text.normalize('NFKC');

    // 4. Replace leetspeak
    for (const [leet, char] of Object.entries(LEETSPEAK_MAP)) {
        text = text.split(leet).join(char);
    }

    // 5. Collapse single-letter spacing tricks: "f l i r t" → "flirt"
    // But preserve normal multi-word sentences
    const singleLetterSpaced = /^([a-z]\s)+[a-z]$/;
    if (singleLetterSpaced.test(text)) {
        text = text.replace(/\s/g, '');
    } else {
        // Also detect embedded spaced words: "tell me about s e x"
        text = text.replace(/\b([a-z])\s+([a-z])\s+([a-z])\b/g, '$1$2$3');
        text = text.replace(/\b([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\b/g, '$1$2$3$4');
        text = text.replace(/\b([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\s+([a-z])\b/g, '$1$2$3$4$5');
    }

    // 6. Collapse repeated characters (more than 2 → 2): sexxxx → sexx
    text = text.replace(/(.)\1{2,}/g, '$1$1');

    // 7. Replace punctuation with spaces (but keep content)
    const cleanText = text.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // 8. Create tokens
    const tokens = cleanText.split(/\s+/).filter(t => t.length > 0);

    // 9. Detect patterns
    const hasUrls = /https?:\/\/|www\./i.test(rawText);
    const hasPhoneLike = /\d{10,}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(rawText);
    const hasEmailLike = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText);

    // 10. Simple language detection (Tamil vs English)
    const tamilChars = /[\u0B80-\u0BFF]/;
    const hasTamilScript = tamilChars.test(rawText);
    // Tamil transliteration cues
    const tamilCues = ['panna', 'epdi', 'enna', 'kitta', 'kudu', 'irukku', 'sollunga', 'pannunga'];
    const hasTamilTranslit = tamilCues.some(cue => cleanText.includes(cue));

    const language = hasTamilScript ? 'ta' : hasTamilTranslit ? 'ta-translit' : 'en';

    return {
        rawText,
        cleanText,
        tokens,
        language,
        hasUrls,
        hasPhoneLike,
        hasEmailLike
    };
}

/**
 * Hash a message for logging (privacy-safe)
 */
export function hashMessage(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Redact message for logging (keep first 20 chars + length)
 */
export function redactMessage(text: string): string {
    if (text.length <= 20) return '[REDACTED]';
    return text.substring(0, 20) + `... [${text.length} chars]`;
}
