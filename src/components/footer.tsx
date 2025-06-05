import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <section id='footer' className='p-4 w-full bg-gradient-to-l from-green-100 to-cyan-200 border-t border-0 border-solid border-black'>
        <div className='flex flex-row items-center justify-between text-1xl p-3'>
            <button className='flex flex-col gap-2'>
                <Link href="/" className='hover:underline cursor-pointer border border-solid border-gray-300 rounded-lg bg-green-50 p-2'> Teammate </Link>
                <Link href="/role" className='hover:underline cursor-pointer border border-solid border-gray-300 rounded-lg bg-green-50 p-2'>Role</Link>
                <Link href="/content" className='hover:underline cursor-pointer border border-solid border-gray-300 rounded-lg bg-green-50 p-2'> Content </Link>
            </button>
            <div>© 2025 Your Company, Inc. All rights reserved.</div>
            <div></div>
        </div>
    </section>
  )
}
