import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Activity, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../../utils/sounds';

// ============================================
// TYPES & REGISTRY
// ============================================
type SimulatorId = 'probability' | 'electromagnetism' | 'dynamic-programming';

interface SimulatorDefinition {
    id: SimulatorId;
    name: string;
    emoji: string;
    description: string;
    infographicData: string;
    color: string;
}

const SIMULATORS: SimulatorDefinition[] = [
    {
        id: 'probability',
        name: 'Normal Distribution',
        emoji: '🎲',
        description: 'Explore how large numbers of random events form a predictable pattern.',
        infographicData: 'The Bell Curve (Normal Distribution) represents how data clusters around an average.',
        color: 'blue'
    },
    {
        id: 'electromagnetism',
        name: 'Magnetic Fields',
        emoji: '⚡',
        description: 'Visualize invisible magnetic lines and their interaction with currents.',
        infographicData: 'Magnetic field lines flow from North to South.',
        color: 'yellow'
    },
    {
        id: 'dynamic-programming',
        name: 'Recursion Optimization',
        emoji: '🧩',
        description: 'See how memoization prevents redundant calculations in real-time.',
        infographicData: 'DP stores results of subproblems to avoid recomputing them.',
        color: 'green'
    }
];

// ============================================
// PROBABILITY SIMULATOR COMPONENT
// ============================================
const ProbabilitySimulator = ({ mode }: { mode: 'infographic' | 'simulator' }) => {
    const [bins, setBins] = useState<number[]>(new Array(11).fill(0));
    const [totalBalls, setTotalBalls] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simSpeed, setSimSpeed] = useState(50);
    const [bias, setBias] = useState(0.5);
    const [disabledPegs, setDisabledPegs] = useState<Set<string>>(new Set());
    const [showNotebook, setShowNotebook] = useState(false);
    const [hasExperimentBegun, setHasExperimentBegun] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const togglePeg = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const newDisabled = new Set(disabledPegs);
        if (newDisabled.has(key)) newDisabled.delete(key);
        else newDisabled.add(key);
        setDisabledPegs(newDisabled);
        sounds.click();
    };

    const runSimulationStep = () => {
        setBins(prev => {
            const newBins = [...prev];
            let pos = 5; // Start at center (approx)
            // Path through 10 rows of pegs
            for (let r = 0; r < 10; r++) {
                const isCurrentPegDisabled = disabledPegs.has(`${r}-${pos}`);
                if (!isCurrentPegDisabled) {
                    if (Math.random() < bias) pos++;
                    else pos--;
                }
            }
            const finalBin = Math.max(0, Math.min(10, pos));
            newBins[finalBin]++;
            return newBins;
        });
        setTotalBalls(t => t + 1);
        if (totalBalls % 2 === 0) sounds.click();
    };

    const toggleSimulation = () => {
        sounds.click();
        if (isSimulating) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsSimulating(false);
        } else {
            setIsSimulating(true);
            intervalRef.current = setInterval(runSimulationStep, simSpeed);
        }
    };

    const resetSimulation = () => {
        sounds.click();
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsSimulating(false);
        setBins(new Array(11).fill(0));
        setTotalBalls(0);
        setDisabledPegs(new Set());
    };

    useEffect(() => {
        if (isSimulating) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(runSimulationStep, simSpeed);
        }
    }, [simSpeed, isSimulating]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const maxBinValue = Math.max(...bins, 1);

    if (mode === 'infographic') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-inner min-h-[400px]">
                <div className="relative w-full max-w-lg h-64 border-b-2 border-gray-200 flex items-end justify-between px-2">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 0,100 C 20,100 40,20 50,20 C 60,20 80,100 100,100" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </svg>
                    <div className="absolute top-4 left-4 right-4 bg-blue-50 p-4 rounded-xl border border-blue-100 italic text-sm text-blue-600">
                        "Numerical patterns are the result of collective interactions between individual obstacles."
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
                    <div className="p-3 bg-gray-50 rounded-xl"><h4 className="font-bold text-xs uppercase text-gray-400">Normal</h4><p className="text-sm font-bold">Standard Pegs</p></div>
                    <div className="p-3 bg-red-50 rounded-xl"><h4 className="font-bold text-xs uppercase text-red-400">Interference</h4><p className="text-sm font-bold">Missing Pegs</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 bg-gray-900 rounded-2xl shadow-xl min-h-[600px] text-white relative">
            {/* LAB BRIEFING OVERLAY - Simplified & Action-Focused */}
            {!hasExperimentBegun && (
                <div className="absolute inset-x-6 top-6 bottom-6 z-50 bg-gray-900/98 backdrop-blur-md rounded-2xl border border-red-500/30 p-8 flex flex-col items-center justify-center text-center">
                    {/* Large Icon */}
                    <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-500/40">
                        <span className="text-6xl">🎯</span>
                    </div>

                    {/* Clear Title */}
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Ready to Explore Probability?
                    </h3>

                    {/* Simple Description */}
                    <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                        Click pegs to <span className="text-red-400 font-bold">disable</span> them and watch how it affects the distribution. Your goal: break the bell curve!
                    </p>

                    {/* Large Primary Action */}
                    <button
                        onClick={() => setHasExperimentBegun(true)}
                        className="px-16 py-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xl uppercase tracking-wide transition-all shadow-2xl hover:scale-105 mb-6 inline-flex items-center justify-center"
                    >
                        <span className="inline-flex items-center gap-2 pl-4 pr-4">
                            <span>Start Experiment</span>
                            <span>→</span>
                        </span>
                    </button>

                    {/* Optional Quick Guide (Collapsible) */}
                    <details className="max-w-2xl text-left">
                        <summary className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer font-semibold uppercase tracking-wider">
                            📋 Quick Guide
                        </summary>
                        <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-3 text-sm text-gray-300">
                            <p><span className="font-bold text-red-400">Objective:</span> Hack the Normal Distribution by modifying the physical environment.</p>
                            <p><span className="font-bold text-red-400">How:</span> Click individual pegs to disable them. Balls will fall straight through disabled pegs.</p>
                            <p><span className="font-bold text-red-400">What to Watch:</span> The bell curve should distort or shift towards your disabled paths.</p>
                        </div>
                    </details>
                </div>
            )}

            {/* Simulation UI - Only show after experiment begins */}
            {hasExperimentBegun && (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30">
                                <h4 className="text-red-400 font-bold text-[10px] uppercase">Sampling Progress</h4>
                                <div className="w-32 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-red-500 transition-all" style={{ width: `${Math.min(100, totalBalls / 5)}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNotebook(!showNotebook)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest transition"
                        >
                            <BookOpen className="w-4 h-4" /> Observation Log
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-end bg-black/40 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden mb-4">
                        {/* LAB NOTEBOOK MODAL */}
                        {showNotebook && (
                            <div className="absolute inset-0 z-50 bg-gray-900 backdrop-blur-md p-8 flex flex-col rounded-3xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-blue-400" /> Statistical Log
                                    </h3>
                                    <button onClick={() => setShowNotebook(false)} className="text-gray-500 hover:text-white">Close</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Sample Size (N)</p>
                                        <p className="text-4xl font-mono font-black text-blue-400">{totalBalls}<span className="text-sm font-normal text-gray-500 ml-1">Drops</span></p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Interference Density</p>
                                        <p className="text-4xl font-mono font-black text-red-500">{disabledPegs.size}<span className="text-sm font-normal text-gray-500 ml-1">Pegs</span></p>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 bg-red-600/10 rounded-2xl border border-red-500/20 overflow-auto">
                                    <h4 className="text-red-400 font-bold text-sm mb-4 uppercase text-center">Conclusion Analysis</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed text-center italic">
                                        {totalBalls < 100 ? (
                                            "Dataset size (N=" + totalBalls + ") is too low for a significant statistical conclusion. Please drop more balls (Goal: 100+)."
                                        ) : (
                                            <>
                                                With <span className="text-white font-bold">{disabledPegs.size} interference nodes</span> and a bias of <span className="text-white font-bold">{bias}</span>,
                                                the distribution has shifted. The **Central Limit Theorem** is observed here in its state of disruption.
                                                By manually disabling pegs, you have altered the **Probability Space**, forcing a mechanical bias that overcomes pure randomness.
                                                Your experiment proves that while large numbers tend toward a curve, environment geometry remains the primary determinant of outcome.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Interactive Peg Grid */}
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="flex flex-col gap-4 items-center">
                                {[0, 1, 2, 3, 4, 5, 6, 7].map(r => (
                                    <div key={r} className="flex gap-4">
                                        {Array.from({ length: r + 1 }).map((_, c) => {
                                            const isDisabled = disabledPegs.has(`${r}-${c}`);
                                            return (
                                                <button
                                                    key={c}
                                                    onClick={() => togglePeg(r, c)}
                                                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 shadow-[0_0_8px_rgba(255,255,255,0.1)] ${isDisabled ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] opacity-100 scale-125' : 'bg-white opacity-40 hover:opacity-100'}`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Histogram Bars */}
                        <div className="flex items-end justify-between h-32 gap-1 sm:gap-2 px-2 z-10 border-t border-white/5 pt-4">
                            {bins.map((val, idx) => (
                                <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-sm transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        style={{ height: `${(val / maxBinValue) * 100}%`, minHeight: val > 0 ? '4px' : '0' }}
                                    />
                                    <span className="mt-1 text-[8px] text-gray-500">{idx}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-between mt-auto">
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-xl border border-white/5">
                                <span className="text-[10px] text-gray-400 font-bold">BIAS</span>
                                <input type="range" min="0.2" max="0.8" step="0.05" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} className="w-20 h-1 bg-blue-600 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-xl border border-white/5">
                                <span className="text-[10px] text-gray-400 font-bold">FLOW</span>
                                <input type="range" min="10" max="200" value={210 - simSpeed} onChange={(e) => setSimSpeed(210 - parseInt(e.target.value))} className="w-16 h-1 bg-red-600 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={resetSimulation} className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition font-bold text-xs uppercase tracking-tight border border-white/5 text-gray-400">Clear Data</button>
                            <button onClick={toggleSimulation} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isSimulating ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}>
                                {isSimulating ? 'Active Flow' : 'Begin Simulation'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================
// ELECTROMAGNETISM SIMULATOR COMPONENT
// ============================================
const ElectromagnetismSimulator = ({ mode }: { mode: 'infographic' | 'simulator' }) => {
    const [magnetPos, setMagnetPos] = useState({ x: 10, y: 50 }); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const [voltage, setVoltage] = useState(0);
    const [peakVoltage, setPeakVoltage] = useState(0);
    const [totalMovement, setTotalMovement] = useState(0);
    const [showNotebook, setShowNotebook] = useState(false);
    const [hasExperimentBegun, setHasExperimentBegun] = useState(false);

    const lastPosRef = useRef({ x: 10, time: Date.now() });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));

        const now = Date.now();
        const dt = (now - lastPosRef.current.time) / 1000; // seconds
        const dx = x - lastPosRef.current.x;
        const velocity = dt > 0 ? dx / dt : 0;

        // Induction logic: Voltage is proportional to velocity if overlapping coil (40%-60% range)
        const isOverlap = x > 35 && x < 65;
        const inducedVoltage = isOverlap ? velocity * 0.5 : 0;

        setVoltage(inducedVoltage);
        if (Math.abs(inducedVoltage) > peakVoltage) setPeakVoltage(Math.abs(inducedVoltage));
        setTotalMovement(prev => prev + Math.abs(dx));

        setMagnetPos(prev => ({ ...prev, x }));
        lastPosRef.current = { x, time: now };
    };

    const stopDragging = () => {
        setIsDragging(false);
        setVoltage(0);
    };

    if (mode === 'infographic') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-inner min-h-[400px]">
                <div className="relative w-full max-w-lg h-64 border border-gray-100 rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            {[10, 20, 30, 40].map(r => (
                                <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}
                        </svg>
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center p-6">
                        <div className="flex gap-4 mb-4">
                            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">MAGNET</div>
                            <div className="w-12 h-12 rounded-full border-4 border-yellow-500 flex items-center justify-center text-yellow-600">⚡</div>
                            <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">COIL</div>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Electromagnetic Induction: Motion + Magnetic Field = Electric Current</p>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <h4 className="font-bold text-yellow-900 text-sm mb-2">Faraday's Discovery</h4>
                        <p className="text-xs text-yellow-800">Electricity is not just 'there'—it is birthed by the relative motion between a magnet and a conductor.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 text-sm mb-2">Physical Action</h4>
                        <p className="text-xs text-indigo-800">The faster the change in magnetic flux, the higher the voltage. Speed matters!</p>
                    </div>
                </div>
            </div>
        );
    }

    const brightness = Math.min(100, Math.abs(voltage) * 2);

    return (
        <div
            className="flex flex-col p-6 bg-gray-900 rounded-2xl shadow-xl min-h-[600px] text-white select-none relative"
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onTouchMove={handleMouseMove}
            onTouchEnd={stopDragging}
        >
            {/* LAB BRIEFING OVERLAY - Simplified */}
            {!hasExperimentBegun && (
                <div className="absolute inset-x-6 top-6 bottom-6 z-50 bg-gray-900/98 backdrop-blur-md rounded-2xl border border-blue-500/30 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/40">
                        <span className="text-6xl">⚡</span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Ready to Generate Electricity?
                    </h3>

                    <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                        Drag the <span className="text-blue-400 font-bold">magnet</span> through the coil as fast as you can. Watch the bulb light up!
                    </p>

                    <button
                        onClick={() => setHasExperimentBegun(true)}
                        className="px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl uppercase tracking-wide transition-all shadow-2xl hover:scale-105 mb-6 inline-flex items-center justify-center"
                    >
                        <span className="inline-flex items-center gap-2 pl-4 pr-4">
                            <span>Start Experiment</span>
                            <span>→</span>
                        </span>
                    </button>

                    <details className="max-w-2xl text-left">
                        <summary className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer font-semibold uppercase tracking-wider">
                            📋 Quick Guide
                        </summary>
                        <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-3 text-sm text-gray-300">
                            <p><span className="font-bold text-blue-400">Objective:</span> Generate maximum voltage by moving the magnetic flux.</p>
                            <p><span className="font-bold text-blue-400">How:</span> Click and drag the magnet quickly through the copper coil.</p>
                            <p><span className="font-bold text-blue-400">What to Watch:</span> Bulb brightness peaks during high-velocity movement (Faraday's Law).</p>
                        </div>
                    </details>
                </div>
            )}

            {/* Simulation UI - Only show after experiment begins */}
            {hasExperimentBegun && (
                <>
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-yellow-600/20 border border-yellow-500/30">
                                <h4 className="text-yellow-400 font-bold text-[10px] uppercase">Experiment Progress</h4>
                                <div className="w-32 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-yellow-500 transition-all" style={{ width: `${Math.min(100, totalMovement / 10)}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNotebook(!showNotebook)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest transition"
                        >
                            <BookOpen className="w-4 h-4" /> Lab Notebook
                        </button>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col pt-12" ref={containerRef}>
                        {/* LAB NOTEBOOK MODAL */}
                        {showNotebook && (
                            <div className="absolute inset-0 z-50 bg-gray-900 backdrop-blur-md p-8 flex flex-col rounded-3xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-blue-400" /> Observation Log
                                    </h3>
                                    <button onClick={() => setShowNotebook(false)} className="text-gray-500 hover:text-white">Close</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Peak Induced Potential</p>
                                        <p className="text-4xl font-mono font-black text-blue-400">{peakVoltage.toFixed(2)}<span className="text-sm font-normal text-gray-500 ml-1">Volts</span></p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Physical Energy Index</p>
                                        <p className="text-4xl font-mono font-black text-yellow-500">{Math.floor(totalMovement)}<span className="text-sm font-normal text-gray-500 ml-1">Units</span></p>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                                    <h4 className="text-blue-400 font-bold text-sm mb-4 uppercase">Conclusion Summary</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {totalMovement < 50 ? (
                                            "Your data is currently insufficient. Please perform more cycles to generate a conclusion."
                                        ) : (
                                            <>
                                                Based on your actions, a peak of <span className="text-white font-bold">{peakVoltage.toFixed(2)} Volts</span> was generated.
                                                The experiment confirms **Faraday's Law**: the magnitude of induction is directly proportional to the rate of change of magnetic flux.
                                                Your movement index of <span className="text-white font-bold">{Math.floor(totalMovement)}</span> demonstrates that static proximity produces zero charge, whereas rapid kinetic energy transfer results in visible photon output (bulb glow).
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Lightbulb and Meter Area */}
                        <div className="flex justify-around items-center mb-12">
                            {/* Lightbulb Visual */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center transition-all duration-75 relative"
                                    style={{
                                        backgroundColor: `rgba(253, 224, 71, ${brightness / 100})`,
                                        boxShadow: brightness > 10 ? `0 0 ${brightness}px rgba(253, 224, 71, 0.8)` : 'none',
                                        borderColor: brightness > 20 ? '#fde047' : '#4b5563'
                                    }}
                                >
                                    <Sparkles className={`w-8 h-8 ${brightness > 50 ? 'text-white' : 'text-yellow-600/50'}`} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500 mt-2 tracking-widest">Generator Output</span>
                            </div>

                            {/* Ammeter Visual */}
                            <div className="w-32 h-20 bg-gray-800 rounded-t-full border-x-4 border-t-4 border-gray-700 relative overflow-hidden flex flex-col justify-end p-2">
                                <div
                                    className="absolute bottom-1 left-1/2 w-1 h-16 bg-red-500 origin-bottom transition-transform duration-75"
                                    style={{ transform: `translateX(-50%) rotate(${Math.max(-60, Math.min(60, voltage * 3))}deg)` }}
                                ></div>
                                <div className="w-2 h-2 rounded-full bg-white self-center z-10"></div>
                                <div className="flex justify-between text-[8px] text-gray-500 font-mono px-2 mb-1">
                                    <span>-V</span>
                                    <span>0</span>
                                    <span>+V</span>
                                </div>
                            </div>
                        </div>

                        {/* The Lab Table */}
                        <div className="flex-1 relative border-t border-white/5 bg-gradient-to-b from-transparent to-white/5 px-8">
                            {/* Copper Coil */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-24 flex items-center justify-center z-10">
                                <div className="w-full h-full border-y-4 border-orange-600/30 rounded-xl relative flex items-center justify-center">
                                    {/* Visual coils */}
                                    <div className="flex gap-1 h-full py-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className="w-2 h-full bg-orange-700/80 rounded-full border-x border-orange-500/20"></div>
                                        ))}
                                    </div>
                                    <span className="absolute -top-6 text-[10px] font-bold text-orange-400 uppercase tracking-widest">Copper Coil</span>
                                </div>
                            </div>

                            {/* Draggable Magnet */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20 transition-transform hover:scale-105"
                                style={{ left: `${magnetPos.x}%`, transform: `translate(-50%, -50%)` }}
                                onMouseDown={() => setIsDragging(true)}
                                onTouchStart={() => setIsDragging(true)}
                            >
                                <div className="w-28 h-10 rounded-lg flex overflow-hidden shadow-2xl border border-white/10 ring-4 ring-black/20">
                                    <div className="flex-1 bg-red-600 flex items-center justify-center font-black text-white text-lg">N</div>
                                    <div className="flex-1 bg-blue-600 flex items-center justify-center font-black text-white text-lg">S</div>
                                </div>
                                {isDragging && (
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-blue-400 animate-bounce">
                                        DRAG ME!
                                    </div>
                                )}

                                {/* Magnetic Field Visual Aura */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-white/5 rounded-full scale-150 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================
// DYNAMIC PROGRAMMING SIMULATOR COMPONENT
// ============================================
const DPSimulator = ({ mode }: { mode: 'infographic' | 'simulator' }) => {
    const [n, setN] = useState(6);
    const [cachedNodes, setCachedNodes] = useState<Set<number>>(new Set());
    const [isAutoSolving, setIsAutoSolving] = useState(false);
    const [showNotebook, setShowNotebook] = useState(false);
    const [hasExperimentBegun, setHasExperimentBegun] = useState(false);

    const toggleCache = (val: number) => {
        const newCache = new Set(cachedNodes);
        if (newCache.has(val)) newCache.delete(val);
        else {
            newCache.add(val);
            // @ts-ignore
            sounds.click();
        }
        setCachedNodes(newCache);
    };

    if (mode === 'infographic') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-inner min-h-[400px]">
                <div className="w-full max-w-lg p-6 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-green-900 mb-6 uppercase tracking-widest">The Power of Memory</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold shadow-lg">CALCULATE</div>
                        <div className="text-2xl text-green-300">➔</div>
                        <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold shadow-lg ring-4 ring-purple-200">STORE</div>
                        <div className="text-2xl text-green-300">➔</div>
                        <div className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold shadow-lg">RE-USE</div>
                    </div>
                    <p className="mt-8 text-center text-sm text-green-700 max-w-sm">"Dynamic Programming is just smart recursion. We save the past to avoid repeating it."</p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
                    <div className="p-3 bg-red-50 rounded-xl"><h4 className="font-bold text-xs uppercase text-red-400">Brute Force</h4><p className="text-xs">O(2ⁿ) - Slow</p></div>
                    <div className="p-3 bg-green-50 rounded-xl"><h4 className="font-bold text-xs uppercase text-green-400">DP optimized</h4><p className="text-xs">O(n) - Instant</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6 bg-gray-900 rounded-2xl shadow-xl min-h-[600px] text-white overflow-hidden relative">
            {/* LAB BRIEFING OVERLAY */}
            {!hasExperimentBegun && (
                <div className="absolute inset-x-6 top-6 bottom-6 z-50 bg-gray-900/98 backdrop-blur-md rounded-2xl border border-green-500/30 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/40">
                        <span className="text-6xl">🧠</span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                        Ready to Optimize Recursion?
                    </h3>

                    <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                        Click nodes to <span className="text-green-400 font-bold">cache</span> their results. See the recursion tree collapse in real-time!
                    </p>

                    <button
                        onClick={() => setHasExperimentBegun(true)}
                        className="px-16 py-6 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl uppercase tracking-wide transition-all shadow-2xl hover:scale-105 mb-6 inline-flex items-center justify-center"
                    >
                        <span className="inline-flex items-center gap-2 pl-4 pr-4">
                            <span>Start Experiment</span>
                            <span>→</span>
                        </span>
                    </button>

                    <details className="max-w-2xl text-left">
                        <summary className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer font-semibold uppercase tracking-wider">
                            📋 Quick Guide
                        </summary>
                        <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-3 text-sm text-gray-300">
                            <p><span className="font-bold text-green-400">Objective:</span> Avoid redundant calculations by caching solutions.</p>
                            <p><span className="font-bold text-green-400">How:</span> Click nodes to "memoize" them. Once cached, identical branches are skipped.</p>
                            <p><span className="font-bold text-green-400">What to Watch:</span> Time complexity drops from O(2ⁿ) to O(N) as you cache more.</p>
                        </div>
                    </details>
                </div>
            )}

            {/* Simulation UI - Only show after experiment begins */}
            {hasExperimentBegun && (
                <>
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-xl bg-green-600/20 border border-green-500/30">
                                <h4 className="text-green-400 font-bold text-[10px] uppercase">Cache Saturation</h4>
                                <div className="w-32 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all" style={{ width: `${(cachedNodes.size / n) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNotebook(!showNotebook)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest transition"
                        >
                            <BookOpen className="w-4 h-4" /> Lab Notebook
                        </button>
                    </div>

                    <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative overflow-auto p-12 flex flex-col items-center min-h-[400px]">
                        {/* LAB NOTEBOOK MODAL */}
                        {showNotebook && (
                            <div className="absolute inset-0 z-50 bg-gray-900 backdrop-blur-md p-8 flex flex-col rounded-3xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-blue-400" /> Profiler Results
                                    </h3>
                                    <button onClick={() => setShowNotebook(false)} className="text-gray-500 hover:text-white">Close</button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Recursive Depth</p>
                                        <p className="text-4xl font-mono font-black text-blue-400">{n}<span className="text-sm font-normal text-gray-500 ml-1">Levels</span></p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-gray-400 text-xs uppercase font-bold mb-2">Computational Savings</p>
                                        <p className="text-4xl font-mono font-black text-green-500">{cachedNodes.size}<span className="text-sm font-normal text-gray-500 ml-1">Entries</span></p>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 bg-green-600/10 rounded-2xl border border-green-500/20">
                                    <h4 className="text-green-400 font-bold text-sm mb-4 uppercase">Optimization Summary</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {cachedNodes.size < 3 ? (
                                            "Your cache is nearly empty. Redundant calculations are slowing down the system. Please memoize more nodes."
                                        ) : (
                                            <>
                                                By manually caching <span className="text-white font-bold">{cachedNodes.size} functional results</span>, you have drastically flattened the recursion tree.
                                                In a standard Fibonacci sequence, the time complexity is **Exponential (2ⁿ)** because the computer repeatedly solves the same sub-problems.
                                                Your manual intervention simulates **Dynamic Programming**, transforming the process into a **Linear (N)** operation by trading a tiny amount of memory for a massive increase in speed.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Visualizing the Tree */}
                        <div className="flex flex-col items-center gap-12 scale-90 origin-top">
                            <button
                                onClick={() => toggleCache(n)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-4 transition-all duration-500 shadow-2xl ${cachedNodes.has(n) ? 'bg-purple-600 border-purple-400 scale-110' : 'bg-green-600 border-green-400 hover:scale-105 animate-pulse'}`}
                            >
                                F{n}
                            </button>

                            <div className="flex gap-24 relative">
                                {[n - 1, n - 2].map((val, i) => {
                                    const isParentCached = cachedNodes.has(n);
                                    const isSelfCached = cachedNodes.has(val);
                                    return (
                                        <div key={i} className={`flex flex-col items-center gap-10 relative transition-all duration-700 ${isParentCached || (isAutoSolving && cachedNodes.has(val)) ? 'opacity-30 scale-90 grayscale' : 'opacity-100'}`}>
                                            <div className="absolute -top-10 h-10 w-1 bg-gradient-to-b from-white/20 to-transparent" />
                                            <button
                                                onClick={() => toggleCache(val)}
                                                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border-2 transition-all duration-500 ${isSelfCached ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-green-500 border-green-300 hover:bg-green-400'}`}
                                            >
                                                F{val}
                                            </button>

                                            {!isSelfCached && val > 2 && (
                                                <div className="flex gap-12">
                                                    {[val - 1, val - 2].map((sub, j) => {
                                                        const isSubCached = cachedNodes.has(sub);
                                                        return (
                                                            <div key={j} className="flex flex-col items-center relative">
                                                                <div className="absolute -top-8 h-8 w-0.5 bg-white/10" />
                                                                <button
                                                                    onClick={() => toggleCache(sub)}
                                                                    className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center font-bold border ${isSubCached ? 'bg-purple-900 border-purple-500 text-purple-200' : 'bg-green-800 border-green-600 text-green-100'}`}
                                                                >
                                                                    F{sub}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center bg-gray-800/50 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-xl">
                                <span className="text-[10px] text-gray-400">PROBLEM SIZE</span>
                                <input type="range" min="3" max="8" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-20 h-1 bg-green-600 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-xs font-mono font-bold text-white">{n}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCachedNodes(new Set())} className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition font-bold text-xs uppercase tracking-tight border border-white/5 text-gray-400">Reset System</button>
                            <button
                                onClick={() => setIsAutoSolving(!isAutoSolving)}
                                className={`px-8 py-2.5 rounded-xl transition font-black text-xs uppercase tracking-widest shadow-lg ${isAutoSolving ? 'bg-purple-600' : 'bg-green-600'}`}
                            >
                                {isAutoSolving ? 'Solver Active' : 'Start Calculation'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================
// ============================================
// MAIN PAGE COMPONENT
// ============================================
const InteractiveSimulators = () => {
    const [selectedId, setSelectedId] = useState<SimulatorId | null>(null);
    const [activeTab, setActiveTab] = useState<'infographic' | 'simulator'>('infographic');
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        const newMuted = sounds.toggleMute();
        setIsMuted(newMuted);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedId]);

    const activeSim = SIMULATORS.find(s => s.id === selectedId);

    if (activeSim) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedId(null)}
                                className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition text-gray-600"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                    {activeSim.emoji} {activeSim.name}
                                </h2>
                                <p className="text-gray-500 text-sm">{activeSim.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Mute Toggle */}
                            <button
                                onClick={toggleMute}
                                className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition text-gray-600"
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>

                            {/* Mode Toggle */}
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setActiveTab('infographic')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'infographic' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Infographic
                                </button>
                                <button
                                    onClick={() => setActiveTab('simulator')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${activeTab === 'simulator' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Activity className="w-4 h-4" />
                                    Simulator
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-white min-h-[600px] relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        {/* Content based on ID */}
                        {selectedId === 'probability' ? (
                            <ProbabilitySimulator mode={activeTab} />
                        ) : selectedId === 'electromagnetism' ? (
                            <ElectromagnetismSimulator mode={activeTab} />
                        ) : selectedId === 'dynamic-programming' ? (
                            <DPSimulator mode={activeTab} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                                    🚧
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Simulator Under Construction</h3>
                                <p className="text-gray-500 max-w-sm">
                                    We're using AI to generate high-fidelity infographics and physics engines for {activeSim.name}. Check back shortly!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        Interactive Simulators
                    </h1>
                    <p className="text-gray-500 font-medium">Concept mapping with AI infographics and high-fidelity physics simulations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SIMULATORS.map(sim => (
                        <button
                            key={sim.id}
                            onClick={() => setSelectedId(sim.id)}
                            className="group relative bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 text-left border border-white hover:scale-[1.02] flex flex-col h-full overflow-hidden"
                        >
                            {/* Hover background effect */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${sim.color}-500 opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 blur-2xl transition-opacity duration-500`}></div>

                            <div className="mb-6 text-5xl group-hover:scale-110 transition-transform duration-500 transform-gpu">{sim.emoji}</div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                                {sim.name}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                {sim.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Infographic</span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Simulator</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <Activity className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Info Section - Corporate Clean Design */}
                <div
                    className="mt-64 p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden"
                    style={{
                        backgroundColor: '#0078D4',
                        color: '#ffffff'
                    }}
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-6 uppercase tracking-wide" style={{ color: '#ffffff' }}>
                            HOW IT WORKS
                        </h2>

                        <p className="text-base leading-relaxed mb-8" style={{ color: '#ffffff', lineHeight: '1.7', fontSize: '16px' }}>
                            We've combined Gemini 2.0 visualization logic with a custom physics engine. First, review the{' '}
                            <span
                                className="inline-block mx-1 px-3 py-1 rounded font-bold"
                                style={{
                                    backgroundColor: '#FFC107',
                                    color: '#000000'
                                }}
                            >
                                📊 Infographic
                            </span>{' '}
                            to understand the core principle, then switch to{' '}
                            <span
                                className="inline-block mx-1 px-3 py-1 rounded font-bold"
                                style={{
                                    backgroundColor: '#FFC107',
                                    color: '#000000'
                                }}
                            >
                                ⚡ Simulator Mode
                            </span>{' '}
                            to experiment with variables and see real-time outcomes.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 items-center mt-8">
                            <button
                                className="px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                                style={{
                                    backgroundColor: '#00BCD4',
                                    color: '#ffffff',
                                    border: 'none'
                                }}
                            >
                                VISUAL LEARNING
                            </button>
                            <button
                                className="px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                                style={{
                                    backgroundColor: '#00BCD4',
                                    color: '#ffffff',
                                    border: 'none'
                                }}
                            >
                                TACTICAL HANDS-ON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveSimulators;

