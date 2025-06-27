import React from 'react'
/**Este componente contiene el nombre de la pagina en la que se encuentra. Es llamado en todas aquellas paginas en las que se requiere exportar a excel y pdf, tambien para realizar busquedas */

import { Link } from 'react-router-dom'
import { toggleSubMenu } from '../funciones/animaciones'

export default function EncabezadoModulo(props) {
	return (
		<div className='encabezado-modulo'>
			<div>
				<h3>{props.titulo}</h3>
				<button style={{ background: 'transparent', cursor: 'pointer' }} onClick={props.exportToExcel}><i className="fa-solid fa-file-excel"></i> Exportar a Excel</button>
				<button style={{ background: 'transparent', cursor: 'pointer' }} onClick={props.exportarPDF}><i className="fa-solid fa-file-pdf"></i> Exportar a PDF</button>
			</div>
			<button type='submit' style={{ padding: '0.5rem', backgroundColor: '#43805a', borderRadius: '10px', color: 'white' }}>{props.descripcionBoton}</button>
		</div>
	)
}