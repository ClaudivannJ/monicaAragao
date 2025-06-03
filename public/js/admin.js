import api from '../../src/services/api';

// Admin state
let adminAuthChecked = false;

// Configure axios interceptor specifically for admin
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Acesso não autorizado - redirecionando para login');
      window.location.href = '/pages/login.html';
    }
    return Promise.reject(error);
  }
);

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await checkAdminAuth();
  console.log(isAdmin)
  
  if (!isAdmin) {
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = '/pages/login.html';
    }
    return;
  }
  
  loadProducts();
  setupEventListeners();
});

// Auth Functions
// Versão final mais robusta
async function checkAdminAuth() {
  if (adminAuthChecked) return false;
  
  try {
    const { data } = await api.get('/api/user/profile');
    console.log('Dados completos do usuário:', data);
    
    // Acesso correto aos dados aninhados
    if (data.data && data.data.user) {
      // Verifique explicitamente se isAdmin existe
      const isAdmin = data.data.user.isAdmin || false;
      console.log('É admin?', isAdmin);
      adminAuthChecked = true;
      return isAdmin;
    }
    return false;
  } catch (error) {
    console.error('Falha ao verificar admin:', error);
    return false;
  }
}
// Product Functions
async function loadProducts() {
  try {
    const { data } = await api.get('/api/products');
    displayProducts(data);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showErrorToast('Erro ao carregar produtos');
  }
}

function displayProducts(products) {
  const productsList = document.getElementById('productsList');
  if (!productsList) return;

  productsList.innerHTML = products.map(product => `
    <div class="admin-product-card" data-id="${product._id}">
      <img src="${product.image}" alt="${product.name}" class="admin-product-image">
      <div class="admin-product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="admin-product-price">R$ ${product.price.toFixed(2)}</p>
        <p class="admin-product-type">${product.type}</p>
      </div>
      <div class="admin-product-actions">
        <button onclick="editProduct('${product._id}')" class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteProduct('${product._id}')" class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Form Handlers
function setupEventListeners() {
  const productForm = document.getElementById('productForm');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

async function handleProductSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
      // Não definir Content-Type, o navegador fará isso automaticamente
      // com o boundary correto para multipart/form-data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao adicionar produto');
    }

    const { data } = await response.json();
    showSuccessToast('Produto adicionado com sucesso!');
    form.reset();
    loadProducts();
  } catch (error) {
    showErrorToast(error.message);
  }
}

async function editProduct(productId) {
  try {
    const { data: product } = await api.get(`/api/products/${productId}`);
    const form = document.getElementById('productForm');
    
    form.name.value = product.name;
    form.description.value = product.description;
    form.price.value = product.price;
    form.type.value = product.type;
    form.image.value = product.image;
    
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const updatedData = Object.fromEntries(formData);
      
      try {
        await api.put(`/api/products/${productId}`, updatedData);
        showSuccessToast('Produto atualizado com sucesso!');
        form.reset();
        form.onsubmit = handleProductSubmit;
        loadProducts();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao atualizar produto';
        showErrorToast(errorMessage);
      }
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erro ao carregar produto';
    showErrorToast(errorMessage);
  }
}

async function deleteProduct(productId) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  try {
    await api.delete(`/api/products/${productId}`);
    showSuccessToast('Produto excluído com sucesso!');
    loadProducts();
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erro ao excluir produto';
    showErrorToast(errorMessage);
  }
}

async function handleLogout() {
  try {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
  } catch (error) {
    showErrorToast('Erro ao fazer logout');
  }
}

// UI Helpers
function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Global functions
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;