"use client";

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Navbar from '@/components/navbar';
import JoinTable from '@/components/table';
import Footer from '@/components/footer';

interface User {
  name: string;
  choices: string[];
}

export default function Home() {
  const [data, setData] = useState<{ users: Record<string, User> }>({ users: {} });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showJoined, setShowJoined] = useState(false);
  const [showNotJoined, setShowNotJoined] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user_choices', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      setData(response.data);
      setError(null);
    } catch (error: unknown) {
      const err = error as AxiosError;
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const joined = Object.values(data.users)
    .filter(user => user.choices.includes('✅'))
    .map(user => user.name);
  const notJoined = Object.values(data.users)
    .filter(user => user.choices.includes('❌'))
    .map(user => user.name);

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* <div className="p-6 bg-[url('/image/1st_anniversary.webp')] bg-cover bg-center"> */}
      <div className="p-6 bg-[url('/image/5818658.jpg')] bg-fixer bg-size-[auto_500px] bg-center">
      {/* <div className='p-6'> */}
        <h1 className="text-3xl font-bold w-full text-shadow text-center mb-6">Những người tham gia</h1>

        {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tham gia */}
          <div className="bg-gradient-to-r from-green-500 to-green-200 p-4 rounded shadow">
            <button
              className={`w-full text-left font-semibold text-xl cursor-pointer mb-2 ${
                joined.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-green-700'
              }`}
              disabled={joined.length === 0}
              onClick={() => setShowJoined(!showJoined)}
            >
              ✅ Tham gia ({joined.length})
            </button>
            {showJoined && (
              <ul className="list-disc pl-5">
                {joined.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Không tham gia */}
          <div className="bg-gradient-to-l from-red-500 to-red-200 p-4 rounded shadow">
            <button
              className={`w-full text-left font-semibold cursor-pointer text-xl mb-2 ${
                notJoined.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-700'
              }`}
              disabled={notJoined.length === 0}
              onClick={() => setShowNotJoined(!showNotJoined)}
            >
              ❌ Không tham gia ({notJoined.length})
            </button>
            {showNotJoined && (
              <ul className="list-disc pl-5">
                {notJoined.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className='mt-3'>
          <JoinTable />
        </div>
      </div>
      <Footer />
    </div>
  );
}