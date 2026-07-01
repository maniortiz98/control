export enum CustomerAllowedValuesRfcNifTinNss {
  RFC = "1",
  NIF = "2",
  TIN = "3",
  SSN = "4",
  EIN = "5"
}
export function compareAndReturnRfcNifTinNss(returnValue: string, value1: CustomerAllowedValuesRfcNifTinNss, value2: string): string {
  return value1 === value2 ? returnValue : '';
}

export function compareAndReturnIdRfcNifTinNss(
  rfc: string,
  nif: string,
  tin: string,
  nss: string,
): string {
  if (rfc != "") {
    return CustomerAllowedValuesRfcNifTinNss.RFC;
  } else if (nif != "") {
    return CustomerAllowedValuesRfcNifTinNss.NIF;
  }
  else if (tin != "") {
    return CustomerAllowedValuesRfcNifTinNss.TIN;
  }
  else if (nss != "") {
    return CustomerAllowedValuesRfcNifTinNss.SSN;
  } else {
    return ''
  }
}

export function compareAndReturnValueRfcNifTinNss(
  rfc: string,
  nif: string,
  tin: string,
  nss: string,
): string {
  if (rfc != "") {
    return rfc;
  } else if (nif != "") {
    return nif;
  }
  else if (tin != "") {
    return tin;
  }
  else if (nss != "") {
    return nss;
  } else {
    return ''
  }
}


/**
 * If the "field" matchs the "TypeId", returns the value, else return an empty string.
 */
export function rfcNifTinNssValueByType(field: keyof typeof CustomerAllowedValuesRfcNifTinNss, type: string, value: string): string {
  return CustomerAllowedValuesRfcNifTinNss[field] === type ? value : '';
}
