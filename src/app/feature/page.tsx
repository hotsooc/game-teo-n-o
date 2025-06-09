import DragDropTable from '@/components/dragdroptable'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

export default function page() {
  return (
    <section>
        <Navbar />
        <div>
            <DragDropTable />
        </div>
        <Footer />
    </section>
  )
}
