import { TestBed } from '@angular/core/testing';
import { ActiwebService } from './actiweb.service';

describe('ActiwebService', () => {
  let service: ActiwebService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiwebService]
    });

    service = TestBed.inject(ActiwebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty data and isDataRequested false', () => {
    expect(service.getData()).toEqual({});
    expect(service.isDataRequested()).toBeFalse();
  });

  it('setItem should set data and mark isDataRequested as true', () => {
    const mockValue = {
      id: 1,
      name: 'Actiweb Mock'
    };

    service.setItem(mockValue);

    expect(service.getData()).toEqual(mockValue);
    expect(service.isDataRequested()).toBeTrue();
  });

  it('clear should reset data and mark isDataRequested as false', () => {
    const mockValue = {
      id: 2,
      name: 'To be cleared'
    };

    service.setItem(mockValue);

    service.clear();

    expect(service.getData()).toEqual({});
    expect(service.isDataRequested()).toBeFalse();
  });

  it('should update data multiple times', () => {
    const firstValue = { step: 1 };
    const secondValue = { step: 2 };

    service.setItem(firstValue);
    expect(service.getData()).toEqual(firstValue);
    expect(service.isDataRequested()).toBeTrue();

    service.setItem(secondValue);
    expect(service.getData()).toEqual(secondValue);
    expect(service.isDataRequested()).toBeTrue();
  });
});
