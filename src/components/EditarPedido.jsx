import React from 'react'
import { toggleSubMenu } from '../funciones/animaciones'
import { openModal } from '../funciones/animaciones'
import { closeModal } from '../funciones/animaciones'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


export default function EditarPedido() {

    const handleClick = () => {
        Swal.fire({
          text: 'Documento Editado correctamente',
          icon: 'success',
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          closeModal('editUserModal'); // cerrar después de aceptar
        });
      };
      
      
    
    return (

        <div className="modal" id="editUserModal">
            <div className="modal-content">
                <div className="form-group">
                    <label>No Pedido</label>
                    <input type="text" required placeholder='1092'/>
                </div>
                <div className="form-group">
                    <label>Producto</label>
                    <select name="" id="" >
                        <option value="">Grama sintetica</option>
                        <option value="">Cilindros de oxigeno</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>Fecha de Entrega</label>
                    <input type="date" required />
                </div>
                <div className="form-group">
                    <label>Observación</label>
                    <textarea style={{marginLeft:"1rem"}} className='textarea'  cols="40"></textarea>


                </div>
                <div className="buttons">
                    <button className="btn btn-secondary" onClick={() => closeModal('editUserModal')}>Cancelar</button>
                    <Link to={`/PedidosAgendados`}>
                    <button className="btn btn-primary" onClick={handleClick}>Guardar Cambios</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
