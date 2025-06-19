const token = localStorage.getItem('token');
const API_URL = 'http://localhost:3000/api/categories';

const tbody = document.getElementById('category-table-body');
const form = document.getElementById('category-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submit-btn');
const categoryIdInput = document.getElementById('categoryId');

let editingId = null;
let categoryModal;

// Inicializar modal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
  loadCategories();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!name || !description) {
    Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
    return;
  }

  const data = { name, description };

  try {
    const resCheck = await fetch(API_URL, {
      headers: { 'x-access-token': token }
    });
    const resultCheck = await resCheck.json();
    const categories = resultCheck.categories || resultCheck.data || resultCheck;

    const nombreRepetido = categories.some(cat =>
      cat.name.toLowerCase() === name.toLowerCase() &&
      cat._id !== editingId
    );

    if (nombreRepetido) {
      Swal.fire('Error', 'Ya existe una categoría con ese nombre', 'error');
      return;
    }

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(editingId ? 'Error al actualizar la categoría' : 'Error al crear la categoría');

    Swal.fire('Éxito', editingId ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente', 'success');

    nameInput.value = '';
    descriptionInput.value = '';
    editingId = null;
    submitBtn.textContent = 'Guardar';
    categoryModal.hide();
    loadCategories();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
});

function openNewCategoryModal() {
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Guardar';
  document.getElementById('categoryModalLabel').textContent = 'Nueva Categoría';
  categoryModal.show();
}

async function loadCategories() {
  tbody.innerHTML = '';

  try {
    const res = await fetch(API_URL, {
      headers: { 'x-access-token': token }
    });

    const result = await res.json();
    const categories = result.categories || result.data || result;

    categories.forEach(cat => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cat.name}</td>
        <td>${cat.description}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editCategory('${cat._id}')">Editar</button>
          ${cat.activo
          ? `<button class="btn btn-danger btn-sm" onclick="deactivateCategory('${cat._id}')">Desactivar</button>`
          : `<button class="btn btn-success btn-sm" onclick="activateCategory('${cat._id}')">Activar</button>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
  }
}

async function deleteCategory(id) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la categoría permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-access-token': token }
    });

    if (!res.ok) throw new Error('No se pudo eliminar la categoría');
    Swal.fire('Eliminado', 'Categoría eliminada correctamente', 'success');
    loadCategories();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}

async function editCategory(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { 'x-access-token': token }
    });

    if (!res.ok) throw new Error('No se pudo obtener la categoría');

    const result = await res.json();
    const category = result.category || result.data || result; // Asegura el acceso correcto

    if (!category.name || !category.description) {
      throw new Error('La categoría no tiene datos válidos');
    }

    document.getElementById('name').value = category.name;
    document.getElementById('description').value = category.description;
    editingId = id;

    document.getElementById('submit-btn').textContent = 'Actualizar';
    document.getElementById('categoryModalLabel').textContent = 'Editar Categoría';

    // Mostrar modal usando Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();

  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}

async function deactivateCategory(id) {
  const confirm = await Swal.fire({
    title: '¿Desactivar categoría?',
    text: 'Podrás volver a activarla más adelante.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`${API_URL}/${id}/deactivate`, {
        method: 'PATCH',
        headers: { 'x-access-token': token }
      });

      if (!res.ok) throw new Error('No se pudo desactivar');
      await Swal.fire('Desactivada', 'La subcategoría ha sido desactivada.', 'success');
      loadCategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}

async function activateCategory(id) {
  const confirm = await Swal.fire({
    title: '¿Activar categoría?',
    text: 'Estará nuevamente disponible.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, activar',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`${API_URL}/${id}/activate`, {
        method: 'PATCH',
        headers: { 'x-access-token': token }
      });

      if (!res.ok) throw new Error('No se pudo activar');
      await Swal.fire('Activada', 'La categoría ha sido activada.', 'success');
      loadCategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}


