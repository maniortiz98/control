export type ColumnType = 'string' | 'checkbox' | 'html' | 'status';

export interface ColumnsDataTable {
  name : string;
  title: string;
  show?: boolean;
  type : ColumnType;
}

export interface ConfigDataTable {
  showPag          : boolean;
  showViewAction   : boolean;
  showEditAction   : boolean;
  showDeleteAction : boolean;
  itemPerPageOpt?: Array<number>;
  multipleSelection: boolean;
  idName?          : string;
  singleSelection?: {
    show        : boolean;
    title?      : string;
    propertyName: string;
  };
  isSelected?: boolean;
  sort?      : boolean;
  saveWord?  : string;
  pagConfig? : PagConfig;
  hideDeleteWhenActive?: boolean; 
}

export interface PagConfig {
  totalRows           : number;
  currentPage         : number;
  pageSize            : number;
  disabled            : boolean;
  showFirstLastButtons: boolean;
  pageSizeOptions     : Array<any>;
  hidePageSize        : boolean;
}
