const taskForm = document.getElementById('taskForm');
const taskDate = document.getElementById('taskDate');
const taskInput = document.getElementById('taskInput');
const tasksContainer = document.getElementById('tasksContainer');

let tasks = JSON.parse(localStorage.getItem('myToSoTasks')) || {};

function saveTasks() {
  localStorage.setItem('myToSoTasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateObj = new Date(dateStr + "T00:00:00");
  return dateObj.toLocaleDateString(undefined, options);
}

function renderTasks() {
  tasksContainer.innerHTML = '';
  const dates = Object.keys(tasks).sort();

  if (dates.length === 0) {
    tasksContainer.innerHTML = `<p style="text-align:center; color:#ccc;">No tasks yet!</p>`;
    return;
  }

  dates.forEach(date => {
    const section = document.createElement('section');
    section.className = 'date-section';

    const heading = document.createElement('h3');
    heading.textContent = formatDate(date);

    const ul = document.createElement('ul');

    tasks[date].forEach((task, index) => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      const buttons = document.createElement('div');
      buttons.className = 'buttons';

      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn-done';
      doneBtn.textContent = 'Done';
      doneBtn.onclick = () => {
        tasks[date][index].done = !tasks[date][index].done;
        saveTasks();
        renderTasks();
      };

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete';
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => {
        tasks[date].splice(index, 1);
        if (tasks[date].length === 0) delete tasks[date];
        saveTasks();
        renderTasks();
      };

      buttons.appendChild(doneBtn);
      buttons.appendChild(delBtn);

      li.appendChild(span);
      li.appendChild(buttons);
      ul.appendChild(li);
    });

    section.appendChild(heading);
    section.appendChild(ul);
    tasksContainer.appendChild(section);
  });
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const date = taskDate.value;
  const text = taskInput.value.trim();

  if (!date || !text) return;

  if (!tasks[date]) tasks[date] = [];
  tasks[date].push({ text, done: false });

  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskInput.focus();
});

renderTasks();
