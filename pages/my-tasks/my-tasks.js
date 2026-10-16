// The "notebook": our list of tasks.
// No database yet, so the data lives here. In Part 2 it will come from the database.
let tasks = [
  { id: 1, title: 'Fix session timeout on client login page', project: 'Client portal v2', priority: 'High',   status: 'In progress', due: '2026-10-09' },
  { id: 2, title: 'Update printer drivers on 2nd-floor PCs',  project: 'Office IT refresh', priority: 'High',   status: 'In progress', due: '2026-10-14' },
  { id: 3, title: 'Draft onboarding checklist',               project: 'HR onboarding',     priority: 'Medium', status: 'To do',       due: '2026-10-16' },
  { id: 4, title: 'Write knowledge base post on VPN setup',   project: 'Office IT refresh', priority: 'Low',    status: 'To do',       due: '2026-10-20' },
  { id: 5, title: 'Order printing paper for Finance',         project: 'Personal',          priority: 'Low',    status: 'Done',        due: '2026-10-08' },
  { id: 6, title: 'Schedule team meeting',                    project: 'Team coordination', priority: 'Medium', status: 'Done',       due: '2026-10-25' }
];

// page loads every task
let currentFilter = 'All';

// Find the empty <ul> on the page, using its id
const list = document.getElementById('task-list');
const newTaskInput = document.getElementById('newTask_input');
const addTaskBtn = document.getElementById('adding_task_btn');

// Wipe the list, then rebuild it from the tasks array
function render() {
  list.innerHTML = '';   // wipe the whiteboard

  let visibleTasks = tasks;
    if (currentFilter !== 'All') {
      visibleTasks = tasks.filter(t => t.status === currentFilter); // keeps each task whose status text matches the selected filter exactly
    }

  visibleTasks.forEach(task => {
    const li = document.createElement('li');   // make a new <li>
    
    li.className = task.status === 'Done' ? 'is-done' : '';
    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.status === 'Done' ? 'checked' : ''}>
      <strong>${task.title}</strong>
      <span>${task.project} · ${task.priority} · due ${task.due}</span>
      <span class="status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
      <button class="delete_btn">Delete</button>`;

    li.querySelector('.task-check').addEventListener('change', () => toggleDone(task.id));
    li.querySelector('.delete_btn').addEventListener('click', () => deleteTask(task.id));
    list.appendChild(li);   // put it on the page
  });
  updateCounters();
}



// Today's date as 'YYYY-MM-DD', the same format as task.due
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// A task is overdue if it isn't done AND its due date is before today
function isOverdue(task) {
  return task.status !== 'Done' && task.due < todayString();
}

// Count the tasks and put the numbers on the page
function updateCounters() {
  const open    = tasks.filter(t => t.status !== 'Done').length;
  const overdue = tasks.filter(isOverdue).length;
  const done    = tasks.filter(t => t.status === 'Done').length;
  const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length;
  
  document.getElementById('count-open').textContent    = open;
  document.getElementById('count-overdue').textContent = overdue;
  document.getElementById('count-done').textContent    = done;
  document.getElementById('count-high-priority').textContent = highPriority;
}


// Flip a task between Done and To do, then redraw the page
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);   // find the task that was clicked

  if (task.status === 'Done') {
    task.status = 'To do';
  } else {
    task.status = 'Done';
  }

  render();   // redraw so the list and counters update
}

// removing a task by its id, then redraw the page
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();   // redraw so the list and counters update
}

// read the input box, build a new task, add it to the array, then redraw
function addTask() {
  const title = newTaskInput.value;
  if (title === '') return; // nothing typed, so do nothing

  tasks.push({
    id: Date.now(),
    title: title,
    project: 'Personal',
    priority: 'Medium',
    status: 'To do',
    due: todayString()
  });

  newTaskInput.value = '';  // box should be cleared
  render();
}
// add task button
addTaskBtn.addEventListener('click', addTask);

// filter buttons
document.querySelectorAll('.filter_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;  // remember which filter was clicked
    document.querySelectorAll('.filter_btn').forEach(b => b.classList.remove('ready'));
    btn.classList.add('ready');
    render();  // redraw with that filter
  });
});

// Draw the list once when the page first loads
render();