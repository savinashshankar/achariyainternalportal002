import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import POCGallery from './pages/POCGallery';
import Dashboard from './pages/Dashboard';
import Intake from './pages/Intake';
import SLAMonitor from './pages/SLAMonitor';
import TaskBoard from './pages/TaskBoard';
import ParentPortal from './pages/ParentPortal';
import VisitBooking from './pages/VisitBooking';
import FunnelVisualizer from './pages/FunnelVisualizer';
import ReferralTracker from './pages/ReferralTracker';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import VisionShell from './pages/VisionShell';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<POCGallery />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/sla-monitor" element={<SLAMonitor />} />
        <Route path="/task-board" element={<TaskBoard />} />
        <Route path="/parent-portal" element={<ParentPortal />} />
        <Route path="/visit-booking" element={<VisitBooking />} />
        <Route path="/funnel" element={<FunnelVisualizer />} />
        <Route path="/referrals" element={<ReferralTracker />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/vision" element={<VisionShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
