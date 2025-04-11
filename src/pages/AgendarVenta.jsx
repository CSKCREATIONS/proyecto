import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import NavAgendar from '../components/NavAgendar';


export default function AgendarVenta() {
  

  return (
    <div>
      <Fijo />
      <div className="content">

        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Agendar pedido'
          />
          <NavAgendar/>

          
           
            
          
        </div>

      </div>
    </div>
  )
}
