import { CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizReviewProps {
    quiz: {
        title: string;
        questions: Array<{
            id: number;
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
            moduleId?: number;  // Optional - for navigation to module
            topic?: string;     // Optional - for display
        }>;
    };
    userAnswers: (number | null)[];
    score: number;
    timeUsed: number;
    onContinue: () => void;
}

const QuizReview = ({ quiz, userAnswers, score, timeUsed, onContinue }: QuizReviewProps) => {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-t-2xl text-center">
                    <h2 className="text-3xl font-bold mb-4">🎉 Quiz Complete!</h2>
                    <div className="flex justify-center items-center gap-8">
                        <div>
                            <p className="text-green-100 text-sm">Your Score</p>
                            <p className="text-5xl font-bold">{percentage}%</p>
                            <p className="text-green-100 mt-1">{score}/{quiz.questions.length} Correct</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <div>
                                <p className="text-green-100 text-sm">Time</p>
                                <p className="text-2xl font-semibold">{formatTime(timeUsed)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Credits earned */}
                    <div className="mt-6 bg-white/20 rounded-lg p-3">
                        <p className="text-lg">
                            ⭐ Credits Earned: <span className="font-bold">
                                {percentage === 100 ? '+5' : percentage >= 80 ? '+3' : '+1'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Review */}
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h3>

                    <div className="space-y-6">
                        {quiz.questions.map((question, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === question.correctAnswer;

                            return (
                                <div
                                    key={question.id}
                                    className={`border-2 rounded-xl p-6 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        {isCorrect ? (
                                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-lg mb-3">
                                                Question {index + 1}: {question.question}
                                            </h4>

                                            <div className="space-y-2 mb-4">
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`p-3 rounded-lg ${optIndex === question.correctAnswer
                                                            ? 'bg-green-100 border-2 border-green-500'
                                                            : optIndex === userAnswer && !isCorrect
                                                                ? 'bg-red-100 border-2 border-red-500'
                                                                : 'bg-white border border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {optIndex === question.correctAnswer && (
                                                                <span className="text-green-700 font-semibold text-sm">✓ Correct:</span>
                                                            )}
                                                            {optIndex === userAnswer && !isCorrect && (
                                                                <span className="text-red-700 font-semibold text-sm">✗ Your answer:</span>
                                                            )}
                                                            <span className={
                                                                optIndex === question.correctAnswer
                                                                    ? 'text-green-800 font-medium'
                                                                    : optIndex === userAnswer && !isCorrect
                                                                        ? 'text-red-800'
                                                                        : 'text-gray-600'
                                                            }>
                                                                {option}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                                <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                                                <p className="text-sm text-blue-800">{question.explanation}</p>
                                            </div>

                                            {/* Module Review Link for Wrong Answers */}
                                            {!isCorrect && question.moduleId && (
                                                <Link
                                                    to={`/student/module/${question.moduleId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold text-sm shadow-md"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    Review Module Content
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-center">
                    <button
                        onClick={onContinue}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizReview;
