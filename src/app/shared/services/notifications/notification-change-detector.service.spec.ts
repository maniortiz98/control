import { TestBed } from '@angular/core/testing';

import { NotificationChangeDetectorService } from './notification-change-detector.service';

describe('NotificationChangeDetectorService', () => {
  let service: NotificationChangeDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationChangeDetectorService],
    });

    service = TestBed.inject(NotificationChangeDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all flags false when there are no current items', () => {
    const result = service.detectArrayChanges([], []);

    expect(result).toEqual({
      created: false,
      updated: false,
      down: false,
    });
  });

  it('should mark created when a new active item has no id', () => {
    const result = service.detectArrayChanges([], [
      {
        id: null,
        active: true,
      },
    ]);

    expect(result).toEqual({
      created: true,
      updated: false,
      down: false,
    });
  });

  it('should mark down when an existing item becomes inactive', () => {
    const result = service.detectArrayChanges([
      {
        id: 1,
        active: true,
        value: 'old',
      },
    ], [
      {
        id: 1,
        active: false,
        value: 'old',
      },
    ]);

    expect(result).toEqual({
      created: false,
      updated: false,
      down: true,
    });
  });

  it('should mark updated when an existing item changes its content', () => {
    const result = service.detectArrayChanges([
      {
        id: 1,
        active: true,
        value: 'old',
      },
    ], [
      {
        id: 1,
        active: true,
        value: 'new',
      },
    ]);

    expect(result).toEqual({
      created: false,
      updated: true,
      down: false,
    });
  });

  it('should detect multiple change types in the same collection', () => {
    const result = service.detectArrayChanges([
      {
        id: 1,
        active: true,
        value: 'same',
      },
      {
        id: 2,
        active: true,
        value: 'old',
      },
    ], [
      {
        id: 1,
        active: true,
        value: 'same',
      },
      {
        id: 2,
        active: true,
        value: 'new',
      },
      {
        id: null,
        active: true,
        value: 'created',
      },
      {
        id: 3,
        active: false,
        value: 'down',
      },
    ]);

    expect(result).toEqual({
      created: true,
      updated: true,
      down: true,
    });
  });
});