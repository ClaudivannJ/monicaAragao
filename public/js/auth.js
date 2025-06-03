import api from '../../src/services/api';

// Auth state
let authChecked = false;
let currentUser = null;

// Configure axios interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Sessão expirada ou não autenticado');
      if (!isAuthPage()) {
        window.location.href = '/pages/login.html';
      }
    }
    return Promise.reject(error);
  }
);

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthPage()) {
    checkAuthStatus();
  }
  setupForms();
});

// Helper Functions
function isAuthPage() {
  return window.location.pathname.includes('/login.html') || 
         window.location.pathname.includes('/register.html');
}

function setupForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await setLoadingState(loginForm, true);
      await handleLogin(e);
      await setLoadingState(loginForm, false);
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await setLoadingState(registerForm, true);
      await handleRegister(e);
      await setLoadingState(registerForm, false);
    });
  }
}

// Auth Functions
async function checkAuthStatus() {
  if (authChecked) return;
  authChecked = true;

  try {
    const { data } = await api.get('/api/user/profile');
    currentUser = data.data;
    console.log('Usuário atual:', currentUser); // Verifique no console
    updateAuthUI();
    
    if (isAuthPage() && currentUser) {
      redirectBasedOnRole();
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    currentUser = null;
    updateAuthUI();
  }
}

async function handleLogin(e) {
  const formData = {
    email: e.target.email.value.trim(),
    password: e.target.password.value.trim()
  };

  e.target.password.value = '';

  try {
    if (!formData.email || !formData.password) {
      throw new Error('Por favor, preencha todos os campos');
    }

    console.log(formData)
    const { data } = await api.post('/api/auth/login', formData);
    console.log(data)
    currentUser = data.data.user;
    console.log(currentUser)
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    redirectBasedOnRole();
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
    showErrorToast(errorMessage);
  }
}

async function handleRegister(e) {
  const formData = {
    name: e.target.name.value.trim(),
    email: e.target.email.value.trim(),
    password: e.target.password.value

  };

  e.target.password.value = '';

  try {
    if (!formData.name || !formData.email || !formData.password) {
      throw new Error('Por favor, preencha todos os campos');
    }

    if (formData.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    await api.post('/api/auth/register', formData);
    showSuccessToast('Cadastro realizado com sucesso!');
    setTimeout(() => window.location.href = '/pages/login.html', 1500);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao realizar cadastro';
    showErrorToast(errorMessage);
  }
}

// UI Functions
function redirectBasedOnRole() {
  if (!currentUser) return;
  console.log('Redirecionando com:', {
    isAdmin: currentUser.isAdmin,
    user: currentUser
  });
  setTimeout(() => {
    window.location.href = currentUser.isAdmin ? '/pages/admin.html' : '/';
  }, 100);
}

function updateAuthUI() {
  const authSection = document.querySelector('.auth-section');
  if (!authSection) return;

  authSection.innerHTML = currentUser ? `
    <div class="user-info">
      <span>Olá, ${escapeHtml(currentUser.user.name)}</span>
      <button onclick="logout()" class="logout-btn">Sair</button>
    </div>
  ` : `
    <a href="/pages/login.html" class="auth-link">Login</a>
    <a href="/pages/register.html" class="auth-link">Cadastro</a>
  `;
}

async function setLoadingState(form, isLoading) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading 
      ? '<span class="spinner"></span> Processando...' 
      : submitButton.dataset.originalText || submitButton.textContent;
    
    if (!submitButton.dataset.originalText) {
      submitButton.dataset.originalText = submitButton.textContent;
    }
  }
}

async function logout() {
  try {
    await api.get('/api/auth/logout');
    localStorage.removeItem('token');
    currentUser = null;
    window.location.href = '/';
  } catch (error) {
    showErrorToast('Erro ao fazer logout');
  }
}

// Helpers
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

// Global
window.logout = logout;