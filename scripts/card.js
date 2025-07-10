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
