import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './data/local-storage.service';

describe('LocalStorageService (root stub)', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });
});
