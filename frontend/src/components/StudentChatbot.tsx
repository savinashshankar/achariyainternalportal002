// Upgraded Student Chatbot with Gemini AI and Guardrails
// P0-3: Mobile-first fullscreen chatbot with Text-to-Speech and Voice Input
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { sendMessage } from '../services/chatbotService';
import { sampleData } from '../data/sampleData';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    source?: string;
    flagged?: boolean;
}

interface StudentChatbotProps {
    studentId: number;
    studentName?: string; // Optional if not always available
}

// Simple markdown formatter for chat messages
const formatMessage = (text: string) => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert newlines to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    // Convert bullet points
    formatted = formatted.replace(/^• /gm, '&bull; ');
    return formatted;
};

// Hook to detect mobile viewport
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

// Speech Recognition hook using OpenAI Whisper for high-quality transcription
const useSpeechRecognition = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recorderRef = useRef<any>(null);

    useEffect(() => {
        // Check for microphone support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setIsSupported(false);
            return;
        }

        // Dynamically import the STT service
        import('../services/openaiSTT').then(({ AudioRecorder, isOpenAISTTAvailable }) => {
            if (!isOpenAISTTAvailable()) {
                console.warn('OpenAI STT not available, falling back to Web Speech API');
                // Keep isSupported true - we'll fall back to Web Speech API
            }
            recorderRef.current = new AudioRecorder();
        });
    }, []);

    const startListening = useCallback(async () => {
        if (isListening || isProcessing) return;

        try {
            if (recorderRef.current) {
                const started = await recorderRef.current.start();
                if (started) {
                    setIsListening(true);
                    onResult(''); // Clear previous text
                }
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }, [isListening, isProcessing, onResult]);

    const stopListening = useCallback(async () => {
        if (!isListening || !recorderRef.current) return;

        setIsListening(false);
        setIsProcessing(true);

        try {
            const audioBlob = await recorderRef.current.stop();

            // Transcribe using OpenAI Whisper
            const { transcribeAudio } = await import('../services/openaiSTT');
            const result = await transcribeAudio(audioBlob);

            if (result && result.text) {
                onResult(result.text);
            } else {
                // Fallback: notify user transcription failed
                console.warn('Transcription returned empty, audio may have been too short');
            }
        } catch (error) {
            console.error('Transcription failed:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [isListening, onResult]);

    return { isListening, isSupported, startListening, stopListening, isProcessing };
};


// Text-to-Speech hook using Google Cloud TTS (supports English & Tamil)
const useSpeech = () => {
    const [speaking, setSpeaking] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Check if TTS API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
        if (!apiKey || apiKey.length < 10) {
            console.warn('Google TTS API key not configured, using browser fallback');
        }
    }, []);

    const speak = async (text: string, messageIndex: number) => {
        if (loading) return;

        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setLoading(true);
        setSpeaking(messageIndex);

        try {
            // Import the TTS service dynamically
            const { synthesizeSpeech } = await import('../services/googleTTS');
            const audioUrl = await synthesizeSpeech(text);

            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    setSpeaking(null);
                    setLoading(false);
                    audioRef.current = null;
                };

                audio.onerror = () => {
                    console.error('Audio playback error');
                    setSpeaking(null);
                    setLoading(false);
                    audioRef.current = null;
                };

                await audio.play();
            } else {
                // Fallback to browser TTS if Google TTS fails
                console.log('Falling back to browser TTS');
                fallbackBrowserTTS(text, messageIndex);
            }
        } catch (error) {
            console.error('TTS error:', error);
            // Fallback to browser TTS
            fallbackBrowserTTS(text, messageIndex);
        }
    };

    const fallbackBrowserTTS = (text: string, _messageIndex: number) => {
        if (!('speechSynthesis' in window)) {
            setSpeaking(null);
            setLoading(false);
            return;
        }

        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/[\u{2600}-\u{26FF}]/gu, '')
            .replace(/•/g, '')
            // Fix AI pronunciation - use Achariya branding
            .replace(/\bAI\b/g, 'Achariya Intelligence')
            .replace(/\s+/g, ' ')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;

        utterance.onend = () => {
            setSpeaking(null);
            setLoading(false);
        };

        speechSynthesis.speak(utterance);
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        speechSynthesis.cancel();
        setSpeaking(null);
        setLoading(false);
    };

    return { speak, stop, speaking, supported: true, loading };
};

const StudentChatbot = ({ studentId, studentName }: StudentChatbotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: studentName
                ? `👋 Hi ${studentName.split(' ')[0]}! I'm your AI Study Assistant. I can help answer questions about your enrolled courses, explain concepts, and guide you through your learning. What would you like to know?`
                : "👋 Hi! I'm your AI Study Assistant. I can help answer questions about your enrolled courses, explain concepts, and guide you through your learning. What would you like to know?",
            source: '🤖 AI Study Assistant'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const { speak, stop, speaking, supported } = useSpeech();

    // Speech recognition for voice input (OpenAI Whisper)
    const handleVoiceResult = useCallback((text: string) => {
        setInput(text);
    }, []);
    const { isListening, isSupported: speechSupported, startListening, stopListening, isProcessing } = useSpeechRecognition(handleVoiceResult);

    // Get student's enrolled courses for context
    const enrollments = sampleData.enrollments.filter(e => e.student_id === studentId);
    const enrolledCourseIds = enrollments.map(e => e.course_id);
    const enrolledCourses = enrollments.map(e => {
        const course = sampleData.courses.find(c => c.id === e.course_id);
        return course?.title;
    }).filter(Boolean);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // P0-3: Lock body scroll when chatbot is open on mobile
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMobile]);

    // Stop TTS audio when chat is closed
    useEffect(() => {
        if (!isOpen) {
            stop();
        }
    }, [isOpen, stop]);

    // Auto-resize textarea when input changes (for transcription)
    useEffect(() => {
        if (inputRef.current) {
            const textarea = inputRef.current as HTMLTextAreaElement;
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
        }
    }, [input]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        // Add user message
        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // Call 5-tier chatbot system
            const result = await sendMessage(
                userInput,
                {
                    courseName: enrolledCourses[0] || 'Your Courses'
                },
                studentId.toString(),
                enrolledCourseIds, // Pass course IDs for static Q&A fallback
                studentName // Pass student name for personalized responses
            );

            // Add AI response
            const assistantMessage: Message = {
                role: 'assistant',
                content: result.response,
                flagged: result.flagged,
                source: result.source || '🤖 AI Study Assistant'
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Auto-focus input field after response
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: "I'm having trouble right now. Please try again or ask your teacher for help.",
                source: '❌ Error'
            };
            setMessages(prev => [...prev, errorMessage]);

            // Auto-focus input field even on error
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } finally {
            setIsTyping(false);
        }
    };

    const conversationStarters = [
        'Explain a concept from my course',
        'Help me with a difficult topic',
        'What should I focus on?',
        'Give me study tips'
    ];

    const handleStarterClick = (starter: string) => {
        setInput(starter);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Close chatbot when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // P0-3: Mobile fullscreen vs desktop floating modal
    const chatWindowClasses = isMobile
        ? 'fixed inset-0 bg-white flex flex-col z-50' // Fullscreen on mobile
        : 'fixed bottom-6 right-6 w-[576px] h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200';

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 group"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        AI
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div ref={chatWindowRef} className={chatWindowClasses}>
                    {/* Header - Click to minimize */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between ${isMobile ? '' : 'rounded-t-2xl'} cursor-pointer hover:opacity-95 transition`}
                        title="Click to minimize"
                    >
                        <div className="flex items-center">
                            <Sparkles className="w-5 h-5 mr-2" />
                            <div>
                                <h3 className="font-bold">AI Study Assistant</h3>
                                <p className="text-xs opacity-90">Your Learning Companion</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            className="hover:bg-white/20 p-2 rounded transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : msg.flagged
                                            ? 'bg-yellow-50 border-2 border-yellow-300 text-gray-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <div
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        {msg.source && (
                                            <p className="text-xs opacity-70 italic">{msg.source}</p>
                                        )}
                                        {msg.role === 'assistant' && supported && (
                                            <button
                                                onClick={() => speaking === idx ? stop() : speak(msg.content, idx)}
                                                className={`p-1.5 rounded-full transition-colors ${speaking === idx
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'hover:bg-gray-200 text-gray-500'
                                                    }`}
                                                title={speaking === idx ? 'Stop' : 'Listen'}
                                            >
                                                {speaking === idx ? (
                                                    <VolumeX className="w-4 h-4" />
                                                ) : (
                                                    <Volume2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Conversation Starters */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2">
                            <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {conversationStarters.slice(0, 3).map((starter, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleStarterClick(starter)}
                                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition"
                                    >
                                        {starter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input - P0-3: Pinned at bottom, works with mobile keyboard */}
                    <div className={`p-4 border-t bg-white ${isMobile ? 'pb-safe' : ''}`}>
                        {/* Voice Wave Animation when recording or processing */}
                        {(isListening || isProcessing) && (
                            <div className="flex items-center justify-center mb-3 py-2">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1 rounded-full animate-pulse ${isProcessing ? 'bg-blue-500' : 'bg-red-500'}`}
                                            style={{
                                                height: isProcessing ? '15px' : `${Math.random() * 20 + 10}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: '0.5s',
                                            }}
                                        />
                                    ))}
                                    {/* Show text only when listening, not when processing */}
                                    {isListening && !isProcessing && (
                                        <span className="text-sm ml-2 text-red-500 animate-pulse">
                                            Recording...
                                        </span>
                                    )}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i + 5}
                                            className={`w-1 rounded-full animate-pulse ${isProcessing ? 'bg-blue-500' : 'bg-red-500'}`}
                                            style={{
                                                height: isProcessing ? '15px' : `${Math.random() * 20 + 10}px`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: '0.5s',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-start space-x-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={isListening ? "Recording..." : "Ask me anything..."}
                                autoFocus
                                rows={1}
                                className={`flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none overflow-hidden ${isListening ? 'border-red-400 bg-red-50' : isProcessing ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                                    }`}
                                style={{ minHeight: '48px', maxHeight: '100px' }}
                                disabled={isTyping || isProcessing}
                            />
                            {/* Mic Button */}
                            {speechSupported && (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    disabled={isTyping || isProcessing}
                                    className={`p-3 rounded-full transition ${isProcessing
                                        ? 'bg-blue-500 text-white cursor-wait'
                                        : isListening
                                            ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={isProcessing ? 'Transcribing...' : isListening ? 'Stop recording' : 'Voice input'}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            )}
                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-1">Safe & filtered for education</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentChatbot;

