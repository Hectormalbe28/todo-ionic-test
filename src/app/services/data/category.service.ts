import { Injectable, Signal } from '@angular/core';
import { Category } from '../../models/category';
import { LocalStorageService } from './local-storage.service';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseDataService<Category> {
  /**
   * Señal pública con las categorías disponibles.
   */
  get categories(): Signal<Category[]> {
    return this.data;
  }

  constructor(storage: LocalStorageService) {
    super(storage, 'categories');
  }

  addCategory(name: string) {
    if (!name.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    this.add(newCat);
  }

  deleteCategory(id: string) {
    this.remove(id);
  }
}
