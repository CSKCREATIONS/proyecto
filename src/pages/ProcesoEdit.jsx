import React from 'react'
import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";




export default function ProcesoEdit() {
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
                            <input type="text" className="input-box" />
                            <br />
                            <label className="label">Nombre</label>
                            <input
                              type="text"
                              className="input-box"
                              
                            />
                
                            <label className="label">Responsable</label>
                            <textarea
                              className="textarea-box"
                              
                            ></textarea>
                
                            {/* Botones */}
                            <div className="button-group">
                              <button className="button accept">Editar</button>
                              <Link to={`/Proceso`}>
                                <button className="button cancel">Cancelar</button>
                              </Link>
                            </div>
                          </form>
                        </div>

          </fieldset>
 
      <div>

       </div>


    </div>
     
    </div>
  )
}
