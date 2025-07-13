document.addEventListener("DOMContentLoaded", () => {
  const updateTotals = () => {
    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;

    cartItems.forEach(item => {
      const price = parseFloat(item.dataset.price);
      const quantityEl = item.querySelector(".counter-value");
      const quantity = parseInt(quantityEl.textContent);

      if (!isNaN(price) && !isNaN(quantity)) {
        const itemTotal = price * quantity;
        total += itemTotal;
      }
    });

    const totalEl = document.getElementById("cart-total");
    if (totalEl) {
      totalEl.textContent = total.toFixed(2);
    }
  };

  // Додаємо обробники до всіх кнопок
  document.querySelectorAll(".counter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const counter = btn.closest(".counter");
      const valueEl = counter.querySelector(".counter-value");
      let count = parseInt(valueEl.textContent);

      if (btn.dataset.action === "increment") {
        count++;
      } else if (btn.dataset.action === "decrement" && count > 1) {
        count--;
      }

      valueEl.textContent = count;
      updateTotals();
    });
  });

  updateTotals(); // Запуск на початку
});



document.addEventListener("DOMContentLoaded", () => {
  const cartKey = "cartItems";
  const cartContainer = document.querySelector(".cart-items");
  const clearBtn = document.querySelector(".clear-cart");

  function loadCart() {
    cartContainer.innerHTML = "";
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Кошик порожній</p>";
      return;
    }

    cart.forEach((item, index) => {
      const productEl = document.createElement("div");
      productEl.className = "cart-item";
      productEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <h3>${item.title}</h3>
          <p>${item.price}</p>
        </div>
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      cartContainer.appendChild(productEl);
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        removeFromCart(index);
      });
    });
  }

  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    loadCart();
  }

  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(cartKey);
    loadCart();
  });

  loadCart();
});
