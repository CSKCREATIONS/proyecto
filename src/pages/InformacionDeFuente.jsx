import React from 'react'
import Fijo from '../components/Fijo'
import EncabezadoModuloSIG from '../components/EncabezadoModuloSIG'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";

export default function InformacionDeFuente() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div className="contenido-modulo">
          <EncabezadoModuloSIG
            titulo='Información de fuente'
          />
          <br />

          <div style={{paddingLeft:'3rem'}}>
            <Link to="/TipoDocumento" className="icons">
              <button className="btn btn-primary">Tipo de Documento</button><br />
            </Link>
            <br />
            <Link to="/Proceso" className="icons">
              <button className="btn btn-primary">Proceso</button><br />
            </Link>
          </div>
        </div>


      </div>
    </div>
  )
}