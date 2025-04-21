import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


export default function ListaDeUsuarios() {

  const handleClick = () => 
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Listo!',
          text: 'El usuario ha sido borrado.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });


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
                    <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                      <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                    </button>
                    <Link to={`/ListaDeUsuarios`}  onClick={handleClick}>
                      <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} type="button">
                        <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                      </button>
                    </Link>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EditarUsuario />
       


      </div>
    </div>
  )
}
