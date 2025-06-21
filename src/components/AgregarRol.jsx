import { closeModal, toggleSubMenu } from "../funciones/animaciones";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function AgregarRol() {
    const handleClick = () =>
        Swal.fire({
            text: 'Rol añadido correctamente',
            icon: 'success',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        });
    return (


        <div class="modal" id="agregar-rol">

            <h3>Agregar rol</h3>
            <form action="">
                <br />
                <label>Nombre de rol</label>
                <input className='entrada' type="text" style={{ marginLeft: '1.5rem' }} /><br /><br />
                <label >Módulos con acceso</label>
                <br />
                <br />
                <div class="checkbox-group">
                    <input type="checkbox" onClick={() => toggleSubMenu('permisos-usuarios')} /> Usuarios
                    <input type="checkbox" onClick={() => toggleSubMenu('permisos-compras')} /> Compras
                    <input type="checkbox" onClick={() => toggleSubMenu('permisos-productos')} /> Productos
                    <input type="checkbox" onClick={() => toggleSubMenu('permisos-ventas')} /> Ventas
                </div>
                <br />
                <div className="section dropdown" id='permisos-usuarios'>
                    <h4>Permisos módulo usuarios</h4>
                    <br />
                    <div class="permissions">
                        <div className="group">
                            <label >
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" onChange={() => toggleSubMenu('lista-usuarios')} />
                                Lista de usuarios
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                                Añadir usuario
                            </label>
                            <br />

                        </div>
                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                                Añadir rol
                            </label>
                            <br />

                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" />
                                Todos
                            </label>
                        </div>
                        <br />

                    </div>
                    <br />
                    <div class="form-group-rol dropdown" id='lista-usuarios'>
                        <label>Permisos para lista de usuarios</label>
                        <div class="radio-options">
                            <input type="radio" name="usersListPermissions" /> Solo ver
                            <input type="checkbox" /> Editar usuarios
                            <input type="checkbox" /> Habilitar / Inhabilitar
                            <input type="checkbox" /> Eliminar usuarios
                            <input type="radio" name="usersListPermissions" /> Todos los permisos
                        </div>
                    </div>

                </div>
                <div className="section dropdown" id='permisos-compras'>
                    <h4>Permisos módulo compras</h4>
                    <br />
                    <div class="permissions">
                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                                Lista de proveedores
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="entregados" />
                                Historial de compras
                            </label>
                            <br />
                        </div>
                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" />
                                Ver reportes
                            </label>
                            <br />

                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" />
                                Todos
                            </label>
                        </div>
                    </div>
                    <br />

                </div>
                <div className="section dropdown" id='permisos-productos'>
                    <h4>Permisos módulo productos</h4>
                    <br />

                    <div class="permissions">

                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                                Lista de productos
                            </label>
                            <br />
                        </div>
                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" />
                                Pedidos cancelados
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cotizacion" />
                                Registrar cotización
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="listaCotizaciones" />
                                Lista de cotizaciones
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" name="todos" />
                                Todos
                            </label>
                        </div>
                    </div>
                    <br />

                    <div class="form-group-rol">
                        <label>Permisos para pedidos agendados</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para pedidos entregados</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de devoluciones</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de cotizaciones</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de clientes</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para prospectos de cliente</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section dropdown" id='permisos-ventas'>
                    <h4>Permisos módulo ventas</h4>
                    <br />

                    <div class="permissions">

                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="agendar" />
                                Agendar pedido
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="agendados" />
                                Pedidos agendados
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="entregados" />
                                Pedidos entregados
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="devueltos" />
                                Pedidos devueltos
                            </label>
                        </div>
                        <div className="group">
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" />
                                Pedidos cancelados
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cotizacion" />
                                Registrar cotización
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="listaCotizaciones" />
                                Lista de cotizaciones
                            </label>
                            <br />
                            <label>
                                <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" name="todos" />
                                Todos
                            </label>
                        </div>
                    </div>
                    <br />

                    <div class="form-group-rol">
                        <label>Permisos para pedidos agendados</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para pedidos entregados</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de devoluciones</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de cotizaciones</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para lista de clientes</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                    <div class="form-group-rol">
                        <label>Permisos para prospectos de cliente</label>
                        <div class="radio-options">
                            <div>
                                <input type="radio" name="pedidosagendados" /> Solo ver
                            </div>
                            <div>
                                <input type="radio" name="pedidosagendados" /> Todos los permisos
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <Link to={`/RolesYPermisos`}><button  onClick={()=> closeModal('agregar-rol')} className="btn btn-primary-cancel" >Cancelar</button></Link>
                    
                    <Link  onClick={handleClick}>
                        <button onClick={()=> closeModal('agregar-rol')} className="btn btn-primary-env">Crear Rol</button>
                    </Link>
                </div>
            </form>

        </div>
    )


}
