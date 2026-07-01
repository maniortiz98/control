import { TaxProfile } from "../../../models/checkpoints/maintenance/fiscal-profile";
import { TaxProfileSignal } from "../../../models/fiscal-profile";


export function mapToCheckpointToSignalTaxProfile(input: TaxProfile): TaxProfileSignal {
  return {
    id: input.id,
    personTypeCve: input.personTypeCve,
    collectTaxes: input.collectTaxes,
    trust: input.trust,
    subPersonTypeCve: input.subPersonTypeCve,
    taxProfile: input.taxProfile,
    taxProfileDescription: input.taxProfileDescription
  }
}

export function mapToSignalToCheckpointTaxProfileBank(input: TaxProfileSignal): TaxProfile {
  return {
    id: input.id,
    collectTaxes: input.collectTaxes
  }
}

export function mapToSignalToCheckpointTaxProfileHouse(input: TaxProfileSignal): TaxProfile {
  return {
    id: input.id,
    personTypeCve: input.personTypeCve,
    subPersonTypeCve: input.subPersonTypeCve,
    collectTaxes: input.collectTaxes,
    trust: input.trust,
  }
}
