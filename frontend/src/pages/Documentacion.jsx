import React, { useState } from 'react';
import Fijo from '../components/Fijo'
import EncabezadoModuloSIGDOC from '../components/EncabezadoModuloSIGDOC'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import '@fortawesome/fontawesome-free/css/all.min.css';



export default function Documentacion() {

const handleClick = () => 
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: '¡Listo!',
        text: 'El documento ha sido borrado.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

  const handleNuevaVersion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas agregar una nueva versión del documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Versión agregada!',
          text: 'La nueva versión se registró correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const mostrarPDF = () => {
    Swal.fire({
      html: `
        <iframe src="/propuesta_tecnica.pdf" width="5000px" height="500px" style="border:none;"></iframe>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };
  const mostrarPDF1 = () => {
    Swal.fire({
      html: `
        <iframe src="/Diagrama de despliegue.pdf" width="5000px" height="500px" style="border:none;"></iframe>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };
  const mostrarPDF2 = () => {
    Swal.fire({
      html: `
        <iframe src="/diagrama de clases.pdf" width="5000px" height="500px" style="border:none;"></iframe>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };
  const [activo, setActivo] = useState(true);

  const toggleEstado = () => {
    setActivo(!activo);
  };
  

  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion/>
        <div className="contenido-modulo">
          <EncabezadoModuloSIGDOC/>

          <div className="container-tabla">
            <div className="table-container"><br />
            <Link to={`/DocumentacionAdicionar`} className="icons">
              <button className="btn btn-primary">Adicionar</button>
               </Link>
              <table>
                  <thead>
                    <tr>
                      <th>Inactivar/Activar</th>
                      <th>Contenido</th>
                      <th>Codigo</th>
                      <th>Nombre</th>
                      <th>Versión</th>
                      <th>Tipo de documento</th>
                      <th>Proceso</th>
                      <th>Fecha</th>
                      <th>Versión nueva</th>
                      <th>Trazabilidad</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    <tr >
                      <td>
                        <button className={`btn-toggle ${activo ? '' : 'inactive'}`} onClick={toggleEstado} >
                          {activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}onClick={mostrarPDF} title="Ver documento">
                          <i className="fa-solid fa-eye fa-2x" style={{ color: '#007bff' }} />
                        </button>
                      &nbsp;&nbsp;&nbsp;
                        <a href="/propuesta_tecnica.pdf" download="propuesta_tecnica.pdf" title="Descargar documento">
                          <i className="fa-solid fa-file-arrow-down fa-2x" style={{ cursor: 'pointer', color: 'green' }}></i>
                        </a>

                      </td>
                      <td >DI-PRO-001</td>
                      <td>PROPUESTA TECNICA PANGEA</td>
                      <td>2</td>
                      <td>Procedimiento(PRO)</td>
                      <td>Direccionamiento Estratégico (DE)	 </td>
                      <td >20/03/2025</td>
                      <td> &nbsp;&nbsp;&nbsp;
                        <button onClick={handleNuevaVersion} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }} title="Agregar nueva versión"                      >
                          <i className="fa-solid fa-file-circle-plus fa-2x" />
                        </button>
                      </td>
                      <td> 
                        <Link to={`/Trazabilidad`} className="icons">
                          <button className="btn btn-secondary " style={{  height: '30px', width: '100px' }} type="button">Trazabilidad</button>
                        </Link> 
                      </td>
                      <td>
                      &nbsp;&nbsp;                 
                        <Link to={`/DocumentacionEdit`} className="icons">
                          <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                        </Link>                      
                        </td>
                      <td>
                      &nbsp;&nbsp;
                      <Link to={`/Documentacion`} className="icons" onClick={handleClick}>
                      <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                      </Link>
                      </td>
                    </tr>
                    {/*desplegable*/}
                    <tr>
                    <td>
                    <button
                      className={`btn-toggle ${activo ? '' : 'inactive'}`}
                      onClick={toggleEstado}
                     >
                      {activo ? 'Activo' : 'Inactivo'}
                    </button>

                    </td>
                      <td>
                      <button
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onClick={mostrarPDF1}
                        title="Ver documento"
                      >
                        <i className="fa-solid fa-eye fa-2x" style={{ color: '#007bff' }} />
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <a href="/diagrama de despliegue.pdf"  download="diagrama de despliegue.pdf" title="Descargar documento">
                        <i className="fa-solid fa-file-arrow-down fa-2x" style={{ cursor: 'pointer', color: 'green' }}></i>
                      </a>
                      </td>
                      <td >DI-PRO-002</td>
                      <td>DIAGRAMA DE DESPLIEGUE PANGEA</td>
                      <td>2</td>
                      <td>Procedimiento(PRO)</td>
                      <td>Direccionamiento Estratégico (DE)	 </td>
                      <td >20/03/2025</td>
                      <td> &nbsp;&nbsp;&nbsp;
                        <button onClick={handleNuevaVersion} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }}title="Agregar nueva versión" >
                          <i className="fa-solid fa-file-circle-plus fa-2x" />
                        </button>
                      </td>
                      <td> 
                        <Link to={`/Trazabilidad`} className="icons">
                          <button className=" btn btn-secondary" style={{  height: '30px', width: '100px' }} type="button">Trazabilidad</button>
                        </Link> 
                      </td>
                      <td>&nbsp;&nbsp;
                        <Link to={`/DocumentacionEdit`} className="icons">
                          <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                        </Link>                      
                      </td>
                      <td>&nbsp;&nbsp;
                        <Link to={`/Documentacion`} className="icons" onClick={handleClick}>
                          <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                        </Link>
                      </td>
                    </tr>
                    {/*clases*/}
                    <tr>
                    <td>
                      <button className={`btn-toggle ${activo ? '' : 'inactive'}`} onClick={toggleEstado}>
                        {activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                      <td>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={mostrarPDF2} title="Ver documento">
                          <i className="fa-solid fa-eye fa-2x" style={{ color: '#007bff' }} />
                        </button>
                      &nbsp;&nbsp;&nbsp;
                        <a  href="/diagrama de clases.pdf" download="diagrama de clases.pdf" title="Descargar documento" >
                          <i className="fa-solid fa-file-arrow-down fa-2x" style={{ cursor: 'pointer', color: 'green' }}></i>
                        </a>
                      </td>
                      <td >DI-PRO-003</td>
                      <td>DIAGRAMA DE CLASES PANGEA</td>
                      <td>2</td>
                      <td>Procedimiento(PRO)</td>
                      <td>Direccionamiento Estratégico (DE)	 </td>
                      <td >20/03/2025</td>
                      <td> &nbsp;&nbsp;&nbsp;
                      <button onClick={handleNuevaVersion} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }} title="Agregar nueva versión"
                      >
                        <i className="fa-solid fa-file-circle-plus fa-2x" />
                      </button>
                      </td>
                      <td> 
                        <Link to={`/Trazabilidad`} className="icons">
                        <button className="btn btn-secondary" style={{  height: '30px', width: '100px' }} type="button">Trazabilidad</button>
                        </Link> 
                      </td>
                      <td>&nbsp;&nbsp;
                        <Link to={`/DocumentacionEdit`} className="icons">
                          <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                        </Link>                      
                      </td>
                      <td>&nbsp;&nbsp;
                        <Link to={`/Documentacion`} className="icons" onClick={handleClick}>
                          <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
        </div>



      </div>
    </div>
  )
}