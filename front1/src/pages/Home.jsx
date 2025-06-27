import React from 'react'
import '../App.css'
import Fijo from '../components/Fijo'
import ContenedorModuloUsuarios from '../components/ContenedorModuloUsuarios'
import ContenedorModuloSIG from '../components/ContenedorModuloSIG'
import ContenedorModuloVentas from '../components/ContenedorModuloVentas'
import ContenedorModuloProductos from '../components/ContenedorModuloProductos'


export default function Home() {
  return (
    <div>
      <Fijo />
      <div class="content">
        <div className="contenido-modulo">
        <ContenedorModuloUsuarios/>
        <ContenedorModuloSIG/>
        <ContenedorModuloProductos/>
        <ContenedorModuloVentas/>
        </div>

        
        

      </div>

    </div>
  )
}
