// OpenAI Speech-to-Text (Whisper) Service
// Uses OpenAI's transcription API for higher quality than Web Speech API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface TranscriptionResult {
    text: string;
    language?: string;
}

/**
 * Check if OpenAI STT is available
 */
export function isOpenAISTTAvailable(): boolean {
    return !!OPENAI_API_KEY && OPENAI_API_KEY.length > 10;
}

/**
 * Transcribe audio blob using OpenAI Whisper API
 * @param audioBlob - The recorded audio blob
 * @returns Transcription result with text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult | null> {
    if (!isOpenAISTTAvailable()) {
        console.warn('OpenAI API key not configured for STT');
        return null;
    }

    try {
        // Create form data with audio file
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en'); // Can be 'ta' for Tamil, 'en' for English
        formData.append('response_format', 'json');

        console.log('🎤 Sending audio to OpenAI Whisper...');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI STT Error:', error);
            return null;
        }

        const result = await response.json();
        console.log('🎤 Transcription result:', result.text);

        return {
            text: result.text,
            language: result.language
        };
    } catch (error) {
        console.error('OpenAI STT request failed:', error);
        return null;
    }
}

/**
 * Helper class to record audio from microphone
 */
export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    async start(): Promise<boolean> {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            this.audioChunks = [];
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
            console.log('🎙️ Recording started...');
            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            return false;
        }
    }

    stop(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('No active recording'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                console.log('🎙️ Recording stopped, size:', audioBlob.size);

                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }

                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    isRecording(): boolean {
        return this.mediaRecorder?.state === 'recording';
    }
}
