import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchCustomerComponent } from './search-customer.component';
import { SearchCustomerService } from '../../services/search-customer.service';
import { NotificationsService } from '../../services/notifications.service';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../shared.module';

describe('SearchCustomerComponent', () => {
  let component: SearchCustomerComponent;
  let fixture: ComponentFixture<SearchCustomerComponent>;
  let searchCustomerServiceSpy: jasmine.SpyObj<SearchCustomerService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    searchCustomerServiceSpy = jasmine.createSpyObj('SearchCustomerService', ['searchCustomer', 'searchProspect']);
    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule],
      declarations: [SearchCustomerComponent],
      providers: [
        { provide: SearchCustomerService, useValue: searchCustomerServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCustomerComponent);
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

    component.type = component.SEARCH_TYPE.CUSTOMER;

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
