import React from 'react'

/**Este componente contiene el nombre de la pagina en la que se encuentra. Es llamado en todas aquellas paginas en las que se requiere exportar a excel y pdf, tambien para realizar busquedas */

export default function EncabezadoModulo(props) {
    return (
        <div className='encabezado-modulo'>
            <div>
                <h3>{props.titulo}</h3>
                <button style={{background:'transparent'}}><i class="fa-solid fa-file-excel"></i> Exportar a Excel</button>
                <button style={{background:'transparent'}}><i class="fa-solid fa-file-pdf"></i> Exportar a PDF</button>
            </div>

            <div class="search-container">
                <input type="text" class="search-box" placeholder=" " id="search" />
                <label for="search"><i class="fa-solid fa-magnifying-glass"></i> Buscar usuario</label>
            </div>
        </div>
    )
}
