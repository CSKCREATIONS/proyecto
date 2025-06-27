const token = localStorage.getItem('token');
const API_URL = 'http://localhost:3000/api/subcategories';
const CATEGORY_API_URL = 'http://localhost:3000/api/categories';

const tbody = document.getElementById('subcategory-table-body');
const form = document.getElementById('subcategory-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');

const editForm = document.getElementById('edit-form');
const editId = document.getElementById('edit-id');
const editName = document.getElementById('edit-name');
const editDescription = document.getElementById('edit-description');
const editCategory = document.getElementById('edit-category');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    category: categoryInput.value
  };

  if (!data.name || !data.description || !data.category) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Error al crear subcategoría');

    form.reset();
    loadSubcategories();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

async function loadCategories() {
  const selects = [document.getElementById('category'), document.getElementById('edit-category')];
  selects.forEach(select => select.innerHTML = '<option value="">Seleccione una categoría</option>');

  try {
    const res = await fetch(CATEGORY_API_URL, {
      headers: {
        'x-access-token': token
      }
    });

    const result = await res.json();
    const categories = result.categories || result.data || result;

    categories.forEach(cat => {
      selects.forEach(select => {
        const option = document.createElement('option');
        option.value = cat._id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    });
  } catch (err) {
    alert('Error al cargar las categorías');
  }
}

async function loadSubcategories() {
  tbody.innerHTML = '';

  try {
    const res = await fetch(API_URL, {
      headers: {
        'x-access-token': token
      }
    });

    const result = await res.json();
    const subcategories = result.subcategories || result.data || result;

    if (!Array.isArray(subcategories)) throw new Error('La respuesta no es una lista');

    subcategories.forEach(sub => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sub.name}</td>
        <td>${sub.description}</td>
        <td>${sub.category?.name || 'Sin categoría'}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editSubcategory('${sub._id}')">Editar</button>
          ${sub.activo
        ? `<button class="btn btn-sm btn-danger" onclick="deactivateSubcategory('${sub._id}')">Desactivar</button>`
        : `<button class="btn btn-sm btn-success" onclick="activateSubcategory('${sub._id}')">Activar</button>`
      }
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Error al cargar subcategorías:', error);
    alert('No se pudieron cargar las subcategorías');
  }
}

async function deleteSubcategory(id) {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token
        }
      });

      if (!res.ok) throw new Error('No se pudo eliminar');

      await Swal.fire(
        '¡Eliminado!',
        'La subcategoría ha sido eliminada.',
        'success'
      );

      loadSubcategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}


async function editSubcategory(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        'x-access-token': token
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'No se pudo obtener la subcategoría');
    }

    const result = await res.json();
    const sub = result.subcategory || result.data || result;

    if (!sub || !sub.name) throw new Error('Subcategoría inválida');

    editId.value = sub._id;
    editName.value = sub.name;
    editDescription.value = sub.description;
    editCategory.value = sub.category?._id || '';

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  } catch (err) {
    Swal.fire('Error', err.message || 'Ocurrió un error inesperado', 'error');
  }
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = editId.value;
  const data = {
    name: editName.value.trim(),
    description: editDescription.value.trim(),
    category: editCategory.value
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('No se pudo actualizar');

    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    loadSubcategories();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

async function deactivateSubcategory(id) {
  const confirm = await Swal.fire({
    title: '¿Desactivar subcategoría?',
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
      loadSubcategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}

async function activateSubcategory(id) {
  const confirm = await Swal.fire({
    title: '¿Activar subcategoría?',
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
      await Swal.fire('Activada', 'La subcategoría ha sido activada.', 'success');
      loadSubcategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}


loadCategories();
loadSubcategories();
