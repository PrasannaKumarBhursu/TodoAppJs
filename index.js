// Function to render a single todo item
function renderTodoItem(todo) {
  const listItem = document.createElement("li");
  listItem.id = `todo-${todo.id}`;
  listItem.innerHTML = `
      <h3>${todo.title}</h3>
      <p>${todo.description}</p>
      <button class="update-button" onclick="updateTodoItem(${todo.id})">Update</button>
      <button class="delete-button" onclick="deleteTodoItem(${todo.id})">Delete</button>
    `;
  return listItem;
}

// Function to fetch all todos and render them
function getTodos() {
  fetch("/todos")
    .then((response) => response.json())
    .then((todos) => {
      const todoList = document.getElementById("todoList");
      todoList.innerHTML = "";
      todos.forEach((todo) => {
        const listItem = renderTodoItem(todo);
        todoList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching todos:", error));
}

// Function to add a new todo
function addTodo() {
  const titleInput = document.getElementById("titleInput");
  const descriptionInput = document.getElementById("descriptionInput");

  const newTitle = titleInput.value.trim();
  const newDescription = descriptionInput.value.trim();

  if (newTitle === "" || newDescription === "") {
    alert("Please enter a Title and Description.");
    return;
  }

  const newTodo = {
    title: titleInput.value,
    description: descriptionInput.value,
  };

  fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((todo) => {
      const todoList = document.getElementById("todoList");
      const listItem = renderTodoItem(todo);
      todoList.appendChild(listItem);

      titleInput.value = "";
      descriptionInput.value = "";
    })
    .catch((error) => console.error("Error adding todo:", error));
}

// Function to delete a todo
function deleteTodoItem(id) {
  fetch(`/todos/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      const listItem = document.getElementById(`todo-${id}`);
      console.log(listItem);
      if (listItem) {
        listItem.remove();
      }
    })
    .catch((error) => console.error("Error deleting todo:", error));
}

// Function to update a todo
function updateTodoItem(id) {
  const newTitle = prompt("Enter the new title:");
  const newDescription = prompt("Enter the new description:");

  if (newTitle && newDescription) {
    const updatedTodo = {
      title: newTitle,
      description: newDescription,
    };

    console.log(id);

    fetch(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTodo),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Update the UI or perform any additional actions on success
          console.log("Todo item updated successfully");

          // Update the UI with the new values
          const listItem = document.getElementById(`todo-${id}`);
          const titleElement = listItem.querySelector("h3");
          const descriptionElement = listItem.querySelector("p");

          titleElement.textContent = newTitle;
          descriptionElement.textContent = newDescription;
        } else {
          // Handle the error case if the update request fails
          console.log("Failed to update todo item");
        }
      })
      .catch((error) => {
        // Handle any network or other errors
        console.error("Error occurred while updating todo item", error);
      });
  } else {
    console.log(
      "Invalid input. Please enter both a new title and description."
    );
  }
}

// Event listener for form submission
const todoForm = document.getElementById("todoForm");
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo();
});

// Fetch initial todos on page load
getTodos();
