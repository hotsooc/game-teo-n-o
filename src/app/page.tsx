"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';


     interface User {
       name: string;
       choices: string[];
     }

     export default function Home() {
       const [data, setData] = useState<{ users: Record<string, User> }>({ users: {} });
       const [teams, setTeams] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });
       const [error, setError] = useState<string | null>(null);
       const [loading, setLoading] = useState<boolean>(true);

       // Hàm lấy dữ liệu từ API route
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
           console.log('Dữ liệu từ API:', response.data);
           setData(response.data);
           setError(null);
         } catch (error: any) {
           console.error('Lỗi khi lấy dữ liệu:', error.response?.data || error.message);
           setError(`Không thể tải dữ liệu: ${error.message}`);
         } finally {
           setLoading(false);
         }
       };

       // Lấy dữ liệu khi mount và polling mỗi 5 phút
       useEffect(() => {
         fetchData(); // Lấy dữ liệu lần đầu
         const interval = setInterval(() => {
           console.log('Đang polling dữ liệu từ API...');
           fetchData();
         }, 300000); // Polling mỗi 5 phút
         return () => clearInterval(interval); // Dọn dẹp khi component unmount
       }, []);

       const makeTeams = () => {
         const joined = Object.values(data.users)
           .filter(user => user.choices.includes('✅'))
           .map(user => user.name);
         const shuffled = [...joined].sort(() => Math.random() - 0.5);
         const mid = Math.ceil(shuffled.length / 2);
         setTeams({
           team1: shuffled.slice(0, mid),
           team2: shuffled.slice(mid),
         });
       };

       const joined = Object.values(data.users).filter(user => user.choices.includes('✅')).map(user => user.name);
       const notJoined = Object.values(data.users).filter(user => user.choices.includes('❌')).map(user => user.name);

       return (
         <div className="min-h-screen bg-gray-100">
           <Navbar />
           <div className="p-6">
             <h1 className="text-3xl font-bold text-center mb-6">Team</h1>

             {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
             {error && <p className="text-center text-red-500">{error}</p>}

             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-green-100 p-4 rounded shadow">
                 <h2 className="text-xl font-semibold mb-4">Tham gia</h2>
                 <ul className="list-disc pl-5">
                   {joined.length ? joined.map((name, i) => <li key={i}>{name}</li>) : <li>Chưa có ai</li>}
                 </ul>
               </div>
               <div className="bg-red-100 p-4 rounded shadow">
                 <h2 className="text-xl font-semibold mb-4">Không tham gia</h2>
                 <ul className="list-disc pl-5">
                   {notJoined.length ? notJoined.map((name, i) => <li key={i}>{name}</li>) : <li>Chưa có ai</li>}
                 </ul>
               </div>
             </div>

             <div className="max-w-4xl mx-auto mt-6">
               <button
                 onClick={makeTeams}
                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                 disabled={loading}
               >
                 Xếp đội
               </button>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                 <div className="bg-white p-4 rounded shadow">
                   <h2 className="text-xl font-semibold mb-4">Team 1</h2>
                   <ul className="list-disc pl-5">
                     {teams.team1.length > 0 ? teams.team1.map((name, i) => <li key={i}>{name}</li>) : <li>Chưa có ai</li>}
                   </ul>
                 </div>
                 <div className="bg-white p-4 shadow rounded">
                   <h2 className="text-xl font-semibold mb-4">Team 2</h2>
                   <ul className="list-disc pl-5">
                     {teams.team2.length > 0 ? teams.team2.map((name, i) => <li key={i}>{name}</li>) : <li>Chưa có ai</li>}
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         </div>
       );
     }