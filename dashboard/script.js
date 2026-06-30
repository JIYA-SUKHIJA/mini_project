// Default template tasks for first-time visitors
const defaultTasks = [
  {
    id: "task-1",
    title: "Draft methodology for SSL-HGMamba architecture",
    desc: "Integrate hypergraphs and State Space Models for temporal modeling.",
    priority: "High",
    date: "2026-06-30",
    status: "In Progress",
  },
  {
    id: "task-2",
    title: "Review examination papers",
    desc: "Grade the recent batch for Kurukshetra University.",
    priority: "Medium",
    date: "2026-06-28",
    status: "Pending",
  },
  {
    id: "task-3",
    title: "Submit HRA application",
    desc: "Submit the annual performance review application for the current fiscal year.",
    priority: "High",
    date: "2026-06-29",
    status: "In Progress",
  },
  {
    id: "task-4",
    title: "Client Follow-ups",
    desc: "Follow up with Max Life Insurance client leads for policy renewals.",
    priority: "Medium",
    date: "2026-07-05",
    status: "Pending",
  },
  {
    id: "task-5",
    title: "Finalize VLM Review Paper",
    desc: "Complete the 40-page draft on Architectural Innovations and Optimization Frontiers in Compact Vision-Language Models.",
    priority: "High",
    date: "2026-07-15",
    status: "Pending",
  },
  {
    id: "task-6",
    title: "Draft education loan correspondence",
    desc: "Prepared formal letter to Canara Bank regarding Geeta University MCA course fees.",
    priority: "High",
    date: "2026-07-15",
    status: "Completed",
  },
];

// Initialize from Local Storage, fallback to defaults
let taskState = JSON.parse(localStorage.getItem("kanbanTasks"));
if (!taskState || taskState.length === 0) {
  taskState = defaultTasks;
  saveTasks(); // Commit defaults to local storage immediately
}

// HELPER: Sync array to Local Storage
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(taskState));
}

// INITIAL AUDIT PLACEHOLDERS LOG MATRIX
let activityHistory = [
  {
    text: "Task 'Setup Project Structure' marked completed",
    type: "success",
    stamp: "1 hour ago",
  },
  {
    text: "Task 'Build Task Cards' moved to In Progress column",
    type: "info",
    stamp: "15 mins ago",
  },
  {
    text: "Workspace verified with advanced performance features",
    type: "info",
    stamp: "Just now",
  },
];

let searchFilterStr = "";
let priorityFilterStr = "";
let statusFilterStr = "all";

// DOM ATTACHMENTS INDEX
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const footerCollapseBtn = document.getElementById("footerCollapseBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuItems = document.querySelectorAll(".menu-item");
const slidingIndicator = document.getElementById("slidingIndicator");
const headerThemeToggle = document.getElementById("headerThemeToggle");
const progressCircle = document.getElementById("dashboardProgressCircle");
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

// LIFECYCLE HOOK RUNNERS
window.addEventListener("load", () => {
  setTimeout(() => {
    if (globalLoader) {
      globalLoader.classList.add("fade-out-loader");
      setTimeout(() => globalLoader.remove(), 400);
    }
  }, 600);
});

// Ensure this is inside your existing DOMContentLoaded listener in script.js
document.addEventListener("DOMContentLoaded", () => {
  renderTaskBoard();
  renderActivityTimeline();
  repositionIndicator();
  spawnNotification(
    "Workspace Loaded",
    "Dynamic timeline parameters initialized successfully.",
  );

  // --- FIX: Ensure logout button is bound here ---
  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", logout);
  }
});

function logout() {
    localStorage.clear();
    // Use ../ to navigate out of the 'dashboard' folder to the root
    location.href = "../index.html"; 
}
// SIDEBAR MECHANICS
function toggleSidebarState() {
  sidebar.classList.toggle("collapsed");
  setTimeout(repositionIndicator, 300);
}
if (toggleSidebar) toggleSidebar.addEventListener("click", toggleSidebarState);
if (footerCollapseBtn)
  footerCollapseBtn.addEventListener("click", toggleSidebarState);

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
    
    // Update active visual state
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    statusFilterStr = this.getAttribute("data-status");
    
    // INTEGRATION: Toggle the view class
    const mainContent = document.querySelector('.main-content');
    const index = this.getAttribute("data-index");
    
    // If index 0 (Dashboard) is active, remove the class (show everything)
    // If index 1 (My Tasks) or others are active, add the class (show just the board)
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

// MATRIX GRAPH TRACK SYNC
function updateProgressCircleTrack(percentage) {
  if (!progressCircle) return;
  const color = "#6366f1";
  const remainderColor = document.body.classList.contains("dark-theme")
    ? "#334155"
    : "#edf2f7";
  const degrees = (percentage / 100) * 360;
  progressCircle.style.background = `conic-gradient(${color} ${degrees}deg, ${remainderColor} 0deg)`;
}

if (headerThemeToggle) {
  headerThemeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme", headerThemeToggle.checked);
    updateProgressCircleTrack(calculateMetrics().score);
  });
}

function calculateMetrics() {
  const total = taskState.length;
  const completed = taskState.filter((t) => t.status === "Completed").length;
  const pending = taskState.filter((t) => t.status === "Pending").length;
  const progress = taskState.filter((t) => t.status === "In Progress").length;
  const high = taskState.filter((t) => t.priority === "High").length;
  const score = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, progress, high, score };
}

function updateMetricDOM() {
  const m = calculateMetrics();
  document.getElementById("stat-total").innerText = m.total;
  document.getElementById("stat-completed").innerText = m.completed;
  document.getElementById("stat-pending").innerText = m.pending;
  document.getElementById("stat-progress").innerText = m.progress;
  document.getElementById("stat-high").innerText = m.high;
  document.getElementById("stat-score").innerText = m.score;

  document.getElementById("pb-total").style.width = "100%";
  document.getElementById("pb-completed").style.width =
    m.total > 0 ? `${(m.completed / m.total) * 100}%` : "0%";
  document.getElementById("pb-pending").style.width =
    m.total > 0 ? `${(m.pending / m.total) * 100}%` : "0%";
  document.getElementById("pb-progress").style.width =
    m.total > 0 ? `${(m.progress / m.total) * 100}%` : "0%";
  document.getElementById("pb-high").style.width =
    m.total > 0 ? `${(m.high / m.total) * 100}%` : "0%";
  document.getElementById("pb-score").style.width = `${m.score}%`;

  const cpValue = document.getElementById("circularProgressValue");
  if (cpValue) cpValue.innerText = `${m.score}%`;
  updateProgressCircleTrack(m.score);

  if (document.getElementById("overview-daily"))
    document.getElementById("overview-daily").innerText = `${m.score}%`;
  if (document.getElementById("overview-weekly"))
    document.getElementById("overview-weekly").innerText =
      m.total > 0 ? `${Math.round((m.completed / m.total) * 90)}%` : "0%";
}

// BOARD RENDERING MATRIX
function renderTaskBoard() {
  const todoList = document.getElementById("list-todo");
  const progressList = document.getElementById("list-inprogress");
  const completedList = document.getElementById("list-completed");

  todoList.innerHTML = "";
  progressList.innerHTML = "";
  completedList.innerHTML = "";
  let tCount = 0,
    pCount = 0,
    cCount = 0;

  taskState.forEach((task) => {
    if (
      !task.title.toLowerCase().includes(searchFilterStr) ||
      (priorityFilterStr !== "" && task.priority !== priorityFilterStr) ||
      (statusFilterStr !== "all" && task.status !== statusFilterStr)
    )
      return;

    const card = document.createElement("div");
    const entrance =
      task.status === "Pending"
        ? "card-entry-left"
        : task.status === "In Progress"
          ? "card-entry-bottom"
          : "card-entry-right";

    // DRAG & DROP: Add draggable attribute and ID tracking
    card.className = `task-card ${entrance} ${task.status === "Completed" ? "completed-task-fade" : ""}`;
    card.setAttribute("draggable", "true");
    card.setAttribute("data-id", task.id);

    // DRAG & DROP: Event Listeners
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.onclick = () => openDrawer(task.id);

    const rawDate = new Date(task.date);
    const cleanDate = isNaN(rawDate)
      ? task.date
      : rawDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

    card.innerHTML = `
            <div class="task-card-header" style="align-items: center;">
                <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
                <div class="card-quick-actions">
                    <button class="quick-action-btn edit" onclick="event.stopPropagation(); openDrawer('${task.id}')" title="Edit Task">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="quick-action-btn delete" onclick="event.stopPropagation(); quickDeleteTask('${task.id}', '${escapeHTML(task.title.replace(/'/g, "\\'"))}')" title="Delete Task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <h4 class="task-card-title">${escapeHTML(task.title)}</h4>
            <div class="task-card-footer">
                <span class="due-date"><i class="fa-regular fa-calendar"></i> ${cleanDate}</span>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80" alt="assignee" class="assignee-img">
            </div>
        `;

    if (task.status === "Pending") {
      todoList.appendChild(card);
      tCount++;
    } else if (task.status === "In Progress") {
      progressList.appendChild(card);
      pCount++;
    } else if (task.status === "Completed") {
      completedList.appendChild(card);
      cCount++;
    }
  });

  // EMPTY STATES: Add professional empty placeholders if columns are clear
  if (tCount === 0)
    todoList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>No pending tasks</div>`;
  if (pCount === 0)
    progressList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>Nothing in progress</div>`;
  if (cCount === 0)
    completedList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><br>No completed tasks</div>`;

  document.getElementById("badge-todo").innerText = tCount;
  document.getElementById("badge-inprogress").innerText = pCount;
  document.getElementById("badge-completed").innerText = cCount;
  updateMetricDOM();
}

// --- DRAG AND DROP LOGIC CORE ---
let draggedTaskId = null;

function handleDragStart(e) {
  draggedTaskId = e.currentTarget.getAttribute("data-id");
  e.currentTarget.classList.add("is-dragging");
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove("is-dragging");
  draggedTaskId = null;
}

document.querySelectorAll(".kanban-column").forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault(); // Required to allow dropping
    column.classList.add("drag-over-active");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over-active");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over-active");

    if (!draggedTaskId) return;

    // Determine which list we dropped into
    const listContainer = column.querySelector(".task-list");
    const statusMap = {
      "list-todo": "Pending",
      "list-inprogress": "In Progress",
      "list-completed": "Completed",
    };
    const newStatus = statusMap[listContainer.id];

    const taskIndex = taskState.findIndex((t) => t.id === draggedTaskId);
    if (taskIndex !== -1 && taskState[taskIndex].status !== newStatus) {
      taskState[taskIndex].status = newStatus;
      saveTasks();
      renderTaskBoard();
      logActivity(
        `Moved "${taskState[taskIndex].title}" to ${newStatus}`,
        "info",
      );
    }
  });
});

// 7. ACTIVE AUDIT RECENT TIMELINE RENDERING SYSTEM
function renderActivityTimeline() {
  const timeline = document.getElementById("activityTimeline");
  if (!timeline) return;

  timeline.innerHTML = ""; // Wipe baseline hardcoded entries

  activityHistory.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "timeline-item activity-fade-in-entry"; // Uses micro animations entry targets

    const dotType = activity.type === "success" ? "success" : "info";
    const icon = activity.type === "success" ? "fa-check" : "fa-pen";

    item.innerHTML = `
            <div class="timeline-dot ${dotType}"><i class="fa-solid ${icon}"></i></div>
            <div class="timeline-content">
                <p>${escapeHTML(activity.text)}</p>
                <span class="time-stamp">${activity.stamp}</span>
            </div>
        `;
    timeline.appendChild(item);
  });
}

function logActivity(text, type) {
  // Unshift newest elements into tracking logs
  activityHistory.unshift({ text: text, type: type, stamp: "Just now" });

  // Bounds check constraint matching visual parameters card layout boundaries
  if (activityHistory.length > 3) {
    activityHistory.pop();
  }
  renderActivityTimeline();
}

// OPERATION TRIGGERS (CRUD INTEGRATIONS INTERFACES)
if (addTaskForm) {
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("taskNameInput").value.trim();
    const desc =
      document.getElementById("taskDescInput").value.trim() ||
      "No description provided.";
    const priority = document.getElementById("taskPriorityInput").value;
    const date = document.getElementById("taskDateInput").value;
    const status = document.getElementById("taskStatusInput").value;

    const submitBtn = document.querySelector(".button-loader-target");
    if (submitBtn) submitBtn.classList.add("button-loading");

    setTimeout(() => {
      taskState.push({
        id: `task-${Date.now()}`,
        title: name,
        desc: desc,
        priority: priority,
        date: date,
        status: status,
      });
      saveTasks(); // <--- NEW: Commit to database

      addTaskForm.reset();
      if (submitBtn) submitBtn.classList.remove("button-loading");
      modalOverlay.classList.remove("active");

      renderTaskBoard();
      logActivity(`Added task "${name}" to board`, "info"); // Logs transaction dynamically
      spawnNotification(
        "Task Saved Successfully",
        "Card appended to structural columns maps.",
      );
    }, 800);
  });
}

document.querySelectorAll(".add-inline-task").forEach((btn) => {
  btn.addEventListener("click", function () {
    const col = this.getAttribute("data-column");
    if (document.getElementById("taskStatusInput"))
      document.getElementById("taskStatusInput").value = col;
    modalOverlay.classList.add("active");
  });
});

if (cancelModalBtn) {
  cancelModalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    addTaskForm.reset();
  });
}
if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });
}
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    addTaskForm.reset();
  });
}

// --- SIDE DRAWER: EDIT & CRUD LOGIC ---

function openDrawer(id) {
  const task = taskState.find((t) => t.id === id);
  if (!task) return;

  // Hydrate inputs with values
  document.getElementById("drawerTaskId").value = task.id;
  document.getElementById("drawerTaskTitle").value = task.title;
  document.getElementById("drawerTaskDesc").value = task.desc;
  document.getElementById("drawerTaskDate").value = task.date;
  document.getElementById("drawerTaskPriority").value = task.priority;
  document.getElementById("drawerTaskStatus").value = task.status;

  if (document.getElementById("drawerCompleteBtn")) {
    document.getElementById("drawerCompleteBtn").style.display =
      task.status === "Completed" ? "none" : "flex";
  }

  taskDrawer.classList.add("active");
  drawerOverlay.classList.add("active");
}

function closeDrawer() {
  taskDrawer.classList.remove("active");
  drawerOverlay.classList.remove("active");
}

if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

// 1. UPDATE TASK BUTTON
if (document.getElementById("drawerSaveBtn")) {
  document.getElementById("drawerSaveBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const taskIndex = taskState.findIndex((t) => t.id === id);

    if (taskIndex !== -1) {
      taskState[taskIndex].title = document
        .getElementById("drawerTaskTitle")
        .value.trim();
      taskState[taskIndex].desc = document
        .getElementById("drawerTaskDesc")
        .value.trim();
      taskState[taskIndex].priority =
        document.getElementById("drawerTaskPriority").value;
      taskState[taskIndex].date =
        document.getElementById("drawerTaskDate").value;
      taskState[taskIndex].status =
        document.getElementById("drawerTaskStatus").value;

      saveTasks(); // Sync
      renderTaskBoard();
      closeDrawer();

      logActivity(`Edited task: "${taskState[taskIndex].title}"`, "info");
      spawnNotification(
        "Task Updated",
        "Changes saved to Local Storage successfully.",
      );
    }
  });
}

// 2. COMPLETE TASK BUTTON
if (document.getElementById("drawerCompleteBtn")) {
  document.getElementById("drawerCompleteBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const task = taskState.find((t) => t.id === id);
    if (task) {
      task.status = "Completed";
      saveTasks(); // Sync
      renderTaskBoard();
      closeDrawer();

      logActivity(`Checked out task "${task.title}" as complete`, "success");
      spawnNotification("Task Completed", "Dashboard matrices updated.");
    }
  });
}

// 3. DELETE TASK BUTTON
if (document.getElementById("drawerDeleteBtn")) {
  document.getElementById("drawerDeleteBtn").addEventListener("click", () => {
    const id = document.getElementById("drawerTaskId").value;
    const idx = taskState.findIndex((t) => t.id === id);
    if (idx !== -1) {
      const name = taskState[idx].title;
      taskState.splice(idx, 1);
      saveTasks(); // Sync
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
  toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div class="toast-body"><h4>${title}</h4><p>${msg}</p></div>
        <div class="toast-progress-bar"></div>
        <button class="toast-close">&times;</button>
    `;
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

function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}

// 8. GLOBAL UTILITY FUNCTIONS
function logout() {
    localStorage.clear();
    // Use ../ to navigate out of the 'dashboard' folder to the root
    location.href = "../index.html"; 
}

// Add this click listener to bind the HTML button to your logout function
document.addEventListener("DOMContentLoaded", () => {
    // 1. Find the button after the page is fully loaded
    const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
    
    // 2. Only add the listener if the button actually exists
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener("click", logout);
        console.log("Logout button listener attached successfully.");
    } else {
        console.warn("Logout button not found in the DOM.");
    }
});

// GLOBAL UTILITY: Inline Delete Function for Kanban Cards
window.quickDeleteTask = function (id, title) {
  if (
    confirm(`Are you sure you want to permanently delete the task: "${title}"?`)
  ) {
    const idx = taskState.findIndex((t) => t.id === id);
    if (idx !== -1) {
      taskState.splice(idx, 1);
      saveTasks(); // Sync to local storage
      renderTaskBoard(); // Re-render UI

      logActivity(`Deleted task "${title}"`, "info");
      spawnNotification(
        "Task Deleted",
        "The task has been permanently removed.",
      );
    }
  }
};
