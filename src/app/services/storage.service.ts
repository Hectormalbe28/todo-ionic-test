import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class Storage {

  private TASK_KEY = 'tasks';
  private CATEGORY_KEY = 'categories';

  getTasks(): Task[] {
    const data = localStorage.getItem(this.TASK_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveTasks(tasks: Task[]) {
    localStorage.setItem(this.TASK_KEY, JSON.stringify(tasks));
  }

  getCategories(): Category[] {
    const data = localStorage.getItem(this.CATEGORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveCategories(categories: Category[]) {
    localStorage.setItem(this.CATEGORY_KEY, JSON.stringify(categories));
  }
  

}
