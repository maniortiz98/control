export interface CustomerPersonRole {
    personRolCve: string;
    personRol: string;
}

export interface CustomerPersonRoleRequest {
    personRolCve: string[];
}
export type PersonRole = CustomerPersonRole;
export type PersonRoleRequest = CustomerPersonRoleRequest;

