import { TestBed } from '@angular/core/testing';

import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    // configurar el servicio antes de cada prueba
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagService);
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });
});
