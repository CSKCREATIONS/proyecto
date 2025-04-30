import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import NavAgendar from '../components/NavAgendar';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';
import Persona from '../components/Persona'

export default function AgendarVenta() {
  

  return (
    <div>
      <Fijo />
      <div className="content">

        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo2
            titulo='Agendar pedido'
            
          />
          <NavAgendar/>
          <Persona/>
          
           
            
          
        </div>

      </div>
    </div>
  )
}
