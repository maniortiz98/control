import { TestBed } from '@angular/core/testing';

import { PldQuizPmService } from './pld-quiz-pm.service';

describe('PldQuizPmService', () => {
  let service: PldQuizPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PldQuizPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose default signal values', () => {
    expect(service.pldQuizData()).toEqual({});
    expect(service.initialPldQuizData).toEqual({});
    expect(service.isMaintenance()).toBeFalse();
    expect(service.isEditable()).toBeTrue();
  });

  it('should allow updating the pldQuizData signal', () => {
    const payload = {
      question1: 'yes',
      question2: 'no',
    } as any;

    service.pldQuizData.set(payload);

    expect(service.pldQuizData()).toEqual(payload);
  });
});
