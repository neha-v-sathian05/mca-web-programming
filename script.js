
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");
const clearBtn = document.getElementById("clearBtn");

// Save tasks in local storage

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = task.completed
            ? "task-text completed"
            : "task-text";

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "✓";
        completeBtn.className = "complete-btn";

        completeBtn.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    // Update statistics

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

// Add new task

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// Add button event

addBtn.addEventListener("click", addTask);

// Add task using Enter key

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Clear completed tasks

clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
});

// Display saved tasks when page loads

displayTasks();
