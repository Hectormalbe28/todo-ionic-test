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
  addTask(title: string, categoryId: string | undefined) {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      categoryId,
    };
    this.add(newTask);
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
