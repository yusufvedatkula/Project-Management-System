// initial task data

let tasks = [
  { id: 1, title: 'Fix session timeout on client login page', project: 'Client portal v2', priority: 'High',   status: 'In progress', due: '2026-10-30' },
  { id: 2, title: 'Update printer drivers on 2nd-floor PCs',  project: 'Office IT refresh', priority: 'High',   status: 'In progress', due: '2026-11-06' },
  { id: 3, title: 'Draft onboarding checklist',               project: 'HR onboarding',     priority: 'Medium', status: 'To do',       due: '2026-11-10' },
  { id: 4, title: 'Write knowledge base post on VPN setup',   project: 'Office IT refresh', priority: 'Low',    status: 'To do',       due: '2026-11-13' },
  { id: 5, title: 'Order printing paper for Finance',         project: 'Personal',          priority: 'Low',    status: 'Done',        due: '2026-10-28' },
  { id: 6, title: 'Schedule team meeting',                    project: 'Team coordination', priority: 'Medium', status: 'Done',       due: '2026-10-29' }
];

const taskEstimates = {
  1: { hours: 4, complexity: 4 },
  2: { hours: 3, complexity: 3 },
  3: { hours: 2, complexity: 2 },
  4: { hours: 1.5, complexity: 2 },
  5: { hours: 0.5, complexity: 1 },
  6: { hours: 1, complexity: 1 }
};

tasks.forEach(task => Object.assign(task, taskEstimates[task.id]));

let currentFilter = 'All';
let currentPriority = 'All';
// default sort is by due date
let currentSort = 'due';

// sort order for priority and status
const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const statusOrder = { 'To do': 1, 'In progress': 2, 'Done': 3 };

const list = document.getElementById('task-list');
const newTaskInput = document.getElementById('newTask_input');
const addTaskBtn = document.getElementById('adding_task_btn');
const prioritySelect = document.getElementById('priority_select');
const projectSelect = document.getElementById('project_select');
const dueInput = document.getElementById('due_input');
const complexitySelect = document.getElementById('complexity_select');
const hoursInput = document.getElementById('hours_input');

// render the filtered and sorted task list
function render() {
  list.innerHTML = ''; 

  let visibleTasks = tasks;
    if (currentFilter !== 'All') {
      visibleTasks = tasks.filter(t => t.status === currentFilter); // keeps each task whose status text matches the selected filter exactly
    }

    // narrow it down again by priority if one is selected
    if (currentPriority !== 'All') {
    visibleTasks = visibleTasks.filter(t => t.priority === currentPriority);
  }

  // put the remaining tasks in order, using a copy so the original list keeps its order
  visibleTasks = [...visibleTasks].sort((a, b) => {
    if (currentSort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (currentSort === 'status') return statusOrder[a.status] - statusOrder[b.status];
    if (currentSort === 'complexity') return b.complexity - a.complexity;
    if (currentSort === 'hours') return b.hours - a.hours;
    return a.due.localeCompare(b.due);   // default: earliest due date first
  });

  // display a message when no tasks match
  if (visibleTasks.length === 0) {
    const message = tasks.length === 0
      ? 'No tasks yet. Add one above.'
      : 'No tasks match these filters';
    list.innerHTML = `<li class="empty">${message}</li>`;
    updateCounters();
    return;
  }

  visibleTasks.forEach(task => {
    const li = document.createElement('li');

    li.className = task.status === 'Done' ? 'is-done' : '';

    const overdue = isOverdue(task); 

    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.status === 'Done' ? 'checked' : ''}>
      <div class="task-main">
        <strong>${task.title}</strong>
        <small>${task.project}</small>
      </div>
      <div class="task-meta">
        <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
        <span class="status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
        <span class="hours">${task.hours}h</span>
        <span class="dots" title="Complexity ${task.complexity}/5">${complexityDots(task.complexity)}</span>
        <span class="due ${overdue ? 'is-overdue' : ''}">${overdue ? 'Overdue · ' : 'Due '}${formatDate(task.due)}</span>
      </div>
      <button class="delete_btn">Delete</button>`;

    li.querySelector('.task-check').addEventListener('change', () => toggleDone(task.id));
    li.querySelector('.delete_btn').addEventListener('click', () => deleteTask(task.id));
    list.appendChild(li); 
  });
  updateCounters();
}



function complexityDots(n) {
  return '●'.repeat(n) + '○'.repeat(5 - n);
}

// return today's date in YYYY-MM-DD format
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// check whether a task is overdue
function isOverdue(task) {
  return task.status !== 'Done' && task.due < todayString();
}

// format a due date for display
function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// update the task counters
function updateCounters() {
  const open    = tasks.filter(t => t.status !== 'Done').length;
  const overdue = tasks.filter(isOverdue).length;
  const done    = tasks.filter(t => t.status === 'Done').length;

  document.getElementById('count-open').textContent    = open;
  document.getElementById('count-overdue').textContent = overdue;
  document.getElementById('count-done').textContent    = done;
}


// toggle a task's completion status
function toggleDone(id) {
  const task = tasks.find(t => t.id === id); 

  if (task.status === 'Done') {
    task.status = 'To do';
  } else {
    task.status = 'Done';
  }

  render();
}

// delete a task by its ID
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();   // redraw so the list and counters update
}

// create a task from the form inputs
function addTask() {
  const title = newTaskInput.value;
  if (title === '') return; // nothing typed, so do nothing

    tasks.push({
    id: Date.now(),
    title: title,
    project: projectSelect.value,       // whichever project the user picked
    priority: prioritySelect.value,
    status: 'To do',
    due: dueInput.value || todayString(),
    hours: Number(hoursInput.value) || 1,
    complexity: Number(complexitySelect.value) // the picked date, or today if left empty
  });

  newTaskInput.value = ''; 
  prioritySelect.value = 'Medium'; // put the dropdown back to the default
  projectSelect.value = 'Personal'; // reset the project too
  dueInput.value = todayString();
  complexitySelect.value = '3';
  hoursInput.value = '';   // and the date back to today
  render();
}
// add task button
addTaskBtn.addEventListener('click', addTask);

// filter buttons
document.querySelectorAll('.filter_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;  // remember which filter was clicked

    // take the highlight off all four buttons, then put it on the one clicked
    document.querySelectorAll('.filter_btn').forEach(b => b.classList.remove('ready'));
    btn.classList.add('ready');

    render();  // redraw with that filter
  });
});

// priority dropdown
document.getElementById('priority_filter').addEventListener('change', event => {
  currentPriority = event.target.value;   // read the option the user picked
  render();                               // redraw with that priority
});

// sort dropdown
document.getElementById('sort_select').addEventListener('change', event => {
  currentSort = event.target.value;   // due, priority or status
  render();                           // redraw in the new order
});

// show today's date above the page title
document.getElementById('today_date').textContent = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
});

// start with today's date in the date picker
dueInput.value = todayString();
// draw the list once when the page first loads
render();
