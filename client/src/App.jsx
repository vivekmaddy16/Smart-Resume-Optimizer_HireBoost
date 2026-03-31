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
        {/* Background glows */}
        <div className="hero-glow bg-primary-600 top-[-200px] left-[-200px]" />
        <div className="hero-glow bg-accent-500 bottom-[-200px] right-[-200px]" />
        
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
