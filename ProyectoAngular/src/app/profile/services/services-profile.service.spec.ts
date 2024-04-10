import { TestBed } from '@angular/core/testing';

import { ServicesProfileService } from './services-profile.service';

describe('ServicesProfileService', () => {
  let service: ServicesProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
