// Decision Router - Routes classified intent to appropriate action
import { GuardrailDecision, GuardrailAction, ClassifierOutput, NormalizedInput, GuardrailLogData } from './types';
import { RESPONSE_TEMPLATES, SYSTEM_PROMPTS } from './guardrailConfig';
import { hashMessage } from './normalizer';

/**
 * Route classified intent to appropriate action
 */
export function routeDecision(
    input: NormalizedInput,
    classification: ClassifierOutput
): GuardrailDecision {
    const { label, confidence, matchedPatterns, academicDomain } = classification;

    // Build log data
    const logData: GuardrailLogData = {
        timestamp: new Date().toISOString(),
        messageHash: hashMessage(input.rawText),
        label,
        confidence,
        domain: academicDomain,
        matchedRules: matchedPatterns,
        sensitiveTermsFound: [],
        syllabusCuesFound: [],
        actionTaken: 'REDIRECT', // Will be updated
        geminiCalled: false
    };

    let action: GuardrailAction;
    let response: string | null = null;
    let shouldCallGemini = false;
    let systemPrompt: 'normal' | 'sensitive' | null = null;

    // === DECISION ROUTING ===
    switch (label) {
        case 'ALLOWED_ACADEMIC':
            if (confidence >= 0.70) {
                action = 'SEND_TO_GEMINI_NORMAL';
                shouldCallGemini = true;
                systemPrompt = 'normal';
            } else {
                action = 'ASK_CLARIFICATION';
                response = RESPONSE_TEMPLATES.CLARIFICATION;
            }
            break;

        case 'ALLOWED_ACADEMIC_SENSITIVE':
            action = 'SEND_TO_GEMINI_SENSITIVE';
            shouldCallGemini = true;
            systemPrompt = 'sensitive';
            break;

        case 'NEED_CLARIFICATION_ACADEMIC':
            action = 'ASK_CLARIFICATION';
            response = classification.needsSyllabusContext
                ? RESPONSE_TEMPLATES.CLARIFICATION_SENSITIVE
                : RESPONSE_TEMPLATES.CLARIFICATION;
            break;

        case 'BLOCK_ROMANCE_SEXUAL':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.ACADEMIC_REDIRECT;
            break;

        case 'BLOCK_PROFANITY':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.PROFANITY_REDIRECT;
            break;

        case 'BLOCK_HARASSMENT_HATE':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.HARASSMENT_REDIRECT;
            break;

        case 'BLOCK_PRIVACY_PERSONAL_DATA':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.PRIVACY_REDIRECT;
            break;

        case 'BLOCK_CHEATING':
            action = 'BLOCK_CHEATING';
            response = RESPONSE_TEMPLATES.CHEATING_REDIRECT;
            break;

        case 'BLOCK_ILLEGAL':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.ACADEMIC_REDIRECT;
            break;

        case 'BLOCK_SELF_HARM':
            action = 'ESCALATE_SELF_HARM';
            response = RESPONSE_TEMPLATES.SELF_HARM_ESCALATION;
            break;

        case 'BLOCK_VIOLENCE':
            action = 'BLOCK';
            response = RESPONSE_TEMPLATES.ACADEMIC_REDIRECT;
            break;

        case 'BLOCK_OTHER_NON_ACADEMIC':
            action = 'REDIRECT';
            response = RESPONSE_TEMPLATES.BLOCK_GENERIC;
            break;

        default:
            action = 'REDIRECT';
            response = RESPONSE_TEMPLATES.ACADEMIC_REDIRECT;
    }

    // Update log data
    logData.actionTaken = action;
    logData.geminiCalled = shouldCallGemini;

    return {
        action,
        label,
        response,
        shouldCallGemini,
        systemPrompt,
        logData
    };
}

/**
 * Get the appropriate system prompt for Gemini
 */
export function getSystemPrompt(promptType: 'normal' | 'sensitive' | null): string {
    if (promptType === 'sensitive') {
        return SYSTEM_PROMPTS.SENSITIVE;
    }
    return SYSTEM_PROMPTS.NORMAL;
}
