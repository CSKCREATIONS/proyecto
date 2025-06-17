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
          <div className="nav-modulo">
            <li>Persona</li>
            <li>Empresa</li>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ciudad</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Fecha entrega</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td><input className='cuadroTexto' /></td>
                <td><input className='cuadroTexto' /></td>
                <td><input className='cuadroTexto' /></td>
                <td><input className='cuadroTexto' /></td>
                <td ><input className='cuadroTexto' /></td>
                <td ><input className='cuadroTexto' /></td>
                <td ><input className='cuadroTexto' /></td>
                <td ><input className='cuadroTexto' /></td>
              </tr>
            </tbody>
          </table>




        </div>

      </div>
    </div>
  )
}
