const list = document.getElementById("todoList");
const input = document.getElementById("todoInput");

window.onload = loadTodos;

function loadTodos() {
    fetch("/api/todos")
        .then(res => res.json())
        .then(todos => {
            list.innerHTML = "";
            todos.forEach(addToDOM);
        });
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    })
    .then(res => res.json())
    .then(todo => {
        addToDOM(todo);
        input.value = "";
    });
}

function addToDOM(todo) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    // Todo text span
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    if (todo.completed) {
        span.classList.add("completed");
    }

    checkbox.onclick = () =>
        toggleComplete(todo._id, checkbox.checked, span);

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteTodo(todo._id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);

    list.appendChild(li);
}

function toggleComplete(id, isDone, span) {
    span.classList.toggle("completed", isDone);

    fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isDone })
    });
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: "DELETE" })
        .then(() => loadTodos());
}
