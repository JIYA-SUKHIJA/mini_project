// Helper to display error messages safely
function showMsg(message) {
    const msgEl = document.getElementById('msg');
    if (msgEl) msgEl.innerText = message;
}

// SIGN IN LOGIC
function login(){
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) return;
    
    const credential = emailInput.value.trim();
    const p = passwordInput.value;

    // 1. Check default admin credentials
    if (credential === 'admin' && p === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        // Save admin as the current user
        localStorage.setItem('currentUser', JSON.stringify({ fullname: 'Admin User', username: 'admin' })); 
        location.href = 'dashboard/index.html';
        return;
    }

    // 2. Fallback to check dynamically registered users in localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const matchedUser = users.find(u => (u.email === credential || u.username === credential) && u.password === p);

    if (matchedUser) {
        localStorage.setItem('isLoggedIn', 'true');
        // Save the specific matched user to local storage
        localStorage.setItem('currentUser', JSON.stringify(matchedUser)); 
        location.href = 'dashboard/index.html';
    } else {
        showMsg('Invalid credentials');
    }
}

// REGISTER LOGIC
function register() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Clear any previous messages
    showMsg('');

    // Password validation match check
    if (password !== confirmPassword) {
        showMsg('Passwords do not match');
        return;
    }

    // Pull existing database array
    let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Duplicate resource checking checks
    if (users.some(u => u.email === email)) {
        showMsg('Email address is already registered');
        return;
    }
    if (users.some(u => u.username === username)) {
        showMsg('Username is already taken');
        return;
    }

    // Save payload transaction to database index maps
    users.push({ fullname, email, username, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // Redirect instantly to the sign-in page. 
    // Added ../ because this function runs from inside the /register folder!
    window.location.href = '../index.html'; 
}

// HELPER FUNCTION: Exposes pipeline arrays to external scripts if needed
function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
}

document.addEventListener("DOMContentLoaded", () => {
    // Select ALL password toggle buttons
    const passwordToggles = document.querySelectorAll(".password-toggle");

    passwordToggles.forEach(toggle => {
        toggle.addEventListener("click", function() {
            // Find the specific input next to the clicked toggle
            const input = this.previousElementSibling;
            if (!input) return;

            const isPassword = input.getAttribute("type") === "password";
            input.setAttribute("type", isPassword ? "text" : "password");

            // Toggle the eye icon appearance
            if (isPassword) {
                this.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                this.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    });
});

// DARK MODE INTERACTION FOR AUTH PAGES
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("headerThemeToggle");

    // Check localStorage first to see if the user previously chose a theme
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                document.body.classList.add("dark-theme");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-theme");
                localStorage.setItem("theme", "light");
            }
        });
    }
});