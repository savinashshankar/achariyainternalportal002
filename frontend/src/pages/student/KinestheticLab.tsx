import { useState, useEffect } from 'react';
import { ArrowLeft, Dices, RotateCcw, Coins, BarChart3, Binary, GitBranch } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sounds } from '../../utils/sounds';

// ============================================
// TYPES & LAB REGISTRY
// ============================================
type Subject = 'all' | 'math' | 'physics' | 'cs';
type LabId = 'dice' | 'spinner' | 'coin' | 'sorting' | 'binary-search' | 'recursion';
type PhetId = 'probability' | 'ohms-law' | 'waves' | 'faraday' | 'circuit-dc' | 'charges-fields' | 'magnets';

interface LabDefinition {
    id: LabId;
    name: string;
    emoji: string;
    subject: Exclude<Subject, 'all'>;
    minTries: number;
    description: string;
    gradient: string;
    icon: typeof Dices;
    type: 'custom';
}

interface PhetDefinition {
    id: PhetId;
    name: string;
    emoji: string;
    subject: Exclude<Subject, 'all'>;
    description: string;
    gradient: string;
    url: string;
    type: 'phet';
}

const LAB_REGISTRY: LabDefinition[] = [
    // 📐 Mathematics → Probability & Statistics (4 custom labs)
    { id: 'dice', name: 'Dice Lab', emoji: '🎲', subject: 'math', minTries: 10, description: 'Roll two dice and discover sum probability', gradient: 'from-blue-600 to-blue-800', icon: Dices, type: 'custom' },
    { id: 'spinner', name: 'Spinner Lab', emoji: '🎡', subject: 'math', minTries: 10, description: 'See how segment size affects probability', gradient: 'from-purple-600 to-purple-800', icon: RotateCcw, type: 'custom' },
    { id: 'coin', name: 'Coin Flip', emoji: '🪙', subject: 'math', minTries: 20, description: 'Test fair coin probability with many flips', gradient: 'from-yellow-600 to-amber-700', icon: Coins, type: 'custom' },
    // 💻 Computer Science → Dynamic Programming / Algorithms (3 custom labs)
    { id: 'sorting', name: 'Sorting Race', emoji: '📊', subject: 'cs', minTries: 3, description: 'Compare sorting algorithm speeds visually', gradient: 'from-pink-600 to-rose-700', icon: BarChart3, type: 'custom' },
    { id: 'binary-search', name: 'Binary Search', emoji: '🔍', subject: 'cs', minTries: 5, description: 'Guess numbers using binary search strategy', gradient: 'from-cyan-600 to-cyan-800', icon: Binary, type: 'custom' },
    { id: 'recursion', name: 'Recursion Tree', emoji: '🌳', subject: 'cs', minTries: 3, description: 'Visualize recursive function calls', gradient: 'from-green-600 to-green-800', icon: GitBranch, type: 'custom' },
];

// PhET Colorado Simulations - 5 labs each for the course modules
const PHET_REGISTRY: PhetDefinition[] = [
    // 📐 Mathematics → Probability & Statistics (1 PhET = 5 total with custom)
    { id: 'probability', name: 'Plinko Probability', emoji: '📊', subject: 'math', description: 'Drop balls through pegs and explore probability distributions', gradient: 'from-indigo-500 to-indigo-700', url: 'https://phet.colorado.edu/sims/html/plinko-probability/latest/plinko-probability_en.html', type: 'phet' },
    // ⚛️ Physics → Electromagnetism (5 PhET labs)
    { id: 'ohms-law', name: "Ohm's Law", emoji: '⚡', subject: 'physics', description: 'Learn voltage, current, and resistance relationship', gradient: 'from-yellow-500 to-yellow-700', url: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html', type: 'phet' },
    { id: 'waves', name: 'Wave on String', emoji: '🌊', subject: 'physics', description: 'Explore wave properties with a vibrating string', gradient: 'from-blue-500 to-blue-700', url: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html', type: 'phet' },
    { id: 'faraday', name: "Faraday's Law", emoji: '🧲', subject: 'physics', description: 'Explore electromagnetic induction with magnets and coils', gradient: 'from-red-500 to-red-700', url: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html', type: 'phet' },
    { id: 'circuit-dc', name: 'Circuit Builder DC', emoji: '🔌', subject: 'physics', description: 'Build circuits with batteries, resistors, and bulbs', gradient: 'from-emerald-500 to-emerald-700', url: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html', type: 'phet' },
    { id: 'charges-fields', name: 'Charges & Fields', emoji: '➕', subject: 'physics', description: 'Place charges and observe electric fields', gradient: 'from-fuchsia-500 to-fuchsia-700', url: 'https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html', type: 'phet' },
];

const SUBJECT_INFO: Record<Exclude<Subject, 'all'>, { name: string; emoji: string; color: string }> = {
    math: { name: 'Probability & Statistics', emoji: '📐', color: 'blue' },
    physics: { name: 'Electromagnetism', emoji: '⚛️', color: 'emerald' },
    cs: { name: 'Dynamic Programming', emoji: '💻', color: 'pink' },
};

// ============================================
// MAIN COMPONENT
// ============================================
const KinestheticLab = () => {
    const navigate = useNavigate();
    const [selectedLab, setSelectedLab] = useState<LabId | null>(null);
    const [selectedPhet, setSelectedPhet] = useState<PhetId | null>(null);
    const [activeSubject, setActiveSubject] = useState<Subject>('all');
    const location = useLocation();

    // Reset to main lab view when navigating via sidebar (location key changes)
    useEffect(() => {
        setSelectedLab(null);
        setSelectedPhet(null);
        window.scrollTo(0, 0);
    }, [location.key]);

    const filteredLabs = activeSubject === 'all'
        ? LAB_REGISTRY
        : LAB_REGISTRY.filter(lab => lab.subject === activeSubject);

    const filteredPhets = activeSubject === 'all'
        ? PHET_REGISTRY
        : PHET_REGISTRY.filter(phet => phet.subject === activeSubject);


    const groupedLabs = Object.entries(SUBJECT_INFO).map(([key, info]) => ({
        subject: key as Exclude<Subject, 'all'>,
        ...info,
        labs: filteredLabs.filter(lab => lab.subject === key),
        phets: filteredPhets.filter(phet => phet.subject === key)
    })).filter(group => group.labs.length > 0 || group.phets.length > 0);

    // PhET Simulation Viewer
    if (selectedPhet) {
        const phet = PHET_REGISTRY.find(p => p.id === selectedPhet);
        if (!phet) return null;

        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 p-3 md:p-6">
                {/* Header with Back Button */}
                <div className="max-w-6xl mx-auto mb-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedPhet(null)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white shadow-lg rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">Back to Labs</span>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{phet.emoji} {phet.name}</h1>
                            <p className="text-gray-500 text-xs truncate hidden sm:block">{phet.description}</p>
                        </div>
                    </div>
                </div>

                {/* Simulation */}
                <div className="max-w-6xl mx-auto">
                    {/* PhET Disclaimer */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-2 text-sm">
                        <span>ℹ️</span>
                        <p className="text-amber-800">This is a PhET interactive simulation. Progress is not tracked for external simulations.</p>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden relative" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
                        <iframe
                            src={phet.url}
                            title={phet.name}
                            className="w-full h-full border-0"
                            allow="fullscreen; autoplay"
                        />
                        {/* Overlay to block clicks on PhET logo at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/90 to-transparent flex items-end justify-center pb-2 pointer-events-auto">
                            <span className="text-white/70 text-xs">PhET Interactive Simulations</span>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-xs mt-2">
                        Simulation by PhET Interactive Simulations, University of Colorado Boulder
                    </p>
                </div>
            </div>
        );
    }

    // Lab selection screen
    if (!selectedLab) {
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🧪 Kinesthetic Lab</h1>
                            <p className="text-gray-500 text-sm md:text-base">Learn by doing - interactive experiments</p>
                        </div>
                    </div>

                    {/* Subject Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveSubject('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeSubject === 'all'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white shadow-md hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            All
                        </button>
                        {Object.entries(SUBJECT_INFO).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => setActiveSubject(key as Subject)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${activeSubject === key
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white shadow-md hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {info.emoji} {info.name}
                            </button>
                        ))}
                    </div>

                    {/* Labs by Subject */}
                    {groupedLabs.map(group => (
                        <div key={group.subject} className="mb-8">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                                <span>{group.emoji}</span>
                                <span>{group.name}</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Custom Labs */}
                                {group.labs.map(lab => (
                                    <button
                                        key={lab.id}
                                        onClick={() => { setSelectedLab(lab.id); window.scrollTo(0, 0); }}
                                        className={`bg-gradient-to-br ${lab.gradient} p-4 md:p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform shadow-xl text-white`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl md:text-2xl">
                                                {lab.emoji}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm md:text-base">{lab.name}</h3>
                                                <p className="text-white/70 text-xs md:text-sm">{lab.minTries}+ tries</p>
                                            </div>
                                        </div>
                                        <p className="text-white/80 text-xs md:text-sm">{lab.description}</p>
                                    </button>
                                ))}
                                {/* PhET Simulations */}
                                {group.phets.map(phet => (
                                    <button
                                        key={phet.id}
                                        onClick={() => { setSelectedPhet(phet.id); window.scrollTo(0, 0); }}
                                        className={`bg-gradient-to-br ${phet.gradient} p-4 md:p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform shadow-xl text-white relative`}
                                    >
                                        <span className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full">PhET</span>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl md:text-2xl">
                                                {phet.emoji}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm md:text-base">{phet.name}</h3>
                                                <p className="text-white/70 text-xs md:text-sm">Interactive Sim</p>
                                            </div>
                                        </div>
                                        <p className="text-white/80 text-xs md:text-sm">{phet.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render selected lab
    const handleBack = () => {
        setSelectedLab(null);
        window.scrollTo(0, 0);
    };

    const labComponents: Record<LabId, JSX.Element> = {
        dice: <DiceLab onBack={handleBack} />,
        spinner: <SpinnerLab onBack={handleBack} />,
        coin: <CoinFlipLab onBack={handleBack} />,
        sorting: <SortingLab onBack={handleBack} />,
        'binary-search': <BinarySearchLab onBack={handleBack} />,
        recursion: <RecursionLab onBack={handleBack} />,
    };

    return labComponents[selectedLab] || null;
};

// ============================================
// SHARED LAB HEADER
// ============================================
interface LabHeaderProps {
    title: string;
    subtitle: string;
    onBack: () => void;
    progress: number;
    maxProgress: number;
    progressLabel: string;
    color: string;
    learningObjective?: string;
}

const LabHeader = ({ title, subtitle, onBack, progress, maxProgress, progressLabel, color, learningObjective }: LabHeaderProps) => {
    const [muted, setMuted] = useState(sounds.muted);

    const toggleMute = () => {
        const newMuted = sounds.toggleMute();
        setMuted(newMuted);
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
                    <p className="text-gray-500 text-sm">{subtitle}</p>
                </div>
                <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg shadow-md transition ${muted ? 'bg-red-100 text-red-600' : 'bg-white hover:bg-gray-100'}`}
                    title={muted ? 'Unmute sounds' : 'Mute sounds'}
                >
                    {muted ? '🔇' : '🔊'}
                </button>
            </div>
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{progress}/{maxProgress}+ {progressLabel}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-${color}-500 transition-all duration-300`}
                        style={{ width: `${Math.min((progress / maxProgress) * 100, 100)}%` }}
                    />
                </div>
            </div>
            {learningObjective && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-xl">🎯</span>
                    <div>
                        <p className="font-semibold text-blue-900 text-sm">What you'll learn:</p>
                        <p className="text-blue-800 text-sm">{learningObjective}</p>
                    </div>
                </div>
            )}
        </>
    );
};

// ============================================
// DICE LAB (Existing - refactored)
// ============================================
interface LabProps { onBack: () => void; }

const DiceLab = ({ onBack }: LabProps) => {
    const [die1, setDie1] = useState(1);
    const [die2, setDie2] = useState(1);
    const [rolls, setRolls] = useState<number[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [score, setScore] = useState(0);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [showPrediction, setShowPrediction] = useState(false);

    const MIN_ROLLS = 10;
    const rollCount = rolls.length;

    const theoreticalProbs: Record<number, number> = {
        2: 2.78, 3: 5.56, 4: 8.33, 5: 11.11, 6: 13.89,
        7: 16.67, 8: 13.89, 9: 11.11, 10: 8.33, 11: 5.56, 12: 2.78
    };

    const getFrequencies = () => {
        const freq: Record<number, number> = {};
        for (let i = 2; i <= 12; i++) freq[i] = 0;
        rolls.forEach(sum => freq[sum]++);
        return freq;
    };

    const frequencies = getFrequencies();
    const maxFreq = Math.max(...Object.values(frequencies), 1);

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);
        sounds.rollDice(); // Play roll sound

        let animCount = 0;
        const interval = setInterval(() => {
            setDie1(Math.floor(Math.random() * 6) + 1);
            setDie2(Math.floor(Math.random() * 6) + 1);
            animCount++;
            if (animCount > 10) {
                clearInterval(interval);
                const final1 = Math.floor(Math.random() * 6) + 1;
                const final2 = Math.floor(Math.random() * 6) + 1;
                setDie1(final1);
                setDie2(final2);
                setRolls(prev => [...prev, final1 + final2]);
                setIsRolling(false);
                // Play success sound on milestone
                if (rolls.length + 1 === MIN_ROLLS) sounds.milestone();

                if (rollCount === 9) setShowPrediction(true);
            }
        }, 50);
    };

    const handlePrediction = (sum: number) => {
        setPrediction(sum);
        setShowPrediction(false);
        if (sum === 7) setScore(prev => prev + 40);
    };

    const getFinalScore = () => Math.min(score + 60, 100); // 40 prediction + 30 completion + 30 engagement

    const DiceFace = ({ value }: { value: number }) => {
        const dotPositions: Record<number, string[]> = {
            1: ['center'], 2: ['top-right', 'bottom-left'], 3: ['top-right', 'center', 'bottom-left'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
        };
        const getPosition = (pos: string) => ({
            'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'top-left': 'top-2 left-2', 'top-right': 'top-2 right-2',
            'middle-left': 'top-1/2 left-2 -translate-y-1/2', 'middle-right': 'top-1/2 right-2 -translate-y-1/2',
            'bottom-left': 'bottom-2 left-2', 'bottom-right': 'bottom-2 right-2'
        }[pos] || '');

        return (
            <div className={`w-20 h-20 md:w-24 md:h-24 bg-white border-2 border-gray-200 rounded-xl shadow-lg relative ${isRolling ? 'animate-bounce' : ''}`}>
                {dotPositions[value]?.map((pos, i) => (
                    <div key={i} className={`absolute w-3 h-3 md:w-4 md:h-4 bg-gray-800 rounded-full ${getPosition(pos)}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="🎲 Two Dice Experiment" subtitle="Discover probability through experimentation" onBack={onBack} progress={rollCount} maxProgress={MIN_ROLLS} progressLabel="rolls" color="blue" learningObjective="Understand probability distributions: why 7 is the most common sum when rolling two dice, and how repeated trials reveal patterns." />

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6 text-center">
                    <div className="flex justify-center gap-8 mb-6">
                        <div><DiceFace value={die1} /><p className="text-gray-500 text-sm mt-2">Die 1</p></div>
                        <div><DiceFace value={die2} /><p className="text-gray-500 text-sm mt-2">Die 2</p></div>
                    </div>
                    <p className="text-2xl font-bold mb-4">Sum: <span className="text-blue-400">{die1 + die2}</span></p>
                    <button onClick={rollDice} disabled={isRolling}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition ${isRolling ? 'bg-slate-600 cursor-wait' : 'bg-red-500 hover:bg-red-600 active:scale-95'}`}>
                        {isRolling ? 'Rolling...' : '🎲 Roll Dice'}
                    </button>
                </div>

                {showPrediction && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white shadow-md rounded-2xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">🧠 Prediction Question</h3>
                            <p className="mb-4">Which sum will appear most often?</p>
                            <div className="grid grid-cols-4 gap-2">
                                {[2, 5, 7, 12].map(sum => (
                                    <button key={sum} onClick={() => handlePrediction(sum)} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">{sum}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="font-bold mb-4">📊 Sum Frequency</h3>
                    <div className="space-y-2">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(sum => (
                            <div key={sum} className="flex items-center gap-2 text-sm">
                                <span className="w-8 text-right">{sum}:</span>
                                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                                    <div className={`h-full ${sum === 7 ? 'bg-yellow-500' : 'bg-blue-500'} transition-all`} style={{ width: `${(frequencies[sum] / maxFreq) * 100}%` }} />
                                </div>
                                <span className="w-8">{frequencies[sum]}</span>
                                <span className="w-20 text-gray-500 text-xs">({theoreticalProbs[sum]}%)</span>
                            </div>
                        ))}
                    </div>
                    {prediction && <p className="mt-4 text-sm text-gray-500">Your prediction: <span className="text-blue-400 font-bold">{prediction}</span> {prediction === 7 ? '✅' : '(7 is most likely)'}</p>}
                </div>

                {rollCount >= MIN_ROLLS && (() => {
                    const mostFrequentSum = Object.entries(frequencies).reduce((a, b) => frequencies[Number(a[0])] > frequencies[Number(b[0])] ? a : b)[0];
                    const predictionCount = prediction ? frequencies[prediction] : 0;
                    const mostFreqCount = Math.max(...Object.values(frequencies));
                    const empiricalProb = prediction ? ((predictionCount / rollCount) * 100).toFixed(1) : '0';

                    return (
                        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 md:p-6 text-center text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">🎉 Milestone Reached!</h3>
                            <p className="text-4xl md:text-5xl font-bold mb-4">{getFinalScore()}/100</p>

                            <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm">
                                <p className="font-bold mb-3">📊 Your Experiment Summary:</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>🎯 Your Prediction:</span>
                                        <span className="font-bold text-lg">{prediction || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>📈 Times {prediction} appeared:</span>
                                        <span className="font-bold">{predictionCount} / {rollCount} rolls ({empiricalProb}%)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🏆 Most frequent sum:</span>
                                        <span className="font-bold text-yellow-300">{mostFrequentSum} ({mostFreqCount} times)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>📐 Theory says 7 should be:</span>
                                        <span className="font-bold">16.67%</span>
                                    </div>
                                </div>

                                <hr className="my-3 border-white/20" />

                                <p className="font-bold mb-2">💰 Score Breakdown:</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span>🧠 Prediction (chose 7?)</span>
                                        <span className={prediction === 7 ? "text-green-300" : "text-red-300"}>{prediction === 7 ? "+40" : "0"}/40</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>✅ Completion ({rollCount} rolls)</span>
                                        <span className="text-green-300">+30/30</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>⚡ Engagement</span>
                                        <span className="text-green-300">+30/30</span>
                                    </div>
                                </div>

                                {prediction !== 7 && (
                                    <p className="mt-3 text-xs text-blue-200">💡 Tip: 7 has the highest probability (6 ways to roll it: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1)</p>
                                )}
                            </div>

                            <p className="text-blue-200 text-sm mb-4">Keep rolling to see if the distribution approaches theoretical values!</p>
                            <button onClick={onBack} className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50">Back to Labs</button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

// ============================================
// SPINNER LAB (Existing - condensed)
// ============================================
const SpinnerLab = ({ onBack }: LabProps) => {
    const [segments, setSegments] = useState([
        { name: 'Even', color: '#3B82F6', percentage: 50 },
        { name: 'Odd', color: '#EF4444', percentage: 50 }
    ]);
    const [spins, setSpins] = useState<string[]>([]);
    const [currentResult, setCurrentResult] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [showPrediction, setShowPrediction] = useState(true);

    const MIN_SPINS = 10;
    const spinCount = spins.length;

    const getResults = () => {
        const results: Record<string, number> = {};
        segments.forEach(s => results[s.name] = 0);
        spins.forEach(spin => results[spin]++);
        return results;
    };
    const results = getResults();

    const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setShowPrediction(false);
        sounds.spinWheel(); // Play spin sound

        const rand = Math.random() * 100;
        let cumulative = 0;
        let result = segments[0].name;
        for (const seg of segments) {
            cumulative += seg.percentage;
            if (rand <= cumulative) { result = seg.name; break; }
        }

        const spinRevs = 5 + Math.floor(Math.random() * 3);
        const resultIndex = segments.findIndex(s => s.name === result);
        const segmentAngle = 360 * (segments.slice(0, resultIndex).reduce((a, s) => a + s.percentage, 0) + segments[resultIndex].percentage / 2) / 100;
        setRotation(rotation + (spinRevs * 360) + (360 - segmentAngle));

        setTimeout(() => {
            setCurrentResult(result);
            setSpins(prev => [...prev, result]);
            setIsSpinning(false);
            sounds.click(); // Result sound
            if (spins.length + 1 === MIN_SPINS) sounds.milestone();
        }, 500);
    };

    const handleResize = (index: number, newPercentage: number) => {
        const clamped = Math.max(10, Math.min(90, newPercentage));
        setSegments(prev => prev.map((s, i) => ({ ...s, percentage: i === index ? clamped : 100 - clamped })));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="🎡 Spinner Experiment" subtitle="Discover how segment size affects probability" onBack={onBack} progress={spinCount} maxProgress={MIN_SPINS} progressLabel="spins" color="purple" learningObjective="Learn how segment size affects probability: larger segments have higher chances of being selected in random events." />

                {showPrediction && spinCount === 0 && (
                    <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                        <h3 className="font-bold mb-3">🧠 Predict which will win more:</h3>
                        <div className="flex gap-4">
                            {segments.map(seg => (
                                <button key={seg.name} onClick={() => { setPrediction(seg.name); setShowPrediction(false); }}
                                    className="flex-1 p-3 rounded-lg font-bold transition hover:opacity-80" style={{ backgroundColor: seg.color }}>{seg.name}</button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                        <div className="relative w-48 h-48 mx-auto mb-4">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white z-10" />
                            <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
                                {segments.map((seg, i) => {
                                    const startAngle = segments.slice(0, i).reduce((a, s) => a + (s.percentage / 100) * 360, 0);
                                    const endAngle = startAngle + (seg.percentage / 100) * 360;
                                    const largeArc = seg.percentage > 50 ? 1 : 0;
                                    const startRad = (startAngle - 90) * Math.PI / 180;
                                    const endRad = (endAngle - 90) * Math.PI / 180;
                                    const x1 = 50 + 50 * Math.cos(startRad), y1 = 50 + 50 * Math.sin(startRad);
                                    const x2 = 50 + 50 * Math.cos(endRad), y2 = 50 + 50 * Math.sin(endRad);
                                    return <path key={seg.name} d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={seg.color} />;
                                })}
                                <circle cx="50" cy="50" r="5" fill="#1E293B" />
                            </svg>
                        </div>
                        {currentResult && <p className="text-lg font-bold mb-4">Result: <span style={{ color: segments.find(s => s.name === currentResult)?.color }}>{currentResult}</span></p>}
                        <button onClick={spinWheel} disabled={isSpinning}
                            className={`px-8 py-3 rounded-xl font-bold text-lg transition ${isSpinning ? 'bg-slate-600 cursor-wait' : 'bg-purple-500 hover:bg-purple-600 active:scale-95'}`}>
                            {isSpinning ? 'Spinning...' : '🔄 Spin'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white shadow-md rounded-2xl p-6">
                            <h3 className="font-bold mb-4">⚙️ Adjust Segments</h3>
                            {segments.map((seg, i) => (
                                <div key={seg.name} className="mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: seg.color }} />
                                        <span>{seg.name}: {seg.percentage}%</span>
                                    </div>
                                    <input type="range" min="10" max="90" value={seg.percentage} onChange={(e) => handleResize(i, parseInt(e.target.value))} className="w-full" disabled={spinCount > 0} />
                                </div>
                            ))}
                        </div>
                        <div className="bg-white shadow-md rounded-2xl p-6">
                            <h3 className="font-bold mb-4">📊 Results</h3>
                            {segments.map(seg => (
                                <div key={seg.name} className="flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: seg.color }} />
                                    <span className="w-12">{seg.name}:</span>
                                    <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                                        <div className="h-full transition-all" style={{ width: spinCount > 0 ? `${(results[seg.name] / spinCount) * 100}%` : '0%', backgroundColor: seg.color }} />
                                    </div>
                                    <span className="w-16 text-right">{results[seg.name]} ({spinCount > 0 ? Math.round((results[seg.name] / spinCount) * 100) : 0}%)</span>
                                </div>
                            ))}
                            {prediction && <p className="mt-4 text-sm text-gray-500">Prediction: <span className="font-bold" style={{ color: segments.find(s => s.name === prediction)?.color }}>{prediction}</span></p>}
                        </div>
                    </div>
                </div>

                {spinCount >= MIN_SPINS && (() => {
                    // Handle tie in results
                    const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);
                    const winner = sortedResults[0][1] === sortedResults[1]?.[1] ? 'Tie' : sortedResults[0][0];
                    const winnerCount = sortedResults[0][1];
                    const predictionCorrect = prediction === winner || (winner === 'Tie' && results[prediction || ''] === winnerCount);
                    // Handle equal segments
                    const segmentsEqual = segments[0].percentage === segments[1]?.percentage;
                    const biggerSegment = segmentsEqual ? 'Equal' : segments.reduce((a, b) => a.percentage > b.percentage ? a : b).name;
                    const biggerPct = segmentsEqual ? '50' : segments.find(s => s.name === biggerSegment)?.percentage;

                    return (
                        <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 md:p-6 text-center text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">🎉 Milestone Reached!</h3>
                            <p className="text-4xl md:text-5xl font-bold mb-4">100/100</p>

                            <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm">
                                <p className="font-bold mb-3">📊 Your Experiment Summary:</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>🎯 Your Prediction:</span>
                                        <span className="font-bold text-lg">{prediction || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🏆 Most frequent result:</span>
                                        <span className="font-bold text-yellow-300">{winner === 'Tie' ? `Tie (${winnerCount} each)` : `${winner} (${winnerCount}/${spinCount})`}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>📐 Segment sizes:</span>
                                        <span className="font-bold">{segmentsEqual ? 'Equal (50% each)' : `${biggerSegment} larger (${biggerPct}%)`}</span>
                                    </div>
                                    {segments.map(seg => (
                                        <div key={seg.name} className="flex justify-between items-center">
                                            <span>{seg.name} actual:</span>
                                            <span>{spinCount > 0 ? Math.round((results[seg.name] / spinCount) * 100) : 0}% (expected: {seg.percentage}%)</span>
                                        </div>
                                    ))}
                                </div>

                                <hr className="my-3 border-white/20" />

                                <p className={`text-center ${predictionCorrect ? 'text-green-300' : 'text-yellow-300'}`}>
                                    {winner === 'Tie' ? '🤝 It\'s a tie!' : predictionCorrect ? '✅ Your prediction was correct!' : `📈 ${winner} won more spins!`}
                                </p>
                            </div>

                            <p className="text-purple-200 text-sm mb-4">Larger segments = higher probability. Keep spinning to see convergence!</p>
                            <button onClick={onBack} className="px-6 py-2 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50">Back to Labs</button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

// ============================================
// COIN FLIP LAB (NEW)
// ============================================
const CoinFlipLab = ({ onBack }: LabProps) => {
    const [flips, setFlips] = useState<('H' | 'T')[]>([]);
    const [isFlipping, setIsFlipping] = useState(false);
    const [currentSide, setCurrentSide] = useState<'H' | 'T'>('H');
    const [flipRotation, setFlipRotation] = useState(0);
    const [prediction, setPrediction] = useState<'H' | 'T' | 'equal' | null>(null);
    const [showPrediction, setShowPrediction] = useState(true);

    const MIN_FLIPS = 20;
    const flipCount = flips.length;
    const heads = flips.filter(f => f === 'H').length;
    const tails = flipCount - heads;

    const flipCoin = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setShowPrediction(false);
        sounds.flipCoin(); // Play flip sound

        // Determine result
        const result: 'H' | 'T' = Math.random() > 0.5 ? 'H' : 'T';

        // Calculate rotation: always do 2+ full spins, land on correct side
        // Heads = 0, 360, 720... Tails = 180, 540, 900...
        const spins = 2; // Number of full rotations
        const targetRotation = flipRotation + (spins * 360) + (result === 'T' ? 180 : 0);
        setFlipRotation(targetRotation);

        // Wait for animation to complete, then update state
        setTimeout(() => {
            setCurrentSide(result);
            setFlips(prev => [...prev, result]);
            setIsFlipping(false);
            sounds.coinLand(); // Play land sound
            if (flips.length + 1 === MIN_FLIPS) sounds.milestone();
        }, 800);
    };

    const getScore = () => {
        let score = 60; // Base: 30 completion + 30 engagement
        if (prediction) {
            const headsPct = heads / flipCount;
            if (prediction === 'equal' && headsPct >= 0.45 && headsPct <= 0.55) score += 40;
            else if (prediction === 'H' && headsPct > 0.55) score += 40;
            else if (prediction === 'T' && headsPct < 0.45) score += 40;
        }
        return Math.min(score, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="🪙 Coin Flip Experiment" subtitle="Test if the coin is truly fair" onBack={onBack} progress={flipCount} maxProgress={MIN_FLIPS} progressLabel="flips" color="yellow" learningObjective="Explore the Law of Large Numbers: with enough flips, the ratio of heads to tails approaches 50/50 for a fair coin." />

                {showPrediction && flipCount === 0 && (
                    <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                        <h3 className="font-bold mb-3">🧠 After 50 flips, what will win?</h3>
                        <div className="flex gap-4">
                            <button onClick={() => { setPrediction('H'); setShowPrediction(false); }} className="flex-1 p-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold">Heads</button>
                            <button onClick={() => { setPrediction('equal'); setShowPrediction(false); }} className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold">Equal (~50/50)</button>
                            <button onClick={() => { setPrediction('T'); setShowPrediction(false); }} className="flex-1 p-3 bg-amber-700 hover:bg-amber-800 rounded-lg font-bold">Tails</button>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                        {/* 3D Coin Container */}
                        <div className="mx-auto mb-6" style={{ perspective: '800px' }}>
                            <div
                                className="w-32 h-32 mx-auto relative"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: `rotateX(${flipRotation}deg)`,
                                    transition: 'transform 0.8s ease-out'
                                }}
                            >
                                {/* Heads side */}
                                <div
                                    className="absolute inset-0 rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-yellow-600"
                                    style={{
                                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                        backfaceVisibility: 'hidden'
                                    }}
                                >
                                    👑
                                </div>
                                {/* Tails side */}
                                <div
                                    className="absolute inset-0 rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-stone-600"
                                    style={{
                                        background: 'linear-gradient(135deg, #78716c, #57534e)',
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateX(180deg)'
                                    }}
                                >
                                    🦅
                                </div>
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-4">{currentSide === 'H' ? 'HEADS' : 'TAILS'}</p>
                        <button onClick={flipCoin} disabled={isFlipping}
                            className={`px-8 py-3 rounded-xl font-bold text-lg transition ${isFlipping ? 'bg-slate-600 cursor-wait text-white' : 'bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-slate-900'}`}>
                            {isFlipping ? 'Flipping...' : '🪙 Flip Coin'}
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-2xl p-6">
                        <h3 className="font-bold mb-4">📊 Results</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1"><span>👑 Heads</span><span>{heads} ({flipCount > 0 ? Math.round((heads / flipCount) * 100) : 0}%)</span></div>
                                <div className="h-6 bg-gray-100 rounded overflow-hidden">
                                    <div className="h-full bg-yellow-500 transition-all" style={{ width: flipCount > 0 ? `${(heads / flipCount) * 100}%` : '0%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1"><span>🦅 Tails</span><span>{tails} ({flipCount > 0 ? Math.round((tails / flipCount) * 100) : 0}%)</span></div>
                                <div className="h-6 bg-gray-100 rounded overflow-hidden">
                                    <div className="h-full bg-stone-500 transition-all" style={{ width: flipCount > 0 ? `${(tails / flipCount) * 100}%` : '0%' }} />
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-500 text-sm">Theoretical: 50% each (fair coin)</p>
                        {prediction && <p className="mt-2 text-sm">Your prediction: <span className="font-bold text-yellow-400">{prediction === 'H' ? 'Heads' : prediction === 'T' ? 'Tails' : 'Equal'}</span></p>}
                    </div>
                </div>

                {flipCount >= MIN_FLIPS && (() => {
                    const headsPct = Math.round((heads / flipCount) * 100);
                    const tailsPct = 100 - headsPct;
                    const winner = heads > tails ? 'Heads' : heads < tails ? 'Tails' : 'Tie';
                    const isFair = headsPct >= 45 && headsPct <= 55;
                    const predictionText = prediction === 'H' ? 'Heads' : prediction === 'T' ? 'Tails' : 'Equal';
                    const predictionCorrect = (prediction === 'equal' && isFair) || (prediction === 'H' && heads > tails) || (prediction === 'T' && tails > heads);

                    return (
                        <div className="mt-6 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-4 md:p-6 text-center">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-900">🎉 Milestone Reached!</h3>
                            <p className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">{getScore()}/100</p>

                            <div className="bg-black/10 rounded-xl p-4 mb-4 text-left text-sm text-slate-900">
                                <p className="font-bold mb-3">📊 Your Experiment Summary:</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>🎯 Your Prediction:</span>
                                        <span className="font-bold text-lg">{predictionText}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>👑 Heads:</span>
                                        <span className="font-bold">{heads} ({headsPct}%)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🦅 Tails:</span>
                                        <span className="font-bold">{tails} ({tailsPct}%)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🏆 Winner:</span>
                                        <span className="font-bold">{winner}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>📐 Theory (fair coin):</span>
                                        <span className="font-bold">50% each</span>
                                    </div>
                                </div>

                                <hr className="my-3 border-black/20" />

                                <p className={`text-center font-bold ${predictionCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    {predictionCorrect ? '✅ Your prediction was correct!' : `❌ ${winner} won this time!`}
                                </p>
                                <p className="text-center text-xs mt-2">
                                    {isFair ? '🎯 Results close to 50/50 - looks like a fair coin!' : `📊 ${Math.abs(headsPct - 50)}% deviation from expected. Keep flipping to see convergence!`}
                                </p>
                            </div>

                            <button onClick={onBack} className="px-6 py-2 bg-slate-900 text-yellow-400 rounded-lg font-bold hover:bg-slate-800">Back to Labs</button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

// ============================================
// BALANCE SCALE LAB (Hidden - Physics) - Keep for future use
// ============================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _BalanceScaleLab = ({ onBack }: LabProps) => {
    const [leftWeights, setLeftWeights] = useState<number[]>([]);
    const [rightWeights, setRightWeights] = useState<number[]>([]);
    const [trials, setTrials] = useState(0);
    const [balancedCount, setBalancedCount] = useState(0);

    const MIN_TRIALS = 5;
    const leftTotal = leftWeights.reduce((a, b) => a + b, 0);
    const rightTotal = rightWeights.reduce((a, b) => a + b, 0);
    const isBalanced = leftTotal === rightTotal && leftTotal > 0;
    const tilt = leftTotal > rightTotal ? 'left' : rightTotal > leftTotal ? 'right' : 'balanced';

    const addWeight = (side: 'left' | 'right', weight: number) => {
        if (side === 'left') setLeftWeights(prev => [...prev, weight]);
        else setRightWeights(prev => [...prev, weight]);
    };

    const checkBalance = () => {
        setTrials(t => t + 1);
        if (isBalanced) setBalancedCount(c => c + 1);
    };

    const resetScale = () => {
        setLeftWeights([]);
        setRightWeights([]);
    };

    const getScore = () => Math.min(30 + 30 + Math.round((balancedCount / trials) * 40), 100);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="⚖️ Balance Scale" subtitle="Learn equilibrium by balancing weights" onBack={onBack} progress={trials} maxProgress={MIN_TRIALS} progressLabel="trials" color="emerald" learningObjective="Understand equilibrium and torque: balance is achieved when forces on both sides are equal (weight × distance from center)." />

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                    {/* Scale Visualization */}
                    <div className="relative h-48 mb-6">
                        {/* Fulcrum */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[40px] border-transparent border-b-emerald-600" />

                        {/* Beam */}
                        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-3 bg-slate-600 rounded transition-transform origin-center ${tilt === 'left' ? '-rotate-6' : tilt === 'right' ? 'rotate-6' : ''
                            }`}>
                            {/* Left Pan */}
                            <div className="absolute -left-4 top-3 w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-emerald-400">{leftTotal}kg</span>
                            </div>
                            {/* Right Pan */}
                            <div className="absolute -right-4 top-3 w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-emerald-400">{rightTotal}kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Status */}
                    <div className="text-center mb-6">
                        <span className={`text-xl font-bold ${isBalanced ? 'text-green-400' : 'text-gray-500'}`}>
                            {isBalanced ? '✅ BALANCED!' : tilt === 'left' ? '⬅️ Left side heavier' : tilt === 'right' ? '➡️ Right side heavier' : 'Add weights to both sides'}
                        </span>
                    </div>

                    {/* Weight Buttons */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="font-bold mb-2 text-center">Left Side</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[1, 2, 5, 10].map(w => (
                                    <button key={w} onClick={() => addWeight('left', w)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold">+{w}kg</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-bold mb-2 text-center">Right Side</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[1, 2, 5, 10].map(w => (
                                    <button key={w} onClick={() => addWeight('right', w)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold">+{w}kg</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-6 justify-center">
                        <button onClick={checkBalance} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Check Balance</button>
                        <button onClick={resetScale} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold">Reset</button>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="font-bold mb-4">📊 Your Progress</h3>
                    <p>Trials completed: {trials}</p>
                    <p>Times balanced: {balancedCount}</p>
                    <p>Balance rate: {trials > 0 ? Math.round((balancedCount / trials) * 100) : 0}%</p>
                </div>

                {trials >= MIN_TRIALS && (
                    <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">🎉 Milestone Reached!</h3>
                        <p className="text-5xl font-bold mb-2">{getScore()}/100</p>
                        <button onClick={onBack} className="mt-4 px-6 py-2 bg-white text-emerald-600 rounded-lg font-bold">Back to Labs</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================
// SORTING LAB (NEW - CS)
// ============================================
const SortingLab = ({ onBack }: LabProps) => {
    const [array, setArray] = useState<number[]>([]);
    const [sorting, setSorting] = useState(false);
    const [algorithm, setAlgorithm] = useState<'bubble' | 'quick' | 'merge'>('bubble');
    const [comparisons, setComparisons] = useState(0);
    const [trials, setTrials] = useState(0);
    const [sortHistory, setSortHistory] = useState<{ algo: string, comparisons: number }[]>([]);

    const MIN_TRIALS = 3;

    const generateArray = () => {
        const newArr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
        setArray(newArr);
        setComparisons(0);
    };

    const bubbleSort = async () => {
        const arr = [...array];
        let comps = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                comps++;
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
                setArray([...arr]);
                setComparisons(comps);
                await new Promise(r => setTimeout(r, 30));
            }
        }
        return comps;
    };

    const quickSortVisual = async () => {
        const arr = [...array];
        let comps = 0;

        const partition = async (low: number, high: number): Promise<number> => {
            const pivot = arr[high];
            let i = low - 1;
            for (let j = low; j < high; j++) {
                comps++;
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                setArray([...arr]);
                setComparisons(comps);
                await new Promise(r => setTimeout(r, 30));
            }
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            setArray([...arr]);
            return i + 1;
        };

        const quickSort = async (low: number, high: number) => {
            if (low < high) {
                const pi = await partition(low, high);
                await quickSort(low, pi - 1);
                await quickSort(pi + 1, high);
            }
        };

        await quickSort(0, arr.length - 1);
        return comps;
    };

    const runSort = async () => {
        if (array.length === 0) generateArray();
        setSorting(true);
        setComparisons(0);

        let finalComparisons = 0;
        if (algorithm === 'bubble') {
            await bubbleSort();
        } else if (algorithm === 'quick') {
            await quickSortVisual();
        }

        // Get final comparisons count after sort completes
        finalComparisons = comparisons;

        setSorting(false);
        setTrials(t => t + 1);
        setSortHistory(prev => [...prev, { algo: algorithm, comparisons: finalComparisons }]);
    };

    if (array.length === 0) generateArray();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="📊 Sorting Race" subtitle="Compare algorithm efficiency" onBack={onBack} progress={trials} maxProgress={MIN_TRIALS} progressLabel="trials" color="pink" learningObjective="Compare algorithm efficiency: Bubble Sort O(n²) vs Quick Sort O(n log n). See why algorithm choice matters for large datasets." />

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                    {/* Array Visualization */}
                    <div className="flex items-end justify-center gap-1 h-48 mb-6">
                        {array.map((val, i) => (
                            <div key={i} className="w-4 bg-pink-500 rounded-t transition-all" style={{ height: `${val}%` }} />
                        ))}
                    </div>

                    {/* Algorithm Selection */}
                    <div className="flex gap-4 mb-6 justify-center">
                        {(['bubble', 'quick'] as const).map(alg => (
                            <button key={alg} onClick={() => setAlgorithm(alg)} disabled={sorting}
                                className={`px-4 py-2 rounded-lg font-bold transition ${algorithm === alg ? 'bg-pink-600' : 'bg-gray-100 hover:bg-slate-600'}`}>
                                {alg === 'bubble' ? 'Bubble Sort' : 'Quick Sort'}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="text-center mb-4">
                        <p className="text-2xl font-bold">Comparisons: <span className="text-pink-400">{comparisons}</span></p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center">
                        <button onClick={runSort} disabled={sorting}
                            className={`px-6 py-2 rounded-lg font-bold ${sorting ? 'bg-slate-600' : 'bg-pink-600 hover:bg-pink-700'}`}>
                            {sorting ? 'Sorting...' : '▶️ Run Sort'}
                        </button>
                        <button onClick={generateArray} disabled={sorting}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold">New Array</button>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="font-bold mb-4">📚 Algorithm Info</h3>
                    <p className="text-gray-500 text-sm">
                        {algorithm === 'bubble'
                            ? 'Bubble Sort: O(n²) - Simple but slow. Compares adjacent elements repeatedly.'
                            : 'Quick Sort: O(n log n) average - Fast! Uses divide-and-conquer with a pivot.'}
                    </p>
                </div>

                {trials >= MIN_TRIALS && (() => {
                    const bubbleRuns = sortHistory.filter(h => h.algo === 'bubble');
                    const quickRuns = sortHistory.filter(h => h.algo === 'quick');
                    const avgBubble = bubbleRuns.length > 0 ? Math.round(bubbleRuns.reduce((a, b) => a + b.comparisons, 0) / bubbleRuns.length) : 0;
                    const avgQuick = quickRuns.length > 0 ? Math.round(quickRuns.reduce((a, b) => a + b.comparisons, 0) / quickRuns.length) : 0;

                    return (
                        <div className="mt-6 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-4 md:p-6 text-center text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">🎉 Lab Complete!</h3>
                            <p className="text-4xl md:text-5xl font-bold mb-4">{trials} Trials</p>

                            <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm">
                                <p className="font-bold mb-3">📊 Your Experiment Summary:</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>🐢 Bubble Sort runs:</span>
                                        <span className="font-bold">{bubbleRuns.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🚀 Quick Sort runs:</span>
                                        <span className="font-bold">{quickRuns.length}</span>
                                    </div>
                                    {avgBubble > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span>📉 Avg Bubble comparisons:</span>
                                            <span className="font-bold text-yellow-300">{avgBubble}</span>
                                        </div>
                                    )}
                                    {avgQuick > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span>📈 Avg Quick comparisons:</span>
                                            <span className="font-bold text-green-300">{avgQuick}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span>📦 Array size:</span>
                                        <span className="font-bold">{array.length} elements</span>
                                    </div>
                                </div>

                                <hr className="my-3 border-white/20" />

                                <p className="text-center text-xs">
                                    {avgBubble > 0 && avgQuick > 0
                                        ? `💡 Quick Sort used ${Math.round((1 - avgQuick / avgBubble) * 100)}% fewer comparisons than Bubble Sort!`
                                        : bubbleRuns.length === 0
                                            ? '💡 Try Bubble Sort to compare algorithms!'
                                            : '💡 Try Quick Sort to compare algorithms!'}
                                </p>
                            </div>

                            <button onClick={onBack} className="px-6 py-2 bg-white text-pink-600 rounded-lg font-bold hover:bg-pink-50">Back to Labs</button>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default KinestheticLab;

// Export hidden components for future use
export { _BalanceScaleLab as BalanceScaleLab };

// ============================================
// BINARY SEARCH LAB (NEW - CS)
// ============================================
const BinarySearchLab = ({ onBack }: LabProps) => {
    const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
    const [low, setLow] = useState(1);
    const [high, setHigh] = useState(100);
    const [guesses, setGuesses] = useState<number[]>([]);
    const [found, setFound] = useState(false);
    const [trials, setTrials] = useState(0);
    const [gameHistory, setGameHistory] = useState<{ target: number, guesses: number, optimal: number }[]>([]);
    const [customGuess, setCustomGuess] = useState<string>('');

    const MIN_TRIALS = 5;
    const OPTIMAL_GUESSES = Math.ceil(Math.log2(100)); // 7

    const makeGuess = (guess: number) => {
        if (guess < low || guess > high) return;
        sounds.guess(); // Play guess sound
        setGuesses(prev => [...prev, guess]);
        if (guess === target) {
            setFound(true);
            setTrials(t => t + 1);
            setGameHistory(prev => [...prev, { target, guesses: guesses.length + 1, optimal: OPTIMAL_GUESSES }]);
            sounds.success(); // Found it!
            if (trials + 1 === MIN_TRIALS) sounds.milestone();
        } else if (guess < target) {
            setLow(guess + 1);
            sounds.higher(); // Go higher
        } else {
            setHigh(guess - 1);
            sounds.lower(); // Go lower
        }
    };

    const handleCustomGuess = () => {
        const guess = parseInt(customGuess);
        if (!isNaN(guess) && guess >= low && guess <= high) {
            makeGuess(guess);
            setCustomGuess('');
        }
    };

    const suggestedGuess = Math.floor((low + high) / 2);

    const resetGame = () => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setLow(1);
        setHigh(100);
        setGuesses([]);
        setFound(false);
    };

    const avgGuesses = gameHistory.length > 0
        ? (gameHistory.reduce((a, b) => a + b.guesses, 0) / gameHistory.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="🔍 Binary Search" subtitle="Find the number using binary search strategy" onBack={onBack} progress={trials} maxProgress={MIN_TRIALS} progressLabel="games" color="cyan" learningObjective="Master binary search: by always guessing the middle, you can find any number in 1-100 within 7 guesses (log₂ 100 ≈ 7)." />

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6 text-center">
                    <p className="text-lg mb-4">I'm thinking of a number between <span className="font-bold text-cyan-600">1</span> and <span className="font-bold text-cyan-600">100</span></p>

                    {!found ? (
                        <>
                            <p className="mb-2">Current range: <span className="font-bold">{low} - {high}</span></p>
                            <p className="text-gray-500 mb-4">Optimal guess (middle): <span className="font-bold text-cyan-600">{suggestedGuess}</span></p>

                            {/* Quick guess buttons */}
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {[low, suggestedGuess, high].filter((v, i, a) => a.indexOf(v) === i).map(g => (
                                    <button key={g} onClick={() => makeGuess(g)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold">
                                        Guess {g}
                                    </button>
                                ))}
                            </div>

                            {/* Custom guess input */}
                            <div className="flex gap-2 justify-center items-center mt-4">
                                <input
                                    type="number"
                                    min={low}
                                    max={high}
                                    value={customGuess}
                                    onChange={(e) => setCustomGuess(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomGuess()}
                                    placeholder={`Enter ${low}-${high}`}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center"
                                />
                                <button
                                    onClick={handleCustomGuess}
                                    disabled={!customGuess || parseInt(customGuess) < low || parseInt(customGuess) > high}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold disabled:opacity-50"
                                >
                                    Guess
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mt-4">Guesses so far: {guesses.length}</p>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-4xl mb-4">🎉</p>
                            <p className="text-xl font-bold text-green-600 mb-2">Found it! The number was {target}</p>
                            <p className="mb-4">You used <span className="font-bold">{guesses.length}</span> guesses (optimal: <span className="font-bold">{OPTIMAL_GUESSES}</span>)</p>
                            <button onClick={resetGame} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold">Play Again</button>
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                    <h3 className="font-bold mb-4">📊 Your Guesses</h3>
                    <div className="flex flex-wrap gap-2">
                        {guesses.map((g, i) => (
                            <span key={i} className={`px-3 py-1 rounded-full text-sm ${g === target ? 'bg-green-500 text-white' : g < target ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                {g} {g === target ? '✓' : g < target ? '↑' : '↓'}
                            </span>
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-4">Binary search finds any number in 1-100 in at most {OPTIMAL_GUESSES} guesses!</p>
                </div>

                {/* Dynamic Summary */}
                {trials >= MIN_TRIALS && (
                    <div className="mt-6 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-4 md:p-6 text-center text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">🎉 Lab Complete!</h3>
                        <p className="text-4xl md:text-5xl font-bold mb-4">{trials} Games</p>

                        <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm">
                            <p className="font-bold mb-3">📊 Your Experiment Summary:</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>🎮 Games completed:</span>
                                    <span className="font-bold">{gameHistory.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>📈 Average guesses per game:</span>
                                    <span className="font-bold">{avgGuesses}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>🎯 Optimal (binary search):</span>
                                    <span className="font-bold text-green-300">{OPTIMAL_GUESSES} guesses max</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>🏆 Best game:</span>
                                    <span className="font-bold text-yellow-300">
                                        {gameHistory.length > 0 ? `${Math.min(...gameHistory.map(g => g.guesses))} guesses` : '-'}
                                    </span>
                                </div>
                            </div>

                            <hr className="my-3 border-white/20" />

                            <p className="text-center text-xs">
                                {Number(avgGuesses) <= OPTIMAL_GUESSES
                                    ? '🌟 Excellent! You matched optimal binary search performance!'
                                    : `💡 Tip: Always guess the middle of the range to find numbers faster!`}
                            </p>
                        </div>

                        <button onClick={onBack} className="px-6 py-2 bg-white text-cyan-600 rounded-lg font-bold hover:bg-cyan-50">Back to Labs</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================
// RECURSION LAB (NEW - CS)
// ============================================
const RecursionLab = ({ onBack }: LabProps) => {
    const [n, setN] = useState(5);
    const [callStack, setCallStack] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [trials, setTrials] = useState(0);

    const MIN_TRIALS = 3;

    const runFactorial = async () => {
        setRunning(true);
        setCallStack([]);

        const calls: string[] = [];
        const factorial = async (num: number): Promise<number> => {
            calls.push(`factorial(${num})`);
            setCallStack([...calls]);
            await new Promise(r => setTimeout(r, 500));

            if (num <= 1) {
                calls[calls.length - 1] = `factorial(${num}) = 1`;
                setCallStack([...calls]);
                await new Promise(r => setTimeout(r, 300));
                return 1;
            }
            const result = num * await factorial(num - 1);
            calls[calls.findIndex(c => c === `factorial(${num})`)] = `factorial(${num}) = ${result}`;
            setCallStack([...calls]);
            await new Promise(r => setTimeout(r, 300));
            return result;
        };

        await factorial(n);
        setRunning(false);
        setTrials(t => t + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <LabHeader title="🌳 Recursion Tree" subtitle="Visualize factorial recursive calls" onBack={onBack} progress={trials} maxProgress={MIN_TRIALS} progressLabel="runs" color="green" learningObjective="Understand recursion: a function calling itself with a smaller problem until reaching a base case (n! = n × (n-1)!)." />

                <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6 justify-center">
                        <span className="font-bold">Calculate factorial of:</span>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={n}
                            onChange={e => setN(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-20 px-3 py-2 border rounded-lg text-center"
                            disabled={running}
                        />
                        <button
                            onClick={runFactorial}
                            disabled={running}
                            className={`px-6 py-2 rounded-lg font-bold ${running ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                        >
                            {running ? 'Running...' : '▶️ Run'}
                        </button>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
                        <h4 className="font-bold mb-3">📚 Call Stack:</h4>
                        <div className="space-y-2">
                            {callStack.map((call, i) => (
                                <div
                                    key={i}
                                    className={`px-4 py-2 rounded-lg transition-all ${call.includes('=') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    style={{ marginLeft: `${i * 20}px` }}
                                >
                                    {call}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="font-bold mb-4">💡 Understanding Recursion</h3>
                    <p className="text-gray-600 text-sm">Recursion is when a function calls itself. Each call waits for the next to complete before returning. factorial(5) = 5 × factorial(4) = 5 × 4 × 3 × 2 × 1 = 120</p>
                </div>
            </div>
        </div>
    );
};
