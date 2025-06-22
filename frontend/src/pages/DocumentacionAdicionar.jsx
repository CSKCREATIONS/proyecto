import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import Fijo from "../components/Fijo";


export default function AñadirDocumento() {

  const handleClick = () => 
    Swal.fire({
    text: 'Documento añadido correctamente',
    icon: 'success',
    showCancelButton: false,
    showCloseButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  });
  
 

  return (
    <div >
          <Fijo />
          <div className="content">

    
    <div className="form-container">
      <h3>Añadir Documento</h3>
      <form>
        <label className="labelDOCS">Código</label>
        <input className= "textDOCS" type="text" name="codigo"/>

        <label className="labelDOCS">Versión</label>
        <input className= "textDOCS" type="text" name="version"/>

        <label className="labelDOCS">Nombre</label>
        <input className= "textDOCS" type="text" name="nombre"/>

        <label className="labelDOCS">Descripción</label>
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

        <label className="labelDOCS">Contenido</label>
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


        <label className="labelDOCS">Tipo de documento</label>
        <input className= "textDOCS" type="text" name="tipoDocumento"/>

        <label className="labelDOCS">Proceso</label>
        <input className= "textDOCS" type="text" name="proceso"/>

        <label className="labelDOCS">Activo</label>
        <input  type="checkbox" name="activo"/>

        <br />
        <br />
        
        <Link to={`/Documentacion`} onClick={handleClick}>
        <button className="btn">Adicionar</button>
        </Link>
        <Link to={`/Documentacion`}>
        <button style={{ marginLeft: "1rem" }} className="btn" type="button" >Cancelar</button>
        </Link>
        
      </form>
    </div>
    </div>

    </div>
  );
}
