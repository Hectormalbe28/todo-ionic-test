import { Injectable } from '@angular/core';

/**
 * Mini-abstracción de localStorage con métodos genéricos.
 * Solo serializa/deserializa; otras capas deciden las claves.
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors for now
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

