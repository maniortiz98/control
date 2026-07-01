export interface CustomerExperienceTimeRequest {
  idTipoPersona: string;
}

export interface CustomerExperienceTimeResponse {
  idTipoTiempoExperienciaCve: string;
  idTipoPersona: number;
  tiempoExperiencia: string;
}

export type ExperienceTimeRequest = CustomerExperienceTimeRequest;
export type ExperienceTimeResponse = CustomerExperienceTimeResponse;

