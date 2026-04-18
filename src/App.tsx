import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DisclaimerBanner from './components/DisclaimerBanner';
import Header from './components/Header';
import Home from './pages/Home';
import Upgrade from './pages/Upgrade';
import Submit from './pages/Submit';
import Saved from './pages/Saved';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] grain-overlay">
        <DisclaimerBanner />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
        <footer className="border-t border-gray-900 mt-20 py-8 text-center">
          <p className="font-mono text-gray-700 text-xs uppercase tracking-widest mb-1">
            THE CONSPIRACY NEWS — Est. 1776
          </p>
          <p className="font-mono text-gray-800 text-[10px]">
            100% satire. 100% fictional. 0% real. They want you to think otherwise.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
