const toNumberOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const getCode = (v: any): string | number | null => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'string' || typeof v === 'number') return v;
  if (typeof v === 'object') {
    if ('lineBusinessId' in v && v.lineBusinessId != null)
      return v.lineBusinessId;
    if ('code' in v && v.code != null) return v.code;
    if ('id' in v && v.id != null) return v.id;
    if ('value' in v && v.value != null) return v.value;
    if ('key' in v && v.key != null) return v.key;
  }
  return null;
};

const toDDMMYYYY = (input: any): string | null => {
  if (!input) return null;
  if (typeof input === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(input))
    return input;
  if (typeof input === 'string' && /^\d{4}[-/]\d{2}[-/]\d{2}$/.test(input)) {
    const [y, m, d] = input.split(/[-/]/).map(Number);
    if (!y || !m || !d) return null;
    const dd = String(d).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${dd}/${mm}/${y}`;
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    const d = String(input.getDate()).padStart(2, '0');
    const m = String(input.getMonth() + 1).padStart(2, '0');
    const y = input.getFullYear();
    return `${d}/${m}/${y}`;
  }
  const dt = new Date(input);
  if (!isNaN(dt.getTime())) {
    const d = String(dt.getDate()).padStart(2, '0');
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const y = dt.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return null;
};

const mapAccountTypeToService = (v: any): string | null => {
  if (v == null || v === '') return null;
  const n = Number(v);
  if (n === 1 || n === 2) return String(n);
  const s = String(v).toLowerCase().trim();
  if (s === 'individual') return '1';
  if (
    s === 'coholders' ||
    s === 'cotitulares' ||
    s === 'cuenta con cotitulares'
  )
    return '2';
  return null;
};

const prospectSectorMapToCode: Record<string, string> = {
  privado: '13',
  público: '99',
};

const riskGroupMapToCode: Record<string, string> = {
  bajo: '01',
  medio: '05',
  alto: '09',
};

const mapLabelToCode = (
  input: any,
  labelToCodeMap: Record<string, string>,
): string | number | null => {
  const code = getCode(input);
  if (code !== null) return code;
  if (typeof input === 'string') {
    const key = input.toLowerCase().trim();
    return labelToCodeMap[key] ?? null;
  }
  return null;
};

export function creditDataMapToServicePF(form: any, table: any): any {
  const f = form ?? {};

  const payload: BackendCreditData = {
    generalData: {
      economicActivity: getCode(f.economicActivity),
      economicSector: mapLabelToCode(f.prospectSector, prospectSectorMapToCode),
      accountType: mapAccountTypeToService(f.accountType) ?? '1',
      yearsOfOperation: toNumberOrNull(f.operationYears),
      riskGroup: mapLabelToCode(f.riskGroup, riskGroupMapToCode),
      numberOfEconomicDependents: toNumberOrNull(f.dependents),
    },
    employmentData: {
      salaried: typeof f.salaried === 'boolean' ? f.salaried : null,
      hiringDate: toDDMMYYYY(f.hiringDate),
      salary: toNumberOrNull(f.salary),
      paymentPeriod: f.paymentPeriod ?? null,
      paymentCurrencyType: f.paymentCurrencyType ?? null,
      employeeNumber: (f.employeeNumber ?? '').trim() || null,
      socialSecurityNumber: (f.socialSecurityNumber ?? '').trim() || null,
    },
  };

  if (Array.isArray(table) && table.length) {
    payload.officers = table.map((row: any) => ({
      firstName: (row.firstName ?? '').trim(),
      middleName: (row.middleName ?? '').trim(),
      firstSurname: (row.firstSurname ?? '').trim(),
      secondSurname: (row.secondSurname ?? '').trim(),
      nationality: getCode(row.nationality),
      currentPosition: (row.currentPosition ?? '').trim(),
      positionYears: toNumberOrNull(row.positionYears),
      industryYears: toNumberOrNull(row.industryYears),
    }));
  }

  return payload;
}

type BackendCreditData = {
  generalData?: {
    economicActivity: string | number | null;
    economicSector: string | number | null;
    accountType: string | number;
    yearsOfOperation: number | string | null;
    riskGroup: string | number | null;
    numberOfEconomicDependents: number | string | null;
  };
  employmentData: {
    salaried: boolean | null;
    hiringDate: string | null;
    salary: number | string | null;
    paymentPeriod: string | number | null;
    paymentCurrencyType: string | number | null;
    employeeNumber: string | null;
    socialSecurityNumber: string | null;
  };
  officers?: Array<any>;
  active?: boolean | null;
};