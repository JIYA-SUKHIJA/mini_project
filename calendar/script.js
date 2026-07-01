// --- Initial Data State ---
let currentDate = new Date(2026, 6, 1); // July 2026

const eventsData = {
    "1": [{ title: "Project Plan Re...", type: "ev-green" }, { title: "+2 more", type: "ev-more" }],
    "3": [{ title: "Design Review", type: "ev-blue" }, { title: "Gym", type: "ev-purple" }, { title: "+1 more", type: "ev-more" }],
    "6": [{ title: "Client Meeting", type: "ev-yellow" }, { title: "Update Report", type: "ev-green" }],
    "15": [{ title: "Blog Writing", type: "ev-green" }, { title: "Call with John", type: "ev-purple" }],
    "24": [{ title: "Doctor Appointment", type: "ev-red" }]
};

// --- DOM Elements ---
const grid = document.getElementById('calendarGrid');
const monthHeader = document.querySelector('.header-titles h1');
const sidebar = document.querySelector('.sidebar');
const collapseBtn = document.querySelector('.collapse-btn');
const addTaskBtn = document.querySelector('.header-actions .btn-primary');
const logoutBtn = document.querySelector('.logout-card .btn-danger'); // Logout button target

// Modal Elements
const modal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById('closeModal');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const tasksContainer = document.querySelector('.task-section'); 

// --- 1. Calendar Generation ---
function generateCalendar(date) {
    grid.innerHTML = ''; 
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    monthHeader.innerHTML = `${monthNames[month]} ${year} <i class="fa-solid fa-chevron-down"></i>`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="cal-day empty"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let activeClass = (i === 30 && month === 6 && year === 2026) ? "active-day" : ""; 
        let eventsHtml = "";

        if (eventsData[i] && month === 6) {
            eventsData[i].forEach(ev => {
                let evClass = ev.type === "ev-more" ? ev.type : `event ${ev.type}`;
                eventsHtml += `<div class="${evClass}">${ev.title}</div>`;
            });
        }
        grid.innerHTML += `<div class="cal-day ${activeClass}"><div class="cal-date">${i}</div>${eventsHtml}</div>`;
    }
}

// --- 2. Sidebar Toggle ---
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
    
    document.querySelector('.app-container').style.gridTemplateColumns = isCollapsed ? '240px 1fr 320px' : '80px 1fr 320px';
});

// --- 3. Task Interactions & Local Storage ---
function attachTaskListeners() {
    document.querySelectorAll('.task-info i').forEach((icon, index) => {
        const newIcon = icon.cloneNode(true);
        icon.parentNode.replaceChild(newIcon, icon);

        newIcon.addEventListener('click', (e) => {
            const iconEl = e.target;
            const taskItem = iconEl.closest('.task-item');
            
            const isCompleted = iconEl.classList.contains('fa-regular');
            
            if (isCompleted) {
                iconEl.classList.replace('fa-circle', 'fa-check-circle');
                iconEl.classList.replace('fa-regular', 'fa-solid');
                iconEl.style.color = "var(--event-green-text)";
                taskItem.classList.add('completed');
            } else {
                iconEl.classList.replace('fa-check-circle', 'fa-circle');
                iconEl.classList.replace('fa-solid', 'fa-regular');
                iconEl.style.color = "";
                taskItem.classList.remove('completed');
            }
        });
    });
}

// --- 4. Modal Logic (Add Task) ---
addTaskBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.getElementById('newTaskName').focus(); 
});

function closeModal() {
    modal.classList.remove('active');
    document.getElementById('newTaskName').value = ''; 
    document.getElementById('newTaskTime').value = '';
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

saveTaskBtn.addEventListener('click', () => {
    const taskName = document.getElementById('newTaskName').value;
    const taskCategory = document.getElementById('newTaskCategory').value;
    const taskTime = document.getElementById('newTaskTime').value;

    if (!taskName) {
        alert("Please enter a task name!");
        return;
    }

    let formattedTime = taskTime;
    if (taskTime) {
        let [hours, minutes] = taskTime.split(':');
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        formattedTime = `${hours}:${minutes} ${ampm}`;
    } else {
        formattedTime = "Anytime";
    }

    const newTaskHTML = `
        <div class="task-item">
            <div class="task-info">
                <i class="fa-regular fa-circle"></i>
                <div>
                    <strong>${taskName}</strong>
                    <span>${taskCategory}</span>
                </div>
            </div>
            <span class="task-time">${formattedTime} <span class="dot dot-blue"></span></span>
        </div>
    `;

    const sectionHeader = tasksContainer.querySelector('h4');
    sectionHeader.insertAdjacentHTML('afterend', newTaskHTML);

    attachTaskListeners();
    closeModal();
});

// --- 5. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmLogout = confirm("Are you sure you want to sign out?");
        
        if (confirmLogout) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = '../index.html'; 
        }
    });
}

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
    generateCalendar(currentDate);
    attachTaskListeners();
});