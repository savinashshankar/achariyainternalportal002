import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Presentation, Video, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { sampleData } from '../../data/sampleData';
import StudentChatbot from '../../components/StudentChatbot';

// Sample content mapping for demo
const moduleContent: Record<number, {
    videoUrl: string;
    audioUrl: string;
    images: string[];
    slides: { title: string; content: string; image?: string }[];
}> = {
    1: { // Advanced Math Module 1
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        images: [
            "/math_quadratic_visual_1764926787773.png",
            "/math_derivatives_chart_1764926831395.png"
        ],
        slides: [
            {
                title: "Quadratic Equations - Introduction",
                content: "Standard Form: ax² + bx + c = 0\n\nWhere:\n• a, b, c are constants\n• a ≠ 0 (otherwise it's linear)\n• x is the variable we solve for"
            },
            {
                title: "The Quadratic Formula",
                content: "x = (-b ± √(b²-4ac)) / 2a\n\nThis formula gives us the solutions (roots) of any quadratic equation.\n\nThe ± symbol means we get two solutions.",
                image: "/math_quadratic_visual_1764926787773.png"
            },
            {
                title: "The Discriminant",
                content: "Δ = b² - 4ac\n\nTells us about the roots:\n• Δ > 0: Two real roots\n• Δ = 0: One real root (repeated)\n• Δ < 0: Two complex roots"
            },
            {
                title: "Example Problem",
                content: "Solve: x² - 5x + 6 = 0\n\na = 1, b = -5, c = 6\n\nΔ = (-5)² - 4(1)(6) = 25 - 24 = 1\n\nx = (5 ± √1) / 2 = (5 ± 1) / 2\n\nSolutions: x = 3 or x = 2"
            }
        ]
    },
    4: { // Physics Module 1
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Sample video
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        images: [
            "/physics_newtons_laws_1764926812539.png",
            "/physics_energy_diagram_1764926850307.png"
        ],
        slides: [
            {
                title: "Newton's Laws of Motion",
                content: "Three fundamental laws that describe the motion of objects.\n\nDefined by Sir Isaac Newton in 1687.\n\nFoundation of classical mechanics."
            },
            {
                title: "First Law - Inertia",
                content: "An object at rest stays at rest, and an object in motion continues in motion at constant velocity, unless acted upon by a net external force.\n\nAlso called the Law of Inertia.",
                image: "/physics_newtons_laws_1764926812539.png"
            },
            {
                title: "Second Law - F = ma",
                content: "Force = mass × acceleration\n\nF = ma\n\nUnits:\n• Force: Newtons (N)\n• Mass: kilograms (kg)\n• Acceleration: m/s²"
            },
            {
                title: "Third Law - Action-Reaction",
                content: "For every action, there is an equal and opposite reaction.\n\nF₁₂ = -F₂₁\n\nExample: When you push a wall, the wall pushes back with equal force."
            }
        ]
    }
};

const StudentModuleView = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'video' | 'audio' | 'images' | 'slides'>('video');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const module = sampleData.modules.find((m) => m.id === Number(moduleId));
    const course = module ? sampleData.courses.find((c) => c.id === module.course_id) : null;
    const content = moduleContent[Number(moduleId)] || moduleContent[1];

    if (!module || !course) {
        return (
            <div>
                <Link to="/student/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                </Link>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700">Module not found.</p>
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % content.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + content.images.length) % content.images.length);
    };

    const nextSlide = () => {
        if (currentSlideIndex < content.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    return (
        <div>
            <Link to={`/student/course/${course.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
            </Link>

            {/* Module Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
                <p className="text-sm opacity-90 mb-1">{course.title}</p>
                <h1 className="text-3xl font-bold mb-2">Module {module.order}: {module.title}</h1>
                <p className="text-blue-100">Choose your preferred learning format below</p>
            </div>

            {/* Learning Mode Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 border mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => setMode('video')}
                        className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition ${mode === 'video'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Video className="w-5 h-5 mr-2" />
                        Video
                    </button>
                    <button
                        onClick={() => setMode('audio')}
                        className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition ${mode === 'audio'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Headphones className="w-5 h-5 mr-2" />
                        Audio
                    </button>
                    <button
                        onClick={() => setMode('images')}
                        className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition ${mode === 'images'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Visuals
                    </button>
                    <button
                        onClick={() => setMode('slides')}
                        className={`flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition ${mode === 'slides'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Presentation className="w-5 h-5 mr-2" />
                        Slides
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Video Mode */}
                {mode === 'video' && (
                    <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                        <video
                            src={content.videoUrl}
                            controls
                            className="w-full h-full"
                            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23000' width='800' height='450'/%3E%3Ctext fill='%23fff' font-size='24' font-family='Arial' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E📹 Educational Video Lecture%3C/text%3E%3C/svg%3E"
                        >
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                            🎓 {module.title} - Video Lecture
                        </div>
                    </div>
                )}

                {/* Audio Mode */}
                {mode === 'audio' && (
                    <div className="p-12 text-center bg-gradient-to-br from-green-50 to-blue-50">
                        <div className="max-w-md mx-auto">
                            <Headphones className="w-24 h-24 mx-auto mb-6 text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{module.title}</h2>
                            <p className="text-gray-600 mb-8">Audio Lecture - Listen and Learn</p>

                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <audio controls className="w-full mb-4" src={content.audioUrl}>
                                    Your browser does not support the audio element.
                                </audio>
                                <p className="text-sm text-gray-500">🎧 Best experienced with headphones</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Images Mode */}
                {mode === 'images' && (
                    <div className="p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                <img
                                    src={content.images[currentImageIndex]}
                                    alt={`Visual ${currentImageIndex + 1}`}
                                    className="w-full rounded-lg shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-between p-4">
                                    <button
                                        onClick={prevImage}
                                        className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
                                        disabled={content.images.length <= 1}
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
                                        disabled={content.images.length <= 1}
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center mt-4 space-x-2">
                                {content.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition ${index === currentImageIndex ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-center mt-4 text-gray-600">
                                Visual {currentImageIndex + 1} of {content.images.length}
                            </p>
                        </div>
                    </div>
                )}

                {/* Slides Mode */}
                {mode === 'slides' && (
                    <div className="p-8 bg-gray-50 min-h-[600px]">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-12">
                                <h2 className="text-4xl font-bold text-gray-800 mb-8">
                                    {content.slides[currentSlideIndex].title}
                                </h2>

                                {content.slides[currentSlideIndex].image && (
                                    <img
                                        src={content.slides[currentSlideIndex].image}
                                        alt="Slide visual"
                                        className="w-full max-w-2xl mx-auto mb-8 rounded-lg"
                                    />
                                )}

                                <div className="text-xl text-gray-700 whitespace-pre-line leading-relaxed">
                                    {content.slides[currentSlideIndex].content}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlideIndex === 0}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Previous
                                </button>

                                <span className="text-gray-600 font-semibold">
                                    Slide {currentSlideIndex + 1} of {content.slides.length}
                                </span>

                                <button
                                    onClick={nextSlide}
                                    disabled={currentSlideIndex === content.slides.length - 1}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Module Completion */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Ready to test your knowledge?</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Complete the quiz after reviewing all learning materials to unlock the next module.
                </p>
                <button
                    onClick={() => navigate(`/student/quiz/${module.id}`)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Take Module Quiz
                </button>
            </div>

            {/* AI Chatbot */}
            <StudentChatbot studentId={1} />
        </div>
    );
};

export default StudentModuleView;
