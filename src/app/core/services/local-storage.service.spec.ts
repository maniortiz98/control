import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [LocalStorageService]
        });
        service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty catalog when not stored', () => {
        const result = service.getCatalog('test' as any);
        expect(result.data).toEqual([]);
        expect(result.updatedAt).toBe('');
    });

    it('should save and get catalog', () => {
        service.setCatalog('demo' as any, [{ id: 1 }]);
        const result = service.getCatalog('demo' as any);
        expect(result.data.length).toBe(1);
    });

    it('should get catalog separated by id', () => {
        localStorage.setItem('cat_x', JSON.stringify({ a: { data: [1] } }));
        const result = service.getSeparatedByIdCatalog('x');
        expect(result['a'].data).toEqual([1]);
    });

    it('should set catalog separated by id', () => {
        service.setSeparatedByIdCatalog('x', 'y', [1]);
        const stored = JSON.parse(localStorage.getItem('cat_x') || '{}');
        expect(stored.y.data).toEqual([1]);
    });

    it('should set classification by person type', () => {
        const list = [
            { personTypeId: '1', name: 'A' },
            { personTypeId: '2', name: 'B' }
        ] as any;

        service.setClassificationPersonByPersonType(list);

        const stored = JSON.parse(localStorage.getItem('cat_classificationPerson')!);
        expect(stored.pf.length).toBe(1);
        expect(stored.pm.length).toBe(1);
    });

    it('should get classification by person type', () => {
        localStorage.setItem('cat_classificationPerson', JSON.stringify({
            pf: [{ id: 1 }],
            pm: [{ id: 2 }]
        }));

        const pf = service.getClassificationPersonByPersonType('1');
        const pm = service.getClassificationPersonByPersonType('2');

        expect(pf[0].id).toBe(1);
        expect(pm[0].id).toBe(2);
    });

    it('should save contracts', () => {
        service.setContracts(1, [
            { contractTypeId: 10, subcontract: [] }
        ] as any);

        const stored = JSON.parse(localStorage.getItem('cat_contracts')!);
        expect(stored.pf.length).toBe(1);
    });

    it('should set subcontracts for a contract', () => {
        localStorage.setItem('cat_contracts', JSON.stringify({
            pf: [
                { contractTypeId: 5, subcontract: [] }
            ],
            pm: []
        }));

        service.setSubcontracts(1, 5, [{ id: 99 }] as any);

        const stored = JSON.parse(localStorage.getItem('cat_contracts')!);
        expect(stored.pf[0].subcontract[0].id).toBe(99);
    });

    it('should return contracts by person type', () => {
        localStorage.setItem('cat_contracts', JSON.stringify({
            pf: [
                {
                    bankAreaTypeId: 1,
                    contractTypeId: 5,
                    contractType: 'Test',
                    subcontract: []
                }
            ],
            pm: []
        }));

        const result = service.getContracts(1);
        expect(result[0].contractTypeId).toBe(5);
    });

    it('should return subcontracts by person type and contract id', () => {
        localStorage.setItem('cat_contracts', JSON.stringify({
            pf: [
                { contractTypeId: 7, subcontract: [{ x: 1 }] }
            ],
            pm: []
        }));

        const result = service.getSubcontracts(1, 7);
        expect((result[0] as any).x).toBe(1);
    });

    it('should return empty array when subcontracts not found', () => {
        const result = service.getSubcontracts(2, 999);
        expect(result).toEqual([]);
    });

    it('should use internal setItem', () => {
        (service as any).setItem('t_key', '123');
        expect(localStorage.getItem('t_key')).toBe('123');
    });

    it('should use internal getItem', () => {
        localStorage.setItem('abc', 'xyz');
        const value = (service as any).getItem('abc');
        expect(value).toBe('xyz');
    });

    it('should use internal removeItem', () => {
        localStorage.setItem('rm', '1');
        (service as any).removeItem('rm');
        expect(localStorage.getItem('rm')).toBeNull();
    });

    it('should get key name by index', () => {
        localStorage.setItem('k1', 'v1');
        const key = (service as any).getKeyName(0);
        expect(key).toBe('k1');
    });

    it('should confirm localStorage support', () => {
        expect(service.isLocalStorageSupported).toBeTrue();
    });
});