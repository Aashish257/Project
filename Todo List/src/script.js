/*
Purpose: Manage state variables, storage synchronization, and view sorting for the Todo planner.
Responsibility: Implements localStorage, form validation, row renders, completion toggles, and deletions.
Dependencies: index.html DOM targets.
Concepts Used: LocalStorage, JSON serialization, array filtering, index tracing.
Learning Outcomes: Creating a client-side database model.
*/

// DOM Selectors
const nameInput = document.querySelector('.todo-name-input');
const dateInput = document.querySelector('.todo-date-input');
const prioritySelect = document.querySelector('.todo-priority-input');
const addBtn = document.querySelector('.todo-add-btn');

const todayList = document.getElementById('today-list');
const futureList = document.getElementById('future-list');
const completedList = document.getElementById('completed-list');

// Global state array
let tasksList = [];

/**
 * UTILITY: Get current local date string formatted as YYYY-MM-DD
 */
function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * UTILITY: Convert YYYY-MM-DD date format to D/M/YYYY for presentation
 */
function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

/**
 * STEP 1: Load initial tasks from LocalStorage on page load
 */
function loadTasks() {
    try {
        const stored = localStorage.getItem('todoList');
        if (stored) {
            tasksList = JSON.parse(stored);
        } else {
            tasksList = [];
        }
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        tasksList = [];
    }
    renderTasks();
}

/**
 * STEP 6: Save current tasks state to LocalStorage
 */
function saveTasks() {
    try {
        localStorage.setItem('todoList', JSON.stringify(tasksList));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
}

/**
 * STEP 3: Helper function to filter and render list sections (Today, Future, Completed)
 */
function renderTasks() {
    if (!todayList || !futureList || !completedList) return;

    // Clear containers
    todayList.innerHTML = '';
    futureList.innerHTML = '';
    completedList.innerHTML = '';

    const todayStr = getTodayDateString();

    // Categorize tasks based on date and completion status
    const todayTasks = tasksList.filter(task => !task.completed && task.date === todayStr);
    const futureTasks = tasksList.filter(task => !task.completed && task.date !== todayStr);
    const completedTasks = tasksList.filter(task => task.completed);

    // 1. Render Today's Tasks
    if (todayTasks.length === 0) {
        todayList.innerHTML = `<p style="color: #888888; font-size: 0.95rem; font-style: italic;">No tasks for today.</p>`;
    } else {
        todayTasks.forEach((task, index) => {
            const originalIndex = tasksList.indexOf(task);
            todayList.innerHTML += `
                <div class="task-card incomplete">
                    <span class="task-name">${index + 1}. ${task.name}</span>
                    <span class="task-date">${formatDateDisplay(task.date)}</span>
                    <span class="task-priority">Priority: ${task.priority}</span>
                    <div class="task-actions">
                        <button type="button" class="action-icon tick-btn" onclick="toggleComplete(${originalIndex})">
                            <i class="fa-regular fa-circle-check"></i>
                        </button>
                        <button type="button" class="action-icon delete-btn" onclick="deleteTask(${originalIndex})">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // 2. Render Future Tasks (date in future or past, but incomplete)
    if (futureTasks.length === 0) {
        futureList.innerHTML = `<p style="color: #888888; font-size: 0.95rem; font-style: italic;">No future tasks.</p>`;
    } else {
        futureTasks.forEach((task, index) => {
            const originalIndex = tasksList.indexOf(task);
            futureList.innerHTML += `
                <div class="task-card incomplete">
                    <span class="task-name">${index + 1}. ${task.name}</span>
                    <span class="task-date">${formatDateDisplay(task.date)}</span>
                    <span class="task-priority">Priority: ${task.priority}</span>
                    <div class="task-actions">
                        <button type="button" class="action-icon tick-btn" onclick="toggleComplete(${originalIndex})">
                            <i class="fa-regular fa-circle-check"></i>
                        </button>
                        <button type="button" class="action-icon delete-btn" onclick="deleteTask(${originalIndex})">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // 3. Render Completed Tasks
    if (completedTasks.length === 0) {
        completedList.innerHTML = `<p style="color: #888888; font-size: 0.95rem; font-style: italic;">No completed tasks.</p>`;
    } else {
        completedTasks.forEach((task, index) => {
            const originalIndex = tasksList.indexOf(task);
            completedList.innerHTML += `
                <div class="task-card completed">
                    <span class="task-name">${index + 1}. ${task.name}</span>
                    <span class="task-date">${formatDateDisplay(task.date)}</span>
                    <span class="task-priority">Priority: ${task.priority}</span>
                    <div class="task-actions">
                        <button type="button" class="action-icon delete-btn" onclick="deleteTask(${originalIndex})">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

/**
 * STEP 2: Submit handler for task form validation and creation
 */
function handleAddTask() {
    const nameVal = nameInput.value.trim();
    const dateVal = dateInput.value;
    const priorityVal = prioritySelect.value;

    // Validate inputs: reject if any field is empty
    if (!nameVal || !dateVal || !priorityVal) {
        alert('Please fill in all fields (Item Name, Deadline, and Priority) before adding a task.');
        return;
    }

    // Push new task into state list
    tasksList.push({
        name: nameVal,
        date: dateVal,
        priority: priorityVal,
        completed: false
    });

    // Save and re-render
    saveTasks();
    renderTasks();

    // Reset inputs
    nameInput.value = '';
    dateInput.value = '';
    prioritySelect.value = '';
}

/**
 * STEP 4: Toggle completion state handler using item index reference
 */
window.toggleComplete = function(index) {
    if (index >= 0 && index < tasksList.length) {
        tasksList[index].completed = !tasksList[index].completed;
        saveTasks();
        renderTasks();
    }
};

/**
 * STEP 5: Delete task handler
 */
window.deleteTask = function(index) {
    if (index >= 0 && index < tasksList.length) {
        tasksList.splice(index, 1);
        saveTasks();
        renderTasks();
    }
};

// Bind event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from storage
    loadTasks();

    // Bind Add button click
    if (addBtn) {
        addBtn.addEventListener('click', handleAddTask);
    }
});
