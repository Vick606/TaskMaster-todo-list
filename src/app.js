import './styles/main.scss';
import { TodoList } from './modules/TodoList';
import { Todo } from './modules/Todo';
import { renderProjects, bindProjectEvents } from './views/projectView';
import { renderTodos, bindTodoEvents } from './views/todoView';
import { format } from 'date-fns';

const todoList = new TodoList();
const currentDateElement = document.getElementById('current-date');
currentDateElement.textContent = format(new Date(), 'MMMM d, yyyy');

// Initial render
renderProjects(todoList.getAllProjects(), todoList.getCurrentProject().id);
renderTodos(todoList.getCurrentProject().getTodos());

// Bind events
bindProjectEvents(todoList, renderTodos);
bindTodoEvents(todoList, renderTodos);

// Add Todo button functionality
const addTodoBtn = document.getElementById('add-todo-btn');
addTodoBtn.addEventListener('click', () => {
  document.getElementById('add-todo-form').style.display = 'block';
});

// Add Project button functionality
const addProjectBtn = document.getElementById('add-project-btn');
addProjectBtn.addEventListener('click', () => {
  document.getElementById('add-project-form').style.display = 'block';
});

// Add sample todos if the list is empty
if (todoList.getAllTodos().length === 0) {
  const sampleTodos = [
    new Todo('Learn webpack', 'Set up and configure webpack for the project', '2023-05-01', 'High', todoList.getCurrentProject().id),
    new Todo('Implement todo list', 'Create the core functionality of the todo list app', '2023-05-05', 'High', todoList.getCurrentProject().id),
    new Todo('Style the application', 'Add CSS to make the app look professional', '2023-05-10', 'Medium', todoList.getCurrentProject().id),
  ];

  sampleTodos.forEach(todo => todoList.addTodo(todo));
  renderTodos(todoList.getCurrentProject().getTodos());
}

// Form submission handlers
const addTodoForm = document.getElementById('add-todo-form');
addTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('new-todo-title').value;
  const description = document.getElementById('new-todo-description').value;
  const dueDate = document.getElementById('new-todo-due-date').value;
  const priority = document.getElementById('new-todo-priority').value;
  
  const newTodo = new Todo(title, description, dueDate, priority, todoList.getCurrentProject().id);
  todoList.addTodo(newTodo);
  renderTodos(todoList.getCurrentProject().getTodos());
  
  addTodoForm.reset();
  addTodoForm.style.display = 'none';
});

const addProjectForm = document.getElementById('add-project-form');
addProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('new-project-name').value;
  const color = document.getElementById('new-project-color').value;
  
  todoList.addProject(name, color);
  renderProjects(todoList.getAllProjects(), todoList.getCurrentProject().id);
  
  addProjectForm.reset();
  addProjectForm.style.display = 'none';
});

// Save data when the user leaves the page
window.addEventListener('beforeunload', () => {
  todoList.saveToLocalStorage();
});