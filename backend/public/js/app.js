// Маршруты Laravel (без .html)
const ROUTES = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  wishlist: '/wishlist',
  reviews: '/reviews',
  login: '/login',
  admin: '/admin',
  orders: '/orders',
  product: '/product',
};

function productUrl(id) {
  return `${ROUTES.product}?id=${encodeURIComponent(id)}`;
}

// Простое "хранилище" в localStorage
const STORAGE_KEYS = {
  CART: 'dp_cart',
  USER: 'dp_user',
  REVIEWS: 'dp_reviews',
  WHATSAPP: 'dp_whatsapp_phone',
  WISHLIST: 'dp_wishlist',
  ORDERS: 'dp_orders',
  PROMOCODES: 'dp_promocodes',
};

// ===== Утилиты =====
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(value) {
  return value.toLocaleString('ru-RU') + ' ₽';
}

function productImageSrc(product) {
  if (product.image) return product.image;
  const id = product.id || 'p1';
  return `/images/products/${id}.jpg`;
}

// Демонстрационный список товаров
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Север No. 01',
    image: '/images/products/p1.jpg',
    notes: 'Цитрусовые, бергамот, белые цветы',
    category: 'женские',
    volume: '50 мл',
    price: 3200,
    popular: true,
    description: 'Свежий и элегантный аромат с цитрусовыми нотами бергамота и нежными белыми цветами. Идеален для дневного использования.',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Север No. 07',
    image: '/images/products/p2.jpg',
    notes: 'Жасмин, ваниль, мускус',
    category: 'женские',
    volume: '50 мл',
    price: 3400,
    popular: true,
    description: 'Соблазнительный аромат с нотами жасмина, ванили и мускуса. Создаёт атмосферу роскоши и утончённости.',
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Север Нуар',
    image: '/images/products/p3.jpg',
    notes: 'Ладан, кожа, тёмные древесные ноты',
    category: 'мужские',
    volume: '50 мл',
    price: 3600,
    popular: true,
    description: 'Мужской аромат с глубокими нотами ладана, кожи и тёмных древесных аккордов. Для уверенных в себе.',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Север Океан',
    image: '/images/products/p4.png',
    notes: 'Морской бриз, цитрус, кедр',
    category: 'мужские',
    volume: '50 мл',
    price: 3100,
    description: 'Свежий морской аромат с цитрусовыми нотами и кедром. Ощущение прохлады и свободы.',
    inStock: true,
  },
  {
    id: 'p5',
    name: 'Север Унисон',
    image: '/images/products/p5.png',
    notes: 'Амбра, ирис, специи',
    category: 'унисекс',
    volume: '50 мл',
    price: 3700,
    description: 'Универсальный аромат с нотами амбры, ириса и специй. Подходит для любого времени суток.',
    inStock: true,
  },
  {
    id: 'p6',
    name: 'Север Бархат',
    image: '/images/products/p6.png',
    notes: 'Роза, пачули, пралине',
    category: 'женские',
    volume: '30 мл',
    price: 2600,
    description: 'Нежный и чувственный аромат с нотами розы, пачули и пралине. Для особых моментов.',
    inStock: true,
  },
];

let PRODUCTS = readStorage('sever_products_v7', DEFAULT_PRODUCTS);

function saveProducts() {
  writeStorage('sever_products_v7', PRODUCTS);
}

// ===== Пользователь / авторизация =====
function getCurrentUser() {
  return readStorage(STORAGE_KEYS.USER, null);
}

function setCurrentUser(user) {
  if (user) {
    writeStorage(STORAGE_KEYS.USER, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  updateNavForUser();
}

function updateNavForUser() {
  const user = getCurrentUser();
  const userLink = document.getElementById('user-nav-link');
  const adminLink = document.getElementById('admin-nav-link');
  const profileLink = document.getElementById('profile-nav-link');
  const ordersLink = document.getElementById('orders-nav-link');
  const cartCounter = document.getElementById('cart-counter');
  if (!userLink) return;

  // Обновляем счётчик корзины
  if (cartCounter) {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 0) {
      cartCounter.textContent = totalQty;
      cartCounter.hidden = false;
    } else {
      cartCounter.hidden = true;
    }
  }

  if (user) {
    userLink.textContent = 'Выйти';
    userLink.href = '#';
    userLink.onclick = (e) => {
      e.preventDefault();
      setCurrentUser(null);
      window.location.href = ROUTES.home;
    };
    if (adminLink) {
      adminLink.hidden = user.role !== 'admin';
    }
    if (profileLink) {
      profileLink.hidden = false;
    }
    if (ordersLink) {
      ordersLink.hidden = false;
    }
  } else {
    userLink.textContent = 'Вход';
    userLink.href = ROUTES.login;
    userLink.onclick = null;
    if (adminLink) {
      adminLink.hidden = true;
    }
    if (profileLink) {
      profileLink.hidden = true;
    }
    if (ordersLink) {
      ordersLink.hidden = true;
    }
  }
}

// ===== Корзина =====
function getCart() {
  return readStorage(STORAGE_KEYS.CART, []);
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.CART, cart);
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
}

function setCartQty(productId, qty) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item && qty <= 0) return;
  if (!item) {
    cart.push({ id: productId, qty });
  } else {
    item.qty = qty;
  }
  cart = cart.filter((i) => i.qty > 0);
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
}

// ===== Отзывы =====
function getReviews() {
  return readStorage(STORAGE_KEYS.REVIEWS, []);
}

function saveReviews(reviews) {
  writeStorage(STORAGE_KEYS.REVIEWS, reviews);
}

function addReview({ name, rating, text }) {
  const reviews = getReviews();
  const newReview = {
    id: 'r' + Date.now(),
    name,
    rating: Number(rating),
    text,
    createdAt: new Date().toISOString(),
    approved: false,
    hidden: false,
  };
  reviews.unshift(newReview);
  saveReviews(reviews);
  return newReview;
}

// ===== WhatsApp =====
function getWhatsappPhone() {
  return readStorage(STORAGE_KEYS.WHATSAPP, null);
}

function setWhatsappPhone(phone) {
  if (!phone) {
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP);
  } else {
    writeStorage(STORAGE_KEYS.WHATSAPP, phone);
  }
}

function initWhatsappButton() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  const stored = getWhatsappPhone();
  const phone = stored || '79990000000'; // замените на свой номер
  btn.href = 'https://wa.me/' + phone;
}

// ===== Избранное =====
function getWishlist() {
  return readStorage(STORAGE_KEYS.WISHLIST, []);
}

function saveWishlist(wishlist) {
  writeStorage(STORAGE_KEYS.WISHLIST, wishlist);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
    showNotification('Товар добавлен в избранное', 'success');
  } else {
    wishlist.splice(idx, 1);
    showNotification('Товар удалён из избранного', 'info');
  }
  saveWishlist(wishlist);
  return idx === -1;
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

// ===== Заказы =====
function getOrders() {
  return readStorage(STORAGE_KEYS.ORDERS, []);
}

function saveOrders(orders) {
  writeStorage(STORAGE_KEYS.ORDERS, orders);
}

function createOrder(cart, promocode = null) {
  const orders = getOrders();
  const order = {
    id: 'ord' + Date.now(),
    items: cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return product ? { ...item, name: product.name, price: product.price } : null;
    }).filter(Boolean),
    total: cart.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0),
    discount: 0,
    finalTotal: 0,
    promocode,
    status: 'pending',
    createdAt: new Date().toISOString(),
    userEmail: getCurrentUser()?.email || 'guest',
  };
  
  // Применяем промокод если есть
  if (promocode) {
    const promo = getPromocode(promocode);
    if (promo && promo.active) {
      order.discount = promo.type === 'percent' 
        ? Math.round(order.total * promo.value / 100)
        : promo.value;
      order.finalTotal = Math.max(0, order.total - order.discount);
    } else {
      order.finalTotal = order.total;
    }
  } else {
    order.finalTotal = order.total;
  }
  
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

// ===== Промокоды =====
function getPromocodes() {
  return readStorage(STORAGE_KEYS.PROMOCODES, [
    { code: 'WELCOME10', type: 'percent', value: 10, active: true, description: 'Скидка 10% на первый заказ' },
    { code: 'GOLD500', type: 'fixed', value: 500, active: true, description: 'Скидка 500₽ на заказ от 3000₽' },
  ]);
}

function savePromocodes(promocodes) {
  writeStorage(STORAGE_KEYS.PROMOCODES, promocodes);
}

function getPromocode(code) {
  return getPromocodes().find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
}

// ===== Уведомления =====
function showNotification(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('toast--show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Рендеринг товаров =====
function createProductCard(product, options = {}) {
  const card = document.createElement('article');
  card.className = 'product-card';
  const cart = getCart();
  const inCart = cart.find((i) => i.id === product.id);
  const qty = inCart ? inCart.qty : 0;
  const inWishlist = isInWishlist(product.id);

  card.innerHTML = `
    <a href="${productUrl(product.id)}" class="product-card__media">
      <img src="${productImageSrc(product)}" alt="${product.name}" loading="lazy" width="480" height="640">
    </a>
    <div class="product-card__top">
      <div>
        <div class="product-card__name">
          <a href="${productUrl(product.id)}" class="product-card__link">${product.name}</a>
        </div>
        <div class="product-card__notes">${product.notes}</div>
      </div>
      <div class="product-card__tags">
        <span class="product-card__tag">${product.category}</span>
        ${product.popular ? '<span class="product-card__tag product-card__tag--popular">Популярный</span>' : ''}
        ${!product.inStock ? '<span class="product-card__tag product-card__tag--out">Нет в наличии</span>' : ''}
      </div>
    </div>
    <div class="product-card__bottom">
      <div>
        <div class="product-card__price">${formatPrice(product.price)}</div>
        <div class="product-card__volume">${product.volume}</div>
      </div>
      <div class="product-card__actions" data-product-id="${product.id}">
        <button type="button" class="wishlist-btn ${inWishlist ? 'wishlist-btn--active' : ''}" data-action="wishlist" aria-label="Избранное">
          ${inWishlist ? '♥' : '♡'}
        </button>
        <div class="product-card__qty">
          <button type="button" class="qty-btn" data-action="dec">−</button>
          <span data-role="qty-value">${qty}</span>
          <button type="button" class="qty-btn" data-action="inc">+</button>
        </div>
        <button type="button" class="btn btn--outline btn--sm" data-action="add" ${!product.inStock ? 'disabled' : ''}>
          В корзину
        </button>
      </div>
    </div>
  `;

  const actions = card.querySelector('.product-card__actions');
  const qtySpan = actions.querySelector('[data-role="qty-value"]');
  const wishlistBtn = actions.querySelector('[data-action="wishlist"]');

  actions.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    if (!action) return;
    
    if (action === 'wishlist') {
      const added = toggleWishlist(product.id);
      wishlistBtn.textContent = added ? '♥' : '♡';
      wishlistBtn.classList.toggle('wishlist-btn--active', added);
      if (options.onWishlistChange) options.onWishlistChange();
      return;
    }
    
    let currentQty = Number(qtySpan.textContent) || 0;
    if (action === 'dec') {
      currentQty = Math.max(0, currentQty - 1);
      setCartQty(product.id, currentQty);
    } else if (action === 'inc') {
      currentQty += 1;
      setCartQty(product.id, currentQty);
    } else if (action === 'add') {
      currentQty += 1;
      addToCart(product.id, 1);
      showNotification('Товар добавлен в корзину', 'success');
    }
    qtySpan.textContent = currentQty;
    if (options.onCartChange) options.onCartChange();
    updateNavForUser();
  });

  return card;
}

function initIndexPage() {
  const container = document.getElementById('popular-products');
  if (!container) return;
  const popular = PRODUCTS.filter((p) => p.popular);
  container.innerHTML = '';
  popular.forEach((p) => container.appendChild(createProductCard(p, {
    onCartChange: () => updateNavForUser(),
    onWishlistChange: () => updateNavForUser(),
  })));
}

function initCatalogPage() {
  const container = document.getElementById('catalog-products');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const priceFilter = document.getElementById('price-filter');
  const sortSelect = document.getElementById('sort-select');
  if (!container) return;

  function render() {
    const search = (searchInput?.value || '').toLowerCase();
    const category = categoryFilter?.value || '';
    const priceRange = priceFilter?.value || '';
    const sortBy = sortSelect?.value || 'default';
    
    let filtered = PRODUCTS.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.notes.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search));
      const matchesCategory = !category || p.category === category;
      
      let matchesPrice = true;
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        matchesPrice = p.price >= min && (max ? p.price <= max : true);
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Сортировка
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    container.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Товары не найдены. Попробуйте изменить фильтры.';
      container.appendChild(empty);
      return;
    }
    
    filtered.forEach((p) =>
      container.appendChild(
        createProductCard(p, {
          onCartChange: () => {
            updateNavForUser();
          },
          onWishlistChange: () => {
            updateNavForUser();
          },
        }),
      ),
    );
  }

  render();
  searchInput?.addEventListener('input', render);
  categoryFilter?.addEventListener('change', render);
  priceFilter?.addEventListener('change', render);
  sortSelect?.addEventListener('change', render);
}

// ===== Страница корзины =====
function initCartPage() {
  const itemsContainer = document.getElementById('cart-items');
  const emptyBlock = document.getElementById('cart-empty');
  const summaryBlock = document.getElementById('cart-summary');
  if (!itemsContainer || !emptyBlock || !summaryBlock) return;

  const totalQtyEl = document.getElementById('cart-total-qty');
  const totalPriceEl = document.getElementById('cart-total-price');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const checkoutBtn = document.getElementById('checkout-btn');
  const promocodeInput = document.getElementById('promocode-input');
  const promocodeBtn = document.getElementById('promocode-btn');
  const promocodeMsg = document.getElementById('promocode-message');
  
  let appliedPromo = null;

  if (promocodeBtn) {
    promocodeBtn.addEventListener('click', () => {
      const code = promocodeInput.value.trim().toUpperCase();
      if (!code) return;
      const promo = getPromocode(code);
      if (promo) {
        appliedPromo = promo;
        promocodeMsg.textContent = `Промокод "${code}" применён!`;
        promocodeMsg.className = 'form__message form__message--success';
        renderCart();
      } else {
        appliedPromo = null;
        promocodeMsg.textContent = 'Промокод не найден или неактивен';
        promocodeMsg.className = 'form__message form__message--error';
        renderCart();
      }
    });
  }

  function renderCart() {
    const cart = getCart();
    if (!cart.length) {
      emptyBlock.hidden = false;
      itemsContainer.hidden = true;
      summaryBlock.hidden = true;
      itemsContainer.innerHTML = '';
      appliedPromo = null;
      if (promocodeInput) promocodeInput.value = '';
      if (promocodeMsg) {
        promocodeMsg.textContent = '';
        promocodeMsg.className = 'form__message';
      }
      return;
    }

    emptyBlock.hidden = true;
    itemsContainer.hidden = false;
    summaryBlock.hidden = false;

    itemsContainer.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return;
      const linePrice = product.price * item.qty;
      totalQty += item.qty;
      totalPrice += linePrice;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <div class="cart-item__name"><a href="${productUrl(product.id)}">${product.name}</a></div>
          <div class="cart-item__meta">${product.volume} · ${product.category}</div>
        </div>
        <div class="cart-item__controls" data-product-id="${product.id}">
          <button type="button" class="qty-btn" data-action="dec">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-action="inc">+</button>
          <button type="button" class="btn btn--outline btn--sm" data-action="remove">Удалить</button>
        </div>
        <div class="cart-item__price">${formatPrice(linePrice)}</div>
      `;

      const controls = row.querySelector('.cart-item__controls');
      const qtySpan = controls.querySelector('span');
      controls.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        let currentQty = Number(qtySpan.textContent) || 0;
        if (action === 'dec') {
          currentQty = Math.max(0, currentQty - 1);
          setCartQty(product.id, currentQty);
        } else if (action === 'inc') {
          currentQty += 1;
          setCartQty(product.id, currentQty);
        } else if (action === 'remove') {
          removeFromCart(product.id);
        }
        renderCart();
        updateNavForUser();
      });

      itemsContainer.appendChild(row);
    });

    // Применяем промокод
    let discount = 0;
    let finalTotal = totalPrice;
    if (appliedPromo) {
      discount = appliedPromo.type === 'percent' 
        ? Math.round(totalPrice * appliedPromo.value / 100)
        : appliedPromo.value;
      finalTotal = Math.max(0, totalPrice - discount);
    }

    totalQtyEl.textContent = String(totalQty);
    if (discount > 0) {
      discountRow.hidden = false;
      discountEl.textContent = '-' + formatPrice(discount);
      totalPriceEl.textContent = formatPrice(finalTotal);
    } else {
      discountRow.hidden = true;
      totalPriceEl.textContent = formatPrice(totalPrice);
    }
  }

  checkoutBtn?.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) {
      showNotification('Корзина пуста', 'error');
      return;
    }
    
    const order = createOrder(cart, appliedPromo?.code);
    saveCart([]);
    appliedPromo = null;
    if (promocodeInput) promocodeInput.value = '';
    if (promocodeMsg) {
      promocodeMsg.textContent = '';
      promocodeMsg.className = 'form__message';
    }
    showNotification('Заказ оформлен! Номер заказа: ' + order.id, 'success');
    setTimeout(() => {
      window.location.href = ROUTES.orders;
    }, 1500);
  });

  renderCart();
}

// ===== Страница входа =====
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const passwordGroup = document.getElementById('password-group');
  const msg = document.getElementById('login-message');
  const roleButtons = document.querySelectorAll('.role-switch__btn');

  let currentRole = 'customer';

  roleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleButtons.forEach((b) => b.classList.remove('role-switch__btn--active'));
      btn.classList.add('role-switch__btn--active');
      currentRole = btn.getAttribute('data-role');
      if (currentRole === 'admin') {
        passwordGroup.hidden = false;
      } else {
        passwordGroup.hidden = true;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form__message';

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email) {
      msg.textContent = 'Введите e-mail.';
      msg.classList.add('form__message--error');
      return;
    }

    if (currentRole === 'admin') {
      if (password !== 'admin123') {
        msg.textContent = 'Неверный пароль администратора (для примера: admin123).';
        msg.classList.add('form__message--error');
        return;
      }
    }

    setCurrentUser({
      role: currentRole,
      email,
    });

    msg.textContent =
      currentRole === 'admin'
        ? 'Вы вошли как администратор. Сейчас произойдет переход в админ-панель.'
        : 'Вы вошли как покупатель. Можно оформить заказ и оставлять отзывы.';
    msg.classList.add('form__message--success');

    setTimeout(() => {
      window.location.href = currentRole === 'admin' ? ROUTES.admin : ROUTES.home;
    }, 700);
  });
}

// ===== Страница отзывов =====
function initReviewsPage() {
  const listEl = document.getElementById('public-reviews');
  const form = document.getElementById('review-form');
  if (!listEl) return;
  // Laravel-страница отзывов: форма отправляется через reviews.js
  if (form?.hasAttribute('data-laravel')) return;
  const nameInput = document.getElementById('review-name');
  const ratingInput = document.getElementById('review-rating');
  const textInput = document.getElementById('review-text');
  const msg = document.getElementById('review-message');

  function renderPublicReviews() {
    const reviews = getReviews().filter((r) => r.approved && !r.hidden);
    listEl.innerHTML = '';
    if (!reviews.length) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Пока нет ни одного одобренного отзыва.';
      listEl.appendChild(empty);
      return;
    }
    reviews.forEach((r) => {
      const card = document.createElement('article');
      card.className = 'review-card';
      const date = new Date(r.createdAt).toLocaleDateString('ru-RU');
      card.innerHTML = `
        <div class="review-card__header">
          <div class="review-card__name">${r.name}</div>
          <div class="review-card__rating">★ ${r.rating}/5</div>
        </div>
        <p class="review-card__text">${r.text}</p>
        <div class="review-card__meta">Отзыв от ${date}</div>
      `;
      listEl.appendChild(card);
    });
  }

  renderPublicReviews();

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form__message';

    const user = getCurrentUser();
    if (!user || user.role !== 'customer') {
      msg.textContent = 'Чтобы оставить отзыв, войдите как покупатель на странице "Вход".';
      msg.classList.add('form__message--error');
      return;
    }

    const name = nameInput.value.trim();
    const rating = ratingInput.value;
    const text = textInput.value.trim();

    if (!name || !text) {
      msg.textContent = 'Заполните имя и текст отзыва.';
      msg.classList.add('form__message--error');
      return;
    }

    addReview({ name, rating, text });
    nameInput.value = '';
    textInput.value = '';
    ratingInput.value = '5';

    msg.textContent = 'Спасибо! Ваш отзыв отправлен на модерацию.';
    msg.classList.add('form__message--success');
    renderPublicReviews();
  });
}

// ===== Админ-панель =====
function initAdminPage() {
  const panels = document.getElementById('admin-panels');
  const msg = document.getElementById('admin-access-message');
  if (!panels || !msg) return;

  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    panels.hidden = true;
    msg.innerHTML =
      `Доступ ограничен. Войдите как администратор на странице <a href="${ROUTES.login}">Вход</a> (пароль: admin123).`;
    return;
  }

  msg.textContent = 'Вы вошли как администратор: ' + user.email;
  panels.hidden = false;

  // Отзывы для модерации
  const adminReviewsEl = document.getElementById('admin-reviews');

  function renderAdminReviews() {
    const reviews = getReviews();
    adminReviewsEl.innerHTML = '';
    if (!reviews.length) {
      const p = document.createElement('p');
      p.className = 'cart-empty';
      p.textContent = 'Пока нет отзывов для модерации.';
      adminReviewsEl.appendChild(p);
      return;
    }

    reviews.forEach((r) => {
      const card = document.createElement('article');
      card.className = 'review-card';
      const date = new Date(r.createdAt).toLocaleString('ru-RU');
      card.innerHTML = `
        <div>
          <div class="review-card__header">
            <div class="review-card__name">${r.name}</div>
            <div class="review-card__rating">★ ${r.rating}/5</div>
          </div>
          <p class="review-card__text">${r.text}</p>
          <div class="review-card__meta">Отправлен: ${date}</div>
        </div>
        <div class="review-card__admin-actions">
          <span class="badge ${
            r.approved && !r.hidden
              ? 'badge--success'
              : r.hidden
              ? 'badge--muted'
              : ''
          }">
            ${
              r.hidden
                ? 'Скрыт'
                : r.approved
                ? 'Одобрен'
                : 'Ожидает модерации'
            }
          </span>
          <div>
            <button type="button" class="btn btn--sm btn--primary" data-action="approve">Одобрить</button>
            <button type="button" class="btn btn--sm btn--outline" data-action="hide">Скрыть</button>
          </div>
        </div>
      `;

      const actions = card.querySelector('.review-card__admin-actions');
      actions.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        const reviewsAll = getReviews();
        const idx = reviewsAll.findIndex((x) => x.id === r.id);
        if (idx === -1) return;
        if (action === 'approve') {
          reviewsAll[idx].approved = true;
          reviewsAll[idx].hidden = false;
        } else if (action === 'hide') {
          reviewsAll[idx].hidden = true;
        }
        saveReviews(reviewsAll);
        renderAdminReviews();
      });

      adminReviewsEl.appendChild(card);
    });
  }

  renderAdminReviews();

  // Настройки WhatsApp
  const form = document.getElementById('admin-settings-form');
  const phoneInput = document.getElementById('whatsapp-phone');
  const formMsg = document.getElementById('admin-settings-message');

  const currentPhone = getWhatsappPhone();
  if (currentPhone) {
    phoneInput.value = currentPhone;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    formMsg.textContent = '';
    formMsg.className = 'form__message';

    const phone = phoneInput.value.trim();
    if (phone && !/^\d{11}$/.test(phone)) {
      formMsg.textContent =
        'Укажите номер в формате 11 цифр, например 79990000000, или оставьте поле пустым.';
      formMsg.classList.add('form__message--error');
      return;
    }

    if (phone) {
      setWhatsappPhone(phone);
      formMsg.textContent = 'Номер WhatsApp сохранён. Кнопка на сайте будет вести на этот номер.';
      formMsg.classList.add('form__message--success');
    } else {
      setWhatsappPhone(null);
      formMsg.textContent = 'Номер сброшен. Используется номер по умолчанию.';
      formMsg.classList.add('form__message--success');
    }

    initWhatsappButton();
  });
}

// ===== Страница товара =====
function initProductPage() {
  const container = document.getElementById('product-detail');
  // Не страница товара — ничего не делаем (важно: иначе будет бесконечный редирект в каталог)
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  if (!productId) {
    window.location.href = ROUTES.catalog;
    return;
  }

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    window.location.href = ROUTES.catalog;
    return;
  }

  const inWishlist = isInWishlist(productId);
  const cart = getCart();
  const inCart = cart.find(i => i.id === productId);
  const qty = inCart ? inCart.qty : 0;

  container.innerHTML = `
    <div class="product-detail__image">
      <img src="${productImageSrc(product)}" alt="${product.name}" class="product-detail__photo" width="480" height="640">
    </div>
    <div class="product-detail__info">
      <h1 class="product-detail__name">${product.name}</h1>
      <div class="product-detail__meta">
        <span class="product-card__tag">${product.category}</span>
        <span class="product-card__tag">${product.volume}</span>
        ${product.popular ? '<span class="product-card__tag product-card__tag--popular">Популярный</span>' : ''}
      </div>
      <div class="product-detail__price">${formatPrice(product.price)}</div>
      <p class="product-detail__description">${product.description || product.notes}</p>
      <div class="product-detail__notes">
        <strong>Ноты аромата:</strong> ${product.notes}
      </div>
      <div class="product-detail__actions" data-product-id="${productId}">
        <button type="button" class="wishlist-btn ${inWishlist ? 'wishlist-btn--active' : ''}" data-action="wishlist">
          ${inWishlist ? '♥ В избранном' : '♡ В избранное'}
        </button>
        <div class="product-detail__qty">
          <button type="button" class="qty-btn" data-action="dec">−</button>
          <span data-role="qty-value">${qty}</span>
          <button type="button" class="qty-btn" data-action="inc">+</button>
        </div>
        <button type="button" class="btn btn--primary" data-action="add" ${!product.inStock ? 'disabled' : ''}>
          ${product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  `;

  const actions = container.querySelector('.product-detail__actions');
  const qtySpan = actions.querySelector('[data-role="qty-value"]');
  const wishlistBtn = actions.querySelector('[data-action="wishlist"]');

  actions.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    if (!action) return;

    if (action === 'wishlist') {
      const added = toggleWishlist(productId);
      wishlistBtn.textContent = added ? '♥ В избранном' : '♡ В избранное';
      wishlistBtn.classList.toggle('wishlist-btn--active', added);
      return;
    }

    let currentQty = Number(qtySpan.textContent) || 0;
    if (action === 'dec') {
      currentQty = Math.max(0, currentQty - 1);
      setCartQty(productId, currentQty);
    } else if (action === 'inc') {
      currentQty += 1;
      setCartQty(productId, currentQty);
    } else if (action === 'add') {
      currentQty += 1;
      addToCart(productId, 1);
      showNotification('Товар добавлен в корзину', 'success');
    }
    qtySpan.textContent = currentQty;
    updateNavForUser();
  });
}

// ===== Страница избранного =====
function initWishlistPage() {
  const container = document.getElementById('wishlist-products');
  if (!container) return;

  function render() {
    const wishlist = getWishlist();
    container.innerHTML = '';

    if (!wishlist.length) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';
      empty.innerHTML = `Избранное пусто. <a href="${ROUTES.catalog}">Перейти в каталог</a>`;
      container.appendChild(empty);
      return;
    }

    const products = PRODUCTS.filter(p => wishlist.includes(p.id));
    products.forEach(p => {
      const card = createProductCard(p, {
        onWishlistChange: render,
        onCartChange: () => updateNavForUser(),
      });
      container.appendChild(card);
    });
  }

  render();
}

// ===== Страница заказов =====
function initOrdersPage() {
  const container = document.getElementById('orders-list') || document.getElementById('admin-orders');
  if (!container) return;

  const user = getCurrentUser();
  const isAdmin = user && user.role === 'admin';

  function render() {
    let orders = getOrders();
    if (!isAdmin) {
      const email = user?.email || 'guest';
      orders = orders.filter(o => o.userEmail === email);
    }

    container.innerHTML = '';

    if (!orders.length) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';
      empty.textContent = isAdmin ? 'Пока нет заказов' : 'У вас пока нет заказов';
      container.appendChild(empty);
      return;
    }

    orders.forEach(order => {
      const card = document.createElement('article');
      card.className = 'order-card';
      const date = new Date(order.createdAt).toLocaleString('ru-RU');
      const statusLabels = {
        pending: 'Ожидает обработки',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменён',
      };

      card.innerHTML = `
        <div class="order-card__header">
          <div>
            <div class="order-card__id">Заказ #${order.id}</div>
            <div class="order-card__date">${date}</div>
            ${isAdmin ? `<div class="order-card__email">${order.userEmail}</div>` : ''}
          </div>
          <div class="order-card__status">
            <select class="input input--sm" data-order-id="${order.id}" ${!isAdmin ? 'disabled' : ''}>
              ${Object.entries(statusLabels).map(([val, label]) => 
                `<option value="${val}" ${order.status === val ? 'selected' : ''}>${label}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="order-card__items">
          ${order.items.map(item => `
            <div class="order-item">
              <span>${item.name} × ${item.qty}</span>
              <span>${formatPrice(item.price * item.qty)}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-card__footer">
          ${order.promocode ? `<div class="order-card__promo">Промокод: ${order.promocode}</div>` : ''}
          ${order.discount > 0 ? `<div class="order-card__discount">Скидка: -${formatPrice(order.discount)}</div>` : ''}
          <div class="order-card__total">Итого: ${formatPrice(order.finalTotal)}</div>
        </div>
      `;

      if (isAdmin) {
        const select = card.querySelector('select');
        select.addEventListener('change', (e) => {
          const ordersAll = getOrders();
          const idx = ordersAll.findIndex(o => o.id === order.id);
          if (idx !== -1) {
            ordersAll[idx].status = e.target.value;
            saveOrders(ordersAll);
            showNotification('Статус заказа обновлён', 'success');
            render();
          }
        });
      }

      container.appendChild(card);
    });
  }

  render();
}

// ===== Страница профиля =====
function initProfilePage() {
  const container = document.getElementById('profile-content');
  if (!container) return;

  const user = getCurrentUser();
  if (!user || user.role !== 'customer') {
    container.innerHTML = '<p class="cart-empty">Войдите как покупатель, чтобы просмотреть профиль.</p>';
    return;
  }

  container.innerHTML = `
    <div class="profile-section">
      <h2 class="section__title section__title--small">Личная информация</h2>
      <div class="profile-info">
        <div class="profile-info__row">
          <span>E-mail:</span>
          <span>${user.email}</span>
        </div>
        <div class="profile-info__row">
          <span>Роль:</span>
          <span>Покупатель</span>
        </div>
      </div>
    </div>
    <div class="profile-section">
      <h2 class="section__title section__title--small">Статистика</h2>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat__value" id="profile-orders-count">0</div>
          <div class="profile-stat__label">Заказов</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat__value" id="profile-wishlist-count">0</div>
          <div class="profile-stat__label">В избранном</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat__value" id="profile-reviews-count">0</div>
          <div class="profile-stat__label">Отзывов</div>
        </div>
      </div>
    </div>
  `;

  const orders = getOrders().filter(o => o.userEmail === user.email);
  const wishlist = getWishlist();
  const reviews = getReviews().filter(r => r.name === user.email || r.name.includes(user.email.split('@')[0]));

  document.getElementById('profile-orders-count').textContent = orders.length;
  document.getElementById('profile-wishlist-count').textContent = wishlist.length;
  document.getElementById('profile-reviews-count').textContent = reviews.length;
}

// ===== Расширенная админка =====
function initAdminProducts() {
  const container = document.getElementById('admin-products');
  if (!container) return;
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') return;

  function render() {
    container.innerHTML = '';
    PRODUCTS.forEach(product => {
      const card = document.createElement('div');
      card.className = 'admin-product-card';
      card.innerHTML = `
        <div class="admin-product-card__info">
          <div class="admin-product-card__name">${product.name}</div>
          <div class="admin-product-card__meta">${product.category} · ${product.volume} · ${formatPrice(product.price)}</div>
        </div>
        <div class="admin-product-card__actions">
          <button type="button" class="btn btn--sm btn--outline" data-action="edit" data-id="${product.id}">Редактировать</button>
          <button type="button" class="btn btn--sm btn--outline" data-action="delete" data-id="${product.id}">Удалить</button>
        </div>
      `;

      card.querySelector('[data-action="delete"]').addEventListener('click', () => {
        if (confirm(`Удалить товар "${product.name}"?`)) {
          PRODUCTS = PRODUCTS.filter(p => p.id !== product.id);
          saveProducts();
          render();
          showNotification('Товар удалён', 'success');
        }
      });

      card.querySelector('[data-action="edit"]').addEventListener('click', () => {
        const form = document.getElementById('admin-product-form');
        const nameInput = document.getElementById('product-name');
        const priceInput = document.getElementById('product-price');
        const categoryInput = document.getElementById('product-category');
        const volumeInput = document.getElementById('product-volume');
        const notesInput = document.getElementById('product-notes');
        const descInput = document.getElementById('product-description');
        const popularInput = document.getElementById('product-popular');
        const inStockInput = document.getElementById('product-instock');
        const productIdInput = document.getElementById('product-id');

        productIdInput.value = product.id;
        nameInput.value = product.name;
        priceInput.value = product.price;
        categoryInput.value = product.category;
        volumeInput.value = product.volume;
        notesInput.value = product.notes;
        descInput.value = product.description || '';
        popularInput.checked = product.popular || false;
        inStockInput.checked = product.inStock !== false;

        form.scrollIntoView({ behavior: 'smooth' });
      });

      container.appendChild(card);
    });
  }

  render();

  const form = document.getElementById('admin-product-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const productId = document.getElementById('product-id').value;
      const name = document.getElementById('product-name').value.trim();
      const price = Number(document.getElementById('product-price').value);
      const category = document.getElementById('product-category').value;
      const volume = document.getElementById('product-volume').value.trim();
      const notes = document.getElementById('product-notes').value.trim();
      const description = document.getElementById('product-description').value.trim();
      const popular = document.getElementById('product-popular').checked;
      const inStock = document.getElementById('product-instock').checked;

      if (!name || !price || !category || !volume || !notes) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
      }

      if (productId) {
        const idx = PRODUCTS.findIndex(p => p.id === productId);
        if (idx !== -1) {
          PRODUCTS[idx] = { ...PRODUCTS[idx], name, price, category, volume, notes, description, popular, inStock };
        }
      } else {
        const newId = 'p' + Date.now();
        PRODUCTS.push({ id: newId, name, price, category, volume, notes, description, popular, inStock, image: `/images/products/p1.jpg` });
      }

      saveProducts();
      form.reset();
      document.getElementById('product-id').value = '';
      render();
      showNotification(productId ? 'Товар обновлён' : 'Товар добавлен', 'success');
    });
  }
}

function initAdminStats() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') return;

  const orders = getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.finalTotal, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const productStats = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.name]) {
        productStats[item.name] = { qty: 0, revenue: 0 };
      }
      productStats[item.name].qty += item.qty;
      productStats[item.name].revenue += item.price * item.qty;
    });
  });

  const popularProducts = Object.entries(productStats)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  const statsContainer = document.getElementById('admin-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-card__value">${formatPrice(totalRevenue)}</div>
          <div class="admin-stat-card__label">Общая выручка</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card__value">${totalOrders}</div>
          <div class="admin-stat-card__label">Всего заказов</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-card__value">${pendingOrders}</div>
          <div class="admin-stat-card__label">Ожидают обработки</div>
        </div>
      </div>
      ${popularProducts.length > 0 ? `
        <div class="admin-stats-section">
          <h3 class="section__title section__title--small">Популярные товары</h3>
          <div class="admin-popular-list">
            ${popularProducts.map(([name, stats]) => `
              <div class="admin-popular-item">
                <span>${name}</span>
                <span>${stats.qty} шт. · ${formatPrice(stats.revenue)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }
}

// ===== Инициализация для всех страниц =====
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  updateNavForUser();
  initWhatsappButton();
  initIndexPage();
  initCatalogPage();
  initCartPage();
  initLoginPage();
  initReviewsPage();
  initAdminPage();
  initProductPage();
  initWishlistPage();
  initOrdersPage();
  initProfilePage();
  initAdminProducts();
  initAdminStats();
});

