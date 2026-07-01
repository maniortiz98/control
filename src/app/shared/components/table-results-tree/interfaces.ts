export type ColumnType = 'string' | 'checkbox' | 'html';

export interface ColumnsDataTable {
  name: string;
  title: string;
  show?: boolean;
  type: ColumnType;
}

export interface ConfigDataTable {
  showPag: boolean;
  showActions: boolean;
  itemPerPageOpt?: Array<number>;
  multipleSelection: boolean;
  idName?: string;
  singleSelection?: { show: boolean; title?: string, propertyName: string };
}