import { mapFormToCheckPointPpeData, mapFormToCheckPointPpeDataMant } from './ppe.mapper';

describe('PPE Mapper', () => {

  const makePpeData = (overrides: any = {}) => ({
    ppe: true,
    fppe: 'YES',
    dppe: 'YES',
    sappe: 'YES',
    typePPE: 'DIPUTADO',
    positionHeld: 'LEGISLADOR',
    expirationDate: '01/12/2025',
    dataClientFamilyPPE: [],
    dataClientDepPPE: [],
    dataClientSocAndAssoPPE: [],
    ...overrides
  });

  it('should map PPE form to checkpoint with boolean conversion', () => {
    const input = makePpeData({ ppe: true, fppe: 'YES', dppe: 'NO', sappe: 'NO' });
    const result = mapFormToCheckPointPpeData(input as any);

    expect(result).toEqual(jasmine.objectContaining({
      isPpe: true,
      ppeType: 'DIPUTADO',
      positionHeld: 'LEGISLADOR'
    }));
  });

  it('should handle YES/NO string conversion for boolean flags', () => {
    const input1 = makePpeData({ fppe: 'YES', dppe: 'YES', sappe: 'YES' });
    const input2 = makePpeData({ fppe: 'NO', dppe: 'NO', sappe: 'NO' });

    const result1 = mapFormToCheckPointPpeData(input1 as any);
    const result2 = mapFormToCheckPointPpeData(input2 as any);

    expect(result1.hasFamilyPpe).toBe(true);
    expect(result1.hasEconomicDependents).toBe(true);
    expect(result1.hasAssociations).toBe(true);

    expect(result2.hasFamilyPpe).toBe(false);
    expect(result2.hasEconomicDependents).toBe(false);
    expect(result2.hasAssociations).toBe(false);
  });

  it('should handle empty arrays for dependents, family, and associations', () => {
    const input = makePpeData({
      dataClientDepPPE: [],
      dataClientFamilyPPE: [],
      dataClientSocAndAssoPPE: []
    });
    const result = mapFormToCheckPointPpeData(input as any);

    expect(result.economicDependents.length).toBe(0);
    expect(result.familyData.length).toBe(0);
    expect(result.associations.length).toBe(0);
  });

  it('should handle maintenance mode with null original', () => {
    const newData = makePpeData();
    const result = mapFormToCheckPointPpeDataMant(newData as any, null as any);

    expect(result).toBeDefined();
    expect(result.isPpe).toBe(true);
    expect(result.ppeType).toBe('DIPUTADO');
  });

  it('should handle maintenance mode with existing data', () => {
    const newData = makePpeData({ ppe: true });
    const original = makePpeData({ ppe: false });

    const result = mapFormToCheckPointPpeDataMant(newData as any, original as any);

    expect(result.isPpe).toBe(true);
  });
});
