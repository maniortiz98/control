import {
  mapToSignalInitialDataCustomer,
} from './initial-data-mapper';

describe('response/initial-data-mapper', () => {
  it('should map customer initial data and default null input', () => {
    const mapped = mapToSignalInitialDataCustomer({
      curp: 'CURP',
      firstName: 'Jane',
      ppe: true,
      foreignerWithoutCurp: true,
    } as any);

    expect(mapped).toEqual(
      jasmine.objectContaining({
        curp: 'CURP',
        firstName: 'Jane',
        ppe: true,
        foreignerWithoutCurp: true,
      }),
    );

    expect(mapToSignalInitialDataCustomer(null)).toEqual(
      jasmine.objectContaining({
        curp: '',
        firstName: '',
        ppe: false,
        foreignerWithoutCurp: false,
      }),
    );
  });
});
