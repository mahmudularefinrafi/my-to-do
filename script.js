function addTask() {
  const date = document.getElementById('task-date').value;
  const task = document.getElementById('task-input').value;

  if (!date || !task) {
    alert("Please select a date and enter a task!");
    return;
  }

  let allTasks = JSON.parse(localStorage.getItem('tasks')) || {};

  if (!allTasks[date]) {
    allTasks[date] = [];
  }

  allTasks[date].push(task);
  localStorage.setItem('tasks', JSON.stringify(allTasks));

  document.getElementById('task-input').value = "";
  displayTasks();
}

function displayTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};

  for (let date in allTasks) {
    const section = document.createElement('div');
    section.innerHTML = `<h3>📅 ${date}</h3>`;

    allTasks[date].forEach(task => {
      const item = document.createElement('p');
      item.textContent = "🔸 " + task;
      section.appendChild(item);
    });

    container.appendChild(section);
  }
}

window.onload = displayTasks;
