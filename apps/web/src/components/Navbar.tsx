'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    setIsLoggedIn(!!token);
    setUserName(name || '');
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    router.push('/');
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">AyuSangh</span>
          <span className="text-xs text-gray-500 hidden sm:block">Healthcare Discovery</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            Search
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 hidden sm:block">
                Hi, {userName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
