import { Injectable, Signal, computed, inject } from '@angular/core';
import { Task } from '../../models/task';
import { LocalStorageService } from './local-storage.service';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends BaseDataService<Task> {
  /**
   * Señal pública con la lista de tareas.
   */
  get tasks(): Signal<Task[]> {
    return this.data;
  }

  // cantidad de tareas, derivada automáticamente
  taskCount = computed(() => this.data().length);

  constructor() {
    // clave en localStorage
    super(inject(LocalStorageService), 'tasks');
  }

  /**
   * Crea y guarda una nueva tarea si el título no está en blanco.
   */
  private normalizeTitle(title: string): string {
    return title.trim().toLowerCase();
  }

  validateTaskTitle(title: string): string | null {
    const trimmed = title.trim();
    if (!trimmed) return 'El nombre de la tarea es obligatorio.';
    if (trimmed.length < 3) return 'La tarea debe tener al menos 3 caracteres.';

    const normalized = this.normalizeTitle(trimmed);
    const exists = this.data().some((task) => this.normalizeTitle(task.title) === normalized);
    if (exists) return 'Ya existe una tarea con ese nombre.';

    return null;
  }

  addTask(title: string, categoryId: string | undefined): boolean {
    const validationError = this.validateTaskTitle(title);
    if (validationError) return false;

    const trimmed = title.trim();
    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false,
      categoryId,
    };
    this.add(newTask);
    return true;
  }

  toggleTask(id: string) {
    this.update(id, (t) => ({ ...t, completed: !t.completed }));
  }

  deleteTask(id: string) {
    this.remove(id);
  }

  /**
   * Reemplaza toda la lista (uso excepcional, p.ej. pruebas).
   */
  setTasks(tasks: Task[]) {
    this.setAll(tasks);
  }
}
