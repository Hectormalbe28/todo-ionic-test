import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonList, IonCheckbox, IonLabel, CommonModule, FormsModule],
})
export class HomePage {

  tasks: Task[] = [];
  newTaskTitle: string = '';

  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.storageService.getTasks();
  }

  addTask() {

    if (!this.newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle,
      completed: false
    };

    this.tasks.push(task);

    this.storageService.saveTasks(this.tasks);

    this.newTaskTitle = '';
  }

  toggleTask(task: Task) {

    task.completed = !task.completed;

    this.storageService.saveTasks(this.tasks);

  }

  deleteTask(taskId: string) {

    this.tasks = this.tasks.filter(task => task.id !== taskId);

    this.storageService.saveTasks(this.tasks);

  }

}
