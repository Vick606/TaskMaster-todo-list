import { parseISO, format, isPast, isToday, isTomorrow } from 'date-fns';

export class Todo {
  constructor(title, description, dueDate, priority, projectId, notes = [], checklist = []) {
    this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    this.title = title;
    this.description = description;
    this.dueDate = parseISO(dueDate);
    this.priority = priority;
    this.projectId = projectId;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
  }

  addNote(note) {
    this.notes.push(note);
  }

  addChecklistItem(item) {
    this.checklist.push({ id: Date.now(), text: item, checked: false });
  }

  toggleChecklistItem(itemId) {
    const item = this.checklist.find(i => i.id === itemId);
    if (item) {
      item.checked = !item.checked;
    }
  }

  formatDueDate() {
    if (isToday(this.dueDate)) {
      return 'Today';
    } else if (isTomorrow(this.dueDate)) {
      return 'Tomorrow';
    } else if (isPast(this.dueDate)) {
      return `Overdue: ${format(this.dueDate, 'MMM d')}`;
    } else {
      return format(this.dueDate, 'MMM d');
    }
  }
}