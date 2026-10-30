// store tasks during session
let tasksList = [];

// Get HTML elements
let taskInput = document.getElementById('taskInput');
let ownerInput = document.getElementById('ownerInput');
let addTaskButton = document.getElementById('addTaskButton');
let taskList = document.getElementById('taskList');
let workList = document.getElementById('workList');
let deadlineInput = document.getElementById('deadlineInput');
let priorityInput = document.getElementById('priorityInput');
let hoursInput = document.getElementById('hoursInput');
let complexityInput = document.getElementById('complexityInput');
let filterTabs = document.getElementById('filterTabs');

// can filter tasks by owner
let currentFilter = "all";

// add new task with custom name
function addTask() {
    let taskText = taskInput.value;
    let owner = ownerInput.value;

    // check there is input in both fields
    if (taskText.trim() === "" || owner.trim() === "") {
        alert("Ensure both fields are filled in!");
        return;
    }

    let newTask = {
        id: Date.now(),
        taskText: taskText.trim(),
        owner: owner.trim(),
        deadline: deadlineInput.value,
        priority: priorityInput.value,
        complexity: complexityInput.value,
        hours: hoursInput.value,
        completed: false
    };

    // add new task to list
    tasksList.push(newTask);

    // reset input fields
    taskInput.value = "";
    ownerInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "medium";
    complexityInput.value = "medium";
    hoursInput.value = "";

    loadTasks();
}

// change completion status
function isComplete(id) {
    for (let i=0; i < tasksList.length; i++) {
        if (tasksList[i].id === id) {
            tasksList[i].completed = !tasksList[i].completed;
        }
    }
    
    loadTasks();
}

// delete a task
function deleteTask(id) {
    let uncompleted = [];
    for (let i=0; i < tasksList.length; i++) {
        if (tasksList[i].id !== id) {
            uncompleted.push(tasksList[i]);
        }
    }
    tasksList = uncompleted;
    loadTasks();
}

// load tasks and find a person's workload
function loadTasks() {
    taskList.innerHTML = "";
    workList.innerHTML = "";

    // find individual owners with tasks
    let allOwners = [];
    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].completed === false && allOwners.indexOf(tasksList[i].owner) === -1) {
            allOwners.push(tasksList[i].owner);
        }
    }

    // return to all if no tasks left
    if (currentFilter !== "all" && allOwners.indexOf(currentFilter) === -1) {
        currentFilter = "all";
    }

    // making tabs to filter tasks by owner
    filterTabs.innerHTML = "";
    let tabNames = ["all"].concat(allOwners);
    for (let i = 0; i < tabNames.length; i++) {
        let tabName = tabNames[i];
        let tabButton = document.createElement('button');
        
        if (tabName === "all") {
            tabButton.textContent = "All";
        } else {
            tabButton.textContent = tabName;
        }

        if (tabName === currentFilter) {
            tabButton.className = "active";
        }

        tabButton.onclick = function() {
            currentFilter = tabName;
            loadTasks();
        };
        filterTabs.appendChild(tabButton);
    }

    // if no tasks for any employees
    if (tasksList.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks created yet!</li>';
    }

    // track uncompleted tasks per person
    let workCount = {};

    for (let i=0; i < tasksList.length; i++) {
        let task = tasksList[i];

        // disregard completed tasks
        if (task.completed === false) {
            if (workCount[task.owner]) {
                workCount[task.owner]++;
            } else {
                workCount[task.owner] = 1;
            }
        }

        // only show filtered tasks
        if (currentFilter !== "all" && task.owner !== currentFilter) {
            continue;
        }

        let list = document.createElement('li');
        let span = document.createElement('span');
        let text = task.taskText + " [Owner: " + task.owner + "]";

        text += " [Priority: " + task.priority + "]";
        text += " [Complexity: " + task.complexity + "]";

        if (task.hours) {
            text += " [Est: " + task.hours + "hrs]";
        }

        if (task.deadline) {
            text += " (due " + task.deadline + ")";
        }
        span.textContent = text;

        if (task.completed === true) {
            span.className = "completed";
        }

        // flags a task if it is overdue
        if (task.deadline && !task.completed && new Date(task.deadline) < new Date().setHours(0, 0, 0, 0)) {
            span.classList.add("overdue");
        }

        list.appendChild(span);

        let actionsDiv = document.createElement('div');
        actionsDiv.className = "task-actions";

        let completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.onclick = function() {
            isComplete(task.id);
        };
        actionsDiv.appendChild(completeButton);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteTask(task.id);
        };
        actionsDiv.appendChild(deleteButton);

        list.appendChild(actionsDiv);
        taskList.appendChild(list);
    }

    let owners = Object.keys(workCount);

    // if no tasks assigned
    if(owners.length === 0) {
        workList.innerHTML = '<li class="empty-state">No work right now!</li>';
    } else {
        for (let i=0; i < owners.length; i++) {
            let memberName = owners[i];
            let count = workCount[memberName];

            let workItem = document.createElement('li');
            workItem.innerHTML = "<span>" + memberName + ":</span> <strong>" + count + "</strong> active tasks";
            workList.appendChild(workItem);
        }
    }
}

addTaskButton.onclick = addTask;

loadTasks();