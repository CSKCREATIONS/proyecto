import React from 'react'

export default function EncabezadoModulo() {
    return (
        <div className='encabezado-modulo'>
            <div>
                <h3>Lista de Documentos </h3>
            </div>
            <div class="search-container">
                <input type="text" class="search-box" placeholder=" " id="search" />
                <label for="search"><i class="fa-solid fa-magnifying-glass"></i> Buscar usuario</label>
            </div>

            <div class="search-container">

            </div>
        </div>
    )
}
