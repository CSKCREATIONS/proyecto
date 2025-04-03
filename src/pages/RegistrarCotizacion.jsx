import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'

export default function RegistrarCotizacion() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Registrar cotizacion' />
          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Producto</th>
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
            <button style={{margin:'20px auto', textAlign:'center', display:'block'}} className='btn btn-primary'>Registrar cotizacion</button>
        </div>
      </div>
    </div>
  )
}
