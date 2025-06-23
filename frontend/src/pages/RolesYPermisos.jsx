import { useEffect, useState } from 'react';
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import AgregarRol from '../components/AgregarRol';
import { openModal } from '../funciones/animaciones';
import { Link } from 'react-router-dom';

export default function RolesYPermisos() {

  const [puedeCrearRol, setPuedeCrearRol] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (usuario && usuario.role && usuario.permissions) {
      setPuedeCrearRol(usuario.permissions.includes('roles.crear'));
    }
  }, []);


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">

          <div className='encabezado-modulo'>
            <div>
              <h3>Roles y permisos</h3>
            </div>
            {puedeCrearRol && (
              <button id='agregar-rol' onClick={() => openModal('crear-rol')} className='btn-agregar'>
                + Crear rol
              </button>
            )}

            
          </div>
          <br />
          <div className='table-container'>
            <table id='tabla_roles'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre de rol</th>
                  <th>Creado</th>
                  <th>Permisos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>1</td>
                  <td>Gerente de importaciones</td>
                  <td>20/03/2025</td>
                  <td>Ver compras - Registrar compras - Ver proveedores - Editar proveedores - Ver productos - Editar productos - Inactivar productos - Ver categorias - Editar categorias - etcetera</td>
                  <td style={{ color: 'green' }}>Habilitado</td>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                    <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                  </button>
                  <Link to={`/`} >
                    <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} type="button">
                      <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                    </button>
                  </Link>
                </tr>
                <tr >
                  <td>1</td>
                  <td>Admin</td>
                  <td>20/03/2025</td>
                  <td>Todos los permisos</td>
                  <td style={{ color: 'green' }}>Habilitado</td>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                    <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                  </button>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} type="button">
                    <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                  </button>
                </tr>
                <tr >
                  <td>1</td>
                  <td>Admin</td>
                  <td>20/03/2025</td>
                  <td>Todos los permisos</td>
                  <td style={{ color: 'green' }}>Habilitado</td>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                    <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                  </button>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} type="button">
                    <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                  </button>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
      <AgregarRol />
    </div>
  )
}