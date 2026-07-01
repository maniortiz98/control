import {
  checkpointMantToTransactionaInvestmentProfileSection,
  getAnswer,
  transactionalInvestmentSectionToCheckpointMant,
} from './transactional-investment-profile-mapper-mant';
import { TransactionalInvestmentProfileCheckpointMant } from '../../../models/checkpoints/maintenance/transactional-investment-profile-checkpoint-mant';

describe('transactional-investment-profile-mapper-mant', () => {
  describe('getAnswer', () => {
    it('debe convertir strings numéricos puros a number', () => {
      expect(getAnswer('0')).toBe(0);
      expect(getAnswer('21')).toBe(21);
    });

    it('debe regresar string cuando no es numérico puro', () => {
      expect(getAnswer('A12')).toBe('A12');
      expect(getAnswer('12A')).toBe('12A');
      expect(getAnswer('01')).toBe('01');
    });
  });

  describe('transactionalInvestmentSectionToCheckpointMant', () => {
    it('debe mapear formulario a checkpoint aplicando reglas de cuestionario y recursos', () => {
      const transactionalForm = {
        '1': 2,
        '8': null,
        '13032': 'WEB',
        '999': '',
        transactionalLimit: '100000',
      };

      const profileRating = jasmine.createSpy('profileRating').and.returnValue('5');
      const selectedResources = [
        { id: 'tmp-1', type: '1', percentage: '70', active: true },
        { id: 55, type: '2', percentage: null, active: false },
      ];

      const investmentProfile = { value: { service: 'SERV', subtype: 'SUB' } } as any;
      const maintenanceQuizForm = {
        value: {
          sClient: true,
          mga: false,
          globalFront: true,
          instClient: false,
          instClientPub: true,
          titular: 'H2',
          adendum: false,
          awm: true,
          noInstClient: false,
          instClientFid: true,
        },
      } as any;

      const titulares = [
        { value: 'H1', text: 'Titular Uno' },
        { value: 'H2', text: 'Titular Dos' },
      ] as any;

      const fullData = { practicaVentaId: 999 } as any;

      const result = transactionalInvestmentSectionToCheckpointMant(
        transactionalForm,
        profileRating,
        selectedResources,
        investmentProfile,
        'QUIZ-1',
        maintenanceQuizForm,
        fullData,
        titulares,
        'PF'
      );

      expect(result).toEqual({
        practicaVentaId: 999,
        customerType: 'SERV',
        customerSubtype: 'SUB',
        investmentProfile: '5',
        manageInvestmentsVia: 'WEB',
        questionnaire: [
          { idQuestion: '1', idAnswer: '2' },
          { idQuestion: '8', idAnswer: '' },
          { idQuestion: '21', idAnswer: '100000' },
        ],
        originResource: [
          { active: true, idOriginResource: '1', percentage: '70', idOrigin: null },
          { active: false, idOriginResource: '2', percentage: '', idOrigin: 55 },
        ],
        salesPracticeRate: '5',
        salesPracticePersonType: 'PF',
        salesPracticeIdQuiz: 'QUIZ-1',
        sofclient: true,
        marcoGeneral: false,
        globalFront: true,
        clientInst: false,
        clientInstPub: true,
        titularName: 'Titular Dos',
        adendum: false,
        cobroAsset: true,
        clientInstNot: false,
        clientFidu: true,
      });
    });

    it('debe usar defaults cuando profileRating está vacío', () => {
      const result = transactionalInvestmentSectionToCheckpointMant(
        { '13032': 1, transactionalLimit: '' },
        () => '',
        [],
        { value: { service: 'A', subtype: 'B' } } as any,
        'QUIZ-2',
        { value: {} } as any,
        null,
        [],
      );

      expect(result.investmentProfile).toBe('1');
      expect(result.salesPracticeRate).toBe('');
      expect(result.questionnaire.find(q => q.idQuestion === '21')?.idAnswer).toBeNull();
    });
  });

  describe('checkpointMantToTransactionaInvestmentProfileSection', () => {
    it('debe mapear checkpoint a sección y resolver textos de recursos', () => {
      const checkpoint: TransactionalInvestmentProfileCheckpointMant = {
        practicaVentaId: 88,
        customerType: 'SERV',
        customerSubtype: 'SUB',
        investmentProfile: '4',
        manageInvestmentsVia: 'BRANCH',
        questionnaire: [
          { idQuestion: '1', idAnswer: '2' },
          { idQuestion: '21', idAnswer: '50000' },
        ],
        originResource: [
          { idOrigin: 11, idOriginResource: '1', percentage: '60', active: true },
          { idOrigin: null, idOriginResource: '3', percentage: '40', active: false },
        ],
        salesPracticeRate: '4',
        salesPracticeIdQuiz: 'QUIZ-3',
        salesPracticePersonType: 'PM',
        sofclient: true,
        marcoGeneral: false,
        globalFront: true,
        clientInst: true,
        clientInstPub: false,
        titularName: 'Titular Uno',
        adendum: true,
        cobroAsset: false,
        clientInstNot: false,
        clientFidu: true,
      };

      const ranges = [
        { rangeId: '1', description: 'Sueldo' },
        { rangeId: '3', description: 'Inversiones' },
      ];

      const result = checkpointMantToTransactionaInvestmentProfileSection(checkpoint, ranges);

      expect(result.investmentProfile).toEqual({ service: 'SERV', subtype: 'SUB' });
      expect(result.transactionalProfile[1]).toBe(2);
      expect(result.transactionalProfile[21]).toBe(50000);
      expect(result.transactionalProfile[13032]).toBe('BRANCH');
      expect(result.transactionalProfile.transactionalLimit).toBe(50000);
      expect(result.maintenanceQuiz).toEqual({
        sClient: true,
        adendum: true,
        mga: false,
        awm: false,
        globalFront: true,
        titular: 'Titular Uno',
        notApply: false,
        instClient: true,
        noInstClient: false,
        instClientPub: false,
        instClientFid: true,
      });
      expect(result.transactionalResources).toEqual([
        { type: '1', percentage: '60', active: true, text: 'Sueldo', id: 11 },
        { type: '3', percentage: '40', active: false, text: 'Inversiones', id: null },
      ]);
      expect(result.investmentQuizCompleted).toBeTrue();
      expect(result.practicaVentaId).toBe(88);
      expect(result.profileRating).toBe('4');
    });
  });
});
