import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import MultiTarget from './pages/MultiTarget';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-warm-bg relative">
        <Header />
        <main className="relative">
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
