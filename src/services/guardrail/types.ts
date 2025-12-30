// Guardrail System Types

export type GuardrailLabel =
    | 'ALLOWED_ACADEMIC'
    | 'ALLOWED_ACADEMIC_SENSITIVE'
    | 'NEED_CLARIFICATION_ACADEMIC'
    | 'BLOCK_ROMANCE_SEXUAL'
    | 'BLOCK_HARASSMENT_HATE'
    | 'BLOCK_PROFANITY'
    | 'BLOCK_SELF_HARM'
    | 'BLOCK_VIOLENCE'
    | 'BLOCK_ILLEGAL'
    | 'BLOCK_CHEATING'
    | 'BLOCK_PRIVACY_PERSONAL_DATA'
    | 'BLOCK_OTHER_NON_ACADEMIC';

export type GuardrailAction =
    | 'SEND_TO_GEMINI_NORMAL'
    | 'SEND_TO_GEMINI_SENSITIVE'
    | 'ASK_CLARIFICATION'
    | 'BLOCK'
    | 'BLOCK_CHEATING'
    | 'ESCALATE_SELF_HARM'
    | 'REDIRECT';

export interface NormalizedInput {
    rawText: string;
    cleanText: string;
    tokens: string[];
    language: string;
    hasUrls: boolean;
    hasPhoneLike: boolean;
    hasEmailLike: boolean;
}

export interface ClassifierOutput {
    label: GuardrailLabel;
    confidence: number;
    reasons: string[];
    academicDomain: string | null;
    needsSyllabusContext: boolean;
    matchedPatterns: string[];
}

export interface GuardrailDecision {
    action: GuardrailAction;
    label: GuardrailLabel;
    response: string | null;
    shouldCallGemini: boolean;
    systemPrompt: 'normal' | 'sensitive' | null;
    logData: GuardrailLogData;
}

export interface GuardrailLogData {
    timestamp: string;
    messageHash: string;
    label: GuardrailLabel;
    confidence: number;
    domain: string | null;
    matchedRules: string[];
    sensitiveTermsFound: string[];
    syllabusCuesFound: string[];
    actionTaken: GuardrailAction;
    geminiCalled: boolean;
}
