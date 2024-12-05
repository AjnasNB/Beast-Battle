import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'
function App() {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Header account={account} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage setAccount={setAccount} />} />
            <Route path="/home" element={<HomePage account={account} />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

