import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { PiGameController } from "react-icons/pi";
import { TbKeyboard } from "react-icons/tb";
import logo from '../assets/logo.png';

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center py-5 px-10">
      <ul className="flex items-center gap-8">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <li>
          <Link to="/" className="text-accent text-xl hover:text-accentText">
            <TbKeyboard />
          </Link>
        </li>
        <li>
          <Link to="/race" className="text-accent text-xl hover:text-accentText">
            <PiGameController />
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-4">
        <li>
          <Link to="/userprofile" className="text-accent text-xl hover:text-blue-300">
            <FaRegUser />
          </Link>
        </li>
      </ul>
    </nav>
  );
}