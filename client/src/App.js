import './App.css';
import Home from './pages/Home';
import TypingResults from './pages/TypingResults';
import LoginAndRegister from './pages/LoginAndRegister';
import UserProfile from './pages/UserProfile';
import RaceStarting from './pages/RaceStarting';
import Race from './pages/Race';
import RaceResults from './pages/RaceResults';

import NavBar from './components/NavBar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/typingresults" element={<TypingResults />} />
        <Route path="/loginandregister" element={<LoginAndRegister />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/racestarting" element={<RaceStarting />} />
        <Route path="/race" element={<Race />} />
        <Route path="/raceresults" element={<RaceResults />} />
      </Routes>
    </Router>
  );
}

export default App;