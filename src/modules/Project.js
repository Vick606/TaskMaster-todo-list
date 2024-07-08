export class Project {
    constructor(name, color = '#000000') {
      this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.name = name;
      this.color = color;
      this.todos = [];
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  
    removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
  
    getTodos() {
      return this.todos;
    }
  }