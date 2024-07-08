import { format } from 'date-fns';
import { Todo } from '../modules/Todo';

export function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
  
    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.classList.add('todo-item');
      li.dataset.id = todo.id;
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.classList.add('todo-checkbox');
  
      const title = document.createElement('span');
      title.innerHTML = `<i class="fas fa-tasks icon"></i>${todo.title}`;
      title.classList.add('todo-title');
      if (todo.completed) {
        title.classList.add('completed');
      }
  
      const dueDate = document.createElement('span');
      dueDate.innerHTML = `<i class="far fa-calendar-alt icon"></i>${todo.formatDueDate()}`;
      dueDate.classList.add('todo-due-date');
  
      const priority = document.createElement('span');
      priority.innerHTML = `<i class="fas fa-flag icon priority-${todo.priority.toLowerCase()}"></i>${todo.priority}`;
      priority.classList.add('todo-priority', `priority-${todo.priority.toLowerCase()}`);
  
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.classList.add('delete-todo');
  
      li.appendChild(checkbox);
      li.appendChild(title);
      li.appendChild(dueDate);
      li.appendChild(priority);
      li.appendChild(deleteBtn);
  
      todoList.appendChild(li);
    });
  }

export function bindTodoEvents(todoList, renderTodos) {
  const todoListElement = document.getElementById('todo-list');
  const addTodoForm = document.getElementById('add-todo-form');

  todoListElement.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const todoId = todoItem.dataset.id;
    const todo = todoList.getCurrentProject().getTodos().find(t => t.id === todoId);

    if (e.target.classList.contains('todo-checkbox')) {
      todo.toggleComplete();
      renderTodos(todoList.getCurrentProject().getTodos());
    } else if (e.target.classList.contains('delete-todo')) {
      todoList.removeTodo(todoId);
      renderTodos(todoList.getCurrentProject().getTodos());
    } else {
      showTodoDetails(todo, todoList, renderTodos);
    }
  });

  addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('new-todo-title').value;
    const description = document.getElementById('new-todo-description').value;
    const dueDate = document.getElementById('new-todo-due-date').value;
    const priority = document.getElementById('new-todo-priority').value;

    if (title && dueDate && priority) {
      const newTodo = new Todo(title, description, dueDate, priority, todoList.getCurrentProject().id);
      todoList.addTodo(newTodo);
      renderTodos(todoList.getCurrentProject().getTodos());
      addTodoForm.reset();
    }
  });
}

function showTodoDetails(todo, todoList, renderTodos) {
  const modal = document.getElementById('todo-details-modal');
  const modalContent = document.getElementById('todo-details-content');
  modalContent.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = todo.title;

  const description = document.createElement('p');
  description.textContent = todo.description;

  const dueDate = document.createElement('p');
  dueDate.textContent = `Due: ${format(todo.dueDate, 'MMMM d, yyyy')}`;

  const priority = document.createElement('p');
  priority.textContent = `Priority: ${todo.priority}`;

  const checklist = document.createElement('ul');
  checklist.classList.add('checklist');
  todo.checklist.forEach(item => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => {
      todo.toggleChecklistItem(item.id);
      renderTodos(todoList.getCurrentProject().getTodos());
    });
    const span = document.createElement('span');
    span.textContent = item.text;
    li.appendChild(checkbox);
    li.appendChild(span);
    checklist.appendChild(li);
  });

  const addChecklistItem = document.createElement('input');
  addChecklistItem.type = 'text';
  addChecklistItem.placeholder = 'Add checklist item';
  addChecklistItem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      todo.addChecklistItem(e.target.value.trim());
      e.target.value = '';
      renderTodos(todoList.getCurrentProject().getTodos());
      showTodoDetails(todo, todoList, renderTodos);
    }
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modalContent.appendChild(title);
  modalContent.appendChild(description);
  modalContent.appendChild(dueDate);
  modalContent.appendChild(priority);
  modalContent.appendChild(checklist);
  modalContent.appendChild(addChecklistItem);
  modalContent.appendChild(closeBtn);

  modal.style.display = 'block';
}