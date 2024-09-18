const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const searchInput = document.getElementById('searchInput');

// Fetch tasks from the server and display them
function fetchTasks() {
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(data => {
      displayTasks(data);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

// Display tasks
function displayTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li>No tasks yet!</li>';
  } else {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      deleteButton.onclick = () => deleteTask(task.id);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }
}

// Add a task
function addTask() {
  const taskName = taskInput.value.trim();
  if (!taskName) {
    alert("Please enter a task.");
    return;
  }

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: taskName })
  })
  .then(() => {
    taskInput.value = '';
    fetchTasks(); // Refresh task list
  })
  .catch(error => {
    console.error('Error adding task:', error);
  });
}

// Delete a task
function deleteTask(taskId) {
  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'DELETE'
  })
  .then(() => fetchTasks()) // Refresh task list
  .catch(error => {
    console.error('Error deleting task:', error);
  });
}

// Clear all tasks
function clearTasks() {
  fetch('http://localhost:3000/tasks', {
    method: 'DELETE'
  })
  .then(() => fetchTasks()) // Refresh task list
  .catch(error => {
    console.error('Error clearing tasks:', error);
  });
}

// Search tasks
function searchTasks() {
  const searchQuery = searchInput.value.toLowerCase();
  fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(data => {
      const filteredTasks = data.filter(task => task.name.toLowerCase().includes(searchQuery));
      displayTasks(filteredTasks);
    })
    .catch(error => {
      console.error('Error searching tasks:', error);
    });
}

// Fetch tasks on page load
fetchTasks();
