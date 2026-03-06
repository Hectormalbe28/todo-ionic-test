import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { LocalStorageService } from './local-storage.service';
import { Task } from '../../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let storage: LocalStorageService;

  beforeEach(() => {
    // configurar e inyectar servicios antes de cada prueba
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(TaskService);
    storage = TestBed.inject(LocalStorageService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('inicia vacía si no hay datos en storage', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('puede agregar, alternar y borrar una tarea', () => {
    service.addTask('hello', 'cat1');
    const list1 = service.tasks();
    expect(list1.length).toBe(1);
    const t = list1[0];
    expect(t.title).toBe('hello');
    expect(t.completed).toBeFalse();

    // alternar
    service.toggleTask(t.id);
    expect(service.tasks()[0].completed).toBeTrue();

    // eliminar
    service.deleteTask(t.id);
    expect(service.tasks()).toEqual([]);
  });

  it('persiste los cambios en localStorage', () => {
    service.addTask('x', '');
    const raw = localStorage.getItem('tasks');
    expect(raw).toBeTruthy();
    const parsed: Task[] = JSON.parse(raw!);
    expect(parsed.length).toBe(1);
  });
});
