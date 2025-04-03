import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'

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

          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Nombre completo</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Username</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td><input type='number'></input></td>
                    <td><input type='text'></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td ><input></input></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
            <button style={{margin:'20px auto', textAlign:'center', display:'block'}} className='btn btn-primary'>Agendar venta</button>
        </div>
      </div>
    </div>
  )
}
