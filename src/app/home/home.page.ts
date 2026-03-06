import { Component, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
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
  ],
})
export class HomePage implements OnInit {
  // señales expuestas por los servicios de datos
  readonly tasks = this.taskService.tasks;
  readonly categories = this.categoryService.categories;

  newTaskTitle = signal('');
  newCategoryName = signal('');

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

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {
    // obtiene feature flag para mostrar categorías
    this.loadRemoteConfig();
  }

  async loadRemoteConfig(): Promise<void> {
    const enabled = await this.featureFlagService.getFeatureFlag('enable_categories');
    this.categoriesEnabled.set(enabled);
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskTitle(), this.selectedCategoryForTask());
    this.newTaskTitle.set('');
    this.selectedCategoryForTask.set('');
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task.id);
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  addCategory(): void {
    this.categoryService.addCategory(this.newCategoryName());
    this.newCategoryName.set('');
  }

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId);
  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }
}

