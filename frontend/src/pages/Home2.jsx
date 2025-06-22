import React from 'react'
import '../App.css'
import Fijo2 from '../components/Fijo2'
import ContenedorModuloUsuarios from '../components/ContenedorModuloUsuarios'
import ContenedorModuloSIG from '../components/ContenedorModuloSIG'
import ContenedorModuloVentas from '../components/ContenedorModuloVentas'


export default function Home() {
  return (
    <div>
      <Fijo2 />
      <div class="content">
        <div className="contenido-modulo">
        <ContenedorModuloVentas/>
        </div>

        
        

      </div>

    </div>
  )
}
