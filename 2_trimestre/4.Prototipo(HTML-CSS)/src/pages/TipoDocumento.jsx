import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import EncabezadoModuloSIGTD from '../components/EncabezadoModuloSIGTD'
import { Link } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from "react";




export default function TipoDocumento() {

    const [contenido, setContenido] = useState("");
  
    const handleEditorChange = (content) => {
      setContenido(content);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Contenido del editor:", contenido);
    };
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div className="contenido-modulo">
          <EncabezadoModuloSIGTD />

          <div class="container-tabla">
            <div class="table-container">

              <Link to={`/TipoDocumentoAdicionar`} className="icons">
                <button className="button accept">Adicionar</button>
              </Link>

              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Acciones</th>


                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Procedimiento(PRO)</td>

                    <td>
                      {/* Botón de Editar */}
                      <Link to={`/TipoDocumentoEdit`} className="icons">
                        <i className="fa-solid fa-pen" aria-label="Editar"></i>
                      </Link>

                      {/* Botón de Eliminar con Modal */}
                      <i
                        className="fa-solid fa-trash icons"
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      ></i>
                    </td>

                    <Editor
                      textareaName='quesooooo'
                      apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"  // Opcional, usa la versión gratuita
                      initialValue="<p>Escribe aquí...</p>"
                      init={{
                        height: 1000,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help",
                      }}
                      onEditorChange={handleEditorChange}

                    />

                  </tr>
                  <tr>
                    <td>Caracterizacion(CAR)</td>

                    <td>
                      {/* Botón de Editar */}
                      <Link to={`/TipoDocumentoEdit`} className="icons">
                        <i className="fa-solid fa-pen" aria-label="Editar"></i>
                      </Link>

                      {/* Botón de Eliminar con Modal */}
                      <i
                        className="fa-solid fa-trash icons"
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      ></i>
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
