import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { PERMISSIONS_MATRIX } from './matrix_role';
import { MENU_MATRIX, PermissionMenuButton } from './menu_role';
import { environment } from '../../../environments/environment';
import { MAINTENANCE_ACTIONS_ROLES, MaintenanceActions } from './maintenance-actions-role';
import { AvailableRoles } from '../models/rol';
import { CUSTOMER_PERMISSIONS_MATRIX } from './customer_matrix_roles';

@Injectable({
  providedIn: 'root'
})
export class PermissionRolService {

  // roleId: 165, roleName: 'SPINE_SUBGERENTE_ADMINISTRATIVO'
  // roleId: 167, roleName: 'SPINE_PLD'
  // roleId: 166, roleName: 'SPINE_CAT'
  // roleId: 163, roleName: 'SPINE_ASESOR'
  // roleId: 164, roleName: 'SPINE_ANALISTA_DE_CONTRATOS'

  private readonly authService = inject(AuthService);

  private readonly PERMISSIONS_MATRIX = PERMISSIONS_MATRIX;

  private readonly CUSTOMER_PERMISSIONS_MATRIX = CUSTOMER_PERMISSIONS_MATRIX;

  private readonly PERMISSIONS_MENU = MENU_MATRIX;

  private readonly PERMISSION_ACTIONS = MAINTENANCE_ACTIONS_ROLES;

  private readonly AVAILABLE_ROLES: AvailableRoles[] = [
    'ROL_SUBGERENTE_ADMINISTRATIVO',
    'ROL_ANALISTA_DE_CONTRATOS',
    'SPINE_GESTOR_SUP',
    'SPINE_GESTOR_OP',
    'ROL_CAT_SEDI',
    'ROL_GEN_SOL_CONSULTA',
    'ROL_CREDITO_PF_PM',
    'ROL_ASESOR_FIN',
    'ROL_CAT_VIDEOLLAMADAS',
    'ROL_PLD',
    'ROL_ANALISTA_MIDDLE_OFFICE',
  ];

  envName = environment.name;

  /**
   *
   * @returns
   */
  getPermissions(): any {
    const rolName = this.authService.getUserInfo();
    const roleKey = rolName().rol as keyof typeof this.PERMISSIONS_MATRIX;
    return this.PERMISSIONS_MATRIX[roleKey];
  }

  getPermissionsCustomer(): any {
    const rolName = this.authService.getUserInfo();
    const roleKey = rolName().rol as keyof typeof this.CUSTOMER_PERMISSIONS_MATRIX;
    return this.CUSTOMER_PERMISSIONS_MATRIX[roleKey];
  }

  getMenuButtonPermission(): PermissionMenuButton {
    const rolName = this.authService.getUserInfo();
    const roleKey = rolName().rol as keyof typeof this.PERMISSIONS_MENU;
    console.log(roleKey);
    if ( roleKey ) {
      return this.PERMISSIONS_MENU[roleKey];
    } else {
       return {
          addCustomer        : false,
          addPerson          : false,
          requestSearch      : false,
          customerSearch     : false,
          trust              : false,
          inbox              : false,
          portfolio_transfer : false,
          catalog_management : false,
          contract_management: false,
          catalogs           : false,
      }
    }
  }

  /**
   * Get Matrix Permissions for Maintenance Header Action Buttons
   */
  getActionButtonsPermission(): MaintenanceActions {
    const rolName = this.authService.getUserInfo();
    const roleKey = rolName().rol as keyof typeof this.PERMISSION_ACTIONS;
    const actions = this.PERMISSION_ACTIONS[roleKey];
    if (actions !== undefined) {
      return actions;
    } else {
      return {
        change_status      : false,
        replicate_contract : false,
        reprint_kit        : false,
      };
    }
  }

  /**
   *
   * @returns
   */
  validRole(): boolean {
    const user = this.authService.getUserInfo();
    const role = user().rol;
    return this.AVAILABLE_ROLES.includes(role as AvailableRoles);
    // function isLetter(value: string): value is Letters {
    //   return ["a", "b", "c", "d"].includes(value as Letters);
    // }
  }

}
