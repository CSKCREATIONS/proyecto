const API_URL = 'http://localhost:3000/api/users'; // ajusta si es diferente
const token = localStorage.getItem('token');

const headers = {
  'Content-Type': 'application/json',
  'x-access-token': token
};

let userModal;
document.addEventListener('DOMContentLoaded', () => {
  userModal = new bootstrap.Modal(document.getElementById('userModal'));
  loadUsers();

  document.getElementById('userForm').addEventListener('submit', saveUser);
});

async function loadUsers() {
  try {
    const response = await fetch(API_URL, { headers });
    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    const users = result.data;
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    

    users.forEach((user, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.fullName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${new Date(user.createdAt).toLocaleString()}</td>
        <td><button class="btn btn-sm ${user.enabled ? 'btn-success' : 'btn-secondary'}" onclick="toggleUserStatus('${user._id}', ${user.enabled})">
        ${user.enabled ? 'Habilitado' : 'Inhabilitado'}
        </button>
        </td>
        <td>
          <button class="btn btn-sm btn-primary me-2" onclick='editUser(${JSON.stringify(user)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error cargando usuarios:', err);
    Swal.fire('Error', err.message, 'error');
  }
}

function openUserForm() {
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
  document.getElementById('passwordField').style.display = 'block';
  document.getElementById('enabled').checked = true; // por defecto habilitado
  userModal.show();
}


function editUser(user) {
  document.getElementById('userId').value = user._id;
  document.getElementById('username').value = user.username;
  document.getElementById('email').value = user.email;
  document.getElementById('role').value = user.role;
  document.getElementById('enabled').checked = user.enabled; // ← aquí se carga el estado
  document.getElementById('passwordField').style.display = 'none';
  userModal.show();
}


async function saveUser(e) {
  e.preventDefault();

  const id = document.getElementById('userId').value;
  const fullName = document.getElementById('fullName').value.trim();
  const data = {
    fullName,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    role: document.getElementById('role').value,
    enabled: document.getElementById('enabled').checked

  };

  const password = document.getElementById('password').value;
  if (!id && !password) {
    Swal.fire('Error', 'La contraseña es obligatoria para nuevos usuarios', 'warning');
    return;
  }

  if (password) data.password = password;

  try {
    const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    Swal.fire('Éxito', id ? 'Usuario actualizado' : 'Usuario creado', 'success');
    userModal.hide();
    loadUsers();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}

async function deleteUser(id) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el usuario permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
    loadUsers();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}


function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

async function toggleUserStatus(id, currentStatus) {
  const newStatus = !currentStatus;

  const confirmResult = await Swal.fire({
    title: `¿Estás seguro de ${newStatus ? 'habilitar' : 'inhabilitar'} este usuario?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmResult.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ enabled: newStatus })
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    Swal.fire('Éxito', `Usuario ${newStatus ? 'habilitado' : 'inhabilitado'} correctamente`, 'success');
    loadUsers();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}

