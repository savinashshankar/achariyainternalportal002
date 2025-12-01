import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeacherCompletion from './pages/teacher-completion/TeacherCompletion';
import StudentCompletion from './pages/student-completion/StudentCompletion';
import CoursesAndLessons from './pages/courses/CoursesAndLessons';

// Placeholder component
const Placeholder = ({ title }: { title: string }) => (
    <div className="bg-white rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">This page is under development</p>
    </div>
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/teacher-completion" element={<TeacherCompletion />} />
                <Route path="/student-completion" element={<StudentCompletion />} />
                <Route path="/courses" element={<CoursesAndLessons />} />
                <Route path="/reports" element={<Placeholder title="Reports" />} />
                <Route path="/settings" element={<Placeholder title="Settings" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
