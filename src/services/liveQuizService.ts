// Live Quiz Service - Firebase operations
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types for Live Quiz
export interface LiveQuizSession {
    id?: string;
    quizId: string;
    quizTitle: string;
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string;
    startTime: Timestamp;
    endTime: Timestamp;
    duration: number; // in seconds (default: 120)
    sessionSeed: string; // for randomization
    status: 'pending' | 'active' | 'completed';
    questionCount: number;
    totalStudents?: number;
    submittedCount?: number;
}

export interface LiveQuizAttempt {
    id?: string;
    sessionId: string;
    studentId: string;
    studentName: string;
    answers: number[]; // array of selected option indexes
    score: number;
    timeTakenMs: number;
    submitTime: Timestamp;
    isLate: boolean;
    questionOrder: number[]; // shuffled question order for this student
    optionOrders: number[][]; // shuffled option orders per question
}

// Generate session seed for randomization
function generateSessionSeed(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Teacher: Start a new live quiz session
 */
export async function startLiveQuizSession(params: {
    quizId: string;
    quizTitle: string;
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string;
    duration: number;
    questionCount: number;
}): Promise<string> {
    try {
        const now = Timestamp.now();
        const endTime = Timestamp.fromMillis(now.toMillis() + params.duration * 1000);

        const sessionData: Omit<LiveQuizSession, 'id'> = {
            quizId: params.quizId,
            quizTitle: params.quizTitle,
            classId: params.classId,
            className: params.className,
            teacherId: params.teacherId,
            teacherName: params.teacherName,
            startTime: now,
            endTime: endTime,
            duration: params.duration,
            sessionSeed: generateSessionSeed(),
            status: 'active',
            questionCount: params.questionCount,
            totalStudents: 0,
            submittedCount: 0
        };

        const docRef = await addDoc(collection(db, 'liveQuizSessions'), sessionData);
        return docRef.id;
    } catch (error) {
        console.error('Error starting live quiz:', error);
        throw error;
    }
}

/**
 * Student: Get active quiz for their class
 */
export async function getActiveQuizForClass(classId: string): Promise<LiveQuizSession | null> {
    try {
        const q = query(
            collection(db, 'liveQuizSessions'),
            where('classId', '==', classId),
            where('status', '==', 'active')
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as LiveQuizSession;
    } catch (error) {
        console.error('Error getting active quiz:', error);
        return null;
    }
}

/**
 * Student: Listen for active quiz in real-time
 */
export function listenForActiveQuiz(
    classId: string,
    callback: (session: LiveQuizSession | null) => void
): () => void {
    const q = query(
        collection(db, 'liveQuizSessions'),
        where('classId', '==', classId),
        where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
            callback(null);
        } else {
            const doc = querySnapshot.docs[0];
            callback({ id: doc.id, ...doc.data() } as LiveQuizSession);
        }
    });

    return unsubscribe;
}

/**
 * Student: Submit quiz attempt
 */
export async function submitQuizAttempt(attempt: Omit<LiveQuizAttempt, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'liveQuizAttempts'), {
            ...attempt,
            submitTime: serverTimestamp()
        });

        // Update session submitted count
        const session = await getSessionById(attempt.sessionId);
        if (session?.id) {
            await updateDoc(doc(db, 'liveQuizSessions', session.id), {
                submittedCount: (session.submittedCount || 0) + 1
            });
        }

        return docRef.id;
    } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        throw error;
    }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string): Promise<LiveQuizSession | null> {
    try {
        const docSnap = await getDocs(query(collection(db, 'liveQuizSessions'), where('__name__', '==', sessionId)));

        if (docSnap.empty) {
            return null;
        }

        const document = docSnap.docs[0];
        return { id: document.id, ...document.data() } as LiveQuizSession;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

/**
 * Teacher: Get all attempts for a session (for leaderboard)
 */
export async function getSessionAttempts(sessionId: string): Promise<LiveQuizAttempt[]> {
    try {
        const q = query(
            collection(db, 'liveQuizAttempts'),
            where('sessionId', '==', sessionId)
        );

        const querySnapshot = await getDocs(q);
        const attempts: LiveQuizAttempt[] = [];

        querySnapshot.forEach((doc) => {
            attempts.push({ id: doc.id, ...doc.data() } as LiveQuizAttempt);
        });

        // Sort by score (desc), then by time (asc)
        attempts.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.timeTakenMs - b.timeTakenMs;
        });

        return attempts;
    } catch (error) {
        console.error('Error getting session attempts:', error);
        return [];
    }
}

/**
 * Teacher: End quiz session
 */
export async function endQuizSession(sessionId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'liveQuizSessions', sessionId), {
            status: 'completed',
            endTime: serverTimestamp()
        });
    } catch (error) {
        console.error('Error ending quiz session:', error);
        throw error;
    }
}
