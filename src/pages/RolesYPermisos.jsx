import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import AgregarRol from '../components/AgregarRol';
import { openModal } from '../funciones/animaciones';
import { Link } from 'react-router-dom';

export default function RolesYPermisos() {

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">

          <div className='encabezado-modulo'>
            <div>
              <h3>Roles y permisos</h3>
              <button style={{ background: 'transparent', cursor: 'pointer' }} ><i className="fa-solid fa-file-excel"></i> Exportar a Excel</button>
              <button style={{ background: 'transparent', cursor: 'pointer' }} ><i className="fa-solid fa-file-pdf"></i> Exportar a PDF</button>
            </div>
            <button onClick={() => openModal('agregar-rol')} type='submit' className='btn-agregar'>+ Agregar rol</button>
          </div>
          <br />
          <div className="container-tabla">
            <table id='tabla_roles'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre de rol</th>
                  <th>Rol</th>
                  <th>Correo</th>
                  <th>Nombre de usuario</th>
                  <th>Estado</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>1</td>
                  <td>Natalia Maria</td>
                  <td>Admin</td>
                  <td>Nat@gmail.com</td>
                  <td>Natalia.Mar</td>
                  <td style={{ color: 'green' }}>Habilitado</td>
                  <td >20/03/2025</td>
                  <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                    <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                  </button>
                  <Link to={`/`} >
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
      <AgregarRol />
    </div>
  )
}