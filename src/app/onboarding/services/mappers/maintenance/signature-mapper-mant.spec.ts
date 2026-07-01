import {
  checkpointMantToSignSection,
  determineTypeIndent,
  mapCheckpointToSignature,
  mapSignatureToCheckpoint,
  rfcNifTinSsnValue,
  signSectionToCheckpointMant,
} from './signature-mapper-mant';
import { SingSection } from '../../../models/sign-section';
import { SignatureDataCheckpointMant } from '../../../models/checkpoints/maintenance/signature-checkpoint-mant';

describe('signature-mapper-mant', () => {
  describe('mapSignatureToCheckpoint', () => {
    it('debe mapear INDIVIDUAL, MANCOMUNADA y SOLIDARIA a su codigo', () => {
      expect(mapSignatureToCheckpoint('INDIVIDUAL')).toBe('1');
      expect(mapSignatureToCheckpoint('MANCOMUNADA')).toBe('2');
      expect(mapSignatureToCheckpoint('SOLIDARIA')).toBe('3');
    });

    it('debe regresar 0 para valor desconocido', () => {
      expect(mapSignatureToCheckpoint('OTRO')).toBe('0');
    });
  });

  describe('mapCheckpointToSignature', () => {
    it('debe mapear codigos 1,2,3 a su descripcion', () => {
      expect(mapCheckpointToSignature('1')).toBe('INDIVIDUAL');
      expect(mapCheckpointToSignature('2')).toBe('MANCOMUNADA');
      expect(mapCheckpointToSignature('3')).toBe('SOLIDARIA');
    });

    it('debe regresar string vacio para codigo desconocido', () => {
      expect(mapCheckpointToSignature('9')).toBe('');
    });
  });

  describe('determineTypeIndent', () => {
    it('debe priorizar RFC sobre los demas identificadores', () => {
      expect(
        determineTypeIndent({
          rfc: 'RFC1',
          nif: 'NIF1',
          tin: 'TIN1',
          nss: 'NSS1',
        })
      ).toBe('1');
    });

    it('debe regresar vacio cuando no hay identificadores', () => {
      expect(determineTypeIndent({})).toBe('');
    });
  });

  describe('rfcNifTinSsnValue', () => {
    it('debe priorizar RFC sobre NIF/TIN/SSN', () => {
      expect(
        rfcNifTinSsnValue({
          rfc: 'RFC1',
          nif: 'NIF1',
          tin: 'TIN1',
          nss: 'NSS1',
        })
      ).toBe('RFC1');
    });

    it('debe regresar vacio cuando no hay valor', () => {
      expect(rfcNifTinSsnValue({})).toBe('');
    });
  });

  describe('signSectionToCheckpointMant', () => {
    it('debe mapear valores basicos y listas vacias', () => {
      const section: SingSection = {
        id: 100,
        signType: 'MANCOMUNADA',
        instructions: 'Firmar en conjunto',
        titularIpabPercentaje: 30,
        titularIsrPecentaje: 10,
        cotitularList: [],
        cotitularTableList: [],
        attoneryList: [],
        attoneryTableList: [],
      };

      const result = signSectionToCheckpointMant(section);

      expect(result).toEqual({
        id: 100,
        signatureType: '2',
        instructions: 'Firmar en conjunto',
        ipabOwnership: '30',
        isrRetention: '10',
        coHolders: [],
        legalProxy: [],
      });
    });
  });

  describe('checkpointMantToSignSection', () => {
    it('debe mapear valores basicos desde checkpoint y mantener listas vacias', async () => {
      const checkpoint: SignatureDataCheckpointMant = {
        id: 200,
        signatureType: '1',
        instructions: 'Instrucciones',
        ipabOwnership: '45',
        isrRetention: '15',
        coHolders: [],
        legalProxy: [],
      };

      const zipCodeServiceMock = {
        postData: jasmine.createSpy('postData'),
      } as any;

      const result = await checkpointMantToSignSection(
        checkpoint,
        [],
        [],
        [],
        zipCodeServiceMock
      );

      expect(zipCodeServiceMock.postData).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 200,
        signType: 'INDIVIDUAL',
        instructions: 'Instrucciones',
        titularIpabPercentaje: 45,
        titularIsrPecentaje: 15,
        cotitularList: [],
        cotitularTableList: [],
        attoneryList: [],
        attoneryTableList: [],
      });
    });
  });
});
