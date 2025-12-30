// Intent Classifier - Pattern-based classification
import { ClassifierOutput } from './types';
import { NormalizedInput } from './types';
import {
    ROMANCE_PATTERNS,
    EXPLICIT_PATTERNS,
    PROFANITY_PATTERNS,
    HARASSMENT_PATTERNS,
    SELF_HARM_PATTERNS,
    VIOLENCE_PATTERNS,
    ILLEGAL_PATTERNS,
    CHEATING_PATTERNS,
    LEARNING_INTENT_CUES,
    PRIVACY_PATTERNS,
    SENSITIVE_ACADEMIC_TERMS,
    SYLLABUS_CUES,
    ACADEMIC_DOMAINS,
    NON_ACADEMIC_DOMAINS
} from './guardrailConfig';

/**
 * Check if text contains any pattern from a list
 */
function matchesPatterns(text: string, patterns: string[]): string[] {
    const matches: string[] = [];
    for (const pattern of patterns) {
        if (text.includes(pattern.toLowerCase())) {
            matches.push(pattern);
        }
    }
    return matches;
}

/**
 * Check for word boundary matches (more precise)
 */
function matchesWordPatterns(text: string, tokens: string[], patterns: string[]): string[] {
    const matches: string[] = [];
    const textLower = text.toLowerCase();

    for (const pattern of patterns) {
        const patternLower = pattern.toLowerCase();
        // Check if pattern is a multi-word phrase
        if (patternLower.includes(' ')) {
            if (textLower.includes(patternLower)) {
                matches.push(pattern);
            }
        } else {
            // Single word - check tokens
            if (tokens.includes(patternLower)) {
                matches.push(pattern);
            }
            // Also check if it's part of the text (for compound words)
            if (textLower.includes(patternLower)) {
                matches.push(pattern);
            }
        }
    }
    return [...new Set(matches)]; // Remove duplicates
}

/**
 * Classify user intent based on normalized input
 */
export function classifyIntent(input: NormalizedInput): ClassifierOutput {
    const { cleanText, tokens } = input;
    const allMatches: string[] = [];

    // === HIGH PRIORITY BLOCKS (Check first) ===

    // 1. Self-harm (highest priority - needs escalation)
    const selfHarmMatches = matchesPatterns(cleanText, SELF_HARM_PATTERNS);
    if (selfHarmMatches.length > 0) {
        return {
            label: 'BLOCK_SELF_HARM',
            confidence: 0.95,
            reasons: ['Self-harm ideation detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: selfHarmMatches
        };
    }

    // 2. Explicit sexual content (immediate block)
    const explicitMatches = matchesWordPatterns(cleanText, tokens, EXPLICIT_PATTERNS);
    if (explicitMatches.length > 0) {
        return {
            label: 'BLOCK_ROMANCE_SEXUAL',
            confidence: 0.95,
            reasons: ['Explicit content detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: explicitMatches
        };
    }

    // 3. Violence
    const violenceMatches = matchesPatterns(cleanText, VIOLENCE_PATTERNS);
    if (violenceMatches.length > 0) {
        return {
            label: 'BLOCK_VIOLENCE',
            confidence: 0.90,
            reasons: ['Violence-related content detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: violenceMatches
        };
    }

    // 4. Romance/flirting
    const romanceMatches = matchesWordPatterns(cleanText, tokens, ROMANCE_PATTERNS);
    if (romanceMatches.length > 0) {
        return {
            label: 'BLOCK_ROMANCE_SEXUAL',
            confidence: 0.90,
            reasons: ['Romance/dating content detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: romanceMatches
        };
    }

    // 5. Profanity
    const profanityMatches = matchesWordPatterns(cleanText, tokens, PROFANITY_PATTERNS);
    if (profanityMatches.length > 0) {
        return {
            label: 'BLOCK_PROFANITY',
            confidence: 0.90,
            reasons: ['Profanity detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: profanityMatches
        };
    }

    // 6. Harassment
    const harassmentMatches = matchesPatterns(cleanText, HARASSMENT_PATTERNS);
    if (harassmentMatches.length > 0) {
        return {
            label: 'BLOCK_HARASSMENT_HATE',
            confidence: 0.90,
            reasons: ['Harassment/bullying detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: harassmentMatches
        };
    }

    // 7. Privacy/PII
    const privacyMatches = matchesPatterns(cleanText, PRIVACY_PATTERNS);
    if (privacyMatches.length > 0 || input.hasPhoneLike || input.hasEmailLike) {
        allMatches.push(...privacyMatches);
        if (input.hasPhoneLike) allMatches.push('phone-like pattern');
        if (input.hasEmailLike) allMatches.push('email-like pattern');
        return {
            label: 'BLOCK_PRIVACY_PERSONAL_DATA',
            confidence: 0.85,
            reasons: ['Personal data request detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: allMatches
        };
    }

    // 8. Illegal
    const illegalMatches = matchesPatterns(cleanText, ILLEGAL_PATTERNS);
    if (illegalMatches.length > 0) {
        return {
            label: 'BLOCK_ILLEGAL',
            confidence: 0.90,
            reasons: ['Illegal activity detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: illegalMatches
        };
    }

    // 9. Cheating (but check for learning intent)
    const cheatingMatches = matchesPatterns(cleanText, CHEATING_PATTERNS);
    const learningMatches = matchesPatterns(cleanText, LEARNING_INTENT_CUES);
    if (cheatingMatches.length > 0 && learningMatches.length === 0) {
        return {
            label: 'BLOCK_CHEATING',
            confidence: 0.85,
            reasons: ['Cheating request without learning intent'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: cheatingMatches
        };
    }

    // === SENSITIVE ACADEMIC TOPICS ===
    const sensitiveMatches = matchesWordPatterns(cleanText, tokens, SENSITIVE_ACADEMIC_TERMS);
    const syllabusMatches = matchesPatterns(cleanText, SYLLABUS_CUES);

    if (sensitiveMatches.length > 0) {
        if (syllabusMatches.length > 0) {
            // Has syllabus context - allow with sensitive prompt
            return {
                label: 'ALLOWED_ACADEMIC_SENSITIVE',
                confidence: 0.85,
                reasons: ['Sensitive topic with syllabus context'],
                academicDomain: 'biology',
                needsSyllabusContext: false,
                matchedPatterns: [...sensitiveMatches, ...syllabusMatches]
            };
        } else {
            // No syllabus context - ask for clarification
            return {
                label: 'NEED_CLARIFICATION_ACADEMIC',
                confidence: 0.70,
                reasons: ['Sensitive topic without syllabus context'],
                academicDomain: 'biology',
                needsSyllabusContext: true,
                matchedPatterns: sensitiveMatches
            };
        }
    }

    // === ACADEMIC DOMAIN CHECK ===
    const academicMatches = matchesWordPatterns(cleanText, tokens, ACADEMIC_DOMAINS);
    const nonAcademicMatches = matchesWordPatterns(cleanText, tokens, NON_ACADEMIC_DOMAINS);

    if (nonAcademicMatches.length > 0 && academicMatches.length === 0) {
        return {
            label: 'BLOCK_OTHER_NON_ACADEMIC',
            confidence: 0.75,
            reasons: ['Non-academic topic detected'],
            academicDomain: null,
            needsSyllabusContext: false,
            matchedPatterns: nonAcademicMatches
        };
    }

    if (academicMatches.length > 0 || learningMatches.length > 0) {
        return {
            label: 'ALLOWED_ACADEMIC',
            confidence: 0.85,
            reasons: ['Academic topic detected'],
            academicDomain: academicMatches[0] || 'general',
            needsSyllabusContext: false,
            matchedPatterns: academicMatches
        };
    }

    // === DEFAULT: If not blocked, allow Gemini to handle it ===
    // The guardrail's job is to BLOCK bad content, not to gate all content
    return {
        label: 'ALLOWED_ACADEMIC',
        confidence: 0.70,
        reasons: ['No block patterns matched - allowing Gemini to handle'],
        academicDomain: 'general',
        needsSyllabusContext: false,
        matchedPatterns: []
    };
}
