
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { PermissionRolService } from './rol.service';

// --- Mocks locales de matrices y tipos ---
const PERMISSIONS_MATRIX_MOCK: Record<string, any> = {
  ROL_PLD: { canSeeRisk: true, canEdit: false },
  ROL_ASESOR_FIN: { canSeeRisk: false, canEdit: true },
};

const MENU_MATRIX_MOCK: Record<string, any> = {
  ROL_PLD: {
    addCustomer: false,
    addPerson: false,
    requestSearch: true,
    customerSearch: true,
    trust: true,
    inbox: true,
    portfolio_transfer: false,
    catalog_management: false,
    contract_management: false,
    catalogs: false,
  },
  ROL_ASESOR_FIN: {
    addCustomer: false,
    addPerson: false,
    requestSearch: false,
    customerSearch: true,
    trust: false,
    inbox: true,
    portfolio_transfer: false,
    catalog_management: false,
    contract_management: true,
    catalogs: false,
  },
};

// --- Mock del AuthService ---
// En tu servicio haces:
// const rolName = this.authService.getUserInfo();
// const roleKey = rolName().rol;
class AuthServiceMock {
  private role = 'ROL_PLD';
  setRole(r: string) { this.role = r; }
  getUserInfo() {
    return () => ({ rol: this.role });
  }
  updateUserInfo() {}
}

describe('PermissionRolService', () => {
  let service: PermissionRolService;
  let authService: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionRolService,
        { provide: AuthService, useClass: AuthServiceMock },
      ],
    });

    service = TestBed.inject(PermissionRolService);
    authService = TestBed.inject(AuthService) as unknown as AuthServiceMock;

    // Reemplazamos las propiedades privadas/readonly del servicio con mocks.
    // Esto funciona en tests aunque sean readonly porque estamos en tiempo de ejecución.
    (service as any).PERMISSIONS_MATRIX = PERMISSIONS_MATRIX_MOCK;
    (service as any).PERMISSIONS_MENU = MENU_MATRIX_MOCK;
    service.envName = 'test'; // si quieres validar el nombre del env
  });

  // ---------------- getPermissions ----------------
  it('getPermissions: debería retornar permisos de ROL_PLD', () => {
    authService.setRole('ROL_PLD');
    const permissions = service.getPermissions();
    expect(permissions).toEqual({ canSeeRisk: true, canEdit: false });
  });

  it('getPermissions: debería retornar permisos de ROL_ASESOR_FIN', () => {
    authService.setRole('ROL_ASESOR_FIN');
    const permissions = service.getPermissions();
    expect(permissions).toEqual({ canSeeRisk: false, canEdit: true });
  });

  // ---------------- getMenuButtonPermission ----------------
  it('getMenuButtonPermission: rol válido regresa el menú correspondiente (ROL_PLD)', () => {
    authService.setRole('ROL_PLD');
    const menu = service.getMenuButtonPermission();
    expect(menu).toEqual(MENU_MATRIX_MOCK['ROL_PLD']);
  });

  it('getMenuButtonPermission: rol válido regresa el menú correspondiente (ROL_ASESOR_FIN)', () => {
    authService.setRole('ROL_ASESOR_FIN');
    const menu = service.getMenuButtonPermission();
    expect(menu).toEqual(MENU_MATRIX_MOCK['ROL_ASESOR_FIN']);
  });

  it('getMenuButtonPermission: rol vacío regresa los valores por defecto', () => {
    authService.setRole('' as unknown as string);
    const menu = service.getMenuButtonPermission();
    expect(menu).toEqual({
      addCustomer: false,
      addPerson: false,
      requestSearch: false,
      customerSearch: false,
      trust: false,
      inbox: false,
      portfolio_transfer: false,
      catalog_management: false,
      contract_management: false,
      catalogs: false,
    });
  });

  // ---------------- validRole ----------------
  it('validRole: true cuando el rol está en AVAILABLE_ROLES (e.g., ROL_PLD)', () => {
    authService.setRole('ROL_PLD');
    expect(service.validRole()).toBeTrue();
  });

  it('validRole: false cuando el rol NO está en AVAILABLE_ROLES', () => {
    authService.setRole('ROL_QUE_NO_EXISTE');
    expect(service.validRole()).toBeFalse();
  });

  // ---------------- environment ----------------
  it('envName: debería poder leerse como "test" en pruebas', () => {
    expect(service.envName).toBe('test');
  });

    // ---------------- getActionButtonsPermission ----------------
    it('getActionButtonsPermission: regresa permisos correctos para ROL_PLD', () => {
      authService.setRole('ROL_PLD');
      const actions = service.getActionButtonsPermission();
      expect(actions).toEqual({
        change_status: false,
        replicate_contract: false,
        reprint_kit: false,
      });
    });

    it('getActionButtonsPermission: regresa permisos correctos para ROL_ASESOR_FIN', () => {
      authService.setRole('ROL_ASESOR_FIN');
      const actions = service.getActionButtonsPermission();
      expect(actions).toEqual({
        change_status: false,
        replicate_contract: false,
        reprint_kit: true,
      });
    });

    it('getActionButtonsPermission: regresa permisos por defecto si el rol no existe', () => {
      authService.setRole('ROL_QUE_NO_EXISTE');
      const actions = service.getActionButtonsPermission();
      expect(actions).toEqual({
        change_status: false,
        replicate_contract: false,
        reprint_kit: false,
      });
    });
});
``
