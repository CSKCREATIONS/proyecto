import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo2 from '../components/EncabezadoModulo2'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import { openModal } from '../funciones/animaciones'

export default function RegistrarCotizacion() {
  const navigate = useNavigate();
  //Agendar venta
  const handleCotizado = () => {
    Swal.fire({
      title: 'Cotización registrada',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
    }).then(() => {
      // Una vez que se confirma la alerta, navegas a otra página
      navigate('/ListaDeCotizaciones');
    });
  };
  const handleCancelado = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas borrar el contenido de esta corización?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // texto despues del si
        Swal.fire('Borrada', 'Registro borrado exitosamente.', 'success');
      }
    });
  };



  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo2
            titulo="Registrar cotizacion"
          />

          <div className="contenido-modulo">
            <div className="container-tabla">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Ciudad</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Responsable cotización</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input type="text" className="cuadroTexto" placeholder="Buscar..." />
                          <button style={{ marginLeft: '5px', cursor: 'pointer' }} title="Buscar cliente">
                          </button>
                        </div>
                      </td>
                      <td><input type="text" className="cuadroTexto" /></td>
                      <td><input type="text" className="cuadroTexto" /></td>
                      <td><input type="text" className="cuadroTexto" /></td>
                      <td><span>Pepito</span></td>
                      <td><input type="date" className="cuadroTexto" /></td>
                    </tr>
                  </tbody>
                </table>

                <label className="labelDOCS">Descripción cotización</label>
                <Editor
                  apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"  // Opcional, usa la versión gratuita
                  textareaName="Descripcion"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
                      'media', 'table', 'emoticons', 'help'
                    ],

                    toolbar:
                      'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',

                    menu: {
                      favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                    },
                    menubar: 'favs file edit view insert format tools table help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'

                  }}


                />
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Valor unitario</th>
                      <th>% Descuento</th>
                      <th>Valor total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td><div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="text" className="cuadroTexto" placeholder="Buscar producto..." />
                      </div></td>
                      <td><input type="text" className='cuadroTexto' /></td>
                      <td><input type="text" className='cuadroTexto' /></td>
                      <td><input type="text" className='cuadroTexto' /></td>
                      <td><input type="text" className='cuadroTexto' /></td>
                      <td><input type="text" className='cuadroTexto' /></td>
                    </tr>
                  </tbody>
                </table>


                <label className="labelDOCS">Condiciones de pago</label>
                <Editor
                  apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"  // Opcional, usa la versión gratuita

                  textareaName="Descripcion"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
                      'media', 'table', 'emoticons', 'help'
                    ],

                    toolbar:
                      'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',

                    menu: {
                      favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                    },
                    menubar: 'favs file edit view insert format tools table help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'

                  }}


                />
              </div>
            </div>
          </div>

          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={handleCancelado}
            >
              Cancelar
            </button>

            {/**Debe enlistar a ListaDeCotizaciones unicamente */}
            <button
              className="btn btn-primary"
              onClick={handleCotizado}
            >
              Guardar
            </button>

            {/**Debe enlistar a ListaDeCotizaciones y abrir el popup de enviarCotizacion */}
            <button
              className="btn btn-primary"
              onClick={() => openModal("cotizacionPreview")}
            >
              Guardar & Enviar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
