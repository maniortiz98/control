import moment, { Moment } from "moment";

type ConvertibleDate = string | Date | moment.Moment | null | undefined;
type ConvertDateBackResult = moment.Moment | Date | '';

export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
}

// NUEVO – SOLO PARA FORMULARIOS Y DATEPICKER
export function yearsAgo(years: number = 18, firstDay: boolean = true): Date {
  const today = new Date();
  const target = new Date(today);

  target.setFullYear(today.getFullYear() - years);

  if (firstDay) {
    target.setMonth(0, 1);
  }

  return target;
}


/**
 * @deprecated Use yearsAgo() instead.
 * This function returns a STRING and should not be used with datepickers.
 */

export function yearsAgoLegacy(years: number = 18, firstDay: boolean = true): string {
  const today = new Date();
  const year = today.getFullYear() - years;

  if (firstDay) {
    return `${year}-01-01`;
  }

  return `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}


export function convertDate(input: string | Date | moment.Moment): string | moment.Moment | Date {
  if (typeof input === 'string') {
    const momentDate = moment(input, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
    if (momentDate.isValid()) {
      return momentDate.format('DD/MM/YYYY');
    } else {
      return "";
    }
  } else if (input instanceof Date) {
    return moment(input).format('DD/MM/YYYY');
  } else if (moment.isMoment(input)) {
    return input.format('DD/MM/YYYY');
  } else {
    return "";
  }
}


export function convertDateBack(input: ConvertibleDate): ConvertDateBackResult {
  if (input == null) {
    return '';
  }

  if (typeof input === 'string') {
    const s = input.trim();

    if (s === '') {
      return '';
    }
    const m = moment(s, 'DD/MM/YYYY', true);
    if (m.isValid()) {
      return m;
    }
    return '';
  }

  if (moment.isMoment(input)) {
    return input.isValid() ? input : '';
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? '' : input;
  }
  throw new Error('Tipo de entrada no válido');
}

export function convertDateTwoDigitsToMomentForFiel(input: string): moment.Moment | '' {
  if (input == null) return '';

  const s = input.trim();
  if (s === '') return '';

  const m = moment(s, 'DD/MM/YY', true);
  if (!m.isValid()) return '';

  const yy = m.year() % 100;
  const fullYear = 2000 + yy;

  return m.year(fullYear);
}

export function convertStringToDate(input: string): Date {
  const momentDate = moment(input, 'DD/MM/YYYY', true);
  if (momentDate.isValid()) {
    return momentDate.toDate();
  } else {
    throw new Error('Fecha no válida. Debe estar en formato DD/MM/YYYY');
  }
}

export function convertStringToDateOrEmpty(input: string): Date | undefined{
  const momentDate = moment(input, 'DD/MM/YYYY', true);
  if (momentDate.isValid()) {
    return momentDate.toDate();
  } else {
    return undefined;
  }
}

/**
 * Convert a string date
 *
 * From: "1987-11-10"
 * To: "10/11/1987"
 *
 * 1998-04-21
 * 21/04/1998
 */
export function formatDateSimple(fechaStr: string): string {

  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if( regex.test(fechaStr) ) {
    return fechaStr
  }

  let partes: any = '';
  try {
    partes = fechaStr.split('-');
    partes = `${partes[2]}/${partes[1]}/${partes[0]}`;
  } catch ( err: any ) {
    console.log(err);
    partes = '';
  }
  return partes;
}

/**
 * Convert a string date
 *
 * From: 10/11/1987
 * To: 1987-11-10
 */
export function formatDateYYYYMMDD(fechaStr: string): string {
  try {
    const partes = fechaStr.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  } catch (e) {
    console.log(e);
    return '';
  }
}


/**
 * Convert a Date | moment date to String
 * Return 'DD/MM/YYYY' format.
 *
 */
export function convertDateToStr(input: Date | moment.Moment): string {
  const momentDate = moment(input, 'DD/MM/YYYY');
  if (momentDate.isValid()) {
    return momentDate.toString()
  } else {
    return '';
  }
}

/**
 * Converts Date|Moment to String (format).
 */
export function convertDateTo(input: Date | moment.Moment, format: 'yyyy-mm-dd' | 'dd/mm/yyyy'): string {
  // console.log(input);
  const momentDate = moment(input);
  if ( momentDate.isValid() ) {
    let str = momentDate.toISOString();
    // console.log(str);
    if ( 'yyyy-mm-dd' === format ) {
      return str.split('T')[0];
    }
  } else {
    return '';
  }

  return '';
}

export function toDate(input: ConvertibleDate, format = 'DD/MM/YYYY'): Date | null {
  if (input == null) return null;

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (moment.isMoment(input)) {
    return input.isValid() ? input.toDate() : null;
  }

  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return null;
    const m = moment(s, [format, 'YYYY-MM-DD', moment.ISO_8601], true);
    return m.isValid() ? m.toDate() : null;
  }

  return null;
}

type InputDate = Date | Moment | string;

export function toIsoUtc(input: InputDate, hour = 6): string {
  if (typeof input === "string") {
    const value = input.trim();

    if (value === "") return "";

    // Formato DD/MM/YYYY
    if (value.includes("/")) {
      const parts = value.split("/");
      if (parts.length !== 3) {
        throw new Error("La fecha string debe tener formato DD/MM/YYYY");
      }

      const day = Number(parts[0]);
      const month = Number(parts[1]);
      const year = Number(parts[2]);

      const utcDate = new Date(Date.UTC(year, month - 1, day, hour, 0, 0, 0));
      return utcDate.toISOString();
    }

    // Formato YYYY-MM-DD
    if (value.includes("-")) {
      const parts = value.split("-");
      if (parts.length !== 3) {
        throw new Error("La fecha string debe tener formato YYYY-MM-DD");
      }

      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      const utcDate = new Date(Date.UTC(year, month - 1, day, hour, 0, 0, 0));
      return utcDate.toISOString();
    }

    throw new Error("Formato de fecha string no soportado");
  }

  if (moment.isMoment(input)) {
    const utcDate = new Date(
      Date.UTC(input.year(), input.month(), input.date(), hour, 0, 0, 0)
    );
    return utcDate.toISOString();
  }

  if (input instanceof Date) {
    const utcDate = new Date(
      Date.UTC(
        input.getFullYear(),
        input.getMonth(),
        input.getDate(),
        hour,
        0,
        0,
        0
      )
    );
    return utcDate.toISOString();
  }

  throw new Error("Tipo de fecha no soportado");
}

