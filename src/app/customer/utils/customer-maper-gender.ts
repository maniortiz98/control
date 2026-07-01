export enum CustomerAllowedValuesGenders {
  H = 2,
  M = 1,
  X = 3
}

export enum CustomerAllowedGenders {
  H = 'H',
  M = 'M',
  X = 'X'
}

export enum CustomerAllowedFullTextGenders {
  H = 'Masculino',
  M = 'Femenino',
  X = 'No Binario'
}

export function compareAndReturnGender(value: string): number {
  switch (value.toUpperCase()) {
    case 'H':
      return CustomerAllowedValuesGenders.H;
    case 'M':
      return CustomerAllowedValuesGenders.M;
    case 'X':
      return CustomerAllowedValuesGenders.X;
    default:
      return 0;
  }
}


export function compareGenderAndReturnValue(value: number): string {
  switch (value) {
    case 2:
      return CustomerAllowedGenders.H;
    case 1:
      return CustomerAllowedGenders.M;
    case 3:
      return CustomerAllowedGenders.X;
    default:
      return '';
  }
}

export function compareGenderFullText(value: string): string {
  switch (value) {
    case '2':
      return CustomerAllowedFullTextGenders.H;
    case '1':
      return CustomerAllowedFullTextGenders.M;
    case '3':
      return CustomerAllowedFullTextGenders.X;
    default:
      return '';
  }
}