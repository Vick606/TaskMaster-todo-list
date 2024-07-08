export function renderProjects(projects, currentProjectId) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
  
    projects.forEach((project) => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-folder icon"></i>${project.name}`;
      li.classList.add('project-item');
      if (project.id === currentProjectId) {
        li.classList.add('active');
      }
      li.dataset.id = project.id;
      li.style.setProperty('--project-color', project.color);
      projectList.appendChild(li);
    });
  }
  
  export function bindProjectEvents(todoList, renderTodos) {
    const projectList = document.getElementById('project-list');
    projectList.addEventListener('click', (e) => {
      if (e.target.classList.contains('project-item')) {
        const projectIndex = parseInt(e.target.dataset.index);
        todoList.setCurrentProject(projectIndex);
        renderProjects(todoList.getAllProjects(), projectIndex);
        renderTodos(todoList.getCurrentProject().getTodos());
      }
    });
  
    const addProjectForm = document.getElementById('add-project-form');
    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectName = document.getElementById('new-project-name').value;
      if (projectName) {
        todoList.addProject(projectName);
        renderProjects(todoList.getAllProjects(), todoList.getAllProjects().length - 1);
        addProjectForm.reset();
      }
    });
  }