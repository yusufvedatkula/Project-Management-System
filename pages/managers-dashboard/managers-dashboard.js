// Hardcoded sample employees and to-do lists for the signed-in manager's demo team.
const manager = {
  employees: [
    {
      name: "Daniel Brooks",
      role: "Developer",
      tasks: [
        { title: "Build the project overview page", project: "Project Portal", status: "In progress", overdue: false },
        { title: "Check the mobile layout", project: "Project Portal", status: "To do", overdue: true },
        { title: "Fix sign-in form spacing", project: "Staff Tools", status: "Done", overdue: false },
        { title: "Prepare the onboarding checklist", project: "HR onboarding", status: "Done", overdue: false }
      ]
    },
    {
      name: "Priya Shah",
      role: "UX Designer",
      tasks: [
        { title: "Review dashboard wireframes", project: "Project Portal", status: "Done", overdue: false },
        { title: "Prepare icons for the task list", project: "Staff Tools", status: "In progress", overdue: false },
        { title: "Confirm replacement equipment", project: "Network upgrade", status: "Done", overdue: false }
      ]
    },
    {
      name: "Lewis Turner",
      role: "Developer",
      tasks: [
        { title: "Connect the task filters", project: "Project Portal", status: "To do", overdue: true },
        { title: "Test the registration page", project: "Staff Tools", status: "In progress", overdue: false },
        { title: "Update the help page links", project: "Staff Tools", status: "Done", overdue: false },
        { title: "Schedule new starter sessions", project: "HR onboarding", status: "To do", overdue: true },
        { title: "Install replacement network switches", project: "Network upgrade", status: "In progress", overdue: true }
      ]
    }
  ]
};

const employeeGrid = document.getElementById("employee-grid");
const projectList = document.getElementById("project-list");

const projectDetails = {
  "Project Portal": { deadline: "30 Oct", status: "At risk" },
  "Staff Tools": { deadline: "6 Nov", status: "On track" },
  "HR onboarding": { deadline: "23 Oct", status: "Late" },
  "Network upgrade": { deadline: "9 Oct", status: "Late" }
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
    const workloadText = activeCount === 1 ? "1 active task" : activeCount + " active tasks";
    const workload = makeElement("span", "workload", workloadText);
  
    details.append(name, role);
    header.append(details, workload);
    card.appendChild(header);
  
    const taskList = makeElement("ul", "task-list");
  
    employee.tasks.forEach(function (task) {
      const row = makeElement("li", "task-row");
      const title = makeElement("span", "task-title", task.title);
      const statusClass = task.status.toLowerCase().replace(" ", "-");
      const status = makeElement("span", "task-status " + statusClass, task.status);
  
      row.append(title, status);
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
