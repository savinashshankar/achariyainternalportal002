import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================
// TYPES & VIDEO REGISTRY
// ============================================
type TopicId = 'probability' | 'electromagnetism' | 'dynamic-programming';

interface VideoDefinition {
    id: string;
    title: string;
    duration: string;
    description: string;
    youtubeId: string; // YouTube video ID for embedding
}

interface TopicDefinition {
    id: TopicId;
    name: string;
    emoji: string;
    color: string;
    description: string;
    learningOutcomes: string[];
    videos: VideoDefinition[];
}

const TOPIC_REGISTRY: TopicDefinition[] = [
    {
        id: 'probability',
        name: 'Probability & Statistics',
        emoji: '🎲',
        color: 'blue',
        description: 'Understand randomness, distributions, and the mathematics of chance',
        learningOutcomes: [
            'Calculate probabilities for simple and compound events',
            'Understand probability distributions',
            'Apply the Law of Large Numbers',
            'Analyze dice, coins, and random experiments'
        ],
        videos: [
            {
                id: 'prob-1',
                title: 'Introduction to Probability',
                duration: '11:20',
                description: 'Learn the fundamentals of probability and how to calculate chances of events.',
                youtubeId: 'uzkc-qNVoOk' // Khan Academy
            },
            {
                id: 'prob-2',
                title: 'Probability Rules & Patterns',
                duration: '12:15',
                description: 'Explore the addition rule, multiplication rule, and conditional probabilities.',
                youtubeId: 'OyddY7DlV58' // Crash Course Statistics
            },
            {
                id: 'prob-3',
                title: 'Binomial Distributions',
                duration: '15:42',
                description: 'Discover binomial distributions and how they apply to repeated experiments.',
                youtubeId: '8idr1WZ1A7Q' // 3Blue1Brown
            }
        ]
    },
    {
        id: 'electromagnetism',
        name: 'Electromagnetism',
        emoji: '⚡',
        color: 'yellow',
        description: 'Explore electric fields, circuits, and the relationship between electricity and magnetism',
        learningOutcomes: [
            'Understand electric charges and fields',
            'Apply Ohm\'s Law to circuits',
            'Explore Faraday\'s Law of induction',
            'Visualize magnetic fields and their interactions'
        ],
        videos: [
            {
                id: 'em-1',
                title: 'Electromagnetism 101',
                duration: '5:30',
                description: 'National Geographic explains electromagnetism as a fundamental force of nature.',
                youtubeId: 'kkS-5uFjc2M' // National Geographic
            },
            {
                id: 'em-2',
                title: 'Magnetism & Electromagnetism',
                duration: '10:45',
                description: 'Learn about magnets, magnetic fields, and how electricity and magnetism are connected.',
                youtubeId: 'hFAOXdXZ5TM' // Crash Course Physics
            },
            {
                id: 'em-3',
                title: 'Electric Current & Circuits',
                duration: '9:15',
                description: 'Understand voltage, current, resistance, and how circuits work.',
                youtubeId: 'r-SCyD7f_zI' // Crash Course Physics
            }
        ]
    },
    {
        id: 'dynamic-programming',
        name: 'Dynamic Programming',
        emoji: '🧩',
        color: 'green',
        description: 'Master algorithmic problem-solving with memoization and optimal substructure',
        learningOutcomes: [
            'Identify problems suitable for dynamic programming',
            'Understand memoization and tabulation',
            'Solve classic DP problems (Fibonacci, knapsack)',
            'Analyze time complexity improvements'
        ],
        videos: [
            {
                id: 'dp-1',
                title: 'What Is Dynamic Programming?',
                duration: '13:51',
                description: 'CS Dojo explains dynamic programming with the Fibonacci sequence example.',
                youtubeId: 'vYquumk4nWw' // CS Dojo
            },
            {
                id: 'dp-2',
                title: 'Dynamic Programming for Beginners',
                duration: '20:32',
                description: 'A comprehensive introduction covering optimal substructure and overlapping subproblems.',
                youtubeId: 'oBt53YbR9Kk' // FreeCodeCamp
            },
            {
                id: 'dp-3',
                title: 'Memoization vs Tabulation',
                duration: '14:20',
                description: 'Compare top-down (memoization) and bottom-up (tabulation) approaches to DP.',
                youtubeId: 'Hdr64lKQ3e4' // Back To Back SWE
            }
        ]
    }
];

// ============================================
// CUSTOM VIDEO PLAYER COMPONENT
// ============================================
interface CustomVideoPlayerProps {
    videoId: string;
    title: string;
}

const CustomVideoPlayer = ({ videoId, title }: CustomVideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Post message to YouTube iframe
    const postMessage = (action: string) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: action }),
                '*'
            );
        }
    };

    const handlePlay = () => {
        if (!isPlaying) {
            postMessage('playVideo');
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (isPlaying) {
            postMessage('pauseVideo');
            setIsPlaying(false);
        }
    };

    const handleMute = () => {
        if (isMuted) {
            postMessage('unMute');
            setIsMuted(false);
        } else {
            postMessage('mute');
            setIsMuted(true);
        }
    };

    return (
        <div className="mb-6">
            {/* Video Container */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative" style={{ aspectRatio: '16/9' }}>
                {!isPlaying ? (
                    // Thumbnail overlay before video starts
                    <div
                        className="absolute inset-0 z-10 cursor-pointer bg-cover bg-center"
                        style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
                    >
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ) : null}

                <iframe
                    ref={iframeRef}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=0&disablekb=1&fs=0`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={title}
                />

                {/* FULL overlay to block ALL clicks on the video - only our custom controls work */}
                {/* When not playing, clicking this will start the video */}
                <div
                    className={`absolute inset-0 z-20 ${!isPlaying ? 'cursor-pointer' : 'pointer-events-auto'}`}
                    onClick={!isPlaying ? handlePlay : undefined}
                />
            </div>

            {/* Custom Controls Bar */}
            <div className="bg-gray-900 rounded-b-2xl -mt-2 px-4 py-3 flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <Play className="w-6 h-6 text-white" fill="currentColor" />
                    )}
                </button>

                {/* Mute Button */}
                <button
                    onClick={handleMute}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                    {isMuted ? (
                        <span className="text-xl">🔇</span>
                    ) : (
                        <span className="text-xl">🔊</span>
                    )}
                </button>

                {/* Video Title */}
                <span className="text-white/80 text-sm truncate flex-1">{title}</span>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
const ExplainerVideos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<VideoDefinition | null>(null);

    // Reset to main view when navigating via sidebar
    useEffect(() => {
        setSelectedTopic(null);
        setSelectedVideo(null);
        window.scrollTo(0, 0);
    }, [location.key]);

    // Get current topic data
    const currentTopic = selectedTopic ? TOPIC_REGISTRY.find(t => t.id === selectedTopic) : null;

    // Video Player View
    if (selectedVideo && currentTopic) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-bold">{selectedVideo.title}</h1>
                            <p className="text-gray-500 text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {selectedVideo.duration}
                            </p>
                        </div>
                    </div>

                    {/* Custom Video Player with External Controls */}
                    <CustomVideoPlayer videoId={selectedVideo.youtubeId} title={selectedVideo.title} />

                    {/* Video Info */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="font-bold text-lg mb-2">About this video</h3>
                        <p className="text-gray-600">{selectedVideo.description}</p>
                    </div>

                    {/* Other Videos in Topic */}
                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-4">More in {currentTopic.name}</h3>
                        <div className="grid gap-4">
                            {currentTopic.videos.filter(v => v.id !== selectedVideo.id).map(video => (
                                <button
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video)}
                                    className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition text-left"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-${currentTopic.color}-100 flex items-center justify-center`}>
                                        <Play className={`w-6 h-6 text-${currentTopic.color}-600`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{video.title}</p>
                                        <p className="text-gray-500 text-sm">{video.duration}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Topic Detail View
    if (currentTopic) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setSelectedTopic(null)}
                            className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">{currentTopic.emoji} {currentTopic.name}</h1>
                            <p className="text-gray-500 text-sm">{currentTopic.videos.length} videos</p>
                        </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className={`bg-${currentTopic.color}-50 border border-${currentTopic.color}-200 rounded-2xl p-6 mb-6`}>
                        <h3 className={`font-bold text-${currentTopic.color}-800 mb-3 flex items-center gap-2`}>
                            <BookOpen className="w-5 h-5" />
                            What you'll learn
                        </h3>
                        <ul className="space-y-2">
                            {currentTopic.learningOutcomes.map((outcome, i) => (
                                <li key={i} className={`text-${currentTopic.color}-700 flex items-start gap-2`}>
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    {outcome}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Video List */}
                    <div className="space-y-4">
                        {currentTopic.videos.map((video, index) => (
                            <button
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition text-left"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${currentTopic.color}-400 to-${currentTopic.color}-600 flex items-center justify-center text-white font-bold text-lg`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-lg truncate">{video.title}</p>
                                    <p className="text-gray-500 text-sm truncate">{video.description}</p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{video.duration}</span>
                                </div>
                                <Play className={`w-8 h-8 text-${currentTopic.color}-500`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Topic Selection View
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🎬 Explainer Videos</h1>
                        <p className="text-gray-500 text-sm">Watch and learn at your own pace</p>
                    </div>
                </div>

                {/* Topic Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {TOPIC_REGISTRY.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic.id)}
                            className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            <div className="text-5xl mb-4">{topic.emoji}</div>
                            <h2 className="text-xl font-bold mb-2">{topic.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">{topic.description}</p>
                            <div className="flex items-center justify-between">
                                <span className={`text-${topic.color}-600 font-medium text-sm`}>
                                    {topic.videos.length} videos
                                </span>
                                <span className={`px-3 py-1 rounded-full bg-${topic.color}-100 text-${topic.color}-700 text-xs font-medium`}>
                                    Start Learning →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Info Banner */}
                <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">📚 Learn by Watching</h3>
                    <p className="text-white/80">
                        These explainer videos complement your hands-on lab experiments.
                        Watch the theory, then practice in the Labs!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExplainerVideos;
