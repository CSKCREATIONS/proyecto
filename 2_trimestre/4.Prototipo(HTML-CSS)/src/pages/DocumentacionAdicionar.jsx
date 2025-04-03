import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Link } from "react-router-dom";


export default function AñadirDocumento() {


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:");
  };


  return (
    <div className="form-container">
      <h3>Añadir Documento</h3>
      <form onSubmit={handleSubmit}>
        <label>Código</label>
        <input type="text" name="codigo"/>

        <label>Versión</label>
        <input type="text" name="version"/>

        <label>Nombre</label>
        <input type="text" name="nombre"/>

        <label>Descripción</label>
        <Editor
        apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"  // Opcional, usa la versión gratuita

        textareaName="descripcion"
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

        <label>Contenido</label>
        <Editor
       apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"  // Opcional, usa la versión gratuita

        textareaName="descripcion"
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'emoticons', 'help'
          ],
          toolbar:
            'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
      'forecolor backcolor emoticons | help',

      menu: {
        favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
      },
      menubar: 'favs file edit view insert format tools table help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'

        }}
           
                />   


        <label>Tipo de documento</label>
        <input type="text" name="tipoDocumento"/>

        <label>Proceso</label>
        <input type="text" name="proceso"/>

        <label>Activo</label>
        <input type="checkbox" name="activo"/>

        <div className="button-group">
          <button type="submit">Adicionar</button>
          <Link to={`/Documentacion`} className="icons">
          <button type="button" onClick={() => console.log("Cancelado")}>Cancelar</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
