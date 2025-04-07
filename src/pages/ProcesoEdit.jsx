import React from 'react'
import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import '@fortawesome/fontawesome-free/css/all.min.css';





export default function ProcesoEdit() {

    const handleClick = () => 
      Swal.fire({
      text: 'El Proceso ha sido editado correctamente',
      icon: 'success',
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    })

  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion/>


        <fieldset className="edit-fieldset">
            <legend>Editar Proceso</legend>

               <div className="form-container">
                          
                
                          <form className="form">
                            <label className="label">Código</label>
                            <input type="text" className= "textDOCS" />
                            <label className="label">Nombre</label>
                            <input
                              type="text"
                              className= "textDOCS"                              
                            />
                
                            <label className="label">Responsable</label>
                            <textarea
                            className= "textDOCS"                              
                            ></textarea>
                            <br />
                            <br />
                
                            {/* Botones */}
                              <Link to={`/Proceso`} className="icons"  onClick={handleClick}>
                              <button className="btn">Editar</button>
                              </Link>
                              
                              <Link to={`/Proceso`}>
                                <button style={{ marginLeft: "1rem" }} className="btn">Cancelar</button>
                              </Link>
                          </form>
                        </div>

          </fieldset>
 
      <div>

       </div>


    </div>
     
    </div>
  )
}
