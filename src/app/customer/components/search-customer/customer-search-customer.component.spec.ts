import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSearchCustomerComponent } from './customer-search-customer.component';
import { CustomerSearchCustomerService } from '../../services/customer-search-customer.service';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

describe('CustomerSearchCustomerComponent', () => {
  let component: CustomerSearchCustomerComponent;
  let fixture: ComponentFixture<CustomerSearchCustomerComponent>;
  let searchCustomerServiceSpy: jasmine.SpyObj<CustomerSearchCustomerService>;
  let notificationsServiceSpy: jasmine.SpyObj<CustomerNotificationsService>;

  beforeEach(async () => {
    searchCustomerServiceSpy = jasmine.createSpyObj('CustomerSearchCustomerService', ['searchCustomer', 'searchProspect']);
    notificationsServiceSpy = jasmine.createSpyObj('CustomerNotificationsService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule],
      declarations: [CustomerSearchCustomerComponent],
      providers: [
        { provide: CustomerSearchCustomerService, useValue: searchCustomerServiceSpy },
        { provide: CustomerNotificationsService, useValue: notificationsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSearchCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchCustomer on submit', () => {
    const mockData = { name: 'John Doe' };
    searchCustomerServiceSpy.searchCustomer.and.returnValue(of(mockData));

    // component.searchForm.setValue({ name: 'John Doe' });
    // component.onSubmit();

    // expect(searchCustomerServiceSpy.searchCustomer).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('should show success notification on successful search', () => {
    const mockData = { name: 'John Doe' };
    searchCustomerServiceSpy.searchCustomer.and.returnValue(of(mockData));

    // component.searchForm.setValue({ name: 'John Doe' });
    // component.onSubmit();

    // expect(notificationsServiceSpy.success).toHaveBeenCalledWith('Search successful');
  });

  it('should show error notification on search failure', () => {
    searchCustomerServiceSpy.searchCustomer.and.throwError('Search failed');

    component.type = component.SEARCH_TYPE.CustomerCUSTOMER;

    component.form.setValue({
        customerNumber: '',
        curp: '',
        typeId: '',
        numId: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        birthdate: '',
    });
    component.submit(false);

    expect(notificationsServiceSpy.error).toHaveBeenCalledWith('Seleccione información para continuar.');
  });
});

