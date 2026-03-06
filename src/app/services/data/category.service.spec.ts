import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { LocalStorageService } from './local-storage.service';
import { Category } from '../../models/category';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(CategoryService);
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('comienza sin categorias', () => {
    expect(service.categories()).toEqual([]);
  });

  it('agrega y elimina una categoria', () => {
    service.addCategory('foo');
    expect(service.categories().length).toBe(1);
    const cat = service.categories()[0];
    expect(cat.name).toBe('foo');

    service.deleteCategory(cat.id);
    expect(service.categories()).toEqual([]);
  });

  it('edita una categoria existente', () => {
    service.addCategory('hogar');
    const cat = service.categories()[0];

    service.updateCategory(cat.id, 'trabajo');

    expect(service.categories()[0].name).toBe('trabajo');
  });

  it('persiste categorias en localStorage', () => {
    service.addCategory('bar');
    const raw = localStorage.getItem('categories');
    expect(raw).toBeTruthy();
    const arr: Category[] = JSON.parse(raw!);
    expect(arr.length).toBe(1);
  });
});
