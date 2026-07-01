import { Component, effect, ElementRef, inject, OnInit, Signal, ViewChild } from '@angular/core';
import { LoadingService } from './shared/services/loading.service';
import { AuthService } from './core/services/auth.service';
import { UserInfo } from './core/models/user-info';
import { EmployeesAdvisor } from './core/models/rol';
import { PermissionRolService } from './core/services/rol.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as stringUtils from './shared/utils/string';
import { VersionInitService } from './core/services/version-init.service';
import { Renderer2 } from '@angular/core';
import { LogoutService } from './service/logout.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly loadingService       = inject(LoadingService);
  private readonly authService          = inject(AuthService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly router               = inject(Router);
  private readonly versionInitService   = inject(VersionInitService);
  private readonly renderer             = inject(Renderer2);
  private readonly logoutService        = inject(LogoutService);

  readonly userInfo: Signal<UserInfo> = this.authService.getUserInfo();

  appVersion = '0.0.0';
  buildDate: string | undefined;
  buildSize = '';

  title = 'actinver_spine';
  loading = this.loadingService.loading;

  showHeader = true;
  letters = '';
  menuOpen = false;

  envName = environment.name;

  constructorEffect = effect(() => {
    this.letters = stringUtils.getInitials(this.userInfo().name);
  });


  @ViewChild('userMenu', { static: false }) userMenu!: ElementRef;

  private removeClickListener!: () => void;
  private removeKeyListener!: () => void;

  constructor() {
    console.log(
      `%c🕒 Env:%c ${this.envName}`,
      'color: #fff; background: #a7285fff; padding: 2px 6px; border-radius: 4px;',
      'color: #a7285fff; font-weight: bold;'
    );

    this.router.navigate(['']);

    this.authService
      .login()
      .then(() => {
        console.log('1. Auth Login - OK');

        this.authService.getRoles().subscribe({
          next: (rolInfo: EmployeesAdvisor) => {
            console.log(rolInfo);
            const rol = rolInfo.userRoles?.[0]?.roleName ?? '';
            this.authService.updateUserInfo({
              roles: rolInfo.userRoles,
              employeeId: rolInfo.employeeId,
              rol: rol,
            });
            console.log(
              `%c🕒 User Rol:%c ${rol}`,
              'color: #fff; background: #28a7a5ff; padding: 2px 6px; border-radius: 4px;',
              'color: #28a7a5ff; font-weight: bold;'
            );
            console.log(this.userInfo());
            console.log(this.permissionRolService.getPermissions());
            console.log(this.permissionRolService.getMenuButtonPermission());

            if (this.permissionRolService.validRole()) {
              this.router.navigate(['onboarding']);
            } else {
              this.router.navigate(['logout']);
            }
          },
          error: (err: any) => {
            console.error(err);
            this.router.navigate(['logout']);
            // TODO Temp for Local Env | aun con error, manda al menu | solo descomentar para local
            // if ( this.envName === 'local' ) {
            //   this.authService.updateUserInfo({
            //     employeeId: '53000',
            //     rol: 'ROL_ANALISTA_DE_CONTRATOS'
            //   });
            //   let dd = this.authService.getUserInfo()();
            //   console.log(dd);
            //   this.authService.setUserInfo(dd);
            //   this.router.navigate(['onboarding']);
            // } else {
            //   this.router.navigate(['logout']);
            // }
          },
        });
      })
      .catch((error: any) => {
        console.error(error);
      });

    this.router.events.subscribe(() => {
      this.closeMenu();
    });
  }

  ngOnInit(): void {
    const info = this.versionInitService.getBuildInfo();

    if (!info) {
      return;
    }

    this.appVersion = info.appVersion;
    this.buildDate = info.buildDate
      ? info.buildDate
      : new Date().toLocaleString();
    this.buildSize = info.bundleSizeMB ? `${info.bundleSizeMB} MB` : 'N/D';

    console.log(
      '%c================ ℹ️ BUILD INFO v3.1 =================',
      'color: #fff; background: #333; padding: 4px; font-weight: bold;',
    );
    console.log(
      `%c🛠️ App Version:%c ${this.appVersion}`,
      'color: #fff; background: #007acc; padding: 2px 6px; border-radius: 4px;',
      'color: #007acc; font-weight: bold;'
    );
    console.log(
      `%c🛠️ App Version Manual:%c 1.44.1`,
      'color: #fff; background: #007acc; padding: 2px 6px; border-radius: 4px;',
      'color: #007acc; font-weight: bold;'
    );
    console.log(
      `%c🕒 Build Date:%c ${this.buildDate}`,
      'color: #fff; background: #28a745; padding: 2px 6px; border-radius: 4px;',
      'color: #28a745; font-weight: bold;'
    );
    console.log(
      `%c📦 Build Size:%c ${this.buildSize}`,
      'color: #fff; background: #d1b124ff; padding: 2px 6px; border-radius: 4px;',
      'color: #d1b124ff; font-weight: bold;'
    );
    console.log(
      '%c=================================================',
      'color: #fff; background: #333; padding: 4px; font-weight: bold;'
    );
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();

    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      this.listenOutsideClicks();
      this.listenEscapeKey();
    } else {
      this.removeListeners();
    }
  }

  private listenOutsideClicks() {
    this.removeClickListener = this.renderer.listen(
      'document',
      'click',
      (event: Event) => {
        const clickedInside = this.userMenu?.nativeElement.contains(
          event.target,
        );

        if (!clickedInside) {
          this.closeMenu();
        }
      },
    );
  }

  private closeMenu() {
    this.menuOpen = false;
    this.removeListeners();
  }

  private removeListeners() {
    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = undefined!;
    }

    if (this.removeKeyListener) {
      this.removeKeyListener();
      this.removeKeyListener = undefined!;
    }
  }

  private listenEscapeKey() {
    this.removeKeyListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeMenu();
        }
      },
    );
  }

  logout() {
    this.logoutService.logout();
  }

  copyBuildInfo() {
    const text = `App Version: ${this.appVersion} | Fecha: ${this.buildDate}`;
    navigator.clipboard.writeText(text).then(() => {
      console.log('✅ Información copiada al portapapeles:', text);
    });
  }

  ngOnDestroy(): void {
    this.removeListeners();
  }
}
