import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'

export default function ListaDeCotizaciones() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Lista de cotizaciones' />
          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Productos</th>
                    <th>Fecha</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>
                      <select style={{width:'100px'}}> 
                        <option value={'pasto'}>Pasto</option>
                        <option value={'grama'}>Grama</option>
                      </select>
                    </td>
                    <td>03/03/2025</td>
                    <td>Me trajeron pizza</td>
                    <td>
                      <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} onClick={() => openModal('editUserModal')}></button>
                      <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} onClick={() => openModal('editUserModal')}></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
