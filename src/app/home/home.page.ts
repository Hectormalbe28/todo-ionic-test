import { Component, signal, computed, OnInit, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel, IonSelectOption, IonSelect, IonTabs, IonTabBar, IonTabButton, IonTab, IonIcon } from '@ionic/angular/standalone';
import { TaskService } from '../services/data/task.service';
import { CategoryService } from '../services/data/category.service';
import { FeatureFlagService } from '../services/remote/feature-flag.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonCheckbox,
    IonLabel,
    IonSelectOption,
    IonSelect,
    CommonModule,
    FormsModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonTab,
    IonIcon
  ],
})
export class HomePage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);
  private readonly featureFlagService = inject(FeatureFlagService);

  // senales expuestas por los servicios de datos
  readonly tasks = this.taskService.tasks;
  readonly categories = this.categoryService.categories;

  newTaskTitle = signal('');
  newCategoryName = signal('');
  editingCategoryId = signal('');
  editingCategoryName = signal('');

  selectedCategoryId = signal('');
  selectedCategoryForTask = signal('');

  categoriesEnabled = signal(false);

  filteredTasks = computed(() => {
    const all = this.tasks();
    const selected = this.selectedCategoryId();
    return selected
      ? all.filter((t: Task) => t.categoryId === selected)
      : all;
  });

  // paginacion para la lista de tareas
  readonly pageSize = 5;
  currentPage = signal(0);

  totalPages = computed(() => {
    const total = this.filteredTasks().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  pagedTasks = computed(() => {
    const all = this.filteredTasks();
    const start = this.currentPage() * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  // paginacion para categorias cuando el flag este activo
  readonly catPageSize = 5;
  catCurrentPage = signal(0);

  totalCategoryPages = computed(() => {
    const total = this.categories().length;
    return Math.max(1, Math.ceil(total / this.catPageSize));
  });

  pagedCategories = computed(() => {
    const all = this.categories();
    const start = this.catCurrentPage() * this.catPageSize;
    return all.slice(start, start + this.catPageSize);
  });

  constructor() {
    // cuando la lista filtrada de tareas cambia se vuelve a la primera pagina
    effect(() => {
      this.filteredTasks();
      this.currentPage.set(0);
    });

    // tambien reseteamos si el filtro de categoria cambia
    effect(() => {
      this.selectedCategoryId();
      this.currentPage.set(0);
    });

    // cuando cambian las categorias se reinicia la pagina de categorias
    effect(() => {
      this.categories();
      this.catCurrentPage.set(0);
    });
  }

  ngOnInit() {
    // obtiene feature flag para mostrar categorias
    this.loadRemoteConfig();
  }

  async loadRemoteConfig(): Promise<void> {
    try {
      const enabled = await this.featureFlagService.getFeatureFlag('enable_categories');
      this.categoriesEnabled.set(enabled);
    } catch {
      this.categoriesEnabled.set(false);
    }
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskTitle(), this.selectedCategoryForTask());
    this.newTaskTitle.set('');
    this.selectedCategoryForTask.set('');
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task.id);
  }

  // manejadores de paginacion de tareas
  nextPage(): void {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  // paginacion de categorias
  nextCatPage(): void {
    if (this.catCurrentPage() + 1 < this.totalCategoryPages()) {
      this.catCurrentPage.set(this.catCurrentPage() + 1);
    }
  }

  prevCatPage(): void {
    if (this.catCurrentPage() > 0) {
      this.catCurrentPage.set(this.catCurrentPage() - 1);
    }
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  addCategory(): void {
    this.categoryService.addCategory(this.newCategoryName());
    this.newCategoryName.set('');
  }

  startEditCategory(categoryId: string, currentName: string): void {
    this.editingCategoryId.set(categoryId);
    this.editingCategoryName.set(currentName);
  }

  cancelEditCategory(): void {
    this.editingCategoryId.set('');
    this.editingCategoryName.set('');
  }

  saveCategoryEdit(): void {
    const id = this.editingCategoryId();
    if (!id) return;
    this.categoryService.updateCategory(id, this.editingCategoryName());
    this.cancelEditCategory();
  }

  deleteCategory(categoryId: string): void {
    if (this.editingCategoryId() === categoryId) {
      this.cancelEditCategory();
    }
    this.categoryService.deleteCategory(categoryId);
  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }
}
