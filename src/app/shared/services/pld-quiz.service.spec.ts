import { TestBed } from '@angular/core/testing';
import { PldQuizService } from './pld-quiz.service';

describe('PldQuizService', () => {
  let service: PldQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PldQuizService]
    });

    service = TestBed.inject(PldQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.pldQuizData()).toEqual({});
    expect(service.initialPldQuizData).toEqual({});
    expect(service.isRequested()).toBeFalse();
  });

  it('set should update pldQuizData and isRequested to true', () => {
    const mockData = {
      id: 1,
      name: 'PLD data'
    } as any;

    const result = service.set(mockData);

    expect(result).toBeTrue();
    expect(service.pldQuizData()).toEqual(mockData);
    expect(service.isRequested()).toBeTrue();
  });

  it('clear should reset pldQuizData and isRequested to false', () => {
    const mockData = {
      id: 2,
      name: 'PLD data'
    } as any;

    service.set(mockData);
    service.clear();

    expect(service.pldQuizData()).toEqual({});
    expect(service.isRequested()).toBeFalse();
  });

  it('should allow multiple set calls', () => {
    const firstData = { step: 1 } as any;
    const secondData = { step: 2 } as any;

    service.set(firstData);
    expect(service.pldQuizData()).toEqual(firstData);
    expect(service.isRequested()).toBeTrue();

    service.set(secondData);
    expect(service.pldQuizData()).toEqual(secondData);
    expect(service.isRequested()).toBeTrue();
  });
});
