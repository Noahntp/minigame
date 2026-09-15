import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MiniGamesPage } from './pages/MiniGamesPage';
import { GamePage } from './pages/GamePage';
import { RewardsPage } from './pages/RewardsPage';
import { HistoryPage } from './pages/HistoryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#06080d] text-[#fcfbfa] flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#06080d]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/mini-games" replace />} />
            <Route path="/mini-games" element={<MiniGamesPage />} />
            <Route path="/mini-games/:slug" element={<GamePage />} />
            <Route path="/mini-games/:slug/play" element={<GamePage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/mini-games/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/mini-games" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
