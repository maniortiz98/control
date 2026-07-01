import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';

import { OnboardingService } from './onboarding.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { AuthService } from '../../core/services/auth.service';
import { PermissionRolService } from '../../core/services/rol.service';
import { AddressesService } from '../../shared/services/storage-services/addresses.service';
import { AdditionalInfoService } from '../../shared/services/storage-services/additional-info.service';
import { AuthorizedPersonSignalService } from './checkpoint/authorized-persona-signal.service';
import { BankAccountCheckpointSignalService } from './checkpoint/bank-account-signal.service';
import { BeneficiariesSignalService } from './checkpoint/beneficiaries-signal.service';
import { IdentificationAndContactService } from '../../shared/services/storage-services/identification-and-contact.service';
import { EntityStatusService } from '../../shared/services/storage-services/pm/entity-status.service';
import { DirectorateSignalService } from './checkpoint/directorate-signal.service';
import { FirstDataClientService } from '../../shared/services/storage-services/first-data-client.service';
import { GeneralInfoStorageService } from '../../shared/services/storage-services/general-info-storage.service';
import { PersonalInterviewService } from '../../shared/services/storage-services/personal-interview.service';
import { OperateChangesStorageService } from '../../shared/services/storage-services/operate-changes-storage.service';
import { OrganizationChartService } from '../../shared/services/storage-services/pm/organization-chart.service';
import { PldQuizService } from '../../shared/services/pld-quiz.service';
import { PpeService } from '../../shared/services/storage-services/ppe.service';
import { PrivacyNoticeService } from '../../shared/services/storage-services/privacy-notice.service';
import { RealOwnerService } from '../../shared/services/storage-services/real-owner.service';
import { ResourceProviderService } from '../../shared/services/storage-services/resource-provider.service';
import { SignStorageService } from '../../shared/services/storage-services/sign-storage.service';
import { SpidProfileSignalService } from './checkpoint/spid-profile-signal.service';
import { FiscalSelfDeclarationDataClientService } from '../../shared/services/storage-services/fiscal-self-declaration.service';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { TiProfileService } from '../../shared/services/storage-services/ti-profile.service';
import { SpouseService } from '../../shared/services/storage-services/spouse.service';
import { ActiwebService } from '../../shared/services/actiweb.service';
import { CreditDataService } from '../../shared/services/storage-services/credit-data.service';
import { TaxProfileService } from '../../shared/services/storage-services/tax-profile.service';
import { ZipCodeService } from '../../shared/services/zip-code.service';
import { OnboardingStateServiceService } from './onboarding-state-service.service';

import { TABS_PF, TABS_PM } from '../constants/tabs';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { environment } from '../../../environments/environment';

describe('OnboardingService', () => {
    let service: OnboardingService;

    let httpSpy: jasmine.SpyObj<HttpClientService>;
    let authSpy: jasmine.SpyObj<AuthService>;
    let permissionSpy: jasmine.SpyObj<PermissionRolService>;
    let stateSpy: jasmine.SpyObj<OnboardingStateServiceService>;

    let addressesSpy: jasmine.SpyObj<AddressesService>;
    let additionalInfoSpy: jasmine.SpyObj<AdditionalInfoService>;
    let authorizedPersonSpy: jasmine.SpyObj<AuthorizedPersonSignalService>;
    let bankAccountSpy: jasmine.SpyObj<BankAccountCheckpointSignalService>;
    let beneficiariesSpy: jasmine.SpyObj<BeneficiariesSignalService>;
    let identificationSpy: jasmine.SpyObj<IdentificationAndContactService>;
    let directorateSpy: jasmine.SpyObj<DirectorateSignalService>;
    let entityStatusSpy: jasmine.SpyObj<EntityStatusService>;
    let firstDataSpy: jasmine.SpyObj<FirstDataClientService>;
    let generalInfoSpy: jasmine.SpyObj<GeneralInfoStorageService>;
    let personalInterviewSpy: jasmine.SpyObj<PersonalInterviewService>;
    let operateChangesSpy: jasmine.SpyObj<OperateChangesStorageService>;
    let organizationChartSpy: jasmine.SpyObj<OrganizationChartService>;
    let pldQuizSpy: jasmine.SpyObj<PldQuizService>;
    let ppeSpy: jasmine.SpyObj<PpeService>;
    let privacyNoticeSpy: jasmine.SpyObj<PrivacyNoticeService>;
    let realOwnerSpy: jasmine.SpyObj<RealOwnerService>;
    let resourceProviderSpy: jasmine.SpyObj<ResourceProviderService>;
    let signSpy: jasmine.SpyObj<SignStorageService>;
    let spidSpy: jasmine.SpyObj<SpidProfileSignalService>;
    let fiscalSelfDeclarationSpy: jasmine.SpyObj<FiscalSelfDeclarationDataClientService>;
    let tiProfileSpy: jasmine.SpyObj<TiProfileService>;
    let spouseSpy: jasmine.SpyObj<SpouseService>;
    let actiwebSpy: jasmine.SpyObj<ActiwebService>;
    let creditDataSpy: jasmine.SpyObj<CreditDataService>;
    let taxProfileSpy: jasmine.SpyObj<TaxProfileService>;

    const defaultState: CurrentOnboardingInfo = {
        requestId: '',
        personType: 'PF',
        name: '',
        contractType: '',
        contractSubtype: '',
        businessType: '',
        onboardingId: 0,
        isMaintenance: false,
        isCustomer: false,
        isOnboarding: false,
        isOnboardingWL: false,
        clientId: 0,
        accountId: 0,
        accountData: null,
    };

    beforeEach(() => {
        httpSpy = jasmine.createSpyObj<HttpClientService>('HttpClientService', ['post']);
        authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserInfo']);
        permissionSpy = jasmine.createSpyObj<PermissionRolService>('PermissionRolService', ['getPermissions']);
        stateSpy = jasmine.createSpyObj<OnboardingStateServiceService>('OnboardingStateServiceService', ['setCurrentInfo', 'getCurrentInfo']);

        addressesSpy = jasmine.createSpyObj<AddressesService>('AddressesService', ['clear']);
        additionalInfoSpy = jasmine.createSpyObj<AdditionalInfoService>('AdditionalInfoService', ['removeItem']);
        authorizedPersonSpy = jasmine.createSpyObj<AuthorizedPersonSignalService>('AuthorizedPersonSignalService', ['clear']);
        bankAccountSpy = jasmine.createSpyObj<BankAccountCheckpointSignalService>('BankAccountCheckpointSignalService', ['clear']);
        beneficiariesSpy = jasmine.createSpyObj<BeneficiariesSignalService>('BeneficiariesSignalService', ['clear']);
        identificationSpy = jasmine.createSpyObj<IdentificationAndContactService>('IdentificationAndContactService', ['cleartIdentificationAndContactInfo']);
        directorateSpy = jasmine.createSpyObj<DirectorateSignalService>('DirectorateSignalService', ['clear']);
        entityStatusSpy = jasmine.createSpyObj<EntityStatusService>('EntityStatusService', ['clearEntityStatusPm']);
        firstDataSpy = jasmine.createSpyObj<FirstDataClientService>('FirstDataClientService', ['removeItem']);
        generalInfoSpy = jasmine.createSpyObj<GeneralInfoStorageService>('GeneralInfoStorageService', ['clearFullSectionSingal']);
        personalInterviewSpy = jasmine.createSpyObj<PersonalInterviewService>('PersonalInterviewService', ['removeItem']);
        operateChangesSpy = jasmine.createSpyObj<OperateChangesStorageService>('OperateChangesStorageService', ['clearOperateChanges']);
        organizationChartSpy = jasmine.createSpyObj<OrganizationChartService>('OrganizationChartService', ['clearOrganizationChartSection']);
        pldQuizSpy = jasmine.createSpyObj<PldQuizService>('PldQuizService', ['clear']);
        ppeSpy = jasmine.createSpyObj<PpeService>('PpeService', ['clear']);
        privacyNoticeSpy = jasmine.createSpyObj<PrivacyNoticeService>('PrivacyNoticeService', ['clear']);
        realOwnerSpy = jasmine.createSpyObj<RealOwnerService>('RealOwnerService', ['removeItem']);
        resourceProviderSpy = jasmine.createSpyObj<ResourceProviderService>('ResourceProviderService', ['removeItem']);
        signSpy = jasmine.createSpyObj<SignStorageService>('SignStorageService', ['clear']);
        spidSpy = jasmine.createSpyObj<SpidProfileSignalService>('SpidProfileSignalService', ['clear']);
        fiscalSelfDeclarationSpy = jasmine.createSpyObj<FiscalSelfDeclarationDataClientService>('FiscalSelfDeclarationDataClientService', ['removeItem']);
        tiProfileSpy = jasmine.createSpyObj<TiProfileService>('TiProfileService', ['clear']);
        spouseSpy = jasmine.createSpyObj<SpouseService>('SpouseService', ['removeItem']);
        actiwebSpy = jasmine.createSpyObj<ActiwebService>('ActiwebService', ['clear']);
        creditDataSpy = jasmine.createSpyObj<CreditDataService>('CreditDataService', ['removeItem']);
        taxProfileSpy = jasmine.createSpyObj<TaxProfileService>('TaxProfileService', ['removeItem']);

        authSpy.getUserInfo.and.returnValue(signal({ employeeId: '53000' } as any));
        permissionSpy.getPermissions.and.returnValue({
            'general-info': { hide: true },
            'spouse': { hide: true },
        } as any);
        stateSpy.getCurrentInfo.and.returnValue(defaultState);
        httpSpy.post.and.returnValue(of({ ok: true }));

        TestBed.configureTestingModule({
            providers: [
                OnboardingService,
                { provide: HttpClientService, useValue: httpSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: PermissionRolService, useValue: permissionSpy },
                { provide: OnboardingStateServiceService, useValue: stateSpy },
                { provide: AddressesService, useValue: addressesSpy },
                { provide: AdditionalInfoService, useValue: additionalInfoSpy },
                { provide: AuthorizedPersonSignalService, useValue: authorizedPersonSpy },
                { provide: BankAccountCheckpointSignalService, useValue: bankAccountSpy },
                { provide: BeneficiariesSignalService, useValue: beneficiariesSpy },
                { provide: IdentificationAndContactService, useValue: identificationSpy },
                { provide: DirectorateSignalService, useValue: directorateSpy },
                { provide: EntityStatusService, useValue: entityStatusSpy },
                { provide: FirstDataClientService, useValue: firstDataSpy },
                { provide: GeneralInfoStorageService, useValue: generalInfoSpy },
                { provide: PersonalInterviewService, useValue: personalInterviewSpy },
                { provide: OperateChangesStorageService, useValue: operateChangesSpy },
                { provide: OrganizationChartService, useValue: organizationChartSpy },
                { provide: PldQuizService, useValue: pldQuizSpy },
                { provide: PpeService, useValue: ppeSpy },
                { provide: PrivacyNoticeService, useValue: privacyNoticeSpy },
                { provide: RealOwnerService, useValue: realOwnerSpy },
                { provide: ResourceProviderService, useValue: resourceProviderSpy },
                { provide: SignStorageService, useValue: signSpy },
                { provide: SpidProfileSignalService, useValue: spidSpy },
                { provide: FiscalSelfDeclarationDataClientService, useValue: fiscalSelfDeclarationSpy },
                { provide: TiProfileService, useValue: tiProfileSpy },
                { provide: SpouseService, useValue: spouseSpy },
                { provide: ActiwebService, useValue: actiwebSpy },
                { provide: CreditDataService, useValue: creditDataSpy },
                { provide: TaxProfileService, useValue: taxProfileSpy },
                { provide: CatalogsService, useValue: {} },
                { provide: ZipCodeService, useValue: {} },
            ],
        });

        service = TestBed.inject(OnboardingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setCurrentInfo y getCurrentInfoState deben delegar al state service', () => {
        const info = { ...defaultState, requestId: 'REQ-1' };

        service.setCurrentInfo(info);
        const result = service.getCurrentInfoState();

        expect(stateSpy.setCurrentInfo).toHaveBeenCalledWith(info);
        expect(result).toEqual(defaultState);
        expect(stateSpy.getCurrentInfo).toHaveBeenCalled();
    });

    it('setOnboardingRegister/getOnboardingRegister deben almacenar y retornar data', () => {
        const payload = { section: 'general', id: 10 };
        service.setOnboardingRegister(payload);

        expect(service.getOnboardingRegister()).toEqual(payload);
    });

    it('updateCurrentOnboardingInfo debe hacer merge y sincronizar state', () => {
        service.updateCurrentOnboardingInfo({ requestId: 'REQ-2', name: 'Cliente Demo' });

        expect(service.currentInfo().requestId).toBe('REQ-2');
        expect(service.currentInfo().name).toBe('Cliente Demo');
        expect(stateSpy.setCurrentInfo).toHaveBeenCalledWith(jasmine.objectContaining({
            requestId: 'REQ-2',
            name: 'Cliente Demo',
        }));
    });

    it('clearOnboardingInfo debe resetear señales y limpiar storages', () => {
        service.clearOnboardingInfo();

        expect(service.currentInfo()).toEqual(defaultState);
        expect(service.currentTab()).toEqual({ previous: 0, current: 0 });
        expect(stateSpy.setCurrentInfo).toHaveBeenCalledWith(defaultState);
        expect(service.getOnboardingRegister()).toEqual({});


        expect(addressesSpy.clear).toHaveBeenCalled();
        expect(additionalInfoSpy.removeItem).toHaveBeenCalled();
        expect(authorizedPersonSpy.clear).toHaveBeenCalled();
        expect(bankAccountSpy.clear).toHaveBeenCalled();
        expect(beneficiariesSpy.clear).toHaveBeenCalled();
        expect(identificationSpy.cleartIdentificationAndContactInfo).toHaveBeenCalled();
        expect(directorateSpy.clear).toHaveBeenCalled();
        expect(entityStatusSpy.clearEntityStatusPm).toHaveBeenCalled();
        expect(firstDataSpy.removeItem).toHaveBeenCalled();
        expect(generalInfoSpy.clearFullSectionSingal).toHaveBeenCalled();
        expect(personalInterviewSpy.removeItem).toHaveBeenCalled();
        expect(operateChangesSpy.clearOperateChanges).toHaveBeenCalled();
        expect(organizationChartSpy.clearOrganizationChartSection).toHaveBeenCalled();
        expect(pldQuizSpy.clear).toHaveBeenCalled();
        expect(ppeSpy.clear).toHaveBeenCalled();
        expect(privacyNoticeSpy.clear).toHaveBeenCalled();
        expect(realOwnerSpy.removeItem).toHaveBeenCalled();
        expect(resourceProviderSpy.removeItem).toHaveBeenCalled();
        expect(signSpy.clear).toHaveBeenCalled();
        expect(spidSpy.clear).toHaveBeenCalled();
        expect(fiscalSelfDeclarationSpy.removeItem).toHaveBeenCalled();
        expect(tiProfileSpy.clear).toHaveBeenCalled();
        expect(taxProfileSpy.removeItem).toHaveBeenCalled();
        expect(spouseSpy.removeItem).toHaveBeenCalled();
        expect(creditDataSpy.removeItem).toHaveBeenCalled();
        expect(actiwebSpy.clear).toHaveBeenCalled();
    });

    it('finishOnboarding debe postear applicationId y advisorId', async () => {
        service.updateCurrentOnboardingInfo({ requestId: 'APP-100' });

        await firstValueFrom(service.finishOnboarding());

        expect(httpSpy.post).toHaveBeenCalledWith((service as any).url, {
            applicationId: 'APP-100',
            advisorId: '53000',
        });
    });

    it('enableTabs y disableTabs deben afectar todos o paths específicos', () => {
        service.tabs.set([
            { label: 'A', path: 'a', step: 1, disabled: true, hide: false },
            { label: 'B', path: 'b', step: 2, disabled: true, hide: false },
        ]);

        service.enableTabs(['a']);
        expect(service.tabs()[0].disabled).toBeFalse();
        expect(service.tabs()[1].disabled).toBeTrue();

        service.disableTabs();
        expect(service.tabs().every(t => t.disabled)).toBeTrue();
    });

    it('hideTabs y showTabs deben ocultar/mostrar pestañas', () => {
        service.tabs.set([
            { label: 'Spouse', path: 'spouse', step: 1, disabled: false, hide: false },
            { label: 'Other', path: 'other', step: 2, disabled: false, hide: false },
        ]);

        service.hideTabs('spouse');
        expect(service.tabs()[0].hide).toBeTrue();

        service.updateCurrentOnboardingInfo({ isMaintenance: false });
        service.showTabs('spouse');
        expect(service.tabs()[0].hide).toBeFalse();
    });

    it('showTabs en mantenimiento debe respetar hide por rol', () => {
        service.tabs.set([
            { label: 'Spouse', path: 'spouse', step: 1, disabled: false, hide: false },
        ]);
        service.updateCurrentOnboardingInfo({ isMaintenance: true });

        service.showTabs('spouse');

        expect(permissionSpy.getPermissions).toHaveBeenCalled();
        expect(service.tabs()[0].hide).toBeTrue();
    });

    it('setTabs debe cargar TABS_PF y TABS_PM según tipo de persona', () => {
        service.updateCurrentOnboardingInfo({ personType: 'PF', isMaintenance: false });
        service.setTabs();
        expect(service.tabs().map(t => t.path)).toEqual(TABS_PF.map(t => t.path));

        service.updateCurrentOnboardingInfo({ personType: 'PM', isMaintenance: false });
        service.setTabs();
        expect(service.tabs().map(t => t.path)).toEqual(TABS_PM.map(t => t.path));
    });

    it('setTabs en mantenimiento debe aplicar permisos de hide', () => {
        service.updateCurrentOnboardingInfo({ personType: 'PF', isMaintenance: true });

        service.setTabs();

        const tab = service.tabs().find(t => t.path === 'general-info');
        expect(permissionSpy.getPermissions).toHaveBeenCalled();
        expect(tab?.hide).toBeTrue();
    });

    it('setCurrentTab y restoreTabPosition deben actualizar navegación de tabs', () => {
        service.setCurrentTab(2);
        expect(service.currentTab()).toEqual({ previous: 0, current: 2 });

        service.setCurrentTab(5);
        expect(service.currentTab()).toEqual({ previous: 2, current: 5 });

        service.restoreTabPosition();
        expect(service.currentTab()).toEqual({ previous: 5, current: 2 });
    });

    it('setCustomerInitalData debe hacer merge y mapear personType 1 -> PF', () => {
        service.customerInitialData.set({ name: 'Prev' } as any);

        service.setCustomerInitalData({ personType: '1', name: 'Nuevo', emptyField: '' } as any);

        expect(service.getCustomerInitialData().name).toBe('Nuevo');
        expect(service.currentInfo().personType).toBe('PF');
    });

    it('getFirstTab debe regresar el primer tab cuando no existe position=0', () => {
        service.tabs.set([
            { label: 'A', path: 'a', step: 1, disabled: false, hide: false },
            { label: 'B', path: 'b', step: 2, disabled: false, hide: false },
        ]);

        expect(service.getFirstTab().path).toBe('a');
    });

    it('registerEquity debe postear a equityRegister', async () => {
        const payload = { clientId: 10, contractId: 20 } as any;

        await firstValueFrom(service.registerEquity(payload));

        expect(httpSpy.post).toHaveBeenCalledWith(environment.api.maintenance.equityRegister, payload);
    });
});
