// Live Quiz Timer Component
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LiveQuizTimerProps {
    endTime: Date;
    onTimeUp?: () => void;
}

const LiveQuizTimer = ({ endTime, onTimeUp }: LiveQuizTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = endTime.getTime();
            const diff = Math.max(0, end - now);
            return Math.floor(diff / 1000); // seconds
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft === 0 && onTimeUp) {
                onTimeUp();
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime, onTimeUp]);

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
