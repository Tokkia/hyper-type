import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { PiGameController } from "react-icons/pi";
import { TbKeyboard } from "react-icons/tb";
import logo from '../assets/logo.png';
import axios from 'axios';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
  
      if (!token || !storedUsername) {
        setIsLoggedIn(false);
        setUsername('');
        return;
      }
  
      try {
        await axios.get('http://localhost:5001/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
      }
    };
  
    validateToken();
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/loginandregister');
    navigate(0);
  };

  return (
    <nav className="flex justify-between items-center py-5 px-10">
      <ul className="flex items-center gap-8">
        <li>
          <Link to="/" className="">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>
        </li>
        <li>
          <Link to="/" className="text-accent hover:text-accentText">
            <TbKeyboard className="text-3xl font-bold" />
          </Link>
        </li>
        <li>
          <Link to="/racestarting" className="text-accent hover:text-accentText">
            <PiGameController className="text-3xl font-bold"/>
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-4">
        {isLoggedIn && <span className="text-accentText text-md font-medium">{username}</span>}
        <li ref={dropdownRef} className="relative">
          {isLoggedIn ? (
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="text-accent text-xl hover:text-accentText"
            >
              <FaRegUser className="text-3xl font-bold" />
            </button>
          ) : (
            <Link to="/loginandregister" className="text-accent hover:text-accentText">
              <FaRegUser className="text-2xl font-bold" />
            </Link>
          )}

          {isLoggedIn && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-overlay text-accentText rounded-xl shadow-lg z-10 flex flex-col">
              <Link
                to="/userprofile"
                className="px-4 py-2 hover:bg-accent hover:text-overlay rounded-t-xl"
                onClick={() => setDropdownOpen(false)}
              >
                user profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-left hover:bg-accent hover:text-overlay rounded-b-xl"
              >
                sign out
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}