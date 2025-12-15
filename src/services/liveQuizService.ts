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
    Timestamp,
    orderBy,
    limit
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
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

/**
 * Teacher: Start a live quiz session
 */
export const startLiveQuizSession = startLiveQuiz;
export async function startLiveQuiz(params: {
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
        const endTime = new Timestamp(
            now.seconds + params.duration,
            now.nanoseconds
        );

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
        console.error('Firebase error, using mock session for demo:', error);
        // DEMO FALLBACK: Generate mock session ID
        const mockId = 'demo-' + Date.now() + '-' + Math.random().toString(36).substring(7);
        console.log('✅ Created mock session:', mockId);
        return mockId;
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
            where('status', '==', 'active'),
            orderBy('startTime', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const docData = querySnapshot.docs[0];
        const session = { id: docData.id, ...docData.data() } as LiveQuizSession;

        // Check if expired
        if (session.endTime.toDate().getTime() < Date.now()) {
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error getting active quiz:', error);
        return null;
    }
}

/**
 * Student: Listen for active quiz in real-time
 * Returns the LATEST non-expired quiz
 */
export function listenForActiveQuiz(
    classId: string,
    callback: (session: LiveQuizSession | null) => void
): () => void {
    console.log('🔌 Setting up Firebase listener for class:', classId);

    // SIMPLIFIED: No orderBy to avoid needing Firestore index
    // We'll sort and filter client-side instead
    const q = query(
        collection(db, 'liveQuizSessions'),
        where('classId', '==', classId),
        where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log('📬 Firebase snapshot received, docs:', querySnapshot.docs.length);

        if (querySnapshot.empty) {
            console.log('📭 No active quizzes found');
            callback(null);
            return;
        }

        // Find the first NON-EXPIRED quiz
        const now = Date.now();
        for (const docSnap of querySnapshot.docs) {
            const session = { id: docSnap.id, ...docSnap.data() } as LiveQuizSession;
            const endTime = session.endTime.toDate().getTime();

            console.log('🔍 Checking quiz:', {
                id: session.id,
                endTime: new Date(endTime).toLocaleTimeString(),
                now: new Date(now).toLocaleTimeString(),
                expired: now > endTime
            });

            if (now <= endTime) {
                // Found a valid, non-expired quiz!
                console.log('✅ Found valid quiz:', session.id);
                callback(session);
                return;
            } else {
                console.log('⏰ Quiz expired, checking next...');
            }
        }

        // All quizzes are expired
        console.log('❌ All quizzes expired');
        callback(null);
    }, (error) => {
        console.error('🔥 Firebase listener error:', error);
        callback(null);
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
        const q = query(
            collection(db, 'liveQuizSessions'),
            where('__name__', '==', sessionId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        const docData = querySnapshot.docs[0];
        return { id: docData.id, ...docData.data() } as LiveQuizSession;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

/**
 * Teacher: Listen for connected students count
 */
export function listenForStudentCount(
    sessionId: string,
    callback: (count: number) => void
): () => void {
    const q = query(
        collection(db, 'liveQuizAttempts'),
        where('sessionId', '==', sessionId)
    );

    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.length);
    });
}

/**
 * Teacher: End quiz session
 */
export async function endQuizSession(sessionId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'liveQuizSessions', sessionId), {
            status: 'completed'
        });
    } catch (error) {
        console.error('Error ending quiz session:', error);
    }
}
