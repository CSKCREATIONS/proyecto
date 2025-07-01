const API_URL = 'http://localhost:3000/api/users';
const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  'x-access-token': token
};

export const crearUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(usuario)
  });
  return response.json();
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(usuario)
  });
  return response.json();
};
