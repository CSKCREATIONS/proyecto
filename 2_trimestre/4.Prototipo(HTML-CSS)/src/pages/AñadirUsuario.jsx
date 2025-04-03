import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'

export default function AñadirUsuario() {
  return (
   
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios/>
        <br/>
        <div className="container-añadirU">
        <h3>Añadir usuario</h3>
        <br/>
        <div className="double">
            <div className="form-group">
                <label>Primer nombre</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Segundo nombre</label>
                <input type="text" />
            </div>
        </div>
        <div className="double">
            <div className="form-group">
                <label>Primer apellido</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Segundo apellido</label>
                <input type="text" />
            </div>
        </div>
        <div className="triple">
            <div className="form-group">
                <label># Documento</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Rol</label>
                <select>
                <option value="" disabled selected>Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                <option value="salchicha">Salchipapa</option>
                </select>
            </div>
            <div className="form-group">
              <label>No teléfono</label>
              <input type="text" />
          </div>
        </div>
        <br/>
        <div className="button-container">
            <button>Crear usuario bb</button>
        </div>
    </div>

      </div>
    </div>
    
  )
}
