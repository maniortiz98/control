import {
  mapToCheckpointToSignalTaxProfile,
  mapToSignalToCheckpointTaxProfileBank,
  mapToSignalToCheckpointTaxProfileHouse,
} from './fiscal-profile-mapper';
import { TaxProfile } from '../../../models/checkpoints/maintenance/fiscal-profile';
import { TaxProfileSignal } from '../../../models/fiscal-profile';

describe('fiscal-profile-mapper', () => {
  describe('mapToCheckpointToSignalTaxProfile', () => {
    it('debe mapear todas las propiedades del checkpoint al signal', () => {
      const input: TaxProfile = {
        id: 10,
        personTypeCve: 'PF',
        collectTaxes: true,
        trust: false,
        subPersonTypeCve: 'SUB-01',
        taxProfile: 'BANK',
        taxProfileDescription: 'Perfil bancario',
      };

      const result = mapToCheckpointToSignalTaxProfile(input);

      expect(result).toEqual({
        id: 10,
        personTypeCve: 'PF',
        collectTaxes: true,
        trust: false,
        subPersonTypeCve: 'SUB-01',
        taxProfile: 'BANK',
        taxProfileDescription: 'Perfil bancario',
      });
    });

    it('debe mantener valores opcionales undefined cuando no existan', () => {
      const input: TaxProfile = {
        id: 5,
        collectTaxes: false,
      };

      const result = mapToCheckpointToSignalTaxProfile(input);

      expect(result).toEqual({
        id: 5,
        personTypeCve: undefined,
        collectTaxes: false,
        trust: undefined,
        subPersonTypeCve: undefined,
        taxProfile: undefined,
        taxProfileDescription: undefined,
      });
    });
  });

  describe('mapToSignalToCheckpointTaxProfileBank', () => {
    it('debe mapear solo id y collectTaxes para perfil bancario', () => {
      const input: TaxProfileSignal = {
        id: 22,
        personTypeCve: 'PM',
        collectTaxes: true,
        trust: true,
        subPersonTypeCve: 'SUB-02',
        taxProfile: 'HOUSE',
        taxProfileDescription: 'Perfil casa de bolsa',
      };

      const result = mapToSignalToCheckpointTaxProfileBank(input);

      expect(result).toEqual({
        id: 22,
        collectTaxes: true,
      });
    });
  });

  describe('mapToSignalToCheckpointTaxProfileHouse', () => {
    it('debe mapear los campos esperados para perfil casa de bolsa', () => {
      const input: TaxProfileSignal = {
        id: 33,
        personTypeCve: 'PM',
        collectTaxes: false,
        trust: true,
        subPersonTypeCve: 'SUB-03',
        taxProfile: 'IGNORED',
        taxProfileDescription: 'No debe incluirse',
      };

      const result = mapToSignalToCheckpointTaxProfileHouse(input);

      expect(result).toEqual({
        id: 33,
        personTypeCve: 'PM',
        subPersonTypeCve: 'SUB-03',
        collectTaxes: false,
        trust: true,
      });
    });

    it('debe soportar trust y subPersonTypeCve undefined', () => {
      const input: TaxProfileSignal = {
        id: 44,
        personTypeCve: 'PF',
        collectTaxes: true,
      };

      const result = mapToSignalToCheckpointTaxProfileHouse(input);

      expect(result).toEqual({
        id: 44,
        personTypeCve: 'PF',
        subPersonTypeCve: undefined,
        collectTaxes: true,
        trust: undefined,
      });
    });
  });
});
