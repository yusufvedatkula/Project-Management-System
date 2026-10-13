// The "notebook": our list of tasks.
// No database yet, so the data lives here. In Part 2 it will come from the database.
let tasks = [
  { id: 1, title: 'Fix session timeout on client login page', project: 'Client portal v2', priority: 'High',   status: 'In progress', due: '2026-10-09' },
  { id: 2, title: 'Update printer drivers on 2nd-floor PCs',  project: 'Office IT refresh', priority: 'High',   status: 'In progress', due: '2026-10-14' },
  { id: 3, title: 'Draft onboarding checklist',               project: 'HR onboarding',     priority: 'Medium', status: 'To do',       due: '2026-10-16' },
  { id: 4, title: 'Write knowledge base post on VPN setup',   project: 'Office IT refresh', priority: 'Low',    status: 'To do',       due: '2026-10-20' },
  { id: 5, title: 'Order printing paper for Finance',         project: 'Personal',          priority: 'Low',    status: 'Done',        due: '2026-10-08' }
];

// Find the empty <ul> on the page, using its id
const list = document.getElementById('task-list');

// Wipe the list, then rebuild it from the tasks array
function render() {
  list.innerHTML = '';   // wipe the whiteboard

  tasks.forEach(task => {
    const li = document.createElement('li');   // make a new <li>

    li.innerHTML = `
      <strong>${task.title}</strong>
      <span>${task.project} · ${task.priority} · due ${task.due}</span>
    `;

    list.appendChild(li);   // put it on the page
  });
}

// Draw the list once when the page first loads
render();