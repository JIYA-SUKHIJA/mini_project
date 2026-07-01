// --- DOM Elements ---
const sidebar = document.querySelector('.sidebar');
const collapseBtn = document.querySelector('.collapse-btn');
const themeToggle = document.getElementById('themeToggle');
const logoutBtn = document.querySelector('.logout-card .btn-danger'); // Target the logout button

// --- 1. Sidebar Toggle ---
if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.style.width === '80px';
        sidebar.style.width = isCollapsed ? '240px' : '80px';
        
        sidebar.querySelectorAll('.logo-text, .nav-item, .logout-card, .menu-label').forEach(el => {
            el.style.display = isCollapsed ? '' : 'none';
        });
        
        sidebar.querySelectorAll('.nav-item').forEach(el => {
            el.style.justifyContent = isCollapsed ? 'flex-start' : 'center';
            el.style.padding = isCollapsed ? '12px 16px' : '12px 0';
        });
        
        // Adjust grid based on context (calendar vs settings page)
        const appContainer = document.querySelector('.app-container');
        if (appContainer.style.gridTemplateColumns.includes('320px')) {
            appContainer.style.gridTemplateColumns = isCollapsed ? '240px 1fr 320px' : '80px 1fr 320px';
        } else {
            appContainer.style.gridTemplateColumns = isCollapsed ? '240px 1fr' : '80px 1fr';
        }
    });
}

// --- 2. Dark Mode Toggle Interaction ---
if (themeToggle) {
    // Check local storage for theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// --- 3. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default button behavior
        
        // Prompt user for confirmation
        const confirmLogout = confirm("Are you sure you want to sign out?");
        
        if (confirmLogout) {
            // Mock clearing sensitive session data (leaving the 'theme' preference alone)
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            
            // Redirect to a login page (update this path to match your actual login route)
            window.location.href = '../index.html'; 
        }
    });
}