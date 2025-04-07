import Swal from 'sweetalert2'

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