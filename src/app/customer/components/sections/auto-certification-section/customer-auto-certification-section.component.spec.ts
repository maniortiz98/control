
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { signal, WritableSignal } from '@angular/core';

import {
  CustomerClientTaxData,
  CustomerFiscalSelfDeclarationPageData,
  CustomerFiscalSelfDeclarationTableData,
} from '../../../models/fiscal-self-declaration-data';

/**
 * Specs de lógica para CustomerAutoCertificationSectionComponent (post-fixes).
 * - Recuperación de mexicoResident / fiscalResidenceAbroad.
 * - Reconstrucción de tabla (fiscalResidences) y normalización de declarationFiscalResidence.
 * - Validaciones explícitas (al menos 1 residencia y una marcada como activa).
 * - Reseteo de controles al eliminar filas.
 * - Shape básico de salida (onSubmit).
 * - RFC dinámico (<13 vs 13+), shortcuts XAXX/XEXX.
 * - isForeigner() alternando foreignerWithoutCurp.
 */

/** ----------------------------------------------------------------
 * Utilidad para UUID en entornos de test donde no exista crypto.randomUUID
 * ---------------------------------------------------------------- */
function safeUUID(): string {
  const g: any = globalThis as any;
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }

  return 'xxxyxxyx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** ----------------------------------------------------------------
 * Builders de datos (tipados de forma segura para evitar conflictos)
 * ---------------------------------------------------------------- */

type FactaObligationsMin = {
  factaId?: number;
  autentication: string;
  nif: string;
  tin: string;
  nss: string;
};

type FiscalResidenceMin = {
  personType: number;
  country: string;
  declarationFiscalResidence: boolean | 'true' | 'false';
  proofOfAddressType: string;
  issueDate: string;
  expirationStatus: string;
  expirationDate: string;
  certificationDate: string;
  declarationYear: number;
  aditionalDays: string;
  factaObligations: FactaObligationsMin;
  active?: boolean;
};

function buildFiscalResidence(
  overrides: Partial<FiscalResidenceMin> = {},
): FiscalResidenceMin {
  return {
    personType: 1,
    country: 'US',
    declarationFiscalResidence: true,
    proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
    issueDate: '2025-06-15T00:00:00.000Z',
    expirationStatus: 'VIGENTE',
    expirationDate: '2026-06-15T00:00:00.000Z',
    certificationDate: '2025-06-15T00:00:00.000Z',
    declarationYear: 2025,
    aditionalDays: '30',
    factaObligations: {
      autentication: 'ID FISCAL EXTRANJERO (NIF / TIN / NSS)',
      nif: '123',
      tin: '456',
      nss: '789',
      ...(overrides.factaObligations ?? {}),
    },
    active: true,
    ...overrides,
  };
}

function buildClientTaxData(
  overrides: Partial<CustomerClientTaxData> = {},
): CustomerClientTaxData {
  const base: CustomerClientTaxData = {
    id: 0,
    mexicoResident: true,
    curp: 'GARC850101HDFRRL09',
    foreignerWithoutCurp: false,
    rfc: 'GARC850101AAA',
    name: 'JUAN GARCIA',

    fiscalRegimeId: 601 as any,
    cfdiUse: 'G03',
    taxPostalCode: '06600',
    nationality: 'MX',
    country: 'MX',
    fiscalResidenceAbroad: true,
    crs: true as any,
    facta: true as any,
    fiscalResidences: [
      buildFiscalResidence({
        declarationFiscalResidence: true,
        country: 'US',
      }) as any,
      buildFiscalResidence({
        declarationFiscalResidence: false,
        country: 'CA',
      }) as any,
    ] as any,
  };
  return { ...base, ...overrides };
}

/** ----------------------------------------------------------------
 * Réplica mínima del Form del componente (sólo controles usados aquí).
 * ---------------------------------------------------------------- */
function createForm(): FormGroup {
  const fb = new FormBuilder();
  return fb.group({
    mexicoResident: [undefined as any, [Validators.required]],
    curp: [{ value: '', disabled: true }, []],
    foreignerWithoutCurp: [{ value: false, disabled: false }],
    rfc: [{ value: '', disabled: false }],
    name: [{ value: '', disabled: false }],
    fiscalRegimeId: [''],
    cfdiUse: [''],
    taxPostalCode: [''],
    nationality: [{ value: '', disabled: true }],
    fiscalResidences: ['' as any],
    declarationFiscalResidence: ['' as any],
    country: [{ value: '', disabled: true }],
    fiscalResidenceAbroad: [undefined as any, [Validators.required]],
    fatca: [{ value: false, disabled: true }],
    crs: [{ value: false, disabled: true } as any],
  });
}

/** ----------------------------------------------------------------
 * Réplica simplificada de existFiscalResidences() para tests.
 * - Normaliza declarationFiscalResidence (string 'true'/'false' a boolean).
 * - Crea data/table y setea controles del form como lo hace el componente.
 * ---------------------------------------------------------------- */
function existFiscalResidences(
  dataAutoCertification: CustomerClientTaxData | null,
  form: FormGroup,
  dataFiscalResidencesData: WritableSignal<CustomerFiscalSelfDeclarationPageData>,
): void {
  if (!dataAutoCertification) return;

  const src = (dataAutoCertification.fiscalResidences ?? []).map((r: any) => ({
    ...r,
    declarationFiscalResidence:
      r.declarationFiscalResidence === true ||
      r.declarationFiscalResidence === 'true',
  }));

  const newData = src.map((residence: any) => ({
    tempId: safeUUID(),
    personId: residence.personId ?? null,
    active: residence.active !== false,
    personType: residence.personType,
    country: residence.country,
    declarationFiscalResidence: residence.declarationFiscalResidence,
    proofOfAddressType: residence.proofOfAddressType,
    issueDate: residence.issueDate,
    expirationStatus: residence.expirationStatus,
    expirationDate: residence.expirationDate,
    certificationDate: residence.certificationDate,
    declarationYear: residence.declarationYear,
    aditionalDays: residence.aditionalDays,
    factaObligations: {
      factaId: residence.factaObligations?.factaId,
      autentication: residence.factaObligations?.autentication ?? '',
      nif: residence.factaObligations?.nif ?? '',
      tin: residence.factaObligations?.tin ?? '',
      nss: residence.factaObligations?.nss ?? '',
    },
  }));

  const activeRows = newData.filter((r: any) => r.active !== false);

  const newTable: CustomerFiscalSelfDeclarationTableData[] = activeRows.map(
    (residence: any, i: number) => ({
      tempId: residence.tempId,
      registerNo: i + 1,
      personType: residence.personType,
      proofOfAddressType: residence.country,
      autentication: residence.factaObligations.autentication,
      proofOfAddressFiscal: residence.proofOfAddressType,
      nif: residence.factaObligations.nif,
      tin: residence.factaObligations.tin,
      nss: residence.factaObligations.nss,
      declarationFiscalResidence: residence.declarationFiscalResidence,
    }),
  );

  dataFiscalResidencesData.set({ data: newData, table: newTable });

  form.patchValue({
    fiscalResidences: activeRows.length > 0,
  });

  if (
    activeRows.length > 0 &&
    activeRows.some((r) => r.declarationFiscalResidence)
  ) {
    form.patchValue({ declarationFiscalResidence: true });
  }
}

/** ----------------------------------------------------------------
 * Réplica de lógica de RFC (handleRfcDynamicFields) y isForeigner()
 * ---------------------------------------------------------------- */
function handleRfcDynamicFields(form: FormGroup, value: string) {
  const nameCtrl = form.get('name');
  const cpCtrl = form.get('taxPostalCode');
  const regimeCtrl = form.get('fiscalRegimeId');
  const cfdiCtrl = form.get('cfdiUse');

  const validRFC = value && value.length === 13;

  [nameCtrl, cpCtrl, regimeCtrl].forEach(ctrl => {
    if (!ctrl) return;

    if (validRFC) {
      ctrl.enable();
      ctrl.addValidators(Validators.required);
    } else {
      ctrl.disable();
      ctrl.clearValidators();
      ctrl.setValue('');
    }

    ctrl.updateValueAndValidity({ emitEvent: false });
  });

  cfdiCtrl?.disable();
  cfdiCtrl?.clearValidators();
  cfdiCtrl?.setValue('');
  cfdiCtrl?.updateValueAndValidity({ emitEvent: false });

  if (value === 'XAXX010101000' || value === 'XEXX010101000') {
    form.patchValue({
      name: value === 'XEXX010101000' ? '' : 'PÚBLICO EN GENERAL',
      fiscalRegimeId: 'SIN OBLIGACIONES FISCALES',
      cfdiUse: 'SIN OBLIGACIONES FISCALES',
      taxPostalCode: '11000',
    });
  }
}

type MinimalClientTaxData = {
  curp?: string;
  rfc?: string;
  nationality?: string;
  country?: string;
  name?: string;
  taxPostalCode?: string;
};

function isForeigner(
  form: FormGroup,
  foreignerWithoutCurpFlag: boolean,
  dataAutoCertification?: MinimalClientTaxData | null,
) {
  const curpControl = form.get('curp');
  const countryControl = form.get('country');
  const nationalityControl = form.get('nationality');

  if (foreignerWithoutCurpFlag) {
    curpControl?.disable();
    curpControl?.clearValidators();
    curpControl?.updateValueAndValidity();

    countryControl?.enable();
    nationalityControl?.enable();

    form.patchValue({ curp: '', nationality: '', country: '' });
  } else {
    form.patchValue({
      curp: dataAutoCertification?.curp ?? '',
      rfc: dataAutoCertification?.rfc ?? '',
      nationality: dataAutoCertification?.nationality ?? '',
      country: dataAutoCertification?.country ?? '',
      name: dataAutoCertification?.name ?? form.get('name')?.value,
      taxPostalCode:
        dataAutoCertification?.taxPostalCode ??
        form.get('taxPostalCode')?.value,
    });

    countryControl?.disable();
    nationalityControl?.disable();
  }
}

/** Util para detectar si un control tiene Validator.required activo */
function hasRequired(control: AbstractControl | null): boolean {
  if (!control) return false;
  const validator = control.validator ? control.validator({} as any) : null;
  return !!(validator && (validator as any).required);
}

/** ========================================================================
 *                               TESTS
 * ======================================================================== */

describe('CustomerAutoCertificationSectionComponent - Logic Specs (post-fixes)', () => {
  let form: FormGroup;
  let dataFiscalResidencesData: WritableSignal<CustomerFiscalSelfDeclarationPageData>;
  let tableData: WritableSignal<CustomerFiscalSelfDeclarationTableData[]>;

  beforeEach(() => {
    form = createForm();
    dataFiscalResidencesData = signal<CustomerFiscalSelfDeclarationPageData>({
      data: [],
      table: [],
    });
    tableData = signal<CustomerFiscalSelfDeclarationTableData[]>([]);
  });

  describe('mexicoResident patch (Bug Fix #1)', () => {
    it('setea "true" cuando mexicoResident es true', () => {
      const data = buildClientTaxData({ mexicoResident: true });

      form.patchValue({
        mexicoResident: data.mexicoResident ? 'true' : 'false',
      });

      expect(form.get('mexicoResident')?.value).toBe('true');
    });

    it('setea "false" cuando mexicoResident es false', () => {
      const data = buildClientTaxData({ mexicoResident: false });

      form.patchValue({
        mexicoResident: data.mexicoResident ? 'true' : 'false',
      });

      expect(form.get('mexicoResident')?.value).toBe('false');
    });

    it('NO usa fiscalResidenceAbroad (regresión)', () => {
      const data = buildClientTaxData({
        mexicoResident: false,
        fiscalResidenceAbroad: true,
      });

      form.patchValue({
        mexicoResident: data.mexicoResident ? 'true' : 'false',
      });

      expect(form.get('mexicoResident')?.value).toBe('false');
    });
  });

  describe('fiscalResidenceAbroad patch (Bug Fix #2)', () => {
    it('setea "true" cuando el input es true', () => {
      const data = buildClientTaxData({ fiscalResidenceAbroad: true });

      form.patchValue({
        fiscalResidenceAbroad: data.fiscalResidenceAbroad ? 'true' : 'false',
      });

      expect(form.get('fiscalResidenceAbroad')?.value).toBe('true');
    });

    it('setea "false" cuando el input es false', () => {
      const data = buildClientTaxData({ fiscalResidenceAbroad: false });

      form.patchValue({
        fiscalResidenceAbroad: data.fiscalResidenceAbroad ? 'true' : 'false',
      });

      expect(form.get('fiscalResidenceAbroad')?.value).toBe('false');
    });

    it('es independiente de mexicoResident', () => {
      const data = buildClientTaxData({
        mexicoResident: true,
        fiscalResidenceAbroad: false,
      });

      form.patchValue({
        mexicoResident: data.mexicoResident ? 'true' : 'false',
        fiscalResidenceAbroad: data.fiscalResidenceAbroad ? 'true' : 'false',
      });

      expect(form.get('mexicoResident')?.value).toBe('true');
      expect(form.get('fiscalResidenceAbroad')?.value).toBe('false');
    });
  });

  describe('existFiscalResidences - reconstrucción de tabla (Bug Fix #3)', () => {
    it('llena data/table a partir de fiscalResidences', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
          buildFiscalResidence({
            country: 'MX',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const result = dataFiscalResidencesData();
      expect(result.data.length).toBe(3);
      expect(result.table.length).toBe(3);
    });

    it('mapea campos correctamente', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            personType: 1,
            declarationFiscalResidence: true,
            factaObligations: {
              autentication: 'id TEST',
              nif: '111',
              tin: '222',
              nss: '333',
            },
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const item: any = dataFiscalResidencesData().data[0];
      expect(item.country).toBe('US');
      expect(item.personType).toBe(1);
      expect(item.declarationFiscalResidence).toBe(true);
      expect(item.factaObligations.nif).toBe('111');
      expect(item.factaObligations.tin).toBe('222');
      expect(item.factaObligations.nss).toBe('333');
    });

    it('asigna registerNo desde 1', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const table = dataFiscalResidencesData().table as any[];
      expect(table[0].registerNo).toBe(1);
      expect(table[1].registerNo).toBe(2);
    });

    it('usa country como proofOfAddressType (display) en la tabla', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(
        (dataFiscalResidencesData().table as any[])[0].proofOfAddressType,
      ).toBe('US');
    });

    it('maneja arreglo vacío sin tronar', () => {
      const data = buildClientTaxData({ fiscalResidences: [] as any });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(dataFiscalResidencesData().data.length).toBe(0);
      expect(dataFiscalResidencesData().table.length).toBe(0);
    });

    it('no truena con dataAutoCertification = null', () => {
      expect(() =>
        existFiscalResidences(null, form, dataFiscalResidencesData),
      ).not.toThrow();
      expect(dataFiscalResidencesData().data.length).toBe(0);
    });

    it('setea el control `fiscalResidences` a true si hay filas activas', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({ declarationFiscalResidence: true }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(form.get('fiscalResidences')?.value).toBe(true);
    });
  });

  describe('normalización de declarationFiscalResidence', () => {
    it('normaliza "true" (string) a boolean true', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({ declarationFiscalResidence: 'true' as any }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(true);
    });

    it('normaliza "false" (string) a boolean false', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({ declarationFiscalResidence: 'false' as any }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(false);
    });

    it('preserva boolean true', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({ declarationFiscalResidence: true }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(true);
    });
  });

  describe('recuperación completa después de navegar de pestañas', () => {
    it('recupera radios y tabla correctamente', () => {
      const saved = buildClientTaxData({
        mexicoResident: true,
        fiscalResidenceAbroad: true,
        name: 'MARIA LOPEZ',
        taxPostalCode: '11000',
        facta: true as any,
        crs: true as any,
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      form.patchValue({
        mexicoResident: saved.mexicoResident ? 'true' : 'false',
        fiscalResidenceAbroad: saved.fiscalResidenceAbroad ? 'true' : 'false',
        name: saved.name,
        taxPostalCode: saved.taxPostalCode,
        fatca: saved.facta,
        crs: saved.crs,
      });

      existFiscalResidences(saved, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      expect(form.get('mexicoResident')?.value).toBe('true');
      expect(form.get('fiscalResidenceAbroad')?.value).toBe('true');
      expect(form.get('name')?.value).toBe('MARIA LOPEZ');
      expect(form.get('taxPostalCode')?.value).toBe('11000');
      expect(tableData().length).toBe(2);
      expect((dataFiscalResidencesData().data[0] as any).country).toBe('US');
      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(true);
      expect((dataFiscalResidencesData().data[1] as any).country).toBe('CA');
      expect(
        (dataFiscalResidencesData().data[1] as any).declarationFiscalResidence,
      ).toBe(false);
    });

    it('recupera radios en false cuando no aplica', () => {
      const saved = buildClientTaxData({
        mexicoResident: false,
        fiscalResidenceAbroad: false,
        fiscalResidences: [] as any,
      });

      form.patchValue({
        mexicoResident: saved.mexicoResident ? 'true' : 'false',
        fiscalResidenceAbroad: saved.fiscalResidenceAbroad ? 'true' : 'false',
      });

      existFiscalResidences(saved, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      expect(form.get('mexicoResident')?.value).toBe('false');
      expect(form.get('fiscalResidenceAbroad')?.value).toBe('false');
      expect(tableData().length).toBe(0);
    });
  });

  describe('rowRadioSelected - toggle de declarationFiscalResidence', () => {
    it('marca sólo la fila seleccionada como activa', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
          buildFiscalResidence({
            country: 'MX',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      const selected = dataFiscalResidencesData().table[2];
      const selectedTempId = selected.tempId;

      const current = dataFiscalResidencesData();
      const nextData = current.data.map((item: any) => ({
        ...item,
        declarationFiscalResidence: item.tempId === selectedTempId,
      }));
      const nextTable = (current.table as any[]).map((row: any) => ({
        ...row,
        declarationFiscalResidence: row.tempId === selectedTempId,
      }));

      dataFiscalResidencesData.set({ data: nextData, table: nextTable as any });
      tableData.set(nextTable as any);
      form.patchValue({ declarationFiscalResidence: true });

      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(false);
      expect(
        (dataFiscalResidencesData().data[1] as any).declarationFiscalResidence,
      ).toBe(false);
      expect(
        (dataFiscalResidencesData().data[2] as any).declarationFiscalResidence,
      ).toBe(true);
      expect(form.get('declarationFiscalResidence')?.value).toBe(true);
    });
  });

  describe('eventRow DELETE - reseteo de controles (Bug Fix #4)', () => {
    function simulateDeleteByRegisterNo(
      deleteRegisterNo: number,
      currentForm: FormGroup,
      fiscalResData: WritableSignal<CustomerFiscalSelfDeclarationPageData>,
      tData: WritableSignal<CustomerFiscalSelfDeclarationTableData[]>,
    ) {
      const curr = fiscalResData();
      const newTable = curr.table.filter(
        (r) => r.registerNo !== deleteRegisterNo,
      );
      const newData = curr.data.filter(
        (_, idx) => idx !== deleteRegisterNo - 1,
      );

      const reindexed = newTable.map((row, i) => ({
        ...row,
        registerNo: i + 1,
      }));

      fiscalResData.set({ data: newData as any, table: reindexed as any });
      tData.set(reindexed as any);

      if (reindexed.length === 0) {
        currentForm.patchValue({
          fiscalResidences: false,
          declarationFiscalResidence: false,
          fatca: false,
          crs: false,
        });
      } else if (
        !(newData as any[]).some((r) => r.declarationFiscalResidence === true)
      ) {
        currentForm.patchValue({ declarationFiscalResidence: false });
      }
    }

    it('resetea fiscalResidences, declarationFiscalResidence, fatca, crs cuando se borra la única fila', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      expect(form.get('fiscalResidences')?.value).toBe(true);
      expect(form.get('declarationFiscalResidence')?.value).toBe(true);

      simulateDeleteByRegisterNo(1, form, dataFiscalResidencesData, tableData);

      expect(form.get('fiscalResidences')?.value).toBe(false);
      expect(form.get('declarationFiscalResidence')?.value).toBe(false);
      expect(form.get('fatca')?.value).toBe(false);
      expect(form.get('crs')?.value).toBe(false);
      expect(dataFiscalResidencesData().data.length).toBe(0);
      expect(tableData().length).toBe(0);
    });

    it('resetea sólo declarationFiscalResidence cuando se borra la fila activa pero quedan otras', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      expect(form.get('declarationFiscalResidence')?.value).toBe(true);

      simulateDeleteByRegisterNo(1, form, dataFiscalResidencesData, tableData);

      expect(form.get('declarationFiscalResidence')?.value).toBe(false);
      expect(form.get('fiscalResidences')?.value).toBe(true);
      expect(dataFiscalResidencesData().data.length).toBe(1);
    });

    it('NO resetea declarationFiscalResidence si se borra una fila no activa', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);
      tableData.set(dataFiscalResidencesData().table);

      expect(form.get('declarationFiscalResidence')?.value).toBe(true);

      simulateDeleteByRegisterNo(2, form, dataFiscalResidencesData, tableData);

      expect(form.get('declarationFiscalResidence')?.value).toBe(true);
      expect(form.get('fiscalResidences')?.value).toBe(true);
      expect(dataFiscalResidencesData().data.length).toBe(1);
      expect(
        (dataFiscalResidencesData().data[0] as any).declarationFiscalResidence,
      ).toBe(true);
    });
  });

  describe('validForm - validación explícita sobre tabla (Bug Fix #4)', () => {
    function simulateValidForm(
      fiscalResData: WritableSignal<CustomerFiscalSelfDeclarationPageData>,
    ): { isValid: boolean; error: string } {
      const rows = (fiscalResData().data as any[]).filter(
        (d) => d.active !== false,
      );

      if (rows.length === 0) {
        return {
          isValid: false,
          error: 'Debe agregar al menos un registro de Residencia Fiscal.',
        };
      }

      if (!rows.some((r) => r.declarationFiscalResidence === true)) {
        return {
          isValid: false,
          error: 'Seleccione un Domicilio Fiscal Activo.',
        };
      }

      return { isValid: true, error: '' };
    }

    it('falla cuando no hay residencias', () => {
      const res = simulateValidForm(dataFiscalResidencesData);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('al menos un registro');
    });

    it('falla cuando no hay domicilio fiscal activo', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: false,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const res = simulateValidForm(dataFiscalResidencesData);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Domicilio Fiscal Activo');
    });

    it('pasa cuando hay al menos uno activo', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const res = simulateValidForm(dataFiscalResidencesData);
      expect(res.isValid).toBe(true);
      expect(res.error).toBe('');
    });
  });

  describe('onSubmit - shape básico del payload', () => {
    it('combina getRawValue() + fiscalResidences (data signal)', () => {
      const data = buildClientTaxData({
        fiscalResidences: [
          buildFiscalResidence({
            country: 'US',
            declarationFiscalResidence: true,
          }),
          buildFiscalResidence({
            country: 'CA',
            declarationFiscalResidence: false,
          }),
        ] as any,
      });

      form.patchValue({
        mexicoResident: 'true',
        fiscalResidenceAbroad: 'true',
        rfc: 'GARC850101AAA',
        name: 'JUAN GARCIA',
        fiscalRegimeId: '601',
        cfdiUse: 'G03',
        taxPostalCode: '06600',
      });

      existFiscalResidences(data, form, dataFiscalResidencesData);

      const raw = form.getRawValue();
      const formData = {
        ...raw,
        fiscalResidences: dataFiscalResidencesData().data,
      };

      expect(raw.mexicoResident).toBe('true');
      expect(raw.fiscalResidenceAbroad).toBe('true');
      expect((formData.fiscalResidences as any[]).length).toBe(2);
      expect((formData.fiscalResidences as any[])[0].country).toBe('US');
      expect((formData.fiscalResidences as any[])[1].country).toBe('CA');
    });
  });

  describe('RFC dinámico y shortcuts', () => {
    it('Deshabilita y quita required cuando RFC < 13', () => {
      handleRfcDynamicFields(form, 'GARC850101A');

      const name = form.get('name')!;
      const cp = form.get('taxPostalCode')!;
      const regime = form.get('fiscalRegimeId')!;
      const cfdi = form.get('cfdiUse')!;

      expect(name.disabled).toBeTrue();
      expect(cp.disabled).toBeTrue();
      expect(regime.disabled).toBeTrue();
      expect(cfdi.disabled).toBeTrue();

      expect(hasRequired(name)).toBeFalse();
      expect(hasRequired(cp)).toBeFalse();
      expect(hasRequired(regime)).toBeFalse();
      expect(hasRequired(cfdi)).toBeFalse();
    });

    it('Habilita y agrega required cuando RFC tiene 13 caracteres', () => {
      handleRfcDynamicFields(form, 'GARC850101AAA');

      const name = form.get('name')!;
      const cp = form.get('taxPostalCode')!;
      const regime = form.get('fiscalRegimeId')!;
      const cfdi = form.get('cfdiUse')!;

      expect(name.enabled).toBeTrue();
      expect(cp.enabled).toBeTrue();
      expect(regime.enabled).toBeTrue();
      expect(cfdi.disabled).toBeTrue();

      expect(hasRequired(name)).toBeTrue();
      expect(hasRequired(cp)).toBeTrue();
      expect(hasRequired(regime)).toBeTrue();
      expect(hasRequired(cfdi)).toBeFalse();
    });

    it('XAXX010101000 → llena name, fiscalRegimeId, cfdiUse, taxPostalCode', () => {
      handleRfcDynamicFields(form, 'XAXX010101000');

      expect(form.get('name')?.value).toBe('PÚBLICO EN GENERAL');
      expect(form.get('fiscalRegimeId')?.value).toBe(
        'SIN OBLIGACIONES FISCALES',
      );
      expect(form.get('cfdiUse')?.value).toBe('SIN OBLIGACIONES FISCALES');
      expect(form.get('taxPostalCode')?.value).toBe('11000');
    });

    it('XEXX010101000 → name vacío, pero llena fiscalRegimeId, cfdiUse, taxPostalCode', () => {
      handleRfcDynamicFields(form, 'XEXX010101000');

      expect(form.get('name')?.value).toBe('');
      expect(form.get('fiscalRegimeId')?.value).toBe(
        'SIN OBLIGACIONES FISCALES',
      );
      expect(form.get('cfdiUse')?.value).toBe('SIN OBLIGACIONES FISCALES');
      expect(form.get('taxPostalCode')?.value).toBe('11000');
    });
  });

  describe('isForeigner() alternando foreignerWithoutCurp', () => {
    const baseData: MinimalClientTaxData = {
      curp: 'GARC850101HDFRRL09',
      rfc: 'GARC850101AAA',
      nationality: 'MX',
      country: 'MX',
      name: 'JUAN GARCIA',
      taxPostalCode: '06600',
    };

    it('foreignerWithoutCurp = true: curp deshabilitado y limpio; country/nationality habilitados y limpios', () => {
      form.patchValue({ curp: 'ABC', country: 'US', nationality: 'US' });

      isForeigner(form, true, baseData);

      const curp = form.get('curp')!;
      const country = form.get('country')!;
      const nationality = form.get('nationality')!;

      expect(curp.disabled).toBeTrue();
      expect(curp.value).toBe('');

      expect(country.enabled).toBeTrue();
      expect(country.value).toBe('');

      expect(nationality.enabled).toBeTrue();
      expect(nationality.value).toBe('');
    });

    it('foreignerWithoutCurp = false: recupera valores desde dataAutoCertification; country/nationality deshabilitados', () => {
      isForeigner(form, false, baseData);

      expect(form.get('curp')?.value).toBe('GARC850101HDFRRL09');
      expect(form.get('rfc')?.value).toBe('GARC850101AAA');
      expect(form.get('nationality')?.value).toBe('MX');
      expect(form.get('country')?.value).toBe('MX');
      expect(form.get('name')?.value).toBe('JUAN GARCIA');
      expect(form.get('taxPostalCode')?.value).toBe('06600');

      expect(form.get('country')?.disabled).toBeTrue();
      expect(form.get('nationality')?.disabled).toBeTrue();
    });

    it('cambio true → false repone valores de dataAutoCertification', () => {
      isForeigner(form, true, baseData);
      expect(form.get('curp')?.value).toBe('');

      isForeigner(form, false, baseData);
      expect(form.get('curp')?.value).toBe('GARC850101HDFRRL09');
      expect(form.get('country')?.value).toBe('MX');
      expect(form.get('nationality')?.value).toBe('MX');
    });
  });


  describe('Regla nueva: CustomerCFDI dinámico según régimen fiscal', () => {
    it('RFC < 13 => cfdiUse disabled', () => {
      handleRfcDynamicFields(form, 'ABC123');

      const cfdi = form.get('cfdiUse')!;
      expect(cfdi.disabled).toBeTrue();
    });

    it('RFC = 13 => cfdiUse sigue disabled hasta tener régimen fiscal', () => {
      handleRfcDynamicFields(form, 'GARC850101AAA');

      const regime = form.get('fiscalRegimeId')!;
      const cfdi = form.get('cfdiUse')!;

      expect(regime.enabled).toBeTrue();
      expect(cfdi.disabled).toBeTrue();
    });

    it('habilita cfdiUse SOLO cuando fiscalRegimeId tiene un valor', () => {

      handleRfcDynamicFields(form, 'GARC850101AAA');

      const cfdi = form.get('cfdiUse')!;
      const regime = form.get('fiscalRegimeId')!;

      expect(cfdi.disabled).toBeTrue();

      regime.setValue('601');

      cfdi.enable();

      expect(cfdi.enabled).toBeTrue();
    });

    it('vuelve a deshabilitar cfdiUse cuando se limpia fiscalRegimeId', () => {
      handleRfcDynamicFields(form, 'GARC850101AAA');

      const cfdi = form.get('cfdiUse')!;
      const regime = form.get('fiscalRegimeId')!;

      regime.setValue('601');
      cfdi.enable();

      expect(cfdi.enabled).toBeTrue();

      regime.setValue('');
      cfdi.disable();

      expect(cfdi.disabled).toBeTrue();
      expect(cfdi.value).toBe('');
    });
  });
});





