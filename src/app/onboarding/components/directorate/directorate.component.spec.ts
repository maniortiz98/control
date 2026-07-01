// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MsalService, MsalBroadcastService } from '@azure/msal-angular';

// import { DirectorateComponent } from './directorate.component';
// import { CoreModule } from '../../../core/core.module';
// import { SharedModule } from '../../../shared/shared.module';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { OnboardingService } from '../../../onboarding/services/onboarding.service';
// import { AuthService } from '../../../core/services/auth.service';

// describe('DirectorateComponent', () => {
//   let component: DirectorateComponent;
//   let fixture: ComponentFixture<DirectorateComponent>;

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
//       declarations: [DirectorateComponent],
//       providers: [
//         { provide: MsalService, useValue: {} },
//         { provide: MsalBroadcastService, useValue: msalBroadcastServiceSpy },
//         { provide: OnboardingService, useValue: onboardingServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(DirectorateComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
