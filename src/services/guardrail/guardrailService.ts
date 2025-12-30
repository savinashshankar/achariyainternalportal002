// Main Guardrail Service - Orchestrates the guardrail pipeline
import { GuardrailDecision, NormalizedInput, ClassifierOutput } from './types';
import { normalizeInput } from './normalizer';
import { classifyIntent } from './classifier';
import { routeDecision, getSystemPrompt } from './router';

export interface GuardrailResult {
    decision: GuardrailDecision;
    normalizedInput: NormalizedInput;
    classification: ClassifierOutput;
}

/**
 * Main entry point for the guardrail system
 * Run this BEFORE calling Gemini
 */
export function processMessage(rawMessage: string): GuardrailResult {
    // Step 1: Normalize input
    const normalizedInput = normalizeInput(rawMessage);

    // Step 2: Classify intent
    const classification = classifyIntent(normalizedInput);

    // Step 3: Route to action
    const decision = routeDecision(normalizedInput, classification);

    // Log decision (in production, send to backend/analytics)
    if (process.env.NODE_ENV === 'development') {
        console.log('[Guardrail]', {
            action: decision.action,
            label: decision.label,
            confidence: classification.confidence,
            shouldCallGemini: decision.shouldCallGemini,
            matchedPatterns: classification.matchedPatterns.slice(0, 3)
        });
    }

    return {
        decision,
        normalizedInput,
        classification
    };
}

/**
 * Check if Gemini API key is available
 */
export function isGeminiAvailable(): boolean {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!apiKey && apiKey.length > 10;
}

/**
 * Get appropriate system prompt based on decision
 */
export function getPromptForDecision(decision: GuardrailDecision): string {
    return getSystemPrompt(decision.systemPrompt);
}

// Re-export types and utilities
export { normalizeInput } from './normalizer';
export { classifyIntent } from './classifier';
export { routeDecision, getSystemPrompt } from './router';
export * from './types';
