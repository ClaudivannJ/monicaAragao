// Product data
const products = [
    {
        id: 1,
        name: "Anel Solitário Diamante",
        description: "Elegante anel em ouro 18k com diamante central de 20 pontos",
        price: 2500,
        image: "https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg",
        type: "anel",
        material: "ouro",
        stone: "diamante",
        style: "classico",
        occasion: ["casamento", "presente"]
    },
    {
        id: 2,
        name: "Colar Pérolas Naturais",
        description: "Colar de pérolas naturais com fecho em prata 925",
        price: 800,
        image: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg",
        type: "colar",
        material: "prata",
        stone: "perola",
        style: "classico",
        occasion: ["presente", "pessoal"]
    },
    {
        id: 3,
        name: "Brincos Modernos Prata",
        description: "Par de brincos geométricos em prata 925",
        price: 350,
        image: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg",
        type: "brinco",
        material: "prata",
        stone: "sem",
        style: "moderno",
        occasion: ["pessoal", "presente"]
    },
    {
        id: 4,
        name: "Pulseira Minimalista",
        description: "Pulseira delicada em ouro 18k",
        price: 1200,
        image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
        type: "pulseira",
        material: "ouro",
        stone: "sem",
        style: "minimalista",
        occasion: ["aniversario", "presente", "pessoal"]
    },
    {
        id: 5,
        name: "Anel Romântico Rubi",
        description: "Anel delicado em ouro rosé com rubi central",
        price: 1800,
        image: "https://images.pexels.com/photos/371069/pexels-photo-371069.jpeg",
        type: "anel",
        material: "ouro",
        stone: "rubi",
        style: "romantico",
        occasion: ["aniversario", "presente"]
    },
    {
        id: 6,
        name: "Brincos de Esmeralda",
        description: "Brincos clássicos em ouro amarelo com esmeraldas",
        price: 2200,
        image: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg",
        type: "brinco",
        material: "ouro",
        stone: "esmeralda",
        style: "classico",
        occasion: ["casamento", "presente"]
    },
    {
        id: 7,
        name: "Colar Minimalista Aço",
        description: "Colar geométrico em aço inoxidável",
        price: 450,
        image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg",
        type: "colar",
        material: "aco",
        stone: "sem",
        style: "minimalista",
        occasion: ["pessoal", "presente"]
    },
    {
        id: 8,
        name: "Pulseira Moderna Prata",
        description: "Pulseira articulada em prata 925",
        price: 680,
        image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg",
        type: "pulseira",
        material: "prata",
        stone: "sem",
        style: "moderno",
        occasion: ["aniversario", "pessoal"]
    },
    {
        id: 9,
        name: "Anel Moderno Prata",
        description: "Anel contemporâneo em prata 925",
        price: 450,
        image: "https://images.pexels.com/photos/10875017/pexels-photo-10875017.jpeg",
        type: "anel",
        material: "prata",
        stone: "sem",
        style: "moderno",
        occasion: ["pessoal", "presente"]
    },
    {
        id: 10,
        name: "Colar Romântico Pérolas",
        description: "Colar delicado com pérolas naturais",
        price: 890,
        image: "https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg",
        type: "colar",
        material: "prata",
        stone: "perola",
        style: "romantico",
        occasion: ["casamento", "presente"]
    },
    {
        id: 11,
        name: "Brincos Minimalistas Aço",
        description: "Brincos geométricos em aço inoxidável",
        price: 280,
        image: "https://images.pexels.com/photos/1413419/pexels-photo-1413419.jpeg",
        type: "brinco",
        material: "aco",
        stone: "sem",
        style: "minimalista",
        occasion: ["pessoal", "presente"]
    },
    {
        id: 12,
        name: "Pulseira Clássica Pérolas",
        description: "Pulseira elegante com pérolas naturais",
        price: 750,
        image: "https://images.pexels.com/photos/1191530/pexels-photo-1191530.jpeg",
        type: "pulseira",
        material: "prata",
        stone: "perola",
        style: "classico",
        occasion: ["casamento", "presente"]
    }
  ];
  
  // State management
  let currentQuestion = 'occasion';
  const userPreferences = {
    occasion: '',
    type: '',
    material: '',
    stone: '',
    style: '',
    budget: ''
  };
  let favorites = new Set();
  let currentCategory = null;
  
  // Recommendation weights
  const recommendationWeights = {
    type: 0.3,
    material: 0.25,
    stone: 0.2,
    budget: 0.15,
    style: 0.1,
    occasion: 0.1
  };
  
  // DOM Elements
  const assistantButton = document.getElementById('assistantButton');
  const assistantModal = document.getElementById('assistantModal');
  const closeModal = document.querySelector('.close-modal');
  const startSearchBtn = document.getElementById('startSearch');
  const questionsSection = document.getElementById('questions');
  const matchPercentageSection = document.getElementById('matchPercentage');
  const resultsSection = document.getElementById('results');
  const percentageSlider = document.getElementById('percentageSlider');
  const percentageValue = document.getElementById('percentageValue');
  const restartButton = document.getElementById('restartChat');
  const productsGrid = document.getElementById('productsGrid');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const categoryList = document.getElementById('categoryList');
  const chatMessages = document.getElementById('chatMessages');
  
  // Typing animation function
  function showTypingAnimation() {
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }
  
  function removeTypingAnimation(typing) {
    typing.remove();
  }
  
  function addMessage(text, isAssistant = true, delay = 1000) {
    return new Promise(resolve => {
        const typing = showTypingAnimation();
        
        setTimeout(() => {
            removeTypingAnimation(typing);
            
            const message = document.createElement('div');
            message.className = `message ${isAssistant ? 'assistant' : 'user'}`;
            message.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            resolve();
        }, delay);
    });
  }
  
  // Mobile Menu Functions
  function initializeMobileMenu() {
    const categories = [...new Set(products.map(product => product.type))];
    categoryList.innerHTML = categories.map(category => `
        <li class="category-item" data-category="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}s
        </li>
    `).join('');
  
    // Event Listeners for mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });
  
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
  
    categoryList.addEventListener('click', (e) => {
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            const category = categoryItem.dataset.category;
            currentCategory = category;
            
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            categoryItem.classList.add('active');
  
            displayCatalog(category);
            mobileMenu.classList.remove('active');
        }
    });
  }
  
  // Event Listeners
  assistantButton.addEventListener('click', async () => {
    assistantModal.classList.add('active');
    chatMessages.innerHTML = '';
    await addMessage('Olá! Sou a Julia, sua consultora virtual de joias. 💎');
    await addMessage('Vou te ajudar a encontrar a joia perfeita que combine com seu estilo e ocasião.');
  });
  
  closeModal.addEventListener('click', () => {
    assistantModal.classList.remove('active');
  });
  
  startSearchBtn.addEventListener('click', async () => {
    startSearchBtn.classList.add('hidden');
    await addMessage('Vamos começar nossa busca! Preciso fazer algumas perguntas para entender melhor o que você procura.');
    questionsSection.classList.remove('hidden');
    showQuestion(currentQuestion);
  });
  
  document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', (e) => handleAnswer(e.target));
  });
  
  percentageSlider.addEventListener('input', (e) => {
    percentageValue.textContent = `${e.target.value}%`;
    updateResults();
  });
  
  restartButton.addEventListener('click', restartQuestionnaire);
  
  // Initialize catalog and mobile menu
  initializeMobileMenu();
  displayCatalog();
  
  // Functions
  async function showQuestion(questionId) {
    const questions = {
        occasion: 'Qual a ocasião?',
        type: 'Que tipo de joia você procura?',
        material: 'Qual material você prefere?',
        stone: 'Gostaria de alguma pedra específica?',
        style: 'Qual estilo você procura?',
        budget: 'Qual seu orçamento?'
    };
  
    document.querySelectorAll('.question').forEach(q => q.classList.add('hidden'));
    await addMessage(questions[questionId]);
    document.querySelector(`[data-question="${questionId}"]`).classList.remove('hidden');
  }
  
  async function handleAnswer(button) {
    button.parentElement.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
  
    const answer = button.textContent;
    await addMessage(answer, false, 500);
    
    userPreferences[currentQuestion] = button.dataset.value;
  
    const questions = ['occasion', 'type', 'material', 'stone', 'style', 'budget'];
    const currentIndex = questions.indexOf(currentQuestion);
  
    if (currentIndex < questions.length - 1) {
        currentQuestion = questions[currentIndex + 1];
        setTimeout(() => showQuestion(currentQuestion), 1000);
    } else {
        await addMessage('Ótimo! Agora vou procurar as joias que melhor combinam com suas preferências.');
        showMatchPercentage();
    }
  }
  
  function showMatchPercentage() {
    questionsSection.classList.add('hidden');
    matchPercentageSection.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    updateResults();
  }
  
  function calculateProductScore(product, preferences) {
    let score = 0;
    
    // Type (must match exactly)
    if (product.type === preferences.type) {
      score += recommendationWeights.type;
    } else {
      return 0;
    }
    
    // Material
    if (product.material === preferences.material) {
      score += recommendationWeights.material;
    }
    
    // Stone
    if (product.stone === preferences.stone) {
      score += recommendationWeights.stone;
    }
    
    // Budget
    const budget = parseInt(preferences.budget);
    if ((budget === 500 && product.price <= 500) ||
        (budget === 1000 && product.price > 500 && product.price <= 1000) ||
        (budget === 1001 && product.price > 1000)) {
      score += recommendationWeights.budget;
    }
    
    // Style
    if (product.style === preferences.style) {
      score += recommendationWeights.style;
    }
    
    // Occasion
    if (product.occasion.includes(preferences.occasion)) {
      score += recommendationWeights.occasion;
    }
    
    // Convert to percentage
    const maxPossibleScore = Object.values(recommendationWeights).reduce((a, b) => a + b, 0);
    return (score / maxPossibleScore) * 100;
  }
  
  function getOrganizedRecommendations(preferences) {
    // Perfect matches (meet all important criteria)
    const perfectMatches = products.filter(product => {
      const score = calculateProductScore(product, preferences);
      return score >= 90;
    });
    
    // Alternative suggestions (meet some criteria)
    const alternativeSuggestions = products.filter(product => {
      return product.type === preferences.type && 
             (product.material === preferences.material || 
              (product.stone === preferences.stone && preferences.stone !== 'sem') ||
              product.price <= parseInt(preferences.budget)) &&
             !perfectMatches.includes(product);
    });
    
    return {
      perfectMatches,
      alternativeSuggestions
    };
  }
  
  async function updateResults() {
    const recommendations = getOrganizedRecommendations(userPreferences);
    displayRecommendations(recommendations);
  }
  
  function displayRecommendations({perfectMatches, alternativeSuggestions}) {
    const recommendedProducts = document.getElementById('recommendedProducts');
    recommendedProducts.innerHTML = '';
    
    // Display perfect matches
    if (perfectMatches.length > 0) {
      const perfectSection = document.createElement('div');
      perfectSection.className = 'recommendation-section';
      perfectSection.innerHTML = '<h3 class="section-title">Exatamente o que você procura</h3>';
      
      const perfectGrid = document.createElement('div');
      perfectGrid.className = 'products-grid perfect-matches';
      
      perfectMatches.forEach(product => {
        const card = createProductCard(product);
        const perfectBadge = document.createElement('div');
        perfectBadge.className = 'perfect-badge';
        perfectBadge.textContent = '✔ Match perfeito';
        card.querySelector('.product-info').prepend(perfectBadge);
        perfectGrid.appendChild(card);
      });
      
      perfectSection.appendChild(perfectGrid);
      recommendedProducts.appendChild(perfectSection);
    }
    
    // Display alternative suggestions
    if (alternativeSuggestions.length > 0) {
      const alternativeSection = document.createElement('div');
      alternativeSection.className = 'recommendation-section';
      alternativeSection.innerHTML = '<h3 class="section-title">Você também pode gostar</h3>';
      
      const alternativeGrid = document.createElement('div');
      alternativeGrid.className = 'products-grid alternative-suggestions';
      
      alternativeSuggestions.forEach(product => {
        const card = createProductCard(product);
        const altBadge = document.createElement('div');
        altBadge.className = 'alt-badge';
        
        const reasons = [];
        if (product.material === userPreferences.material) reasons.push('mesmo material');
        if (product.stone === userPreferences.stone && userPreferences.stone !== 'sem') reasons.push('mesma pedra');
        if (product.price <= parseInt(userPreferences.budget)) reasons.push('dentro do orçamento');
        
        altBadge.textContent = reasons.length > 0 ? 
          `Sugestão: ${reasons.join(', ')}` : 
          'Sugestão similar';
        
        card.querySelector('.product-info').prepend(altBadge);
        alternativeGrid.appendChild(card);
      });
      
      alternativeSection.appendChild(alternativeGrid);
      recommendedProducts.appendChild(alternativeSection);
    }
    
    // Show no results message if both are empty
    if (perfectMatches.length === 0 && alternativeSuggestions.length === 0) {
      recommendedProducts.innerHTML = `
        <div class="no-results">
          <p>Nenhuma joia encontrada com esses critérios.</p>
          <p>Tente ajustar suas preferências ou ver nossa coleção completa.</p>
          <button onclick="displayCatalog()" class="btn">Ver Catálogo Completo</button>
        </div>
      `;
    }
  }
  
  function displayCatalog(filterCategory = null) {
    productsGrid.innerHTML = '';
  
    const categories = [...new Set(products.map(product => product.type))];
    const categoriesToShow = filterCategory ? [filterCategory] : categories;
  
    categoriesToShow.forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.className = 'category-section';
  
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + 's';
  
        const productsRow = document.createElement('div');
        productsRow.className = 'products-row';
  
        const categoryProducts = products.filter(product => product.type === category);
        categoryProducts.forEach(product => {
            const card = createProductCard(product);
            productsRow.appendChild(card);
        });
  
        categorySection.appendChild(categoryTitle);
        categorySection.appendChild(productsRow);
        productsGrid.appendChild(categorySection);
    });
    
    // Fecha o modal do assistente se estiver aberto
    if (assistantModal) {
      assistantModal.classList.remove('active');
    }
  }
  
  // Remove esta linha duplicada:
  // window.displayCatalog = function(category = null) {
  //   displayCatalog(category);
  //   assistantModal.classList.remove('active');
  // }
  
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const formattedPrice = product.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
  
    const isFavorite = favorites.has(product.id);
  
    card.innerHTML = `
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formattedPrice}</p>
            <button class="whatsapp-btn" onclick="openWhatsApp('${product.name}', '${product.description}', ${product.price}, ${product.id})">
                <i class="fab fa-whatsapp"></i>
                Comprar
            </button>
        </div>
    `;
  
    return card;
  }
  
  window.toggleFavorite = function(productId) {
    if (favorites.has(productId)) {
        favorites.delete(productId);
    } else {
        favorites.add(productId);
    }
  
    document.querySelectorAll(`.favorite-btn[onclick="toggleFavorite(${productId})"]`).forEach(btn => {
        btn.classList.toggle('active');
        btn.innerHTML = `<i class="${favorites.has(productId) ? 'fas' : 'far'} fa-heart"></i>`;
    });
  }
  
  window.openWhatsApp = function(name, description, price, code) {
    const formattedPrice = price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
  
    const message = encodeURIComponent(
        `Olá! Me interessei por essa joia:\n\n` +
        `💎 *Nome:* ${name}\n` +
        `✨ *Descrição:* ${description}\n` +
        `💰 *Preço:* ${formattedPrice}\n` +
        `🛒 *Código:* ${code}\n\n` +
        `Poderiam me ajudar a concluir a compra?`
    );
  
    window.open(`https://wa.me/5587981569414?text=${message}`);
  }
  
  // window.displayCatalog = function(category = null) {
  //   displayCatalog(category);
  //   assistantModal.classList.remove('active');
  // }
  
  async function restartQuestionnaire() {
    currentQuestion = 'occasion';
    Object.keys(userPreferences).forEach(key => {
        userPreferences[key] = '';
    });
  
    chatMessages.innerHTML = '';
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
  
    await addMessage('Olá! Sou a Julia, sua consultora virtual de joias. 💎');
    await addMessage('Vou te ajudar a encontrar a joia perfeita que combine com seu estilo e ocasião.');
  
    startSearchBtn.classList.remove('hidden');
    questionsSection.classList.add('hidden');
    matchPercentageSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
  }