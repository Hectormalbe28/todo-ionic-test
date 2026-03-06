import { Injectable, Signal, inject } from '@angular/core';
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

  constructor() {
    super(inject(LocalStorageService), 'categories');
  }

  addCategory(name: string) {
    if (!name.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    this.add(newCat);
  }

  updateCategory(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.update(id, (cat) => ({ ...cat, name: trimmed }));
  }

  deleteCategory(id: string) {
    this.remove(id);
  }
}
