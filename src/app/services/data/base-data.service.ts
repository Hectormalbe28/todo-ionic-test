import { signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

/**
 * Clase base genérica para colecciones identificadas (con campo `id`).
 * Provee operaciones reactivas y persistencia en localStorage.
 */
export abstract class BaseDataService<T extends { id: string }> {
  protected items = signal<T[]>([]);

  constructor(protected storage: LocalStorageService, private storageKey: string) {
    const stored = this.storage.get<T[]>(storageKey);
    if (stored) {
      this.items.set(stored);
    }
  }

  /**
   * Devuelve el signal que contiene los elementos actuales.
   */
  get data() {
    return this.items;
  }

  protected persist() {
    this.storage.set(this.storageKey, this.items());
  }

  protected add(item: T) {
    this.items.update((arr) => [...arr, item]);
    this.persist();
  }

  protected update(id: string, updater: (t: T) => T) {
    this.items.update((arr) => arr.map((t) => (t.id === id ? updater(t) : t)));
    this.persist();
  }

  protected remove(id: string) {
    this.items.update((arr) => arr.filter((t) => t.id !== id));
    this.persist();
  }

  protected setAll(list: T[]) {
    this.items.set(list);
    this.persist();
  }
}
