import api from '../../src/services/api'; // Importa a instância do axios configurada

// Estado global para produtos
let products = [];

// Função para mostrar detalhes do produto (adicionada para corrigir o erro)
function showProductDetails(productId) {
  const product = products.find(p => p._id === productId);
  if (!product) return;

  // Cria um modal para mostrar os detalhes
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <img src="${product.image}" alt="${product.name}" class="modal-image">
      <h2>${escapeHtml(product.name)}</h2>
      <p class="product-description">${escapeHtml(product.description || 'Sem descrição disponível')}</p>
      <div class="modal-price">
        ${product.discountPrice ? `
          <span class="original-price">De: R$ ${product.price.toFixed(2)}</span>
          <span class="discount-price">Por: R$ ${product.discountPrice.toFixed(2)}</span>
          <span class="discount-badge">-${calculateDiscountPercentage(product.price, product.discountPrice)}% OFF</span>
        ` : `
          <span>Preço: R$ ${product.price.toFixed(2)}</span>
        `}
      </div>
      <button class="whatsapp-btn" 
              onclick="openWhatsApp('${escapeHtml(product.name)}', '${escapeHtml(product.description)}', ${product.discountPrice || product.price}, '${product._id}')">
        <i class="fab fa-whatsapp"></i> Comprar via WhatsApp
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
}
async function loadProducts() {
  try {
    const { data } = await api.get('/api/products');
    // Garante que products seja um array
    products = Array.isArray(data) ? data : [];
    
    if (products.length === 0) {
      showErrorToast('Nenhum produto disponível no momento');
    }
    
    renderProducts(products);
    
    if (typeof loadFavorites === 'function') {
      await loadFavorites();
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    showErrorToast('Erro ao carregar produtos. Tente recarregar a página.');
    
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Não foi possível carregar os produtos.</p>
          <button onclick="loadProducts()" class="retry-btn">
            <i class="fas fa-sync-alt"></i> Tentar novamente
          </button>
        </div>
      `;
    }
  }
}
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  productsGrid.innerHTML = productsToRender.map(product => `
    <div class="product-card" data-id="${product._id}">
      <button class="favorite-btn" onclick="toggleFavorite('${product._id}')" 
              data-product-id="${product._id}">
        <i class="far fa-heart"></i>
      </button>
      
      <img src="${product.image}" alt="${product.name}" 
           class="product-image" loading="lazy">
      
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        ${product.discountPrice ? `
          <div class="price-container">
            <span class="original-price">R$ ${product.price.toFixed(2)}</span>
            <span class="discount-price">R$ ${product.discountPrice.toFixed(2)}</span>
          </div>
          <span class="discount-badge">-${calculateDiscountPercentage(product.price, product.discountPrice)}%</span>
        ` : `
          <span class="product-price">R$ ${product.price.toFixed(2)}</span>
        `}
        
        <div class="product-actions">
          <button class="details-btn" onclick="showProductDetails('${product._id}')">
            <i class="fas fa-eye"></i> Detalhes
          </button>
          <button class="whatsapp-btn" 
                  onclick="openWhatsApp('${escapeHtml(product.name)}', '${escapeHtml(product.description)}', ${product.discountPrice || product.price}, '${product._id}')">
            <i class="fab fa-whatsapp"></i> Comprar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Helper functions
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function calculateDiscountPercentage(originalPrice, discountPrice) {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast error';
  toast.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

// Exporta funções para escopo global
window.loadProducts = loadProducts;
window.showProductDetails = showProductDetails;
window.renderProducts = renderProducts;
window.escapeHtml = escapeHtml;
window.calculateDiscountPercentage = calculateDiscountPercentage;

// Carrega os produtos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadProducts);