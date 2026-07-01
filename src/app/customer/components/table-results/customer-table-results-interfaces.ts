export type CustomerColumnType = '' | 'checkbox' | 'html' | 'status';

export interface ColumnsDataTable {
  name : string;
  title: string;
  show?: boolean;
  type : CustomerColumnType;
}

export interface ConfigDataTable {
  showPag          : boolean;
  showViewAction   : boolean;
  showEditAction   : boolean;
  showDeleteAction : boolean;
  multipleSelection: boolean;
  idName?          : string;
  singleSelection?: {
    show        : boolean;
    title?      : string;
    propertyName: string;
  };
  isSelected?: boolean;
  saveWord?  : string;
  pagConfig? : CustomerPagConfig;
}

export interface CustomerPagConfig {
  totalRows           : number;
  currentPage         : number;
  pageSize            : number;
  disabled            : boolean;
  showFirstLastButtons: boolean;
  pageSizeOptions     : Array<any>;
  hidePageSize        : boolean;
}



