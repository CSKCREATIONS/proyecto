import { useEffect, useState } from 'react';
import { closeModal, toggleSubMenu } from "../funciones/animaciones";
import Swal from "sweetalert2";

export default function EditarRol({ rol }) {
   const [nombreRol, setNombreRol] = useState('');
   const [permisos, setPermisos] = useState([]);
   const permisosUsuarios = [
      'usuarios.crear',
      'usuarios.editar',
      'usuarios.inhabilitar',
      'usuarios.eliminar'
   ];

   const permisosRoles = [
      'roles.crear',
      'roles.editar',
      'roles.inhabilitar'
   ];
   const permisosProductos = [
      'productos.ver',
      'productos.crear',
      'productos.editar',
      'productos.inactivar'
   ];

   useEffect(() => {
      if (rol) {
         setNombreRol(rol.name || '');
         setPermisos(rol.permissions || []);
      }
   }, [rol]);

   // Manejo de cambios en checkboxes
   const togglePermiso = (permiso) => {
      setPermisos(prev =>
         prev.includes(permiso)
            ? prev.filter(p => p !== permiso)
            : [...prev, permiso]
      );
   };
   const toggleGrupoPermisos = (grupoPermisos) => {
      const todosMarcados = grupoPermisos.every(p => permisos.includes(p));
      if (todosMarcados) {
         // Si todos ya están marcados → los quitamos
         setPermisos(prev => prev.filter(p => !grupoPermisos.includes(p)));
      } else {
         // Si hay al menos uno sin marcar → los agregamos todos
         setPermisos(prev => [...new Set([...prev, ...grupoPermisos])]);
      }
   };
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!nombreRol.trim()) {
         return Swal.fire('Error', 'El nombre del rol es obligatorio', 'error');
      }

      if (permisos.length === 0) {
         return Swal.fire('Error', 'Selecciona al menos un permiso', 'error');
      }

      try {
         const token = localStorage.getItem('token');
         const res = await fetch(`http://localhost:5000/api/roles/${rol._id}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               'x-access-token': token
            },
            body: JSON.stringify({
               name: nombreRol,
               permissions: permisos
            })
         });

         const data = await res.json();

         if (res.ok && data.success) {
            Swal.fire('Éxito', 'Rol actualizado correctamente', 'success');
            closeModal('edit-role-modal');
         } else {
            Swal.fire('Error', data.message || 'No se pudo actualizar el rol', 'error');
         }

      } catch (error) {
         console.error('[EditarRol]', error);
         Swal.fire('Error', 'Error del servidor al actualizar el rol', 'error');
      }
   };
   return (
      <form class="modal" id="edit-role-modal" onSubmit={handleSubmit}>
         <h3>Editar rol</h3>
         <br />
         <label>Nombre de rol</label>
         <input className='entrada' type="text" style={{ marginLeft: '1.5rem' }} value={nombreRol} onChange={(e) => setNombreRol(e.target.value)} /><br /><br />
         <label >Módulos con acceso</label>
         <br />
         <br />
         <div class="checkbox-group">
            <input value="usuarios" type="checkbox" onClick={() => toggleSubMenu('permisos-usuarios')} />Usuarios
            <input value="compras" type="checkbox" onClick={() => toggleSubMenu('permisos-compras')} /> Compras
            <input value="productos" type="checkbox" onClick={() => toggleSubMenu('permisos-productos')} /> Productos
            <input value="ventas" type="checkbox" onClick={() => toggleSubMenu('permisos-ventas')} /> Ventas
         </div>
         <br />
         <div className="section dropdown" id='permisos-usuarios'>
            <h4>Permisos módulo usuarios</h4>
            <br />
            <div class="permissions">
               <div className="group">
                  <label >
                     <input
                        style={{ marginRight: '0.5rem', marginBottom: '.5rem' }}
                        type="checkbox"
                        checked={permisos.includes('usuarios.ver')}
                        onChange={() => { toggleSubMenu('lista-usuarios'); togglePermiso('usuarios.ver') }}
                     />
                     Lista de usuarios
                  </label>
                  <br />

               </div>
               <div className="group">
                  <label>
                     <input
                        style={{ marginRight: '0.5rem', marginBottom: '.5rem' }}
                        type="checkbox"
                        checked={permisos.includes('roles.ver')}
                        onChange={() => { toggleSubMenu('roles-y-permisos'); togglePermiso('roles.ver') }} />
                     Roles y permisos
                  </label>
                  <br />
               </div>
               <br />

            </div>
            <br />
            <div class="form-group-rol dropdown" id='lista-usuarios'>
               <label>Permisos para lista de usuarios</label>
               <div class="radio-options">
                  <input type="checkbox"
                     checked={permisos.includes('usuarios.crear')}
                     onChange={() => togglePermiso('usuarios.crear')}
                  /> Crear usuarios
                  <input type="checkbox"
                     checked={permisos.includes('usuarios.editar')}
                     onChange={() => togglePermiso('usuarios.editar')}
                  /> Editar usuarios
                  <input type="checkbox"
                     checked={permisos.includes('usuarios.inhabilitar')}
                     onChange={() => togglePermiso('usuarios.inhabilitar')}
                  /> Habilitar / Inhabilitar
                  <input type="checkbox"
                     checked={permisos.includes('usuarios.eliminar')}
                     onChange={() => togglePermiso('usuarios.eliminar')}
                  /> Eliminar usuarios
                  <input
                     type="radio"
                     name="usersListPermissions"
                     onClick={() => toggleGrupoPermisos(permisosUsuarios)}
                     checked={permisosUsuarios.every(p => permisos.includes(p))}
                  /> Todos los permisos

               </div>
            </div>
            <div class="form-group-rol dropdown" id='roles-y-permisos'>
               <label>Permisos para roles y permisos</label>
               <div className="radio-options">
                  <input
                     type="checkbox"
                     checked={permisos.includes('roles.crear')}
                     onChange={() => togglePermiso('roles.crear')}
                  /> Crear roles

                  <input
                     type="checkbox"
                     checked={permisos.includes('roles.editar')}
                     onChange={() => togglePermiso('roles.editar')}
                  /> Editar roles

                  <input
                     type="checkbox"
                     checked={permisos.includes('roles.inhabilitar')}
                     onChange={() => togglePermiso('roles.inhabilitar')}
                  /> Habilitar / Inhabilitar

                  <input
                     type="radio"
                     name="rolesPermissions"
                     onClick={() => toggleGrupoPermisos(permisosRoles)}
                     checked={permisosRoles.every(p => permisos.includes(p))}
                  /> Todos los permisos
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
            <button type="button" onClick={() => closeModal('edit-role-modal')} className="btn btn-primary-cancel">
               Cancelar
            </button>
            <button type="submit" className="btn btn-primary-env">
               Guardar cambios
            </button>
         </div>


      </form>
   )
}