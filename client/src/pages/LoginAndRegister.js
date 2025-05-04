import React, { useState } from 'react';
import axios from 'axios';
import { FaRegUser } from "react-icons/fa";

export default function LoginAndRegister() {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username); // <-- add this
      alert('Login successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/signup', registerForm);
      alert('Signup successful! You can now log in.');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="rounded-2xl mx-auto flex flex-col lg:flex-row items-center justify-center sm:gap-6 lg:gap-32 mt-8 lg:mt-40">
      {/* Register Form */}
      <div className="p-6 max-w-md">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-4">
          <FaRegUser className="text-5xl font-bold"/>
          Register
        </h2>
        <form onSubmit={handleRegisterSubmit} className="w-96 text-lg flex flex-col gap-4">
          <input
            name="username"
            placeholder="username"
            className="px-8 border p-3 rounded-2xl border-overlay bg-overlay text-accent"
            value={registerForm.username}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            className="px-8 border p-3 rounded-2xl border-overlay bg-overlay text-accent"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            className="px-8 border p-3 rounded-2xl border-overlay bg-overlay text-accent"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit" className="text-2xl bg-accent text-overlay font-bold p-3 rounded-2xl">
            register
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className="p-6 max-w-md">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-4">
          <FaRegUser className="text-5xl font-bold"/>
          Login
        </h2>
        <form onSubmit={handleLoginSubmit} className="w-96 text-lg flex flex-col gap-4">
          <input
            name="username"
            placeholder="username"
            className="px-8 p-3 border rounded-2xl border-overlay bg-overlay text-accent"
            value={loginForm.username}
            onChange={handleLoginChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            className="px-8 border p-3 rounded-2xl border-overlay bg-overlay text-accent"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit" className="text-xl bg-accent text-overlay font-bold p-3 rounded-2xl">
            login
          </button>
        </form>
      </div>
    </div>
  );
}