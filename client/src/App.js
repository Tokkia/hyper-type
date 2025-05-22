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

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/loginandregister" replace />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/loginandregister" replace />} />
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