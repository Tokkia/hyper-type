import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import RaceRoom from './pages/RaceRoom';
import UserProfile from './pages/UserProfile';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/race" element={<RaceRoom />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
    </Router>
  );
}

export default App;
