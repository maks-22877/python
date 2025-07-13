document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const products = document.querySelectorAll('.product-card');

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sort = sortSelect.value;

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

  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  sortSelect.addEventListener('change', filterProducts);
});




const decrementBtn = document.getElementById("decrement");
const incrementBtn = document.getElementById("increment");
const counterValue = document.getElementById("counterValue");

let count = 3;

decrementBtn.addEventListener("click", () => {
  if (count > 1) {
    count--;
    counterValue.textContent = count;
  }
});

incrementBtn.addEventListener("click", () => {
  count++;
  counterValue.textContent = count;
});





document.addEventListener("DOMContentLoaded", () => {
  const cartKey = "cartItems";

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.push(product);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert("Товар додано до кошика!");
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest(".product-card");

      const product = {
        id: Date.now(),
        title: productCard.querySelector(".product-title").textContent,
        price: productCard.querySelector(".product-price").textContent,
        image: productCard.querySelector("img").getAttribute("src")
      };

      addToCart(product);
    });
  });
});
