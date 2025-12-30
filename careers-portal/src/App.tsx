import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CareersHome from './pages/CareersHome';
import CategoryOpenings from './pages/CategoryOpenings';
import ThankYou from './pages/ThankYou';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CareersHome />} />
        <Route path="/school" element={<CategoryOpenings category="School" />} />
        <Route path="/college" element={<CategoryOpenings category="College" />} />
        <Route path="/corporate" element={<CategoryOpenings category="Corporate" />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
