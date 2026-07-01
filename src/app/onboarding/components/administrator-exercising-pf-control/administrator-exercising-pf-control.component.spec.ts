// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { AdministratorExercisingPfControlComponent } from "./administrator-exercising-pf-control.component";
// import { SharedModule } from "../../../shared/shared.module";
// import { CoreModule } from "../../../core/core.module";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { ActivatedRoute } from '@angular/router';
// import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
// import { OnboardingService } from '../../../onboarding/services/onboarding.service';
// import { HttpClientService } from '../../../core/services/http-client.service';

// describe('AdministratorExercisingPfControlComponent', () => {
//   let component: AdministratorExercisingPfControlComponent;
//   let fixture: ComponentFixture<AdministratorExercisingPfControlComponent>;
//   let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;

//   beforeEach(async () => {
//     onboardingServiceSpy = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);

//     await TestBed.configureTestingModule({
//       imports: [
//         CoreModule,
//         SharedModule,
//         HttpClientTestingModule,
//       ],
//       declarations: [AdministratorExercisingPfControlComponent],
//       providers: [
//         { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
//         { provide: MsalService, useValue: {} },
//         { provide: MsalBroadcastService, useValue: {} },
//         { provide: OnboardingService, useValue: onboardingServiceSpy },
//         HttpClientService // Use the actual implementation
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AdministratorExercisingPfControlComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
