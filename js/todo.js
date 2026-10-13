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

// Find the empty <ul> on the page, using its id
const list = document.getElementById('task-list');

// Wipe the list, then rebuild it from the tasks array
function render() {
  list.innerHTML = '';   // wipe the whiteboard

  tasks.forEach(task => {
    const li = document.createElement('li');   // make a new <li>
    
    li.className = task.status === 'Done' ? 'is-done' : '';
    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.status === 'Done' ? 'checked' : ''}>
      <strong>${task.title}</strong>
      <span>${task.project} · ${task.priority} · due ${task.due}</span>
      <span class="status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>`;

    li.querySelector('.task-check').addEventListener('change', () => toggleDone(task.id));
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

// Draw the list once when the page first loads
render();