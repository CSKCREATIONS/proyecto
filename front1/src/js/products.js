const apiUrl = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'x-access-token': token
};

const productTableBody = document.getElementById('productTableBody');
const productForm = document.getElementById('productForm');
const productIdField = document.getElementById('productId');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const categorySelect = document.getElementById('categorySelect');
const subcategorySelect = document.getElementById('subcategorySelect');

// Cargar categorías
async function loadCategories() {
  try {
    const res = await fetch(`${apiUrl}/categories`, { headers });
    const data = await res.json();
    const categories = data.categories || data.data || data;
    categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

// Cargar subcategorías
async function loadSubcategories() {
  try {
    const res = await fetch(`${apiUrl}/subcategories`, { headers });
    const data = await res.json();
    const subcategories = data.subcategories || data.data || data;
    subcategorySelect.innerHTML = '<option value="">Seleccione una subcategoría</option>';
    subcategories.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub._id;
      option.textContent = `${sub.name} (${sub.category?.name || 'Sin categoría'})`;
      subcategorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar subcategorías:', error);
  }
}

// Cargar productos
async function loadProducts() {
  try {
    const res = await fetch(`${apiUrl}/products`, { headers });
    const data = await res.json();
    const products = data.products || data.data || data;

    // Solo productos activos
    const activeProducts = products.filter(p => p.estado !== false);

    productTableBody.innerHTML = '';

    activeProducts.forEach(product => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>$${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category?.name || 'Sin categoría'}</td>
        <td>${product.subcategory?.name || 'Sin subcategoría'}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editProduct('${product._id}')">Editar</button>
    ${product.activo
      ? `<button class="btn btn-sm btn-danger" onclick="deactivateProduct('${product._id}')">Desactivar</button>`
      : `<button class="btn btn-sm btn-success" onclick="activateProduct('${product._id}')">Activar</button>`}
        </td>
      `;
      productTableBody.appendChild(tr);
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Crear o actualizar producto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = productIdField.value;
  console.log('ID a enviar:', id);

  const product = {
    name: nameInput.value,
    description: descriptionInput.value,
    price: parseFloat(priceInput.value),
    stock: parseInt(stockInput.value),
    category: categorySelect.value,
    subcategory: subcategorySelect.value
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrl}/products/${id}` : `${apiUrl}/products`;

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(product)
    });

    if (res.ok) {
      const isEdit = !!id;

  productForm.reset();
  productIdField.value = '';
  const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
  if (modal) modal.hide();
  await loadProducts();

  Swal.fire({
    icon: 'success',
    title: isEdit ? 'Producto actualizado' : 'Producto agregado',
    text: isEdit
      ? 'El producto ha sido actualizado correctamente.'
      : 'El producto ha sido creado exitosamente.',
    timer: 2000,
    showConfirmButton: false
  });
    } else {
      const error = await res.json();
      alert('Error: ' + (error.message || 'No se pudo guardar el producto'));
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
  }
});

// Editar producto
function openNewProductModal() {
  productForm.reset();
  productIdField.value = '';
  document.getElementById('productModalLabel').textContent = 'Agregar Producto';
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

async function editProduct(id) {
  try {
    const res = await fetch(`${apiUrl}/products/${id}`, { headers });
    const result = await res.json();

    const product = result.data; // <== así accedes al producto correctamente

    // Cargar campos en el formulario
    productIdField.value = product._id;
    nameInput.value = product.name || '';
    descriptionInput.value = product.description || '';
    priceInput.value = product.price || '';
    stockInput.value = product.stock || '';
    categorySelect.value = product.category?._id || product.category || '';
    subcategorySelect.value = product.subcategory?._id || product.subcategory || '';

    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  } catch (error) {
    console.error('Error al cargar producto:', error);
  }
  
}



// Activar producto
async function activateProduct(id) {
  const result = await Swal.fire({
    title: '¿Activar producto?',
    text: 'El producto volverá a estar disponible.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, activar'
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${apiUrl}/products/${id}/activate`, {
        method: 'PATCH',
        headers
      });

      if (res.ok) {
        Swal.fire('Activado', 'El producto ha sido activado.', 'success');
        await loadProducts();
      } else {
        const error = await res.json();
        throw new Error(error.message || 'No se pudo activar');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}

// Desactivar producto
async function deactivateProduct(id) {
  const result = await Swal.fire({
    title: '¿Desactivar producto?',
    text: 'El producto no se eliminará, solo se marcará como inactivo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, desactivar'
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${apiUrl}/products/${id}/deactivate`, {
        method: 'PATCH',
        headers
      });

      if (res.ok) {
        Swal.fire('Desactivado', 'El producto ha sido desactivado.', 'success');
        await loadProducts();
      } else {
        const error = await res.json();
        throw new Error(error.message || 'No se pudo desactivar');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}


// Inicializar
(async () => {
  await loadCategories();
  await loadSubcategories();
  await loadProducts();
})();
