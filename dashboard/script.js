// Default template tasks for first-time visitors (Admin only now)
const defaultTasks = [
  { id: "task-1", title: "Draft methodology for SSL-HGMamba architecture", desc: "Integrate hypergraphs and State Space Models for temporal modeling.", priority: "High", date: "2026-06-30", status: "In Progress" },
  { id: "task-2", title: "Review examination papers", desc: "Grade the recent batch for Kurukshetra University.", priority: "Medium", date: "2026-06-28", status: "Pending" },
  { id: "task-3", title: "Submit HRA application", desc: "Submit the annual performance review application for the current fiscal year.", priority: "High", date: "2026-06-29", status: "In Progress" },
  { id: "task-4", title: "Client Follow-ups", desc: "Follow up with Max Life Insurance client leads for policy renewals.", priority: "Medium", date: "2026-07-05", status: "Pending" },
  { id: "task-5", title: "Finalize VLM Review Paper", desc: "Complete the 40-page draft on Architectural Innovations and Optimization Frontiers in Compact Vision-Language Models.", priority: "High", date: "2026-07-15", status: "Pending" },
  { id: "task-6", title: "Draft education loan correspondence", desc: "Prepared formal letter to Canara Bank regarding Geeta University MCA course fees.", priority: "High", date: "2026-07-15", status: "Completed" },
];

// Retrieve currentUser from localStorage to namespace tasks
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
const userEmail = currentUser.email || 'guest';
const tasksStorageKey = `kanbanTasks_${userEmail}`;

let taskState = JSON.parse(localStorage.getItem(tasksStorageKey));

if (!taskState) {
    if (userEmail === 'admin') {
        taskState = defaultTasks;
    } else {
        taskState = []; 
    }
    saveTasks();
}

function saveTasks() {
  localStorage.setItem(tasksStorageKey, JSON.stringify(taskState));
}

let activityHistory = [
  { text: "Task 'Setup Project Structure' marked completed", type: "success", stamp: "1 hour ago" },
  { text: "Task 'Build Task Cards' moved to In Progress column", type: "info", stamp: "15 mins ago" },
  { text: "Workspace verified with advanced performance features", type: "info", stamp: "Just now" },
];

let searchFilterStr = "";
let priorityFilterStr = "";
let statusFilterStr = "all";

const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const footerCollapseBtn = document.getElementById("footerCollapseBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuItems = document.querySelectorAll(".menu-item");
const slidingIndicator = document.getElementById("slidingIndicator");
const globalLoader = document.getElementById("globalLoader");
const modalOverlay = document.getElementById("modalOverlay");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const addTaskForm = document.getElementById("addTaskForm");
const taskDrawer = document.getElementById("taskDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const taskSearchInput = document.getElementById("taskSearch");
const labelFilterBtns = document.querySelectorAll(".label-filter-btn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (globalLoader) {
      globalLoader.classList.add("fade-out-loader");
      setTimeout(() => globalLoader.remove(), 400);
    }
  }, 600);
});

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile(); 
  renderTaskBoard();
  renderActivityTimeline();
  repositionIndicator();
  spawnNotification("Workspace Loaded", "Dynamic timeline parameters initialized successfully.");

  // 1. Sidebar Logout Button Handler
  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", logout);
  }

  // 2. User Profile Wrapper (Image + Text) Logout Handler
  const userProfileWrapper = document.querySelector(".user-profile");
  if (userProfileWrapper) {
      userProfileWrapper.style.cursor = "pointer";
      userProfileWrapper.addEventListener("click", (e) => {
          e.stopPropagation(); 
          logout();
      });
  }

  // 3. Welcome Message Greeting Pop-up Handler with a Long Greeting Message
  const welcomeMsg = document.querySelector(".welcome-msg");
  if (welcomeMsg) {
      welcomeMsg.style.cursor = "pointer";
      welcomeMsg.addEventListener("click", () => {
          const userDataStr = localStorage.getItem('currentUser');
          let name = 'User';
          if (userDataStr) {
              try {
                  const user = JSON.parse(userDataStr);
                  name = user.fullname || 'User';
              } catch (e) {
                  console.error(e);
              }
          }
          
          alert(
              `✨ Welcome to TaskFlow, ${name}! ✨\n\n` +
              `We are absolutely thrilled to have you back in your workspace today. ` +
              `Your production environment is running smoothly, and everything is synchronized ` +
              `and waiting for you to conquer your daily objectives.\n\n` +
              `💡 Quick Tip: Remember that you can drag and drop your task blocks across columns ` +
              `to seamlessly update your live workflow metrics on the fly.\n\n` +
              `Let's make today incredibly productive and hit those goals! 🚀`
          );
      });
  }

  const notifBtn = document.getElementById("notificationTriggerBtn");
  const notifDropdown = document.getElementById("notificationDropdown");
  if (notifBtn && notifDropdown) {
      notifBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          notifDropdown.classList.toggle("active");
      });
      document.addEventListener("click", (e) => {
          if (!notifBtn.contains(e.target)) {
              notifDropdown.classList.remove("active");
          }
      });
      notifDropdown.addEventListener("click", (e) => {
          e.stopPropagation();
      });
  }

  // Dark Mode Logic
  const themeToggle = document.getElementById("headerThemeToggle");
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

function loadUserProfile() {
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
        try {
            const user = JSON.parse(userDataStr);
            const fullName = user.fullname || 'User';
            const firstName = fullName.split(' ')[0]; 
            
            const welcomeDisplay = document.getElementById('userNameDisplay');
            if (welcomeDisplay) welcomeDisplay.textContent = firstName;

            const profileDisplay = document.getElementById('userFullNameDisplay');
            if (profileDisplay) profileDisplay.textContent = fullName;
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    }
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to sign out?");
    if (confirmLogout) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        location.href = "../index.html"; 
    }
}

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

function repositionIndicator() {
  const activeItem = document.querySelector(".menu-item.active");
  if (activeItem && slidingIndicator) {
    slidingIndicator.style.top = `${activeItem.offsetTop}px`;
    slidingIndicator.style.height = `${activeItem.offsetHeight}px`;
  }
}
window.addEventListener("resize", repositionIndicator);

menuItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (!this.hasAttribute("data-status")) return;
    e.preventDefault();
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    statusFilterStr = this.getAttribute("data-status");
    const mainContent = document.querySelector('.main-content');
    const index = this.getAttribute("data-index");
    if (index === "0") {
        mainContent.classList.remove("tasks-only-view");
    } else {
        mainContent.classList.add("tasks-only-view");
    }
    repositionIndicator();
    renderTaskBoard();
  });
});

labelFilterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    priorityFilterStr = this.getAttribute("data-priority");
    labelFilterBtns.forEach((b) => b.classList.remove("active-label-filter"));
    this.classList.add("active-label-filter");
    renderTaskBoard();
  });
});

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    searchFilterStr = "";
    priorityFilterStr = "";
    statusFilterStr = "all";
    
    if (taskSearchInput) taskSearchInput.value = "";
    
    labelFilterBtns.forEach((b) => b.classList.remove("active-label-filter"));
    
    menuItems.forEach((i) => i.classList.remove("active"));
    if (menuItems[0]) menuItems[0].classList.add("active");
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.remove("tasks-only-view");
    }
    
    repositionIndicator();
    renderTaskBoard();
  });
}

if (taskSearchInput) {
  taskSearchInput.addEventListener("input", (e) => {
    searchFilterStr = e.target.value.toLowerCase().trim();
    renderTaskBoard();
  });
}

function updateNotifications() {
    const badge = document.getElementById("notificationBadge");
    const notifList = document.getElementById("notificationList");
    if (!badge || !notifList) return;

    const activeTasks = taskState.filter(t => t.status === "Pending" || t.status === "In Progress");
    
    badge.innerText = activeTasks.length;
    if (activeTasks.length === 0) {
        badge.style.display = 'none';
        notifList.innerHTML = `<div class="notif-empty">No active tasks! You're all caught up. 🎉</div>`;
        return;
    } else {
        badge.style.display = 'flex';
    }

    notifList.innerHTML = "";
    activeTasks.forEach(task => {
        const statusClass = task.status === "Pending" ? "pending" : "inprogress";
        const item = document.createElement("div");
        item.className = "notif-item";
        item.innerHTML = `
            <div class="notif-title">${escapeHTML(task.title)}</div>
            <div class="notif-meta">
                <span class="notif-status ${statusClass}">${task.status}</span>
                <span>${task.date}</span>
            </div>
        `;
        notifList.appendChild(item);
    });
}

function updateProductivityMetrics() {
    const totalTasks = taskState.length;
    const completedTasks = taskState.filter(t => t.status === "Completed").length;

    let overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const circleValue = document.getElementById("circularProgressValue");
    if (circleValue) circleValue.innerText = `${overallProgress}%`;

    const progressCircle = document.getElementById("dashboardProgressCircle");
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(var(--primary-color) ${overallProgress * 3.6}deg, var(--border-color) 0deg)`;
    }

    const dailyElem = document.getElementById("overview-daily");
    const weeklyElem = document.getElementById("overview-weekly");
    const monthlyElem = document.querySelector(".progress-amber .inner-circle");

    let dailyProg = totalTasks === 0 ? 0 : Math.min(100, Math.round(overallProgress * 1.2));
    let weeklyProg = overallProgress;
    let monthlyProg = totalTasks === 0 ? 0 : Math.max(0, Math.round(overallProgress * 0.8) + 15);

    if (dailyElem) dailyElem.innerText = `${dailyProg}%`;
    if (weeklyElem) weeklyElem.innerText = `${weeklyProg}%`;
    if (monthlyElem) monthlyElem.innerText = `${monthlyProg}%`;
}

function renderTaskBoard() {
  const todoList = document.getElementById("list-todo");
  const progressList = document.getElementById("list-inprogress");
  const completedList = document.getElementById("list-completed");

  todoList.innerHTML = "";
  progressList.innerHTML = "";
  completedList.innerHTML = "";
  let tCount = 0, pCount = 0, cCount = 0;

  taskState.forEach((task) => {
    if (!task.title.toLowerCase().includes(searchFilterStr) || (priorityFilterStr !== "" && task.priority !== priorityFilterStr) || (statusFilterStr !== "all" && task.status !== statusFilterStr)) return;

    const card = document.createElement("div");
    card.className = `task-card ${task.status === "Completed" ? "completed-task-fade" : ""}`;
    card.setAttribute("draggable", "true");
    card.setAttribute("data-id", task.id);
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.onclick = () => openDrawer(task.id);

    card.innerHTML = `
            <div class="task-card-header" style="align-items: center;">
                <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
                <div class="card-quick-actions">
                    <button class="quick-action-btn edit" onclick="event.stopPropagation(); openDrawer('${task.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="quick-action-btn delete" onclick="event.stopPropagation(); quickDeleteTask('${task.id}', '${escapeHTML(task.title.replace(/'/g, "\\'"))}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <h4 class="task-card-title">${escapeHTML(task.title)}</h4>
            <div class="task-card-footer">
                <span class="due-date"><i class="fa-regular fa-calendar"></i> ${task.date}</span>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80" alt="assignee" class="assignee-img">
            </div>
        `;

    if (task.status === "Pending") { todoList.appendChild(card); tCount++; }
    else if (task.status === "In Progress") { progressList.appendChild(card); pCount++; }
    else if (task.status === "Completed") { completedList.appendChild(card); cCount++; }
  });

  if (tCount === 0) todoList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>No pending tasks</div>`;
  if (pCount === 0) progressList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>Nothing in progress</div>`;
  if (cCount === 0) completedList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>No completed tasks</div>`;

  document.getElementById("badge-todo").innerText = tCount;
  document.getElementById("badge-inprogress").innerText = pCount;
  document.getElementById("badge-completed").innerText = cCount;
  
  updateNotifications();
  updateProductivityMetrics(); 
}

let draggedTaskId = null;
function handleDragStart(e) { draggedTaskId = e.currentTarget.getAttribute("data-id"); e.currentTarget.classList.add("is-dragging"); }
function handleDragEnd(e) { e.currentTarget.classList.remove("is-dragging"); draggedTaskId = null; }

document.querySelectorAll(".kanban-column").forEach((column) => {
  column.addEventListener("dragover", (e) => { e.preventDefault(); column.classList.add("drag-over-active"); });
  column.addEventListener("dragleave", () => { column.classList.remove("drag-over-active"); });
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over-active");
    if (!draggedTaskId) return;
    const listContainer = column.querySelector(".task-list");
    const statusMap = { "list-todo": "Pending", "list-inprogress": "In Progress", "list-completed": "Completed" };
    const newStatus = statusMap[listContainer.id];
    const taskIndex = taskState.findIndex((t) => t.id === draggedTaskId);
    if (taskIndex !== -1 && taskState[taskIndex].status !== newStatus) {
      taskState[taskIndex].status = newStatus;
      saveTasks(); renderTaskBoard();
      logActivity(`Moved "${taskState[taskIndex].title}" to ${newStatus}`, "info");
    }
  });
});

function renderActivityTimeline() {
  const timeline = document.getElementById("activityTimeline");
  if (!timeline) return;
  timeline.innerHTML = "";
  activityHistory.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "timeline-item activity-fade-in-entry";
    item.innerHTML = `<div class="timeline-dot ${activity.type === "success" ? "success" : "info"}"><i class="fa-solid ${activity.type === "success" ? "fa-check" : "fa-pen"}"></i></div>
        <div class="timeline-content"><p>${escapeHTML(activity.text)}</p><span class="time-stamp">${activity.stamp}</span></div>`;
    timeline.appendChild(item);
  });
}

function logActivity(text, type) {
  activityHistory.unshift({ text: text, type: type, stamp: "Just now" });
  if (activityHistory.length > 3) activityHistory.pop();
  renderActivityTimeline();
}

if (addTaskForm) {
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("taskNameInput").value.trim();
    const desc = document.getElementById("taskDescInput").value.trim() || "No description provided.";
    const priority = document.getElementById("taskPriorityInput").value;
    const date = document.getElementById("taskDateInput").value;
    const status = document.getElementById("taskStatusInput").value;
    const submitBtn = document.querySelector(".button-loader-target");
    if (submitBtn) submitBtn.classList.add("button-loading");
    setTimeout(() => {
      taskState.push({ id: `task-${Date.now()}`, title: name, desc: desc, priority: priority, date: date, status: status });
      saveTasks();
      addTaskForm.reset();
      if (submitBtn) submitBtn.classList.remove("button-loading");
      modalOverlay.classList.remove("active");
      renderTaskBoard();
      logActivity(`Added task "${name}" to board`, "info");
      spawnNotification("Task Saved Successfully", "Card appended to structural columns maps.");
    }, 800);
  });
}

document.querySelectorAll(".add-inline-task").forEach((btn) => {
  btn.addEventListener("click", function () {
    const col = this.getAttribute("data-column");
    if (document.getElementById("taskStatusInput")) document.getElementById("taskStatusInput").value = col;
    modalOverlay.classList.add("active");
  });
});

if (cancelModalBtn) cancelModalBtn.addEventListener("click", () => { modalOverlay.classList.remove("active"); addTaskForm.reset(); });
if (openModalBtn) openModalBtn.addEventListener("click", () => { modalOverlay.classList.add("active"); });
if (closeModalBtn) closeModalBtn.addEventListener("click", () => { modalOverlay.classList.remove("active"); addTaskForm.reset(); });

function openDrawer(id) {
  const task = taskState.find((t) => t.id === id);
  if (!task) return;
  document.getElementById("drawerTaskId").value = task.id;
  document.getElementById("drawerTaskTitle").value = task.title;
  document.getElementById("drawerTaskDesc").value = task.desc;
  document.getElementById("drawerTaskDate").value = task.date;
  document.getElementById("drawerTaskPriority").value = task.priority;
  document.getElementById("drawerTaskStatus").value = task.status;
  if (document.getElementById("drawerCompleteBtn")) {
    document.getElementById("drawerCompleteBtn").style.display = task.status === "Completed" ? "none" : "flex";
  }
  taskDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
}

function closeDrawer() { taskDrawer.classList.remove("active"); drawerOverlay.classList.remove("active"); }

if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

if (document.getElementById("drawerSaveBtn")) {
  document.getElementById("drawerSaveBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const taskIndex = taskState.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      taskState[taskIndex].title = document.getElementById("drawerTaskTitle").value.trim();
      taskState[taskIndex].desc = document.getElementById("drawerTaskDesc").value.trim();
      taskState[taskIndex].priority = document.getElementById("drawerTaskPriority").value;
      taskState[taskIndex].date = document.getElementById("drawerTaskDate").value;
      taskState[taskIndex].status = document.getElementById("drawerTaskStatus").value;
      saveTasks();
      renderTaskBoard();
      closeDrawer();
      logActivity(`Edited task: "${taskState[taskIndex].title}"`, "info");
      spawnNotification("Task Updated", "Changes saved to Local Storage successfully.");
    }
  });
}

if (document.getElementById("drawerCompleteBtn")) {
  document.getElementById("drawerCompleteBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const task = taskState.find((t) => t.id === id);
    if (task) {
      task.status = "Completed";
      saveTasks();
      renderTaskBoard();
      closeDrawer();
      logActivity(`Checked out task "${task.title}" as complete`, "success");
      spawnNotification("Task Completed", "Dashboard metrics updated.");
    }
  });
}

if (document.getElementById("drawerDeleteBtn")) {
  document.getElementById("drawerDeleteBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const idx = taskState.findIndex((t) => t.id === id);
    if (idx !== -1) {
      const name = taskState[idx].title;
      taskState.splice(idx, 1);
      saveTasks();
      renderTaskBoard();
      closeDrawer();
      logActivity(`Permanently deleted task "${name}"`, "info");
      spawnNotification("Task Purged", "Item removed from local storage.");
    }
  });
}

function spawnNotification(title, msg) {
  const container = document.getElementById("notificationContainer");
  const toast = document.createElement("div");
  toast.className = "toast-card toast-success";
  toast.innerHTML = `<div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div><div class="toast-body"><h4>${title}</h4><p>${msg}</p></div><div class="toast-progress-bar"></div><button class="toast-close">&times;</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("visible-toast"), 20);
  toast.querySelector(".toast-close").onclick = () => toast.remove();
  setTimeout(() => { if (toast && toast.parentElement) { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); } }, 4000);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, (tag) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag);
}

window.quickDeleteTask = function (id, title) {
  if (confirm(`Are you sure you want to permanently delete the task: "${title}"?`)) {
    const idx = taskState.findIndex((t) => t.id === id);
    if (idx !== -1) {
      taskState.splice(idx, 1);
      saveTasks();
      renderTaskBoard();
      logActivity(`Deleted task "${title}"`, "info");
      spawnNotification("Task Deleted", "The task has been permanently removed.");
    }
  }
};