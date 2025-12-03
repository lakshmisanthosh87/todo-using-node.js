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
    li.innerHTML = `${todo.text} <button onclick="deleteTodo('${todo.id}')">X</button>`;
    list.appendChild(li);
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: "DELETE" })
        .then(() => loadTodos());
}
