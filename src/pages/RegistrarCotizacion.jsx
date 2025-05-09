import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo2 from '../components/EncabezadoModulo2'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";

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
  const handleGuardarYEnviar = () => {
    const htmlPreview = `
      <div style="text-align: left; font-family: Arial; padding: 10px; border: 1px solid #ccc;">
        <h2 style="text-align: left;">Cotización C-1-321</h2>
        <label><strong>Cliente:</strong> <p>Empresa XYZ</p></label> 
        <label><strong>Ciudad:</label> Medellín</p>
        <p><strong>Teléfono:</strong> 3000000000</p>
        <p><strong>Correo:</strong> cliente@ejemplo.com</p>
        <p><strong>Responsable:</strong> Pepito</p>
        <p><strong>Fecha:</strong> 2025-05-08</p>
  
        <h3>Productos</h3>
        <table style="width: 100%; border-collapse: collapse;" border="1">
          <thead>
            <tr>
              <th style="padding: 5px;">Producto</th>
              <th style="padding: 5px;">Descripción</th>
              <th style="padding: 5px;">Cantidad</th>
              <th style="padding: 5px;">Valor unitario</th>
              <th style="padding: 5px;">% Descuento</th>
              <th style="padding: 5px;">Valor total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px;">Producto A</td>
              <td style="padding: 5px;">Descripción breve</td>
              <td style="padding: 5px;">2</td>
              <td style="padding: 5px;">$100.000</td>
              <td style="padding: 5px;">10%</td>
              <td style="padding: 5px;">$180.000</td>
            </tr>
          </tbody>
        </table>
  
        <h3>Condiciones de pago</h3>
        <p>El pago se realizará 30 días después de la entrega del producto.</p>
      </div>
    `;
  
    Swal.fire({
      title: 'Vista previa de la cotización',
      html: htmlPreview,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Volver a editar',
      width: '800px',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Enviada!', 'La cotización ha sido enviada exitosamente.', 'success');
        navigate('/ListaDeCotizaciones');
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
                      <td><div style={{ display: 'flex', alignItems: 'center' }}>
                          <input type="text" className="cuadroTexto" placeholder="Buscar producto..." />
                          <button style={{ marginLeft: '5px', cursor: 'pointer' }} title="Buscar cliente">
                          </button>
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
            <button
              className="btn btn-primary"
              onClick={handleCotizado}
            >
              Guardar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleGuardarYEnviar}
            >
              Guardar & Enviar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
