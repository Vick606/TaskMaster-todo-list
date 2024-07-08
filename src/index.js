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

const addTodoBtn = document.createElement('button');
addTodoBtn.innerHTML = '<i class="fas fa-plus"></i> Add Todo';
addTodoBtn.classList.add('add-todo-btn');
addTodoBtn.addEventListener('click', () => {
  document.getElementById('add-todo-form').style.display = 'block';
});
document.querySelector('.main-content').prepend(addTodoBtn);

const addProjectBtn = document.createElement('button');
addProjectBtn.innerHTML = '<i class="fas fa-folder-plus"></i> Add Project';
addProjectBtn.classList.add('add-project-btn');
addProjectBtn.addEventListener('click', () => {
  document.getElementById('add-project-form').style.display = 'block';
});
document.querySelector('.sidebar').prepend(addProjectBtn);

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

// Save data when the user leaves the page
window.addEventListener('beforeunload', () => {
  todoList.saveToLocalStorage();
});