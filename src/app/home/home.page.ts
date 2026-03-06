import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel, IonSelectOption, IonSelect, CommonModule, FormsModule,],
})
export class HomePage {

  tasks: Task[] = [];
  newTaskTitle: string = '';
  categories: Category[] = [];
  newCategoryName: string = '';

  selectedCategoryId: string = '';
  selectedCategoryForTask: string = '';

  categoriesEnabled: boolean = true;

  filteredTasks: Task[] = [];

  constructor(private storageService: StorageService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadTasks();
    this.loadCategories();
    this.loadRemoteConfig();
  }

  async loadRemoteConfig() {
    this.categoriesEnabled = await this.firebaseService.getFeatureFlag('enable_categories');
  }

  loadTasks() {
    this.tasks = this.storageService.getTasks();
    this.applyFilter();
  }

  applyFilter() {

    if (!this.selectedCategoryId) {
      this.filteredTasks = this.tasks;
      return;
    }

    this.filteredTasks = this.tasks.filter(
      task => task.categoryId === this.selectedCategoryId
    );

  }

  addTask() {

    if (!this.newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle,
      completed: false,
      categoryId: this.selectedCategoryForTask
    };

    this.tasks.push(task);

    this.storageService.saveTasks(this.tasks);

    this.newTaskTitle = '';
    this.selectedCategoryForTask = '';
  }

  toggleTask(task: Task) {

    task.completed = !task.completed;

    this.storageService.saveTasks(this.tasks);

  }

  deleteTask(taskId: string) {

    this.tasks = this.tasks.filter(task => task.id !== taskId);

    this.storageService.saveTasks(this.tasks);

    this.applyFilter();

  }

  loadCategories() {
    this.categories = this.storageService.getCategories();
  }

  addCategory() {

    if (!this.newCategoryName.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: this.newCategoryName
    };

    this.categories.push(category);

    this.storageService.saveCategories(this.categories);

    this.newCategoryName = '';

  }

  deleteCategory(categoryId: string) {

    this.categories = this.categories.filter(category => category.id !== categoryId);

    this.storageService.saveCategories(this.categories);

  }

  getfilteredTasks(): Task[] {

    if (!this.selectedCategoryId) return this.tasks;

    return this.tasks.filter(task => task.categoryId === this.selectedCategoryId);

  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }

}
