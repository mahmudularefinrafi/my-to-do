const taskForm = document.getElementById('taskForm');
const taskDate = document.getElementById('taskDate');
const taskInput = document.getElementById('taskInput');
const taskPriority = document.getElementById('taskPriority');
const tasksContainer = document.getElementById('tasksContainer');
const clearAllBtn = document.getElementById('clearAll');
const toggleThemeBtn = document.getElementById('toggleTheme');

let tasks = JSON.parse(localStorage.getItem('myToSoTasks')) || {};

// Set today's date as default for date input
function setTodayDate() {
  const today = new Date().toISOString().slice(0, 10);
  taskDate.value = today;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('myToSoTasks', JSON.stringify(tasks));
}

// Format date nicely
function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(dateStr + "T00:00:00");
  return dateObj.toLocaleDateString(undefined, options);
}

// Sort tasks by priority (high > medium > low)
function sortTasksByPriority(taskArr) {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return taskArr.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// Render tasks grouped by date and sorted by priority
function renderTasks() {
  tasksContainer.innerHTML = '';
  const dates = Object.keys(tasks).sort();

  if (dates.length === 0) {
    tasksContainer.innerHTML = '<p style="color:#666; font-style: italic; text-align:center;">No tasks yet. Add one above!</p>';
    return;
  }

  dates.forEach(date => {
    const dateSection = document.createElement('section');
    dateSection.classList.add('date-section');

    const dateTitle = document.createElement('h3');
    dateTitle.textContent = formatDate(date);
    dateSection.appendChild(dateTitle);

    const ul = document.createElement('ul');

    const sortedTasks = sortTasksByPriority(tasks[date]);

    sortedTasks.forEach((task) => {
      const li = document.createElement('li');
      li.dataset.priority = task.priority;

      if (task.done) li.classList.add('done');

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;
      span.title = `Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;

      // Toggle done on clicking task text
      span.onclick = () => {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      };

      const btns = document.createElement('div');
      btns.className = 'buttons';

      // Done button
      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn-done';
      doneBtn.textContent = task.done ? 'Undo' : 'Done';
      doneBtn.title = task.done ? 'Mark as not done' : 'Mark as done';
      doneBtn.onclick = () => {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      };

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.title = 'Delete task';
      deleteBtn.onclick = () => {
        // Find index in original array
        const index = tasks[date].indexOf(task);
        if (index > -1) {
          tasks[date].splice(index, 1);
          if (tasks[date].length === 0) delete tasks[date];
          saveTasks();
          renderTasks();
        }
      };

      btns.appendChild(doneBtn);
      btns.appendChild(deleteBtn);

      li.appendChild(span);
      li.appendChild(btns);

      ul.appendChild(li);
    });

    dateSection.appendChild(ul);
    tasksContainer.appendChild(dateSection);
  });
}

// Clear all tasks confirmation
clearAllBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = {};
    saveTasks();
    renderTasks();
  }
});

// Add new task handler
taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const dateValue = taskDate.value;
  const taskText = taskInput.value.trim();
  const priorityValue = taskPriority.value;

  if (!dateValue) {
    alert('Please select a date.');
    return;
  }
  if (taskText.length === 0) {
    alert('Please enter a task.');
    return;
  }
  if (!priorityValue) {
    alert('Please select priority.');
    return;
  }

  if (!tasks[dateValue]) {
    tasks[dateValue] = [];
  }

  tasks[dateValue].push({ text: taskText, done: false, priority: priorityValue });

  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskPriority.value = '';
  taskInput.focus();
});

// Theme toggle
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if(document.body.classList.contains('dark')){
    toggleThemeBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    toggleThemeBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
});

// Load theme from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark'){
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    toggleThemeBtn.textContent = '🌙';
  }
}

// Initialize
setTodayDate();
loadTheme();
renderTasks();
