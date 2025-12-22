import { useState, useEffect } from 'react';
import { X, Clock, ChevronLeft, Lightbulb } from 'lucide-react';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizModalProps {
    quiz: {
        id: number;
        title: string;
        timeLimit: number;
        questions: QuizQuestion[];
        maxAttempts: number;
    };
    onClose: () => void;
    onComplete: (score: number, timeUsed: number, userAnswers: (number | null)[]) => void;
    currentAttempt: number;
}

// P0-6: Hook to detect mobile viewport
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

const QuizModal = ({ quiz, onClose, onComplete, currentAttempt }: QuizModalProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
    const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit);
    const [showHintForQuestion, setShowHintForQuestion] = useState(false);
    const isMobile = useIsMobile();

    // P0-6: Lock body scroll when quiz modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);

        const isCorrect = answerIndex === question.correctAnswer;

        // MS2 Attempt 3: Show hint if wrong, hide if correct
        if (currentAttempt === 3) {
            if (!isCorrect) {
                setShowHintForQuestion(true);
                return;
            } else {
                setShowHintForQuestion(false);
            }
        }

        // Auto-advance logic
        if (currentQuestion < quiz.questions.length - 1) {
            if (currentAttempt < 3) {
                setTimeout(() => {
                    setCurrentQuestion(prev => prev + 1);
                }, 300);
            } else if (currentAttempt === 3 && isCorrect) {
                setTimeout(() => {
                    setCurrentQuestion(prev => prev + 1);
                    setShowHintForQuestion(false);
                }, 300);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer !== null && answer === quiz.questions[index].correctAnswer) {
                score++;
            }
        });

        const timeUsed = quiz.timeLimit - timeRemaining;
        onComplete(score, timeUsed, answers);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const question = quiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.questions.length - 1;
    const answeredCount = answers.filter(a => a !== null).length;

    // P0-6: Fullscreen on mobile, modal on desktop
    const containerClasses = isMobile
        ? 'fixed inset-0 bg-white flex flex-col z-50'
        : 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

    const modalClasses = isMobile
        ? 'flex-1 flex flex-col overflow-hidden'
        : 'bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden';

    return (
        <div className={containerClasses}>
            <div className={modalClasses}>
                {/* Header */}
                <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 ${isMobile ? '' : 'rounded-t-2xl'}`}>
                    <div className="flex justify-between items-center mb-2 md:mb-4">
                        <h2 className="text-lg md:text-2xl font-bold pr-4 line-clamp-1">{quiz.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-semibold text-base md:text-lg">{formatTime(timeRemaining)}</span>
                        </div>
                        <div>
                            Q {currentQuestion + 1}/{quiz.questions.length}
                        </div>
                        <div>
                            Attempt {currentAttempt}/{quiz.maxAttempts}
                        </div>
                    </div>
                </div>

                {/* Question - P0-6: Single scroll context */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="flex items-start gap-3 mb-4 md:mb-6">
                        <h3 className="text-base md:text-xl font-semibold text-gray-800 flex-1">
                            {question.question}
                        </h3>

                        {currentAttempt === 3 && showHintForQuestion && (
                            <div className="group relative">
                                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 cursor-help animate-pulse" />
                                <div className="hidden group-hover:block absolute right-0 top-8 w-56 md:w-64 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 shadow-lg z-10">
                                    <p className="text-xs font-semibold text-yellow-900 mb-1">💡 Hint:</p>
                                    <p className="text-xs text-yellow-800">
                                        Think about the key concepts you've learned. What formula or principle applies here?
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-2 md:space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition ${answers[currentQuestion] === index
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${answers[currentQuestion] === index
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-400'
                                        }`}>
                                        {answers[currentQuestion] === index && (
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-sm md:text-base text-gray-800">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{answeredCount}/{quiz.questions.length} answered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className={`bg-gray-50 p-4 md:p-6 flex justify-between ${isMobile ? '' : 'rounded-b-2xl'}`}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                    </button>

                    {isLastQuestion && (
                        <button
                            onClick={handleSubmit}
                            disabled={answeredCount < quiz.questions.length}
                            className="px-6 md:px-8 py-2 md:py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm md:text-base"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
