'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth', { action: 'login', email, password });
      localStorage.setItem('token', response.data.token);
      router.push('/post-page');
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">Login to Fliker</h1>
        <input
          className="w-full text-black p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full text-black  p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
