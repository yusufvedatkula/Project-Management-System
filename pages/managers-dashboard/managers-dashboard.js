// The team and their assigned tasks come from shared/sample-team.js,
// the same data the Team tasks page uses. Personal to-do lists are never included.

// More estimated hours than this (of unfinished work) = flagged as overloaded
const OVERLOAD_HOURS = 20;

// Today's date as "YYYY-MM-DD", the same format as task.deadline
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// A task is overdue if it isn't done and its deadline has passed
function isOverdue(task) {
  return task.status !== "Done" && task.deadline < todayString();
}

// "2026-11-10" -> "10 Nov"
function niceDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Build each employee's card data from the shared task list
function buildEmployees() {
  return TEAM_MEMBERS.map(function (member) {
    return {
      name: member.name,
      role: member.role,
      tasks: TEAM_TASKS
        .filter(function (task) { return task.owner === member.name; })
        .map(function (task) { return { ...task, overdue: isOverdue(task) }; })
    };
  });
}

// Move a task to another team member, then redraw the whole dashboard
function reassignTask(taskId, newOwner) {
  const task = TEAM_TASKS.find(function (t) { return t.id === taskId; });
  task.owner = newOwner;
  renderDashboard();
}

const manager = { employees: [] };

const employeeGrid = document.getElementById("employee-grid");
const projectList = document.getElementById("project-list");

const projectDetails = {
  "Project Portal": { deadline: "14 Nov", status: "At risk" },
  "Staff Tools": { deadline: "21 Nov", status: "On track" },
  "HR onboarding": { deadline: "30 Oct", status: "Late" },
  "Network upgrade": { deadline: "28 Oct", status: "Late" }
};

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}
  
  // total estimated hours of an employee's unfinished tasks
  function getActiveHours(employee) {
    return employee.tasks
      .filter(function (task) { return task.status !== "Done"; })
      .reduce(function (total, task) { return total + task.hours; }, 0);
  }

  function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // dropdown that lets the manager move a task to someone else
  function makeReassignSelect(task) {
    const select = makeElement("select", "reassign-select");
    select.setAttribute("aria-label", "Reassign " + task.title);

    TEAM_MEMBERS.forEach(function (member) {
      const option = makeElement("option", "", member.name);
      option.value = member.name;
      option.selected = member.name === task.owner;
      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      reassignTask(task.id, select.value);
    });
    return select;
  }

  function getActiveTaskCount(employee) {
    return employee.tasks.filter(function (task) {
      return task.status !== "Done";
    }).length;
  }
  
  function renderEmployee(employee) {
    const card = makeElement("article", "employee-card");
    const header = makeElement("div", "employee-header");
    const details = document.createElement("div");
    const name = makeElement("h3", "", employee.name);
    const role = makeElement("p", "employee-role", employee.role);
    const activeCount = getActiveTaskCount(employee);
    const activeHours = getActiveHours(employee);
    const overloaded = activeHours > OVERLOAD_HOURS;
    let workloadText = (activeCount === 1 ? "1 active task" : activeCount + " active tasks") + " · " + activeHours + "h";
    if (overloaded) {
      workloadText += " · Overloaded";
    }
    const workload = makeElement("span", overloaded ? "workload overloaded" : "workload", workloadText);
  
    details.append(name, role);
    header.append(details, workload);
    card.appendChild(header);
  
    const taskList = makeElement("ul", "task-list");
  
    employee.tasks.forEach(function (task) {
      const row = makeElement("li", "task-row");
      const main = makeElement("div", "task-main");
      const title = makeElement("span", "task-title", task.title);

      // priority · complexity · hours · deadline
      const detailText = capitalise(task.priority) + " priority · " + capitalise(task.complexity) +
        " · " + task.hours + "h · due " + niceDate(task.deadline);
      const meta = makeElement("span", task.overdue ? "task-meta overdue" : "task-meta",
        task.overdue ? detailText + " · Overdue" : detailText);
      main.append(title, meta);

      const side = makeElement("div", "task-side");
      const statusClass = task.status.toLowerCase().replace(" ", "-");
      side.appendChild(makeElement("span", "task-status " + statusClass, task.status));

      // unfinished tasks can be moved to another team member
      if (task.status !== "Done") {
        side.appendChild(makeReassignSelect(task));
      }

      row.append(main, side);
      taskList.appendChild(row);
    });
  
    card.appendChild(taskList);
    return card;
  }
  
function renderProjects(employees) {
  const projects = {};

  employees.forEach(function (employee) {
    employee.tasks.forEach(function (task) {
      if (!projects[task.project]) {
        projects[task.project] = { tasks: [], done: 0, overdue: 0 };
      }

      projects[task.project].tasks.push({ ...task, owner: employee.name });

      if (task.status === "Done") {
        projects[task.project].done += 1;
      }

      if (task.overdue && task.status !== "Done") {
        projects[task.project].overdue += 1;
      }
    });
  });

  projectList.replaceChildren();
  const projectNames = Object.keys(projects);
  const tableWrap = makeElement("div", "project-table-wrap");
  const table = makeElement("table", "project-table");
  const tableHead = document.createElement("thead");
  const headingRow = document.createElement("tr");

  ["Project", "Tasks done", "Overdue", "Deadline", "Status"].forEach(function (heading) {
    headingRow.appendChild(makeElement("th", "", heading));
  });

  tableHead.appendChild(headingRow);
  table.appendChild(tableHead);
  const tableBody = document.createElement("tbody");

  projectNames.forEach(function (projectName) {
    const project = projects[projectName];
    const details = projectDetails[projectName] || { deadline: "Not set", status: "On track" };
    const total = project.tasks.length;
    const percent = Math.round((project.done / total) * 100);
    const row = document.createElement("tr");
    const projectCell = document.createElement("td");
    const taskCell = makeElement("td", "project-progress-cell");
    const overdueCell = makeElement("td", project.overdue > 0 ? "overdue-count" : "", project.overdue);
    const deadlineCell = makeElement("td", "", details.deadline);
    const statusCell = document.createElement("td");
    const disclosure = makeElement("details", "project-details");
    const summary = document.createElement("summary");
    const projectTitle = makeElement("span", "project-title", projectName);
    const toggleLabel = makeElement("span", "project-toggle-label", "View tasks");
    const progressSummary = makeElement("div", "project-progress-summary");
    const progressText = makeElement("span", "", project.done + " / " + total);
    const percentText = makeElement("strong", "", percent + "%");
    const track = makeElement("div", "progress-track");
    const fill = makeElement("div", "progress-fill");
    const statusClass = details.status.toLowerCase().replace(" ", "-");
    const statusBadge = makeElement("span", "project-status " + statusClass, details.status);

    summary.append(projectTitle, toggleLabel);
    disclosure.appendChild(summary);

    const taskList = makeElement("ul", "project-task-list");
    project.tasks.forEach(function (task) {
      const taskRow = makeElement("li", "project-task");
      const taskInfo = document.createElement("div");
      const taskTitle = makeElement("span", "project-task-title", task.title);
      const taskOwner = makeElement("span", "project-task-owner", task.owner);
      const taskStatusClass = task.status.toLowerCase().replace(" ", "-");
      const taskStatus = makeElement("span", "task-status " + taskStatusClass, task.status);

      taskInfo.append(taskTitle, taskOwner);
      taskRow.append(taskInfo, taskStatus);
      taskList.appendChild(taskRow);
    });

    disclosure.appendChild(taskList);
    disclosure.addEventListener("toggle", function () {
      toggleLabel.textContent = disclosure.open ? "Hide tasks" : "View tasks";
    });

    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", projectName + " task completion");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(percent));
    fill.style.width = percent + "%";

    progressSummary.append(progressText, percentText);
    track.appendChild(fill);
    taskCell.append(progressSummary, track);
    projectCell.appendChild(disclosure);
    statusCell.appendChild(statusBadge);
    row.append(projectCell, taskCell, overdueCell, deadlineCell, statusCell);
    tableBody.appendChild(row);
  });

  if (projectNames.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = makeElement("td", "empty-state", "No project tasks to show yet.");
    emptyCell.colSpan = 5;
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
  }

  table.appendChild(tableBody);
  tableWrap.appendChild(table);
  projectList.appendChild(tableWrap);

  return projectNames.length;
}
  
function renderDashboard() {
  manager.employees = buildEmployees();   // rebuild from the shared tasks (picks up reassignments)
  employeeGrid.replaceChildren();

  let activeTasks = 0;
  let completedTasks = 0;

  manager.employees.forEach(function (employee) {
    activeTasks += getActiveTaskCount(employee);
    completedTasks += employee.tasks.filter(function (task) {
      return task.status === "Done";
    }).length;

    employeeGrid.appendChild(renderEmployee(employee));
  });

  if (manager.employees.length === 0) {
    employeeGrid.appendChild(
      makeElement("p", "empty-state", "No team members are assigned to this manager yet.")
    );
  }

  document.getElementById("member-count").textContent = manager.employees.length;
  document.getElementById("active-task-count").textContent = activeTasks;
  document.getElementById("completed-task-count").textContent = completedTasks;
  document.getElementById("project-count").textContent = renderProjects(manager.employees);
}

renderDashboard();
