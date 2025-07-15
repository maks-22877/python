document.addEventListener("DOMContentLoaded", () => {
  const USERS_KEY = "accounts";
  const CURRENT_KEY = "activeUser";

  const authSection = document.getElementById("auth-section");
  const profileSection = document.getElementById("profile-section");
  const authTitle = document.getElementById("auth-title");
  const authError = document.getElementById("auth-error");

  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");

  const toggleRegisterLink = document.getElementById("toggleRegister");
  const registerForm = document.getElementById("registerForm");
  const regNameInput = document.getElementById("regName");
  const regEmailInput = document.getElementById("regEmail");
  const regPasswordInput = document.getElementById("regPassword");
  const regPhoneInput = document.getElementById("regPhone");
  const registerBtn = document.getElementById("registerBtn");
  const toggleLoginLink = document.getElementById("toggleLogin");

  const profileAvatar = document.getElementById("profileAvatar");
  const avatarInput = document.getElementById("avatarInput");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const profileJoined = document.getElementById("profileJoined");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const editModal = document.getElementById("editModal");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("editForm");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const photoInput = document.getElementById("photoInput");

  // ================== AUTH ===================

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\+\-\(\) ]{6,20}$/;
    return re.test(phone);
  }

  function showProfile(user) {
    authSection.style.display = "none";
    profileSection.style.display = "block";

    profileName.textContent = user.name || "Користувач";
    profileEmail.textContent = user.email || "";
    profilePhone.textContent = user.phone || "Не вказано";
    profileJoined.textContent = user.joined || new Date().toLocaleDateString();

    profileAvatar.src = user.avatar || "./img/user-avatar.png";
  }

  function showAuth() {
    authSection.style.display = "block";
    profileSection.style.display = "none";
    authTitle.textContent = "Увійти";
    authError.textContent = "";
    loginEmailInput.value = "";
    loginPasswordInput.value = "";
    registerForm.style.display = "none";

    loginEmailInput.style.display = "block";
    loginPasswordInput.style.display = "block";
    loginBtn.style.display = "block";
    toggleRegisterLink.style.display = "block";
  }

  function checkLogin() {
    const activeUser = JSON.parse(localStorage.getItem(CURRENT_KEY));
    if (activeUser && activeUser.email) {
      showProfile(activeUser);
      return true;
    } else {
      showAuth();
      return false;
    }
  }

  loginBtn.addEventListener("click", () => {
    authError.textContent = "";
    const email = loginEmailInput.value.trim().toLowerCase();
    const password = loginPasswordInput.value;

    if (!email) return (authError.textContent = "Email не може бути порожнім.");
    if (!validateEmail(email)) return (authError.textContent = "Некоректний email.");
    if (!password) return (authError.textContent = "Пароль не може бути порожнім.");

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
      showProfile(user);
    } else {
      authError.textContent = "Невірний email або пароль.";
    }
  });

  registerBtn.addEventListener("click", () => {
    authError.textContent = "";

    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim().toLowerCase();
    const password = regPasswordInput.value;
    const phone = regPhoneInput.value.trim();
    const joined = new Date().toLocaleDateString();

    if (!name) return (authError.textContent = "Ім’я не може бути порожнім.");
    if (!email) return (authError.textContent = "Email не може бути порожнім.");
    if (!validateEmail(email)) return (authError.textContent = "Некоректний email.");
    if (!password || password.length < 6)
      return (authError.textContent = "Пароль має містити мінімум 6 символів.");
    if (phone && !validatePhone(phone)) return (authError.textContent = "Некоректний телефон.");

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    if (users.find(u => u.email === email)) {
      return (authError.textContent = "Користувач з таким email вже існує.");
    }

    const newUser = { name, email, password, phone, joined };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    showProfile(newUser);
  });

  toggleRegisterLink.addEventListener("click", () => {
    authTitle.textContent = "Реєстрація";
    registerForm.style.display = "block";
    loginEmailInput.style.display = "none";
    loginPasswordInput.style.display = "none";
    loginBtn.style.display = "none";
    toggleRegisterLink.style.display = "none";
    authError.textContent = "";
  });

  toggleLoginLink.addEventListener("click", () => {
    showAuth();
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(CURRENT_KEY);
    showAuth();
  });

  profileAvatar.addEventListener("click", () => {
    avatarInput.click();
  });

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      profileAvatar.src = e.target.result;

      let currentUser = JSON.parse(localStorage.getItem(CURRENT_KEY));
      if (currentUser) {
        currentUser.avatar = e.target.result;
        localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) {
          users[idx].avatar = e.target.result;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      }
    };
    reader.readAsDataURL(file);
  });

  // ================== EDIT PROFILE ===================

  editProfileBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem(CURRENT_KEY));
    if (!user) return;

    nameInput.value = user.name || "";
    emailInput.value = user.email || "";
    photoInput.value = user.avatar || "";

    editModal.style.display = "block";
  });

  closeBtn.onclick = () => {
    editModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
    }
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const avatar = photoInput.value.trim();

    if (!name || !email) {
      alert("Ім’я та email обов’язкові.");
      return;
    }

    let currentUser = JSON.parse(localStorage.getItem(CURRENT_KEY));
    if (!currentUser) return;

    currentUser.name = name;
    currentUser.email = email;
    currentUser.avatar = avatar;

    // update profile
    profileName.textContent = name;
    profileEmail.textContent = email;
    if (avatar) profileAvatar.src = avatar;

    // update storage
    localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      users[idx] = currentUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    editModal.style.display = "none";
  };

  checkLogin();
});
