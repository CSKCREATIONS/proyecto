import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import AgregarRol from '../components/AgregarRol';
import { openModal } from '../funciones/animaciones';
import { Link } from 'react-router-dom';

export default function RolesYPermisos() {

  const [roles, setRoles] = useState([]);
  const [puedeCrearRol, setPuedeCrearRol] = useState(false);
  const [puedeEditarRol, setPuedeEditarRol] = useState(false);
  const navigate = useNavigate();

  //crea paginacion de tablas
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // se renderizan 10 registros 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleEstadoRol = async (id, nuevoEstado) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/roles/${id}/toggle-enabled`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ enabled: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al cambiar estado del rol');

      // Actualiza la lista
      const data = await res.json();
      setRoles(prev =>
        prev.map(r => (r._id === id ? { ...r, enabled: nuevoEstado } : r))
      );
    } catch (error) {
      console.error(error);
    }
  };





  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeEditarRol(usuario.permissions.includes('roles.editar'));
    }
    const token = localStorage.getItem('token');

    if (!usuario || !usuario.permissions || !usuario.permissions.includes('roles.ver')) {
      // Si no tiene permiso, lo redirigimos
      navigate('/Home');
    } else {
      // se valida si puede crear roles
      setPuedeCrearRol(usuario.permissions.includes('roles.crear'));
    }

    // Petición al backend para obtener los roles
    fetch('http://localhost:5000/api/roles', {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRoles(data.roles);
        } else {
          console.error('Error cargando roles');
        }
      })
      .catch(err => console.error('Error:', err));

  }, [navigate]);


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
                {currentItems.map((rol, index) => (
                  <tr key={rol._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{rol.name}</td>
                    <td>{new Date(rol.createdAt).toLocaleDateString()}</td>
                    <td className="td-multiline">{rol.permissions.join(' - ')}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={rol.enabled}
                          onChange={() => toggleEstadoRol(rol._id, !rol.enabled)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>


                    <td>
                      {puedeEditarRol && (
                        <button
                          className='btnTransparente'
                          style={{ marginLeft: '.7rem', height: '35px', width: '50px' }}
                          onClick={() => openModal('editUserModal')}
                        >
                          <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>


            </table>

          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>

      </div>
      <AgregarRol />
    </div>
  )
}