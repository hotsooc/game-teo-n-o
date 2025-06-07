"use client";

import Link from 'next/link';
// import { useState } from 'react';

export default function Navbar() {
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className="bg-fixer p-4 shadow-md transition-opacity duration-300"
      style={{
        backgroundImage: "url('/image/5825038.jpg')",
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center bottom -300px',
        backgroundSize: 'cover',
        // opacity: isHovered ? 0 : 0,
      }}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl text-shadow font-bold">Hero Land - XHCN Guild - Asia(Sea)</h1>
        <div className="space-x-4 font-bold text-shadow">
          <Link href="/" className="hover:underline">Teammate</Link>
          <Link href="/role" className="hover:underline">Role</Link>
          <Link href="/content" className="hover:underline">Content</Link>
        </div>
      </div>
    </nav>
  );
}