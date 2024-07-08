import { Project } from './Project';
import { Todo } from './Todo';

export class TodoList {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('todoListData'));
      if (data) {
        this.projects = data.projects.map(projectData => {
          const project = new Project(projectData.name, projectData.color);
          project.id = projectData.id;
          project.todos = projectData.todos.map(todoData => {
            const todo = new Todo(
              todoData.title,
              todoData.description,
              todoData.dueDate,
              todoData.priority,
              todoData.projectId,
              todoData.notes,
              todoData.checklist
            );
            todo.id = todoData.id;
            todo.completed = todoData.completed;
            todo.createdAt = new Date(todoData.createdAt);
            return todo;
          });
          return project;
        });
        this.currentProject = this.projects.find(p => p.id === data.currentProjectId) || this.projects[0];
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      this.projects = [new Project('Inbox', '#0080ff')];
      this.currentProject = this.projects[0];
    }

    if (this.projects.length === 0) {
      this.projects = [new Project('Inbox', '#0080ff')];
      this.currentProject = this.projects[0];
    }
  }

  saveToLocalStorage() {
    const data = {
      projects: this.projects.map(project => ({
        ...project,
        todos: project.todos.map(todo => ({
          ...todo,
          dueDate: todo.dueDate.toISOString()
        }))
      })),
      currentProjectId: this.currentProject.id
    };
    localStorage.setItem('todoListData', JSON.stringify(data));
  }

  addProject(projectName, color) {
    const newProject = new Project(projectName, color);
    this.projects.push(newProject);
    this.saveToLocalStorage();
    return newProject;
  }

  removeProject(projectId) {
    this.projects = this.projects.filter(project => project.id !== projectId);
    if (this.currentProject.id === projectId) {
      this.currentProject = this.projects[0];
    }
    this.saveToLocalStorage();
  }

  setCurrentProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.currentProject = project;
      this.saveToLocalStorage();
    }
  }

  getCurrentProject() {
    return this.currentProject;
  }

  addTodo(todo) {
    this.currentProject.addTodo(todo);
    this.saveToLocalStorage();
  }

  removeTodo(todoId) {
    this.currentProject.removeTodo(todoId);
    this.saveToLocalStorage();
  }

  updateTodo(todoId, updates) {
    const todo = this.currentProject.todos.find(t => t.id === todoId);
    if (todo) {
      Object.assign(todo, updates);
      this.saveToLocalStorage();
    }
  }

  getAllProjects() {
    return this.projects;
  }

  getAllTodos() {
    return this.projects.flatMap(project => project.todos);
  }
}