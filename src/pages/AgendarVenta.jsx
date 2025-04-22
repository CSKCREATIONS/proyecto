import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import NavAgendar from '../components/NavAgendar';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';


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

          
           
            
          
        </div>

      </div>
    </div>
  )
}
