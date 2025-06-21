import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { closeModal } from "../funciones/animaciones";

export default function AgregarUsuario() {

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
    <div className='modal' id="agregar-usuario">
      <div className="modal-content">
        <div className="double">
          <div className="form-group">
            <label>Primer nombre</label>
            <input className='entrada' type="text" autoFocus />
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
            <label>Rol</label>
            <select className='entrada'>
              <option value="" disabled selected>Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
              <option value="salchicha">Salchipapa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Correo</label>
            <input className='entrada' type="email" />
          </div>
        </div>
        <div className="buttons">
          <button onClick={()=> closeModal('agregar-usuario')} className="btn btn-secondary">Cancelar</button>
          <Link onClick={ handleClick} >
            <button onClick={()=> closeModal('agregar-usuario')} className="btn btn-primary">Crear Usuario</button>
          </Link>
        </div>
      </div>

    </div>
  )
}