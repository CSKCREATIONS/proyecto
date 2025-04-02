import React from 'react'
import { toggleSubMenu } from '../funciones/animaciones'
import { openModal } from '../funciones/animaciones'
import { closeModal } from '../funciones/animaciones'

export default function EditarUsuario() {
    return (

        <div className="modal" id="editUserModal">
            <div className="modal-content">
                <div className="form-group">
                    <label>No documento</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Primer nombre</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Segundo nombre</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Primer apellido</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Segundo apellido</label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Teléfono </label>
                    <input type="text" required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" required />
                </div>
                <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input type="text" disabled />
                </div>
                <div className="form-group">
                    <label>Rol</label>
                    <select name="" id="" >
                        <option value="">admin</option>
                        <option value="">salchipapa</option>
                    </select>
                </div>
                <div className="buttons">
                    <button className='btn btn-secondary' onClick={() => toggleSubMenu('changePassword')}>Cambiar contraseña</button>
                </div>
                <div className='dropdown' id='changePassword' style={{border: '1px solid #ccc', padding:'0.5rem', marginTop:'1rem'}}>
                    <div className="form-group"><label>Contraseña actual</label><input type="password" /></div>
                    <div className="form-group"><label>Nueva contraseña</label><input type="password" /></div>
                    <div className="form-group"><label>Confirmar nueva contraseña</label><input type="password" /></div>
                </div>
                <div className="buttons">
                    <button className="btn btn-secondary" onClick={() => closeModal('editUserModal')}>Cancelar</button>
                    <button className="btn btn-primary">Guardar Cambios</button>
                </div>

                



            </div>
        </div>
    )
}
