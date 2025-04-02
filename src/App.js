import React from 'react';
import {  Routes, Route, BrowserRouter, } from "react-router-dom";
import ListaDeUsuarios from './pages/ListaDeUsuarios';
import Home from './pages/Home';
import AñadirUsuario from './pages/AñadirUsuario';
import AñadirRol from './pages/AñadirRol';
import InformacionDeFuente from './pages/InformacionDeFuente';
import Documentacion from './pages/Documentacion';
import AgendarVenta from './pages/AgendarVenta';
import PedidosAgendados from './pages/PedidosAgendados';
import PedidosEntregados from './pages/PedidosEntregados';
import Devoluciones from './pages/Devoluciones';
import PedidosCancelados from './pages/PedidosCancelados';
import RegistrarCotizacion from './pages/RegistrarCotizacion';
import ListaDeCotizaciones from './pages/ListaDeCotizaciones';
import ListaDeClientes from './pages/ListaDeClientes';
import ProspectosDeCliente from './pages/ProspectosDeCliente';
import Login from './pages/Login';
import RecuperarContraseña from './pages/RecuperarContraseña';
import TipoDocumentoAdicionar from './pages/TipoDocumentoAdicionar';
import TipoDocumento from './pages/TipoDocumento';
import TipoDocumentoEdit from './pages/TipoDocumentoEdit';
import Proceso from './pages/Proceso';
import ProcesoEdit from './pages/ProcesoEdit';
import ProcesoAdicionar from './pages/ProcesoAdicionar';
import DocumentacionAdicionar from './pages/DocumentacionAdicionar';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route index path='/' element = {<Login/>}/>
          
          <Route path='/RecuperarContraseña' element = {<RecuperarContraseña/>}/>

          <Route path='/Home' element ={<Home/>}/>
          <Route path='/ListaDeUsuarios' element={<ListaDeUsuarios />} />
          <Route path='/AñadirUsuario' element={<AñadirUsuario/>}/>
          <Route path='/AñadirRol' element={<AñadirRol/>}/>
          <Route path='/InformacionDeFuente' element={<InformacionDeFuente/>}/>
          <Route path='/Documentacion' element={<Documentacion/>}/>
          <Route path='/DocumentacionAdicionar' element={<DocumentacionAdicionar/>}/>
          <Route path='/AgendarVenta' element={<AgendarVenta/>}/>
          <Route path='/PedidosAgendados' element={<PedidosAgendados/>}/>
          <Route path='/PedidosEntregados' element={<PedidosEntregados/>}/>
          <Route path='/Devoluciones' element={<Devoluciones/>}/>
          <Route path='/PedidosCancelados' element={<PedidosCancelados/>}/>
          <Route path='/RegistrarCotizacion' element={<RegistrarCotizacion/>}/>
          <Route path='/ListaDeCotizaciones' element={<ListaDeCotizaciones/>}/>
          <Route path='/ListaDeClientes' element={<ListaDeClientes/>}/>
          <Route path='/ProspectosDeClientes' element={<ProspectosDeCliente/>}/>
          <Route path='/TipoDocumentoAdicionar' element={<TipoDocumentoAdicionar/>}/>
          <Route path='/TipoDocumento' element={<TipoDocumento/>}/>
          <Route path='/TipoDocumentoEdit' element={<TipoDocumentoEdit/>}/>
          <Route path='/Proceso' element={<Proceso/>}/>
          <Route path='/ProcesoEdit' element={<ProcesoEdit/>}/>
          <Route path='/ProcesoAdicionar' element={<ProcesoAdicionar/>}/>

          
           
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;