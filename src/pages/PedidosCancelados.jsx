import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'

export default function PedidosCancelados() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas/>
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Pedidos cancelados'
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
                  <tr>
                    <td>105323234</td>
                    <td>Natalia Maria</td>
                    <td>Admin</td>
                    <td>Nat@gmail.com</td>
                    <td>Natalia.Mar</td>
                    <td>30204342</td>
                    <td>Habilitado</td>
                    <td>20/03/2025</td>
                    <td>
                      <button className='btn' style={{ height: '30px', width: '50px' }} onClick={() => openModal('editUserModal')}></button>
                      <button className='btn' style={{ height: '30px', width: '50px' }} ></button>
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
