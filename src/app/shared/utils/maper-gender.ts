export enum AllowedValuesGenders {
  H = 2,
  M = 1,
  X = 3
}

export enum AllowedGenders {
  H = 'H',
  M = 'M',
  X = 'X'
}

export enum AllowedFullTextGenders {
  H = 'Masculino',
  M = 'Femenino',
  X = 'No Binario'
}

export function compareAndReturnGender(value: string): number {
  switch (value.toUpperCase()) {
    case 'H':
      return AllowedValuesGenders.H;
    case 'M':
      return AllowedValuesGenders.M;
    case 'X':
      return AllowedValuesGenders.X;
    default:
      return 0;
  }
}


export function compareGenderAndReturnValue(value: number): string {
  switch (value) {
    case 2:
      return AllowedGenders.H;
    case 1:
      return AllowedGenders.M;
    case 3:
      return AllowedGenders.X;
    default:
      return '';
  }
}

export function compareGenderFullText(value: string): string {
  switch (value) {
    case '2':
      return AllowedFullTextGenders.H;
    case '1':
      return AllowedFullTextGenders.M;
    case '3':
      return AllowedFullTextGenders.X;
    default:
      return '';
  }
}

type InputValue = string | number | null | undefined;

export function mapValueGender(value: InputValue): string {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "string" && ["H", "M", "X"].includes(value)) {
    return value;
  }

  const map: Record<string, string> = {
    "1": "M",
    "2": "H",
    "3": "X",
  };

  return map[String(value)] ?? "";
}