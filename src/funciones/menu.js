
/*Funcion para desplegar los submenus de la barra lateral*/ 
export function toggleSubMenu(menuId){
    const targetMenu = document.getElementById(menuId);
    targetMenu.classList.toggle('visible')
}


/***Los elementos son traidos con su id**/
export function mostrarMenu(){
    const closeMenu = document.querySelector('#close-menu')
    const menuLateral = document.querySelector('#menu')
    const companyName = document.querySelector('#empresa-nombre')
    const contenido = document.querySelector('.content')
    
    closeMenu.classList.toggle('visible')
    menuLateral.classList.toggle('mostrar-menu')

    if (window.innerWidth > 768) {
        // En computadoras de escritorio, el contenido se mueve hacia la derecha
        contenido.style.marginLeft = '240px'
        companyName.style.marginLeft = '160px'
    } else{
        // En dispositivos moviles, el contenido se sombrea
        menuLateral.style.boxShadow= '0 0 0 200vmax rgba(0,0,0,.4)';
    }

}

export function cerrarMenu(){
    const closeMenu = document.querySelector('#close-menu')
    const menuLateral = document.querySelector('#menu')
    const companyName = document.querySelector('#empresa-nombre')
    companyName.style.marginLeft = '0px'
    menuLateral.classList.toggle('mostrar-menu')
    closeMenu.classList.toggle('visible')
    const contenido = document.querySelector('.content')
    contenido.style.margin = '0 1.5vw'
    menuLateral.style.boxShadow= 'none';
}