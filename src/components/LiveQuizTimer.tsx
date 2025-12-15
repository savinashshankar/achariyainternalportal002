// Live Quiz Timer Component - with visibility change handling
import { useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface LiveQuizTimerProps {
    endTime: Date;
    onTimeUp?: () => void;
}

const LiveQuizTimer = ({ endTime, onTimeUp }: LiveQuizTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const calculateTimeLeft = useCallback(() => {
        const now = Date.now();
        const end = endTime.getTime();
        const diff = Math.max(0, end - now);
        return Math.floor(diff / 1000);
    }, [endTime]);

    useEffect(() => {
        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft === 0 && onTimeUp) {
                onTimeUp();
                clearInterval(interval);
            }
        }, 1000);

        // CRITICAL: Recalculate immediately when tab becomes visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const newTimeLeft = calculateTimeLeft();
                setTimeLeft(newTimeLeft);

                // If time is up while tab was hidden, trigger callback
                if (newTimeLeft === 0 && onTimeUp) {
                    onTimeUp();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [endTime, onTimeUp, calculateTimeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isLowTime = timeLeft <= 30;
    const isVeryLowTime = timeLeft <= 10;

    return (
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-2xl transition ${isVeryLowTime
            ? 'bg-red-50 text-red-600 animate-pulse'
            : isLowTime
                ? 'bg-orange-50 text-orange-600'
                : 'bg-blue-50 text-blue-600'
            }`}>
            <Clock className={`w-8 h-8 ${isVeryLowTime ? 'animate-bounce' : ''}`} />
            <span className="font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};

export default LiveQuizTimer;
