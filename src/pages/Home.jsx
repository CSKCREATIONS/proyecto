import React from 'react'
import '../App.css'
import Fijo from '../components/Fijo'
import ContenedorModulo from '../components/ContenedorModulo'

export default function Home() {
  return (
    <div>
      <Fijo />
      <div class="content">

        <ContenedorModulo 
          modulo = 'Usuarios'
        />
        <ContenedorModulo 
          modulo = 'SIG'
        />
        <ContenedorModulo 
          modulo = 'Ventas'
        />
        <iframe
          src="/propuesta_tecnica.pdf"
          width="80%"
          height="600px"
          title="PDF Viewer"
        />

      </div>

    </div>
  )
}
