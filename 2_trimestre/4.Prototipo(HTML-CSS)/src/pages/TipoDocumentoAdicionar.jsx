import React from 'react'
import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";




export default function TipoDocumentoAdicionar() {
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion/>
 
      <div>
       <section class="">
            <fieldset >
                <legend>Adicionar Tipo de Documento</legend>

                
                <label className="label">Nombre</label>
               <input
                type="text"
                className="input-boxTD"
              
            />


            </fieldset>
                    <Link to={`/TipoDocumento`} className="icons">
                    <button className="button">Cancelar</button><br />
                    </Link>
                    <br />
                    
            <button className="button">Aceptar</button><br />
            
             
        </section>
    </div>
     
    </div>
    </div>
  )
}
