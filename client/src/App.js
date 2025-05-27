import React, { useEffect, useState } from 'react';

import './App.css';
import Home from './pages/Home';
import TypingResults from './pages/TypingResults';
import LoginAndRegister from './pages/LoginAndRegister';
import UserProfile from './pages/UserProfile';
import RaceStarting from './pages/RaceStarting';
import Race from './pages/Race';
import RaceResults from './pages/RaceResults';
import NavBar from './components/NavBar';
import TypingBox from './components/TypingBox';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get('http://localhost:5001/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Token invalid or expired:', err.response?.data?.message);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/loginandregister" replace />} />
        <Route path="/hyper-type" element={isLoggedIn ? <Home /> : <Navigate to="/loginandregister" replace />} />
        <Route path="/loginandregister" element={!isLoggedIn ? <LoginAndRegister /> : <Navigate to="/" replace />} />
        <Route path="/typingresults" element={<TypingResults />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/racestarting" element={<RaceStarting />} />
        <Route path="/race" element={<Race />} />
        <Route path="/raceresults" element={<RaceResults />} />
        <Route path="/typing" element={<TypingBox />} />
      </Routes>
    </Router>
  );
}

export default App;