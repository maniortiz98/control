import { TestBed } from '@angular/core/testing';
import { SignStorageService } from './sign-storage.service';
import { SingSection } from '../../../onboarding/models/sign-section';
describe('SignStorageService', () => {
  let service: SignStorageService;

  const mockSingSection: SingSection = {
    id: null,
    signType: 'INDIVIDUAL',
    instructions: '',
    titularIpabPercentaje: 20,
    titularIsrPecentaje: 20,
    cotitularList: [],
    cotitularTableList: [],
    attoneryList: [],
    attoneryTableList: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignStorageService]
    });
    service = TestBed.inject(SignStorageService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value null in singSectionSignal', () => {
    expect(service.singSectionSignal()).toBeNull();
  });

  it('should store a SingSection with setSingSection', () => {
    service.setSingSection(mockSingSection);

    expect(service.singSectionSignal()).toEqual(mockSingSection);
  });

  it('should clear the value with clear()', () => {
    service.setSingSection(mockSingSection);
    service.clear();

    expect(service.singSectionSignal()).toBeNull();
  });
});
