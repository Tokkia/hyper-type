import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { PiGameController } from "react-icons/pi";
import { TbKeyboard } from "react-icons/tb";
import logo from '../assets/logo.png';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Close dropdown on outside click
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
    navigate('/login');
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
        {isLoggedIn && <span className="text-accentText text-sm font-bold">{username}</span>}
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
                User Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-left hover:bg-accent hover:text-overlay rounded-b-xl"
              >
                Sign Out
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}