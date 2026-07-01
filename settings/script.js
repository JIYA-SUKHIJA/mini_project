// --- DOM Elements ---
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const footerCollapseBtn = document.getElementById("footerCollapseBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const slidingIndicator = document.getElementById("slidingIndicator");
const globalLoader = document.getElementById("globalLoader");
const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

// Theme Toggles
const headerThemeToggle = document.getElementById("headerThemeToggle");
const bodyThemeToggle = document.getElementById("bodyThemeToggle");

// Account & Security Elements
const changePasswordBtn = document.getElementById("changePasswordBtn");
const passwordFieldsContainer = document.getElementById("passwordFieldsContainer");
const newPasswordInput = document.getElementById("newPasswordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const savePasswordBtn = document.getElementById("savePasswordBtn");
const sessionTimeoutSelect = document.getElementById("sessionTimeoutSelect");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// About Elements
const helpRowContainer = document.getElementById("helpRowContainer");
const policyRowContainer = document.getElementById("policyRowContainer");
const helpTextDropdown = document.getElementById("helpTextDropdown");
const policyTextDropdown = document.getElementById("policyTextDropdown");

// Loader Timeout
window.addEventListener("load", () => {
  setTimeout(() => {
    if (globalLoader) {
      globalLoader.classList.add("fade-out-loader");
      setTimeout(() => globalLoader.remove(), 400);
    }
  }, 500);
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    repositionIndicator();
    initTheme();
    initSecuritySettings();
    initAboutSettings();

    // 1. Existing Sidebar Logout Button Handler
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener("click", logout);
    }
    
    // 2. NEW: User Profile Wrapper Click Handler (Image + Text) for Sign Out
    const userProfileWrapper = document.querySelector(".user-profile");
    if (userProfileWrapper) {
        userProfileWrapper.style.cursor = "pointer";
        userProfileWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            logout();
        });
    }
    
    // Wire up Clear Data Settings Button
    const clearDataBtn = document.getElementById('clearDataBtn');
    if(clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to clear all local task data? This cannot be undone.")) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                const userEmail = currentUser.email || 'guest';
                localStorage.removeItem(`kanbanTasks_${userEmail}`);
                spawnNotification("Data Cleared", "All local task data has been permanently removed.");
            }
        });
    }
});

// Load User Data
function loadUserProfile() {
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
        try {
            const user = JSON.parse(userDataStr);
            const fullName = user.fullname || 'User';
            
            const profileDisplay = document.getElementById('userFullNameDisplay');
            if (profileDisplay) {
                profileDisplay.textContent = fullName;
            }
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    }
}

// Auth Logout Logic
function logout() {
    const confirmLogout = confirm("Are you sure you want to sign out?");
    if (confirmLogout) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        location.href = "../index.html"; 
    }
}

// Sidebar Logic
function toggleSidebarState() {
  sidebar.classList.toggle("collapsed");
  setTimeout(repositionIndicator, 300);
}

if (toggleSidebar) toggleSidebar.addEventListener("click", toggleSidebarState);
if (footerCollapseBtn) footerCollapseBtn.addEventListener("click", toggleSidebarState);

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.add("active-mobile");
    sidebarOverlay.classList.add("active");
  });
}

if(sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
        sidebar.classList.remove("active-mobile");
        sidebarOverlay.classList.remove("active");
    });
}

// Sliding Indicator Logic (Settings is index 4)
function repositionIndicator() {
  const activeItem = document.querySelector(".menu-item.active");
  if (activeItem && slidingIndicator) {
    slidingIndicator.style.top = `${activeItem.offsetTop}px`;
    slidingIndicator.style.height = `${activeItem.offsetHeight}px`;
  }
}
window.addEventListener("resize", repositionIndicator);

// --- UNIFIED DARK MODE LOGIC ---
function initTheme() {
    const currentTheme = localStorage.getItem("theme");
    const isDark = currentTheme === "dark";
    
    applyTheme(isDark);
    
    // Listen to Top Header Switch
    if(headerThemeToggle) {
        headerThemeToggle.addEventListener("change", (e) => {
            applyTheme(e.target.checked);
        });
    }
    
    // Listen to Settings Body Switch
    if(bodyThemeToggle) {
        bodyThemeToggle.addEventListener("change", (e) => {
            applyTheme(e.target.checked);
        });
    }
}

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
        if(headerThemeToggle) headerThemeToggle.checked = true;
        if(bodyThemeToggle) bodyThemeToggle.checked = true;
    } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
        if(headerThemeToggle) headerThemeToggle.checked = false;
        if(bodyThemeToggle) bodyThemeToggle.checked = false;
    }
}

// --- ACCOUNT & SECURITY FUNCTIONALITY STAGE ---
function initSecuritySettings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const userEmail = currentUser.email || 'guest';

    if (changePasswordBtn && passwordFieldsContainer) {
        changePasswordBtn.addEventListener("click", () => {
            const isHidden = passwordFieldsContainer.style.display === "none";
            passwordFieldsContainer.style.display = isHidden ? "flex" : "none";
        });
    }

    if (savePasswordBtn) {
        savePasswordBtn.addEventListener("click", () => {
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!newPassword || !confirmPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (userEmail === 'admin') {
                alert("Master admin structural credentials cannot be changed locally.");
                return;
            }

            let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = users.findIndex(u => u.email === userEmail);

            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                
                currentUser.password = newPassword;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                newPasswordInput.value = "";
                confirmPasswordInput.value = "";
                passwordFieldsContainer.style.display = "none";
                spawnNotification("Password Updated", "Your security credentials have been safely altered.");
            } else {
                alert("User context error. Could not match user session data index mapping.");
            }
        });
    }

    if (sessionTimeoutSelect) {
        const savedTimeout = localStorage.getItem(`sessionTimeout_${userEmail}`) || "30";
        sessionTimeoutSelect.value = savedTimeout;

        sessionTimeoutSelect.addEventListener("change", (e) => {
            localStorage.setItem(`sessionTimeout_${userEmail}`, e.target.value);
            spawnNotification("Preference Saved", `Inactivity logouts set to ${e.target.value === "0" ? "Never" : e.target.value + " minutes"}.`);
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", () => {
            if (userEmail === 'admin') {
                alert("The system master admin account cannot be purged.");
                return;
            }

            const checkConfirmation = confirm("DANGER: Are you absolutely sure you want to permanently delete your account? This will purge your profile and all saved tasks instantly.");
            if (checkConfirmation) {
                let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                users = users.filter(u => u.email !== userEmail);
                localStorage.setItem('registeredUsers', JSON.stringify(users));

                localStorage.removeItem(`kanbanTasks_${userEmail}`);
                localStorage.removeItem(`sessionTimeout_${userEmail}`);
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');

                alert("Your account profile has been wiped. Redirecting to initialization window.");
                window.location.href = '../index.html';
            }
        });
    }
}

// --- JAVASCRIPT-WIRED HOVER INTERFACES ---
function initAboutSettings() {
    // 1. Help & Support Tracking Logic
    if (helpRowContainer && helpTextDropdown) {
        helpRowContainer.addEventListener("mouseenter", () => {
            helpTextDropdown.style.display = "block";
        });
        helpRowContainer.addEventListener("mouseleave", () => {
            helpTextDropdown.style.display = "none";
        });
        
        // Ensure user can hover inside content box without it breaking
        helpTextDropdown.addEventListener("mouseenter", () => {
            helpTextDropdown.style.display = "block";
        });
        helpTextDropdown.addEventListener("mouseleave", () => {
            helpTextDropdown.style.display = "none";
        });
    }

    // 2. Privacy Policy Tracking Logic
    if (policyRowContainer && policyTextDropdown) {
        policyRowContainer.addEventListener("mouseenter", () => {
            policyTextDropdown.style.display = "block";
        });
        policyRowContainer.addEventListener("mouseleave", () => {
            policyTextDropdown.style.display = "none";
        });

        // Ensure user can hover inside content box without it breaking
        policyTextDropdown.addEventListener("mouseenter", () => {
            policyTextDropdown.style.display = "block";
        });
        policyTextDropdown.addEventListener("mouseleave", () => {
            policyTextDropdown.style.display = "none";
        });
    }
}

// Toast Notifications System for Settings Page
function spawnNotification(title, msg) {
  const container = document.getElementById("notificationContainer");
  if(!container) return;
  
  const toast = document.createElement("div");
  toast.className = "toast-card toast-success";
  toast.innerHTML = `<div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div><div class="toast-body"><h4>${title}</h4><p>${msg}</p></div><button class="toast-close" style="background:transparent; border:none; margin-left:auto; color:var(--text-muted); cursor:pointer; font-size:18px;">&times;</button>`;
  
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("visible-toast"), 20);
  toast.querySelector(".toast-close").onclick = () => toast.remove();
  
  setTimeout(() => { 
      if (toast && toast.parentElement) { 
          toast.style.opacity = "0"; 
          setTimeout(() => toast.remove(), 400); 
      } 
  }, 4000);
}