import Footer from '@/components/footer'
import Lightning from '@/components/lightning'
import Navbar from '@/components/navbar'
import React from 'react'

export default function Role() {
  return (
    <section>
        <Navbar />
        <div style={{ width: '100%', height: '1000px', position: 'relative' }}>
          <Lightning
            hue={220}
            xOffset={0}
            speed={1}
            intensity={1}
            size={1}
          />
        </div>
        <Footer />
    </section>
  )
}
