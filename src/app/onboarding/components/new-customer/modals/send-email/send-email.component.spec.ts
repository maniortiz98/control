import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { SendEmailComponent } from './send-email.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { CoreModule } from '../../../../../core/core.module';

describe('SendEmailComponent', () => {
  let component: SendEmailComponent;
  let fixture: ComponentFixture<SendEmailComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SendEmailComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule],
      declarations: [SendEmailComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.value).toEqual({
      privacyOption: false,
      clauseOption: false,
      coverOption: false
    });
  });

  it('should close the dialog with ok: false when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      ok: false,
      data: {}
    });
  });

  it('should log form value and close the dialog with ok: true when send is called', () => {
    spyOn(console, 'log');
    component.send();
    expect(console.log).toHaveBeenCalledWith(component.form.value);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      ok: true,
      data: {}
    });
  });
});
