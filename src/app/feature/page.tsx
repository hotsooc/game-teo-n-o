import DragDropTable from '@/components/dragdroptable'
import Footer from '@/components/footer'
import Iridescence from '@/components/iredescence'
import Navbar from '@/components/navbar'
import React from 'react'

export default function Feature() {
  return (
    <section>
      <Navbar />
      <div style={{ width: '100%', height: '1000px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
        }}>
            <Iridescence />
        </div>
        {/* Nội dung DragDropTable */}
        <div style={{ position: 'relative', zIndex: 1 }}>
            <DragDropTable />
        </div>
        </div>
      <Footer />
    </section>
  )
}