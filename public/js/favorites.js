import api from '../../src/services/api';

// Favorites state
let favorites = [];
let favoritesNeedRefresh = false;

// Exporta função para escopo global
window.toggleFavorite = toggleFavorite;

async function toggleFavorite(productId) {
  try {
    const { data } = await api.post('/api/favorites/toggle', { productId });
    
    favorites = data.favorites;
    updateFavoritesUI();
    
    const isNowFavorite = data.isFavorite;
    showSuccessToast(
      isNowFavorite 
        ? 'Produto adicionado aos favoritos!' 
        : 'Produto removido dos favoritos'
    );
    
    favoritesNeedRefresh = false;
    return isNowFavorite;
  } catch (error) {
    handleFavoriteError(error);
    return false;
  }
}

async function loadFavorites() {
  try {
    const { data } = await api.get('/api/favorites');
    
    favorites = data.favorites;
    updateFavoritesUI();
    favoritesNeedRefresh = false;
  } catch (error) {
    handleFavoriteError(error);
    
    if (error.response?.status === 401) {
      favorites = [];
      updateFavoritesUI();
    }
  }
}

function handleFavoriteError(error) {
  const errorMsg = error.response?.data?.message || 'Erro ao atualizar favoritos';
  showErrorToast(errorMsg);
  console.error('Erro com favoritos:', error);
  favoritesNeedRefresh = true;
}

function updateFavoritesUI() {
  // Atualiza todos os botões de favorito na página
  document.querySelectorAll('[data-product-id]').forEach(btn => {
    const productId = btn.dataset.productId;
    const isFavorite = favorites.some(fav => 
      fav._id === productId || fav === productId
    );
    
    // Atualiza ícone e estado
    const icon = btn.querySelector('i') || btn;
    icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    btn.classList.toggle('active', isFavorite);
    btn.setAttribute('aria-pressed', isFavorite);
    btn.title = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  });
  
  // Atualiza contador de favoritos
  updateFavoritesCounter();
}

function updateFavoritesCounter() {
  const favoritesCount = document.getElementById('favoritesCount');
  if (favoritesCount) {
    favoritesCount.textContent = favorites.length;
    favoritesCount.style.display = favorites.length > 0 ? 'inline-block' : 'none';
  }
}

// Sistema de sincronização inteligente
function setupFavoritesSync() {
  // Verifica se há atualizações pendentes quando a janela ganha foco
  window.addEventListener('focus', () => {
    if (favoritesNeedRefresh) {
      loadFavorites();
    }
  });

  // Sincronização entre abas
  window.addEventListener('storage', (event) => {
    if (event.key === 'favoritesUpdated') {
      loadFavorites();
    }
  });
}

// Notifica outras abas sobre mudanças
function notifyFavoritesChange() {
  localStorage.setItem('favoritesUpdated', Date.now().toString());
}

// Helper functions para mostrar notificações
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  setupFavoritesSync();
});

// Atualiza favoritos quando o estado de autenticação muda
document.addEventListener('userChange', () => {
  favoritesNeedRefresh = true;
  loadFavorites();
});