import api from '../../src/services/api';

// Cart state
let cart = [];

// Exporta funções para escopo global
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

// Flag para controlar se há atualizações pendentes
let cartNeedsRefresh = false;

async function addToCart(productId, quantity = 1) {
  try {
    const { data } = await api.post('/api/cart', { productId, quantity });
    
    cart = data.cart;
    updateCartUI();
    showSuccessToast('Produto adicionado ao carrinho!');
    cartNeedsRefresh = false; // Atualização já foi feita
  } catch (error) {
    handleCartError(error, 'adicionar ao carrinho');
  }
}

async function updateCartQuantity(productId, newQuantity) {
  try {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const { data } = await api.put('/api/cart', { productId, quantity: newQuantity });
    
    cart = data.cart;
    updateCartUI();
    cartNeedsRefresh = false;
  } catch (error) {
    handleCartError(error, 'atualizar carrinho');
  }
}

async function removeFromCart(productId) {
  try {
    const { data } = await api.delete(`/api/cart/${productId}`);
    
    cart = data.cart;
    updateCartUI();
    showSuccessToast('Produto removido do carrinho');
    cartNeedsRefresh = false;
  } catch (error) {
    handleCartError(error, 'remover do carrinho');
  }
}

async function loadCart() {
  try {
    const { data } = await api.get('/api/cart');
    
    cart = data.cart;
    updateCartUI();
    cartNeedsRefresh = false;
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    if (error.response?.status === 401) {
      cart = [];
      updateCartUI();
    }
  }
}

function handleCartError(error, action) {
  const errorMsg = error.response?.data?.message || `Erro ao ${action}`;
  showErrorToast(errorMsg);
  console.error(`Erro ao ${action}:`, error);
  
  // Marca que precisamos atualizar o carrinho na próxima verificação
  cartNeedsRefresh = true;
}

function updateCartUI() {
  const cartContainer = document.getElementById('cartContainer');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const emptyCartMsg = document.getElementById('emptyCartMsg');
  
  // Atualiza contador
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  // Mostra/oculta mensagem de carrinho vazio
  if (emptyCartMsg) {
    emptyCartMsg.style.display = cart.length === 0 ? 'block' : 'none';
  }
  
  // Atualiza lista de itens
  if (cartContainer) {
    cartContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.product._id}">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.product.name}</h3>
          <p class="cart-item-price">R$ ${item.product.price.toFixed(2)}</p>
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateCartQuantity('${item.product._id}', ${item.quantity - 1})">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateCartQuantity('${item.product._id}', ${item.quantity + 1})">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.product._id}')">
              <i class="fas fa-trash"></i> Remover
            </button>
          </div>
          <p class="cart-item-subtotal">
            Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    `).join('');
  }
  
  // Atualiza total
  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  }
}

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
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

// Verificação otimizada para sincronização
function setupCartSync() {
  // Verifica se há atualizações pendentes a cada 5 segundos (opcional)
  const syncInterval = setInterval(() => {
    if (cartNeedsRefresh) {
      loadCart();
    }
  }, 5000);

  // Atualiza ao ganhar foco da janela (útil se o usuário tem múltiplas abas)
  window.addEventListener('focus', () => {
    if (cartNeedsRefresh) {
      loadCart();
    }
  });

  // Para limpar o intervalo quando não for mais necessário
  return () => clearInterval(syncInterval);
}

// Carrega o carrinho quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  setupCartSync();
});