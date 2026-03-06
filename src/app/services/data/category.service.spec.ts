import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { LocalStorageService } from './local-storage.service';
import { Category } from '../../models/category';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    // configurar servicio y limpiar almacenamiento
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(CategoryService);
    localStorage.clear();
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('comienza sin categorías', () => {
    expect(service.categories()).toEqual([]);
  });

  it('agrega y elimina una categoría', () => {
    service.addCategory('foo');
    expect(service.categories().length).toBe(1);
    const cat = service.categories()[0];
    expect(cat.name).toBe('foo');

    service.deleteCategory(cat.id);
    expect(service.categories()).toEqual([]);
  });

  it('persiste categorías en localStorage', () => {
    service.addCategory('bar');
    const raw = localStorage.getItem('categories');
    expect(raw).toBeTruthy();
    const arr: Category[] = JSON.parse(raw!);
    expect(arr.length).toBe(1);
  });
});
