export interface CustomerClientNoGuaranteedIpabRequest {
  guaranteedNoClientIds: string[]
}

export interface CustomerClientNoGuaranteedIpab {
  guaranteedNoClientId: string,
  description: string,
}

export type ClientNoGuaranteedIpabRequest = CustomerClientNoGuaranteedIpabRequest;
export type ClientNoGuaranteedIpab = CustomerClientNoGuaranteedIpab;

