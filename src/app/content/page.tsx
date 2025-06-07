import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

export default function Content() {
  return (
    <section>
      <Navbar />
      <div className='bg-gradient-to-t from-sky-300 to-green-100 min-h-screen'>
        <div className='py-8'>
          <div className='flex justify-center mb-6'>
            <span className='text-2xl font-bold'>Danh sách</span>
          </div>
          <div className='grid grid-cols-2 gap-4 items-start justify-center text-center max-w-2xl mx-auto'>
            <div className='grid grid-cols-2 border border-solid border-black rounded-lg bg-amber-50'>
              <div>
                <p className='p-4 font-semibold'>Tên</p>
                <div className='flex flex-col gap-2 p-4'>
                  <button className="bg-blue-200 rounded px-2 py-1 hover:bg-blue-300">User 1</button>
                  <button className="bg-blue-200 rounded px-2 py-1 hover:bg-blue-300">User 2</button>
                </div>
              </div>
              <div>
                <p className='p-4 font-semibold'>Vai trò</p>
                <div className='flex flex-col gap-2 p-4'>
                  <button className="bg-green-200 rounded px-2 py-1 hover:bg-green-300">DPS</button>
                  <button className="bg-green-200 rounded px-2 py-1 hover:bg-green-300">Tank</button>
                  <button className="bg-green-200 rounded px-2 py-1 hover:bg-green-300">Support</button>
                </div>
              </div>
            </div>
            <div>
              <p className='font-semibold'>Hình ảnh minh hoạ</p>
              {/* Thêm hình ảnh nếu muốn */}
              <div className='flex justify-center items-center h-32'>
                {/* <img src="/image/your-image.jpg" alt="minh hoạ" className="h-full object-contain" /> */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  )
}