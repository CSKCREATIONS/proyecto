import React from 'react'
import '../App.css'
import Fijo1 from '../components/Fijo1'
import ContenedorModuloUsuarios from '../components/ContenedorModuloUsuarios'
import ContenedorModuloSIG from '../components/ContenedorModuloSIG'
import ContenedorModuloVentas from '../components/ContenedorModuloVentas'


export default function Home() {
  return (
    <div>
      <Fijo1 />
      <div class="content">
        <div className="contenido-modulo">
        <ContenedorModuloSIG/>
        
        </div>

        
        

      </div>

    </div>
  )
}
