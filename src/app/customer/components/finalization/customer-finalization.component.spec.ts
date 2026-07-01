// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { CustomerFinalizationComponent } from './customer-finalization.component';
// import { SharedModule } from '../../../shared/shared.module';
// import { CoreModule } from '../../../core/core.module';

// describe('CustomerFinalizationComponent', () => {
//   let component: CustomerFinalizationComponent;
//   let fixture: ComponentFixture<CustomerFinalizationComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [CustomerFinalizationComponent],
//       imports: [CoreModule, SharedModule],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerFinalizationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize contractColumns and registryColumns on ngOnInit', () => {
//     component.ngOnInit();

//     expect(component.contractColumns.length).toBe(2);
//     expect(component.contractColumns[0].name).toBe('customer-contract');
//     expect(component.registryColumns.length).toBe(4);
//     expect(component.registryColumns[0].name).toBe('registry');
//   });

//   it('should load contract and registry data correctly', async () => {
//     await component.loadInformation();

//     expect(component.contractData()).toEqual([
//       { contract: 'Banco', contractNumber: '091238765' },
//       { contract: 'Casa de Bolsa', contractNumber: '091238766' },
//       { contract: 'Plan Personal de Retiro', contractNumber: '091238767' }
//     ]);

//     expect(component.registryData().length).toBe(6);
//     expect(component.registryData()[0].registry).toBe('Cotitular');
//   });

//   describe('copyProspectNumber', () => {
//     let writeTextSpy: jasmine.Spy;

//     beforeEach(() => {
//       writeTextSpy = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());

//       const mockClipboard = {
//         writeText: writeTextSpy
//       } as unknown as Clipboard;

//       spyOnProperty(navigator, 'clipboard').and.returnValue(mockClipboard);
//     });

//     it('should copy infoToCopy to clipboard when infoToCopy is set', async () => {
//       component.infoToCopy = '010101';
//       await component.copyProspectNumber();

//       expect(writeTextSpy).toHaveBeenCalledWith('010101');
//       expect(writeTextSpy).toHaveBeenCalledTimes(1);
//     });

//     it('should not call clipboard.writeText if infoToCopy is empty', async () => {
//       component.infoToCopy = '';
//       await component.copyProspectNumber();

//       expect(writeTextSpy).not.toHaveBeenCalled();
//     });
//   });

//   it('should navigate to /onboarding/kit-contract when accept is called', () => {
//     component.accept();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/onboarding/kit-contract']);
//   });
// });


