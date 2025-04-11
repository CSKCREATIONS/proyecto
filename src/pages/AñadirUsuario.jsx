import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


export default function AñadirUsuario() {
  const handleClick = () =>
    Swal.fire({
      text: 'Usuario añadido correctamente',
      icon: 'success',
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  return (

    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <h3>Añadir usuario</h3>
          <br />
          <div className='container-form'>

            <div className="double">
              <div className="form-group">
                <label>Primer nombre</label>
                <input className='entrada' type="text" />
              </div>
              <div className="form-group">
                <label>Segundo nombre</label>
                <input className='entrada' type="text" />
              </div>
            </div>
            <div className="double">
              <div className="form-group">
                <label>Primer apellido</label>
                <input className='entrada' type="text" />
              </div>
              <div className="form-group">
                <label>Segundo apellido</label>
                <input className='entrada' type="text" />
              </div>
            </div>
            <div className="triple">
              <div className="form-group">
                <label># Documento</label>
                <input className='entrada' type="text" />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select className='entrada'>
                  <option value="" disabled selected>Seleccione un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                  <option value="salchicha">agente</option>
                </select>
              </div>
              <div className="form-group">
                <label>No teléfono</label>
                <input className='entrada' type="text" />
              </div>
            </div>
            <div className="buttons">
            <Link to={`/ListaDeUsuarios`} onClick={handleClick}>
              <button className="btn btn-primary">Crear Usuario</button>
            </Link>
          </div>
          </div>

          <br />
          
        </div>

      </div>
    </div>

  )
}
