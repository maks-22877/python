
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const products = document.querySelectorAll('.product-card');

  function filterProducts() {
    const searchTerm = searchInput?.value.toLowerCase() || "";
    const category = categoryFilter?.value || "all";
    const sort = sortSelect?.value || "";

    let productArray = Array.from(products);

    productArray.forEach(product => {
      const name = product.dataset.name.toLowerCase();
      const prodCategory = product.dataset.category;

      if (
        name.includes(searchTerm) &&
        (category === 'all' || category === prodCategory)
      ) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });

    let visibleProducts = productArray.filter(p => p.style.display === 'block');
    visibleProducts.sort((a, b) => {
      const nameA = a.dataset.name.toLowerCase();
      const nameB = b.dataset.name.toLowerCase();
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);

      switch (sort) {
        case 'az':
          return nameA.localeCompare(nameB);
        case 'za':
          return nameB.localeCompare(nameA);
        case 'priceLowHigh':
          return priceA - priceB;
        case 'priceHighLow':
          return priceB - priceA;
        default:
          return 0;
      }
    });

    const grid = document.querySelector('.products-grid');
    visibleProducts.forEach(product => grid.appendChild(product));
  }

  searchInput?.addEventListener('input', filterProducts);
  categoryFilter?.addEventListener('change', filterProducts);
  sortSelect?.addEventListener('change', filterProducts);
});


// --- КОШИК -----------------------------------------------------

const cartKey = "cartItems";

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  saveCart(cart);
  alert("Товар додано до кошика!");
}

// Додавання товарів на головній
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest(".product-card");

      const product = {
        id: productCard.dataset.id || Date.now(),
        title: productCard.querySelector(".product-title").textContent,
        price: parseFloat(productCard.querySelector(".product-price").textContent),
        image: productCard.querySelector("img").getAttribute("src")
      };

      addToCart(product);
    });
  });
});

// Рендер і керування в кошику
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-items");
  const clearBtn = document.querySelector(".clear-cart");
  const totalEl = document.getElementById("cart-total");

  function updateTotals() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (totalEl) totalEl.textContent = total.toFixed(2) + "$";
  }

  function loadCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = "";
    const cart = getCart();

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Кошик порожній</p>";
      if (totalEl) totalEl.textContent = "0 $";
      return;
    }

    cart.forEach((item, index) => {
      const productEl = document.createElement("div");
      productEl.className = "cart-item";
      productEl.dataset.price = item.price;

      productEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <h3>${item.title}</h3>
          <p>${item.price} $</p>
          <div class="counter">
            <button class="counter-btn" data-action="decrement" data-index="${index}">-</button>
            <span class="counter-value">${item.quantity}</span>
            <button class="counter-btn" data-action="increment" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      cartContainer.appendChild(productEl);
    });

    // Дії
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        removeFromCart(index);
      });
    });

    document.querySelectorAll(".counter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index, 10);
        const action = btn.dataset.action;
        let cart = getCart();

        if (action === "increment") {
          cart[index].quantity++;
        } else if (action === "decrement" && cart[index].quantity > 1) {
          cart[index].quantity--;
        }

        saveCart(cart);
        loadCart();
      });
    });

    updateTotals();
  }

  function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
  }

  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(cartKey);
    loadCart();
  });

  loadCart();
});
