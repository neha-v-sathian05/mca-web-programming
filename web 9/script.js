
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Switch between forms

registerTab.addEventListener("click", function() {
    registerForm.style.display = "block";
    loginForm.style.display = "none";

    registerTab.classList.add("active");
    loginTab.classList.remove("active");
});

loginTab.addEventListener("click", function() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";

    loginTab.classList.add("active");
    registerTab.classList.remove("active");
});

// Display error message

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

// Email validation

function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Password validation

function validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
}

// Registration validation

registerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    document.querySelectorAll("small").forEach(el => {
        el.textContent = "";
    });

    document.getElementById("registerMessage").textContent = "";

    if (name === "") {
        showError("nameError", "Name is required");
        valid = false;
    }

    if (email === "") {
        showError("regEmailError", "Email is required");
        valid = false;
    }
    else if (!validateEmail(email)) {
        showError("regEmailError", "Enter a valid email address");
        valid = false;
    }

    if (password === "") {
        showError("regPasswordError", "Password is required");
        valid = false;
    }
    else if (!validatePassword(password)) {
        showError("regPasswordError",
            "Use 8 characters with uppercase, lowercase and a number");
        valid = false;
    }

    if (confirm === "") {
        showError("confirmError", "Please confirm your password");
        valid = false;
    }
    else if (password !== confirm) {
        showError("confirmError", "Passwords do not match");
        valid = false;
    }

    if (valid) {
        const message = document.getElementById("registerMessage");
        message.textContent = "Registration form validated successfully!";
        message.className = "message success";

        registerForm.reset();
    }
});

// Login validation

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let valid = true;

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    document.getElementById("loginMessage").textContent = "";

    if (email === "") {
        showError("loginEmailError", "Email is required");
        valid = false;
    }
    else if (!validateEmail(email)) {
        showError("loginEmailError", "Enter a valid email address");
        valid = false;
    }

    if (password === "") {
        showError("loginPasswordError", "Password is required");
        valid = false;
    }
    else if (!validatePassword(password)) {
        showError("loginPasswordError",
            "Password must have 8 characters, uppercase, lowercase and a number");
        valid = false;
    }

    if (valid) {
        const message = document.getElementById("loginMessage");
        message.textContent = "Login form validated successfully!";
        message.className = "message success";

        loginForm.reset();
    }
});
