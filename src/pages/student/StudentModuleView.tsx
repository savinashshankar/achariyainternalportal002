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
    1: { // Advanced Math Module 1 - Calculus Fundamentals
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        images: [
            "/math_derivatives_chart_1764926831395.png",
            "/math_quadratic_visual_1764926787773.png"
        ],
        slides: [
            {
                title: "Introduction to Calculus",
                content: "Calculus is the mathematical study of continuous change.\n\nTwo main branches:\n• Differential Calculus (rates of change)\n• Integral Calculus (accumulation)"
            },
            {
                title: "Limits - The Foundation",
                content: "lim (x→a) f(x) = L\n\nMeaning: As x approaches a, f(x) approaches L.\n\nLimits are essential for defining derivatives and integrals.",
                image: "/math_derivatives_chart_1764926831395.png"
            },
            {
                title: "Derivatives - Rate of Change",
                content: "f'(x) = dy/dx = lim(h→0) [f(x+h) - f(x)]/h\n\nDerivative represents:\n• Slope of tangent line\n• Instantaneous rate of change\n• Velocity in physics"
            },
            {
                title: "Basic Derivative Rules",
                content: "Power Rule: d/dx(x^n) = nx^(n-1)\n\nExamples:\n• d/dx(x²) = 2x\n• d/dx(x³) = 3x²\n• d/dx(x) = 1"
            }
        ]
    },
    4: { // Physics Module 1 - Mechanics
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
    },
    2: { // Advanced Math Module 2 - Linear Algebra
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        images: ["/math_derivatives_chart_1764926831395.png"],
        slides: [
            { title: "Linear Algebra Introduction", content: "Study of vectors, matrices, and linear transformations.\n\nKey concepts:\n• Vector spaces\n• Matrix operations\n• Linear transformations" },
            { title: "Matrices", content: "Matrix: Rectangular array of numbers\n\n[a b]\n[c d]\n\nOperations: Addition, Multiplication, Determinant" },
            { title: "Vectors", content: "Vector: Quantity with magnitude and direction\n\nv = [x, y, z]\n\nOperations: Addition, Scalar multiplication, Dot product" }
        ]
    },
    3: { // Advanced Math Module 3 - Probability & Statistics
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        images: ["/math_quadratic_visual_1764926787773.png"],
        slides: [
            { title: "Probability Basics", content: "Probability: Measure of likelihood\n\nP(event) = favorable outcomes / total outcomes\n\nRange: 0 to 1" },
            { title: "Statistics", content: "Mean: Average value\nMedian: Middle value\nMode: Most frequent value\n\nStandard deviation: Measure of spread" },
            { title: "Distributions", content: "Normal Distribution (Bell Curve)\nBinomial Distribution\nPoisson Distribution\n\nUsed for probability modeling" }
        ]
    },
    5: { // Physics Module 2 - Thermodynamics
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        images: ["/physics_energy_diagram_1764926850307.png"],
        slides: [
            { title: "Thermodynamics", content: "Study of heat, energy, and work.\n\nFour Laws of Thermodynamics\nApplied in engines, refrigerators, etc." },
            { title: "First Law", content: "Energy cannot be created or destroyed\n\nΔU = Q - W\n\nΔU: Change in internal energy\nQ: Heat added\nW: Work done" },
            { title: "Entropy", content: "Measure of disorder in a system\n\nS = k log W\n\nEntropy always increases (Second Law)" }
        ]
    },
    6: { // Physics Module 3 - Electromagnetism (FIX FOR ISSUE #1)
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        images: [
            "/physics_newtons_laws_1764926812539.png",
            "/physics_energy_diagram_1764926850307.png"
        ],
        slides: [
            {
                title: "Electromagnetism - Introduction",
                content: "Electromagnetism is the study of electric and magnetic fields and their interactions.\n\nDiscovered by James Clerk Maxwell in the 19th century.\n\nOne of the four fundamental forces of nature."
            },
            {
                title: "Electric Fields",
                content: "Electric field (E) is a region around a charged particle where forces act on other charges.\n\nE = F/q\n\nUnits: Newtons per Coulomb (N/C)\n\nDirection: Away from positive, toward negative charges.",
                image: "/physics_energy_diagram_1764926850307.png"
            },
            {
                title: "Magnetic Fields",
                content: "Magnetic field (B) created by moving charges (electric currents).\n\nF = qvB sin(θ)\n\nWhere:\n• q = charge\n• v = velocity\n• B = magnetic field strength\n• θ = angle between v and B"
            },
            {
                title: "Maxwell's Equations",
                content: "Four fundamental equations unifying electricity and magnetism:\n\n1. Gauss's Law (Electric)\n2. Gauss's Law (Magnetic)\n3. Faraday's Law\n4. Ampère-Maxwell Law\n\nThese equations predict electromagnetic waves (light!)."
            }
        ]
    },
    7: { // Data Structures Module 1 - Arrays & Linked Lists
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        images: ["/math_derivatives_chart_1764926831395.png"],
        slides: [
            { title: "Arrays", content: "Contiguous memory locations\n\narray[0], array[1], array[2]...\n\nO(1) access time\nFixed size" },
            { title: "Linked Lists", content: "Node-based structure\n\nNode: [data | next]\n\nTypes:\n• Singly linked\n• Doubly linked\n• Circular" },
            { title: "Operations", content: "Insert: O(1) or O(n)\nDelete: O(1) or O(n)\nSearch: O(n)\n\nArrays vs Lists tradeoffs" }
        ]
    },
    8: { // Data Structures Module 2 - Trees & Graphs
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        images: ["/physics_newtons_laws_1764926812539.png"],
        slides: [
            { title: "Binary Trees", content: "Hierarchical structure\n\nNode: [left | data | right]\n\nTypes:\n• Binary Search Tree\n• AVL Tree\n• Red-Black Tree" },
            { title: "Tree Traversal", content: "Inorder: Left-Root-Right\nPreorder: Root-Left-Right\nPostorder: Left-Right-Root\n\nLevel-order (BFS)" },
            { title: "Graphs", content: "Vertices + Edges\n\nTypes:\n• Directed/Undirected\n• Weighted/Unweighted\n\nTraversal: DFS, BFS" }
        ]
    },
    9: { // Data Structures Module 3 - Dynamic Programming
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        images: ["/math_quadratic_visual_1764926787773.png"],
        slides: [
            { title: "Dynamic Programming", content: "Optimization technique\n\nBreak problem into subproblems\nStore results (memoization)\nAvoid recomputation" },
            { title: "Fibonacci DP", content: "Naive: O(2^n)\n\nDP approach:\nfib[0] = 0\nfib[1] = 1\nfib[n] = fib[n-1] + fib[n-2]\n\nTime: O(n)" },
            { title: "Common Problems", content: "• Knapsack\n• Longest Common Subsequence\n• Edit Distance\n• Coin Change\n• Matrix Chain Multiplication" }
        ]
    },
    10: { // DBMS Module 1 - Relational Databases
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        images: ["/physics_energy_diagram_1764926850307.png"],
        slides: [
            { title: "Relational Databases", content: "Data stored in tables (relations)\n\nRows: Records\nColumns: Attributes\n\nRelated via keys" },
            { title: "Normalization", content: "1NF: Atomic values\n2NF: No partial dependency\n3NF: No transitive dependency\n\nBCNF: Stricter form of 3NF" },
            { title: "Keys", content: "Primary Key: Unique identifier\nForeign Key: Reference to another table\nCandidate Key: Potential primary key\nComposite Key: Multiple columns" }
        ]
    },
    11: { // DBMS Module 2 - SQL Queries
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        images: ["/math_derivatives_chart_1764926831395.png"],
        slides: [
            { title: "SQL Basics", content: "SELECT: Retrieve data\nINSERT: Add data\nUPDATE: Modify data\nDELETE: Remove data\n\nDDL, DML, DCL commands" },
            { title: "SELECT Statement", content: "SELECT column1, column2\nFROM table\nWHERE condition\nORDER BY column;\n\nJOINs: INNER, LEFT, RIGHT, FULL" },
            { title: "Advanced SQL", content: "GROUP BY: Aggregate data\nHAVING: Filter groups\nSubqueries: Nested queries\n\nIndexes for performance" }
        ]
    },
    12: { // Web Dev Module 1 - HTML & CSS
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        images: ["/physics_newtons_laws_1764926812539.png"],
        slides: [
            { title: "HTML Structure", content: "<!DOCTYPE html>\n<html>\n  <head><title>Page</title></head>\n  <body>Content</body>\n</html>\n\nSemantic tags: header, nav, main, footer" },
            { title: "CSS Styling", content: "Selectors: tag, .class, #id\n\nProperties:\ncolor, background, margin, padding\n\nBox model: content, padding, border, margin" },
            { title: "Responsive Design", content: "Media queries:\n@media (max-width: 768px) { }\n\nFlexbox & Grid layouts\nMobile-first approach" }
        ]
    },
    13: { // English Module 1 - Shakespeare
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        images: ["/math_quadratic_visual_1764926787773.png"],
        slides: [
            { title: "Shakespeare Introduction", content: "William Shakespeare (1564-1616)\n\nEnglish playwright & poet\n\nWorks:\n• 37 plays\n• 154 sonnets\n• Poems" },
            { title: "Tragedies", content: "Major tragedies:\n• Hamlet\n• Macbeth\n• Othello\n• King Lear\n• Romeo and Juliet\n\nThemes: fate, ambition, revenge" },
            { title: "Literary Devices", content: "Soliloquy: Character speaks thoughts aloud\nMetaphor & Simile\nIambic Pentameter\n\n'To be or not to be' - Hamlet" }
        ]
    },
    14: { // English Module 2 - Modern Poetry
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        images: ["/physics_energy_diagram_1764926850307.png"],
        slides: [
            { title: "Modern Poetry", content: "20th & 21st century poetry\n\nFree verse: No fixed meter\nExperimental forms\nDiverse voices & themes" },
            { title: "Key Poets", content: "T.S. Eliot - 'The Waste Land'\nRobert Frost - 'The Road Not Taken'\nMaya Angelou - 'Still I Rise'\nLangston Hughes - Harlem Renaissance" },
            { title: "Analysis Techniques", content: "Imagery: Visual descriptions\nTone: Author's attitude\nTheme: Central message\n\nContext: Historical & cultural background" }
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
