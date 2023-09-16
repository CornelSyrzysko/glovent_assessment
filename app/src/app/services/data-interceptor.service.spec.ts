import { TestBed } from '@angular/core/testing';

import { DataInterceptorService } from './data-interceptor.service';

describe('DataInterceptorService', () => {
  let service: DataInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
