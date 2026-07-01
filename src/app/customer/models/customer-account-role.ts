export interface CustomerAccountRole {
    accountRolCve: string;
    accountRol: string;
}

export interface CustomerAccountRoleRequest {
    accountRolCve: string[];
}
export type AccountRole = CustomerAccountRole;
export type AccountRoleRequest = CustomerAccountRoleRequest;

