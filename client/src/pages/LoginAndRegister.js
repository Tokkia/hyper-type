import React, { useState } from 'react';
import axios from 'axios';
import { FaRegUser } from "react-icons/fa";

export default function LoginAndRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';

    try {
      const res = await axios.post(`http://localhost:5001/api/auth/${endpoint}`, form);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        alert('login successful!');
        
      } else {
        alert('Signup successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaRegUser />
        {isLogin ? 'login' : 'register'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="username"
          className="border p-2 font-bold border-overlay bg-overlay text-accent"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="border p-2 font-bold border-overlay bg-overlay text-accent"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-accent text-overlay font-bold p-2 rounded">
          {isLogin ? 'login' : 'register'}
        </button>
      </form>
      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-accentText mt-4 cursor-pointer"
      >
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </p>
    </div>
  );
}