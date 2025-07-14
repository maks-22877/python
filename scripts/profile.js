
document.addEventListener("DOMContentLoaded", () => {
  const PROFILE_KEY = "userProfile";
  const USER_KEY = "userAccount";

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const profileSection = document.getElementById("profile-section");
  const authSection = document.getElementById("auth-section");

  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  const editPopup = document.getElementById("editProfilePopup");
  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const editPhoneInput = document.getElementById("editPhone");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  function showProfile(profile) {
    authSection.style.display = "none";
    profileSection.style.display = "block";

    document.getElementById("profileName").textContent = profile.name || "";
    document.getElementById("profileEmail").textContent = profile.email || "";
    document.getElementById("profilePhone").textContent = profile.phone || "";
    document.getElementById("profileJoined").textContent = profile.joined || new Date().toLocaleDateString();

    if (profile.avatar) {
      document.getElementById("profileAvatar").src = profile.avatar;
    }
  }

  function checkLoggedIn() {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (profile && profile.email) {
      showProfile(profile);
    }
  }

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const joined = new Date().toLocaleDateString();

    if (name && email && password) {
      const user = { name, email, password, phone, joined };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
      showProfile(user);
    } else {
      alert("Заповніть усі поля!");
    }
  });

  document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem(USER_KEY));

    if (user && user.email === email && user.password === password) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
      showProfile(user);
    } else {
      alert("Невірний email або пароль!");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem(PROFILE_KEY);
    authSection.style.display = "block";
    profileSection.style.display = "none";
  });

  // ======== Edit Profile Logic ==========
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    if (!profile) return;

    editNameInput.value = profile.name || "";
    editEmailInput.value = profile.email || "";
    editPhoneInput.value = profile.phone || "";

    editPopup.style.display = "block";
  });

  cancelEditBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
  });

  saveEditBtn.addEventListener("click", () => {
    const newName = editNameInput.value.trim();
    const newEmail = editEmailInput.value.trim();
    const newPhone = editPhoneInput.value.trim();

    if (!newName || !newEmail) {
      alert("Ім'я та email обов'язкові.");
      return;
    }

    const updatedProfile = {
      ...JSON.parse(localStorage.getItem(PROFILE_KEY)),
      name: newName,
      email: newEmail,
      phone: newPhone
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(USER_KEY, JSON.stringify(updatedProfile));
    showProfile(updatedProfile);
    editPopup.style.display = "none";
  });

  checkLoggedIn();
});

