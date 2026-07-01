import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { NotificationFormRegistry } from './notification-form-registry.service';

describe('NotificationFormRegistry', () => {
  let service: NotificationFormRegistry;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationFormRegistry, FormBuilder],
    });

    service = TestBed.inject(NotificationFormRegistry);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register the form and clone its raw value as initial value', () => {
    const form = formBuilder.group({
      name: ['John'],
      nested: formBuilder.group({
        lastName: ['Doe'],
      }),
    });

    service.registerForm(form);

    const currentForm = service.getCurrentForm();
    const initialValue = service.getInitialValue();

    expect(currentForm).toBe(form);
    expect(initialValue).toEqual({
      name: 'John',
      nested: {
        lastName: 'Doe',
      },
    });

    form.patchValue({
      name: 'Jane',
      nested: { lastName: 'Smith' },
    });

    expect(service.getInitialValue()).toEqual({
      name: 'John',
      nested: {
        lastName: 'Doe',
      },
    });
  });

  it('should update only the current form when setCurrentSubmitForm is used', () => {
    const firstForm = formBuilder.group({
      name: ['John'],
    });
    const secondForm = formBuilder.group({
      name: ['Jane'],
    });

    service.registerForm(firstForm);
    service.setCurrentSubmitForm(secondForm);

    expect(service.getCurrentForm()).toBe(secondForm);
    expect(service.getInitialValue()).toEqual({ name: 'John' });
  });
});