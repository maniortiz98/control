import { AttoneryInfo, AttoneryTableInfo } from './attonery';
import { CotitularInfo, CotitularTableInfo } from './cotitular';

export interface SingSection{
  id: number | null,
  signType: string,
  instructions: string,
  titularIpabPercentaje: number,
  titularIsrPecentaje: number,
  cotitularList: CotitularInfo[],
  cotitularTableList: CotitularTableInfo[],
  attoneryList: AttoneryInfo[],
  attoneryTableList: AttoneryTableInfo[]
}
