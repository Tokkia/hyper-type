import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 

export default function NavBar() {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex justify-around">
        <li>
          <Link to="/" className="text-white text-xl hover:text-blue-300">Home</Link>
        </li>
        <li>
          <Link to="/typingresults" className="text-white text-xl hover:text-blue-300">Typing Results</Link>
        </li>
        <li>
          <Link to="/loginandregister" className="text-white text-xl hover:text-blue-300">Login/Register</Link>
        </li>
        <li>
          <Link to="/userprofile" className="text-white text-xl hover:text-blue-300">User Profile</Link>
        </li>
        <li>
          <Link to="/racestarting" className="text-white text-xl hover:text-blue-300">Race Starting</Link>
        </li>
        <li>
          <Link to="/race" className="text-white text-xl hover:text-blue-300">Race</Link>
        </li>
        <li>
          <Link to="/raceresults" className="text-white text-xl hover:text-blue-300">Race Results</Link>
        </li>
      </ul>
    </nav>
  );
}