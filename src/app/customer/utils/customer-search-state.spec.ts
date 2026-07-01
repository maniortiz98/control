import { searchState } from './customer-search-state';

describe('searchState', () => {

  const mockData = [
    { bland: '01', name: 'State1' },
    { bland: '02', name: 'State2' },
    { bland: '03', name: 'State3' }
  ];

  it('debe retornar el id si existe en el arreglo', () => {
    const result = searchState('02', mockData);
    expect(result).toBe('02');
  });

  it('debe retornar cadena vacía si no existe', () => {
    const result = searchState('99', mockData);
    expect(result).toBe('');
  });

  it('debe retornar cadena vacía si array está vacío', () => {
    const result = searchState('01', []);
    expect(result).toBe('');
  });

  it('debe funcionar con solo un elemento', () => {
    const result = searchState('01', [{ bland: '01' }]);
    expect(result).toBe('01');
  });

});