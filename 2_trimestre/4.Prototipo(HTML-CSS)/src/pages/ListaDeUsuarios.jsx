import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'
import ConfirmarAccion from '../components/ConfirmarAccion'

export default function ListaDeUsuarios() {
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Lista de usuarios'
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
                    <td>105323234</td>
                    <td>Natalia Maria</td>
                    <td>Admin</td>
                    <td>Nat@gmail.com</td>
                    <td>Natalia.Mar</td>
                    <td>30204342</td>
                    <td>Habilitado</td>
                    <td >20/03/2025</td>

                    <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} onClick={() => openModal('editUserModal')}></button>
                    <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} onClick={() => openModal('deleteUser')}></button>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EditarUsuario />
        <ConfirmarAccion
          idItem='deleteUser'
          pregunta='¿Seguro que quieres eliminar a "salchipapa"?'
        />


      </div>
    </div>
  )
}
