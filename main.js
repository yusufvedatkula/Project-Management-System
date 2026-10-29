// store tasks during session
let tasksList = [];

// Get HTML elements
let taskInput = document.getElementById('taskInput');
let ownerInput = document.getElementById('ownerInput');
let addTaskButton = document.getElementById('addTaskButton');
let taskList = document.getElementById('taskList');
let workList = document.getElementById('workList');

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
        completed: false
    };

    // add new task to list
    tasksList.push(newTask);

    // reset input fields
    taskInput.value = "";
    ownerInput.value = "";

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
        let list = document.createElement('li');
        let span = document.createElement('span');
        span.textContent = task.taskText + " [Owner: " + task.owner + "]";

        if (task.completed === true) {
            span.className = "completed";
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