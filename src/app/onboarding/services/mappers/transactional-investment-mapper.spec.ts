// transactional-investment.mapper.spec.ts
import { FormControl, FormGroup } from '@angular/forms';

import {
  transactionalInvestmentSectionToCheckpoint,
  checkpointToTransactionalInvestmentSection,
  getAnswer,
  getHolderOption,
  getCoHoldersOptions,
} from './transactional-investment-mapper';

// Ajusta estos imports a tus rutas reales
import { TransactionalInvestmentProfileCheckpoint } from '../../models/checkpoints/transactional-investment-profile-checkpoint';
import { Ranges } from '../../models/origin-resource';

describe('transactionalInvestment mapper', () => {
  describe('getAnswer', () => {
    it('debe convertir un string numérico puro a number', () => {
      expect(getAnswer('0')).toBe(0);
      expect(getAnswer('123')).toBe(123);
      expect(typeof getAnswer('123')).toBe('number');
    });

    it('debe retornar el mismo valor si no es un número puro', () => {
      expect(getAnswer('ABC')).toBe('ABC');
      expect(getAnswer('12A')).toBe('12A');
      expect(getAnswer('01')).toBe('01'); // no cumple la regex de número puro
    });
  });

  describe('getHolderOption', () => {
    it('debe construir correctamente la opción del titular', () => {
      const data: any = {
        firstName: 'Juan',
        middleName: 'Carlos',
        firstLastName: 'Pérez',
        secondLastName: 'López',
        id: 99,
      };

      const result = getHolderOption(data);

      expect(result).toEqual({
        text: 'Juan Carlos Pérez López',
        value: 99,
      });
    });
  });

  describe('getCoHoldersOptions', () => {
    it('debe retornar [] si no hay cotitulares', () => {
      expect(getCoHoldersOptions([])).toEqual([]);
      expect(getCoHoldersOptions(null as any)).toEqual([]);
      expect(getCoHoldersOptions(undefined as any)).toEqual([]);
    });

    it('debe mapear correctamente los cotitulares', () => {
      const coHolders: any[] = [
        {
          cotitularNumber: 1,
          dataSection: {
            firstName: 'Ana',
            middleName: 'María',
            firstLastName: 'Gómez',
            secondLastName: 'Ruiz',
          },
        },
        {
          cotitularNumber: 2,
          dataSection: {
            firstName: 'Luis',
            middleName: '',
            firstLastName: 'Torres',
            secondLastName: 'Díaz',
          },
        },
      ];

      const result = getCoHoldersOptions(coHolders);

      expect(result).toEqual([
        {
          text: 'Ana María Gómez Ruiz',
          value: 1,
        },
        {
          text: 'Luis  Torres Díaz',
          value: 2,
        },
      ]);
    });
  });

  describe('transactionalInvestmentSectionToCheckpoint', () => {
    it('debe mapear correctamente el formulario al checkpoint', () => {
      const transactionalForm = {
        '1': 'SI',
        '2': 10,
        '13032': 'MIFID',
        transactionalLimit: 5000,
      };

      const profileRating = jasmine.createSpy('profileRating').and.returnValue('A1');

      const selectedResources: any[] = [
        { active: true, type: '1', percentage: 60 },
        { active: true, type: '2', percentage: 40 },
        { active: false, type: '3', percentage: 10 },
      ];

      const investmentProfile = new FormGroup({
        service: new FormControl('SERVICIO_X'),
        subtype: new FormControl('SUBTIPO_Y'),
      });

      const result = transactionalInvestmentSectionToCheckpoint(
        transactionalForm,
        profileRating,
        selectedResources,
        investmentProfile,
        'QUIZ-123',
        'PERSONA_FISICA',
      );

      expect(result).toEqual({
        customerType: 'SERVICIO_X',
        customerSubtype: 'SUBTIPO_Y',
        investmentProfile: 'A1',
        manageInvestmentsVia: 'MIFID',
        questionnaire: [
          { idQuestion: '1', idAnswer: 'SI' },
          { idQuestion: '2', idAnswer: '10' },
          { idQuestion: '21', idAnswer: '5000' },
        ],
        originResource: [
          { idOriginResource: '1', percentage: '60' },
          { idOriginResource: '2', percentage: '40' },
        ],
        salesPracticeRate: 'A1',
        salesPracticePersonType: 'PERSONA_FISICA',
        salesPracticeIdQuiz: 'QUIZ-123',
      });

      expect(profileRating).toHaveBeenCalled();
    });

    it('debe usar "0" si profileRating devuelve null o undefined', () => {
      const transactionalForm = {
        '13032': 'WEB',
        transactionalLimit: '',
      };

      const profileRating = jasmine.createSpy('profileRating').and.returnValue(null);

      const selectedResources: any[] = [];
      const investmentProfile = new FormGroup({
        service: new FormControl('SERVICIO'),
        subtype: new FormControl('SUBTIPO'),
      });

      const result = transactionalInvestmentSectionToCheckpoint(
        transactionalForm,
        profileRating,
        selectedResources,
        investmentProfile,
        'QUIZ-1',
      );

      expect(result.investmentProfile).toBe('0');
      expect(result.salesPracticeRate).toBe('');
    //   expect(result.questionnaire).toEqual([
    //     { idQuestion: '21', idAnswer: '1' },
    //   ]);
    });

    it('debe convertir transactionalLimit a string cuando existe', () => {
      const transactionalForm = {
        transactionalLimit: 1200,
      };

      const profileRating = jasmine.createSpy('profileRating').and.returnValue('2');
      const selectedResources: any[] = [];
      const investmentProfile = new FormGroup({
        service: new FormControl('SERVICIO'),
        subtype: new FormControl('SUBTIPO'),
      });

      const result = transactionalInvestmentSectionToCheckpoint(
        transactionalForm,
        profileRating,
        selectedResources,
        investmentProfile,
        'QUIZ-X',
      );

      expect(result.questionnaire).toEqual([
        { idQuestion: '21', idAnswer: '1200' },
      ]);
    });

    it('debe mapear originResource solo para recursos activos', () => {
      const transactionalForm = {
        '13032': 'APP',
        transactionalLimit: 100,
      };

      const profileRating = jasmine.createSpy('profileRating').and.returnValue('1');
      const selectedResources: any[] = [
        { active: true, type: 'A', percentage: 10 },
        { active: false, type: 'B', percentage: 20 },
        { active: true, type: 'C', percentage: null },
      ];

      const investmentProfile = new FormGroup({
        service: new FormControl('S1'),
        subtype: new FormControl('S2'),
      });

      const result = transactionalInvestmentSectionToCheckpoint(
        transactionalForm,
        profileRating,
        selectedResources,
        investmentProfile,
        'QUIZ-9',
      );

      expect(result.originResource).toEqual([
        { idOriginResource: 'A', percentage: '10' },
        { idOriginResource: 'C', percentage: '' },
      ]);
    });
  });

  describe('checkpointToTransactionalInvestmentSection', () => {
    // it('debe convertir checkpoint a modelo de investment profile', () => {
    //   spyOn(crypto, 'randomUUID').and.returnValue('123e4567-e89b-12d3-a456-426614174000');

    //   const request: TransactionalInvestmentProfileCheckpoint = {
    //     customerType: 'SERVICIO',
    //     customerSubtype: 'SUBTIPO',
    //     investmentProfile: 'A1',
    //     manageInvestmentsVia: 'MIFID',
    //     questionnaire: [],
    //     originResource: [
    //       { idOriginResource: '999', percentage: '10' }
    //     ],
    //     salesPracticeRate: 'A1',
    //     salesPracticePersonType: 'PERSONA_FISICA',
    //     salesPracticeIdQuiz: 'QUIZ-123',
    //   } as any;

    //   const ranges: Ranges[] = [
    //     { rangeId: '1', description: 'Banco' } as any,
    //     { rangeId: '2', description: 'Casa de bolsa' } as any,
    //   ];

    //   const result = checkpointToTransactionalInvestmentSection(request, ranges);
    //   console.log(result);

    //   expect(result).toEqual({
    //     investmentProfile: {
    //       service: 'SERVICIO',
    //       subtype: 'SUBTIPO',
    //     },
    //     investmentProfileQuiz: [],
    //     maintenanceQuiz: null,
    //     transactionalProfile: {
    //       1: 'SI',
    //       2: 10,
    //       21: 5000
    //     },
    //     transactionalResources: [
    //       {
    //         type: '999',
    //         percentage: '10',
    //         active: true,
    //         text: '',
    //         id: '123e4567-e89b-12d3-a456-426614174000',
    //       },
    //     ],
    //     investmentQuizId: 0,
    //     profileRating: 'A1',
    //     investmentQuizCompleted: true,
    //     onWorkFlow: false,
    //   });
    // });

    it('debe convertir transactionalLimit desde la pregunta 21 usando getAnswer', () => {
      const request: any = {
        customerType: 'SERVICIO',
        customerSubtype: 'SUBTIPO',
        investmentProfile: '1',
        manageInvestmentsVia: 'WEB',
        questionnaire: [
          { idQuestion: '21', idAnswer: '2500' },
          { idQuestion: '3', idAnswer: 'x' },
        ],
        originResource: [],
      };

      const result = checkpointToTransactionalInvestmentSection(request, []);

      expect(result.transactionalProfile.transactionalLimit).toBe(2500);
    });

    it('debe poner investmentQuizCompleted en false si no hay investmentProfile', () => {
      const request: any = {
        customerType: 'SERVICIO',
        customerSubtype: 'SUBTIPO',
        investmentProfile: '',
        manageInvestmentsVia: 'WEB',
        questionnaire: [],
        originResource: [],
      };

      const result = checkpointToTransactionalInvestmentSection(request, []);

      expect(result.investmentQuizCompleted).toBeFalse();
      expect(result.profileRating).toBe('');
    });

    it('debe usar descripción vacía si no encuentra rangeId en ranges', () => {
      spyOn(crypto, 'randomUUID').and.returnValue('123e4567-e89b-12d3-a456-426614174000');

      const request: any = {
        customerType: 'SERVICIO',
        customerSubtype: 'SUBTIPO',
        investmentProfile: 'A1',
        manageInvestmentsVia: 'MIFID',
        questionnaire: [],
        originResource: [
          { idOriginResource: '999', percentage: '10' },
        ],
      };

      const result = checkpointToTransactionalInvestmentSection(request, []);

      expect(result.transactionalResources).toEqual([
        {
          type: '999',
          percentage: '10',
          active: true,
          text: '',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      ]);
    });
  });
});
