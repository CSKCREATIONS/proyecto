import React from 'react'
import '../App.css'
import Fijo from '../components/Fijo'
import ContenedorModuloUsuarios from '../components/ContenedorModuloUsuarios'
import ContenedorModuloSIG from '../components/ContenedorModuloSIG'
import ContenedorModuloVentas from '../components/ContenedorModuloVentas'

export default function Home() {
  return (
    <div>
      <Fijo />
      <div class="content">

        <ContenedorModuloUsuarios
        />
        <ContenedorModuloSIG/>
        <ContenedorModuloVentas/>
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
