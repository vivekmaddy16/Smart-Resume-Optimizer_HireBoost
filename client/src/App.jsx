import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import MultiTarget from './pages/MultiTarget';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,231,206,0.08),transparent_34%),linear-gradient(180deg,rgba(8,24,21,0.1),rgba(8,24,21,0.45))]" />
        {/* Background glows */}
        <div className="hero-glow bg-accent-400 top-[-220px] left-[-180px]" />
        <div className="hero-glow bg-primary-400 bottom-[-240px] right-[-160px]" />
        
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/multi-target" element={<MultiTarget />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
