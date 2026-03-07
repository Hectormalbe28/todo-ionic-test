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

  private normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }

  validateCategoryName(name: string, excludeId?: string): string | null {
    const trimmed = name.trim();
    if (!trimmed) return 'El nombre de la categoria es obligatorio.';
    if (trimmed.length < 3) return 'La categoria debe tener al menos 3 caracteres.';

    const normalized = this.normalizeName(trimmed);
    const exists = this.data().some((category) => {
      if (excludeId && category.id === excludeId) return false;
      return this.normalizeName(category.name) === normalized;
    });

    if (exists) return 'Ya existe una categoria con ese nombre.';
    return null;
  }

  addCategory(name: string): boolean {
    const validationError = this.validateCategoryName(name);
    if (validationError) return false;

    const trimmed = name.trim();
    const newCat: Category = {
      id: Date.now().toString(),
      name: trimmed,
    };
    this.add(newCat);
    return true;
  }

  updateCategory(id: string, name: string): boolean {
    const validationError = this.validateCategoryName(name, id);
    if (validationError) return false;

    const trimmed = name.trim();
    this.update(id, (cat) => ({ ...cat, name: trimmed }));
    return true;
  }

  deleteCategory(id: string) {
    this.remove(id);
  }
}
