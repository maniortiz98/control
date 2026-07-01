import { CustomerAttoneryInfo, CustomerAttoneryTableInfo } from './customer-attonery';
import { CustomerCotitularInfo, CustomerCotitularTableInfo } from './customer-cotitular';

export interface CustomerSingSection{
  id: number | null,
  signType: string,
  instructions: string,
  titularIpabPercentaje: number,
  titularIsrPecentaje: number,
  cotitularList: CustomerCotitularInfo[],
  cotitularTableList: CustomerCotitularTableInfo[],
  attoneryList: CustomerAttoneryInfo[],
  attoneryTableList: CustomerAttoneryTableInfo[]
}



export type SingSection = CustomerSingSection;

