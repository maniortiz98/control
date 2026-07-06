export interface CatCpRecord {
    id_cp?: number;
    cp?: string;
    id_estado?: string;
    id_municipio?: string;
    id_colonia?: string;
    id_ciudad?: string;
    colonia?: string;
    centro_reparto?: string;
    activo?: boolean;
    creado?: string;
    modificado?: string | null;
  }
  
  export interface EstadoCatalogItem {
    id: string;
    nombre: string;
  }
  
  export interface MunicipioCatalogItem {
    id: string;
    idEstado?: string;
    nombre: string;
  }
  
  export interface CiudadCatalogItem {
    id: string;
    nombre: string;
  }
  
  export interface ColoniaItem {
    suburb:    string;
    idSuburb:  string;
    centerRep: string;
    idCp?:     number;
  }
  
  export interface MunicipioModalData {
    idEstado: string;
    estadoNombre: string;
    municipiosExistentes: string[];
  }
  
  export interface NuevoMunicipioResult {
    id_municipio_cve: string;
    id_estado: string;
    municipio: string;
    id_zona_geografica: string;
    activo: boolean;
  }
  