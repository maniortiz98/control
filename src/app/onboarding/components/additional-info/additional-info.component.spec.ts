// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AdditionalInfoComponent } from './additional-info.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { SharedModule } from '../../../shared/shared.module';
// import { CoreModule } from '../../../core/core.module';
// import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
// import { OnboardingService } from '../../services/onboarding.service';
// import { AuthService } from '../../../core/services/auth.service';

// describe('AdditionalInfoComponent', () => {
//   let component: AdditionalInfoComponent;
//   let fixture: ComponentFixture<AdditionalInfoComponent>;

//   let msalBroadcastServiceSpy: jasmine.SpyObj<MsalBroadcastService>;
//   let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;

//   beforeEach(async () => {
//     msalBroadcastServiceSpy = jasmine.createSpyObj('MsalBroadcastService', ['msalSubject$', 'inProgress$']);
//     onboardingServiceSpy = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);

//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         SharedModule,
//         CoreModule
//       ],
//       declarations: [AdditionalInfoComponent],
//       providers: [
//         { provide: MsalService, useValue: {} },
//         { provide: MsalBroadcastService, useValue: msalBroadcastServiceSpy },
//         { provide: OnboardingService, useValue: onboardingServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AdditionalInfoComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
