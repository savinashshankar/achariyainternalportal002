import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import Layout from './components/Layout';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentCourseDetail from './pages/student/StudentCourseDetail';
import StudentModuleView from './pages/student/StudentModuleView';
import StudentWalletPage from './pages/student/StudentWalletPage';
import StudentBadgesPage from './pages/student/StudentBadgesPage';
import StudentFAQPage from './pages/student/StudentFAQPage';
import StudentMarketplace from './pages/student/StudentMarketplace';
import StudentLeaderboard from './pages/student/StudentLeaderboard';
import StudentChallenges from './pages/student/StudentChallenges';
import StudentProgress from './pages/student/StudentProgress';
import StudentRivals from './pages/student/StudentRivals';
import StudentPowerUps from './pages/student/StudentPowerUps';
import StudentSocialFeed from './pages/student/StudentSocialFeed';
import StudentQuizPage from './pages/student/StudentQuizPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCoursesPage from './pages/teacher/TeacherCoursesPage';
import TeacherCourseDetail from './pages/teacher/TeacherCourseDetail';
import TeacherStudentDetail from './pages/teacher/TeacherStudentDetail';
import TeacherEvidencePage from './pages/teacher/TeacherEvidencePage';
import TeacherFAQPage from './pages/teacher/TeacherFAQPage';
import TeacherAllStudentsPage from './pages/teacher/TeacherAllStudentsPage';
import TeacherPerformanceBreakdown from './pages/teacher/TeacherPerformanceBreakdown';
import TeacherCreditsPage from './pages/teacher/TeacherCreditsPage';

// Principal Pages
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import PrincipalCourses from './pages/principal/PrincipalCourses';
import PrincipalCourseDetail from './pages/principal/PrincipalCourseDetail';
import PrincipalStudentDetail from './pages/principal/PrincipalStudentDetail';
import PrincipalAllStudents from './pages/principal/PrincipalAllStudents';
import PrincipalAllTeachers from './pages/principal/PrincipalAllTeachers';
import PrincipalFAQPage from './pages/principal/PrincipalFAQPage';
import PrincipalClassAnalytics from './pages/principal/PrincipalClassAnalytics';
import PrincipalStudentActivity from './pages/principal/PrincipalStudentActivity';
import PrincipalSchoolDetail from './pages/principal/PrincipalSchoolDetail';
import PrincipalSystemStats from './pages/principal/PrincipalSystemStats';
import PrincipalEvidenceApproval from './pages/principal/PrincipalEvidenceApproval';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminConfigPage from './pages/admin/AdminConfigPage';
import AdminFAQPage from './pages/admin/AdminFAQPage';
import AdminQuestionBank from './pages/admin/AdminQuestionBank';
import AdminAddUserForm from './pages/admin/AdminAddUserForm';
import AdminEditCourseForm from './pages/admin/AdminEditCourseForm';
import AdminCreateCourseForm from './pages/admin/AdminCreateCourseForm';
import AdminSystemMonitoring from './pages/admin/AdminSystemMonitoring';
import AdminModuleEdit from './pages/admin/AdminModuleEdit';



function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/select-role" element={<RoleSelection />} />

            <Route element={<Layout />}>
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<StudentCourses />} />
                <Route path="/student/course/:courseId" element={<StudentCourseDetail />} />
                <Route path="/student/module/:moduleId" element={<StudentModuleView />} />
                <Route path="/student/quiz/:moduleId" element={<StudentQuizPage />} />
                <Route path="/student/wallet" element={<StudentWalletPage />} />
                <Route path="/student/badges" element={<StudentBadgesPage />} />
                <Route path="/student/marketplace" element={<StudentMarketplace />} />
                <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
                <Route path="/student/challenges" element={<StudentChallenges />} />
                <Route path="/student/progress" element={<StudentProgress />} />
                <Route path="/student/rivals" element={<StudentRivals />} />
                <Route path="/student/powerups" element={<StudentPowerUps />} />
                <Route path="/student/social" element={<StudentSocialFeed />} />
                <Route path="/student/faq" element={<StudentFAQPage />} />

                {/* Teacher Routes */}
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
                <Route path="/teacher/course/:courseId" element={<TeacherCourseDetail />} />
                <Route path="/teacher/student/:studentId" element={<TeacherStudentDetail />} />
                <Route path="/teacher/students" element={<TeacherAllStudentsPage />} />
                <Route path="/teacher/performance" element={<TeacherPerformanceBreakdown />} />
                <Route path="/teacher/credits" element={<TeacherCreditsPage />} />
                <Route path="/teacher/evidence" element={<TeacherEvidencePage />} />
                <Route path="/teacher/faq" element={<TeacherFAQPage />} />

                {/* Principal Routes */}
                <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
                <Route path="/principal/courses" element={<PrincipalCourses />} />
                <Route path="/principal/students" element={<PrincipalAllStudents />} />
                <Route path="/principal/teachers" element={<PrincipalAllTeachers />} />
                <Route path="/principal/course/:courseId" element={<PrincipalCourseDetail />} />
                <Route path="/principal/student/:studentId" element={<PrincipalStudentDetail />} />
                <Route path="/principal/class-analytics" element={<PrincipalClassAnalytics />} />
                <Route path="/principal/student-activity" element={<PrincipalStudentActivity />} />
                <Route path="/principal/school/:schoolId" element={<PrincipalSchoolDetail />} />
                <Route path="/principal/system-stats" element={<PrincipalSystemStats />} />
                <Route path="/principal/evidence" element={<PrincipalEvidenceApproval />} />
                <Route path="/principal/faq" element={<PrincipalFAQPage />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/add" element={<AdminAddUserForm />} />
                <Route path="/admin/courses/create" element={<AdminCreateCourseForm />} />
                <Route path="/admin/courses/edit/:courseId" element={<AdminEditCourseForm />} />
                <Route path="/admin/modules/edit/:moduleId" element={<AdminModuleEdit />} />
                <Route path="/admin/question-bank" element={<AdminQuestionBank />} />
                <Route path="/admin/config" element={<AdminConfigPage />} />
                <Route path="/admin/monitoring" element={<AdminSystemMonitoring />} />
                <Route path="/admin/faq" element={<AdminFAQPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
