import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { environment } from '../../../environments/environment';
import { catchError, filter, firstValueFrom, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AccessToken } from '../interfaces/access-token';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, EventMessage, EventType, InteractionRequiredAuthError, PublicClientApplication, SilentRequest } from '@azure/msal-browser';
import { UserInfo } from '../models/user-info';
import { ConfigService } from './config.service';
import { RolResponse } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpService = inject(HttpClientService);
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly configService = inject(ConfigService);
  private readonly secUrls = environment.api.security;

  private _userinfo = signal<UserInfo>({
    name: '',
    username: '',
    employeeId: '',
    homeAccountId: '',
    localAccountId: '',
    idToken: '',
    roles: [],
    rol: ''
  });

  readonly userinfo = this._userinfo.asReadonly();

  constructor() { }

  /**
   * Retrieves the user info of current user.
   */
  getUserInfo(): Signal<UserInfo> {
    return this.userinfo;
  }

  /**
   * Sets the user info object.
   */
  setUserInfo(data: UserInfo): void {
    this._userinfo.set(data);
  }

  /**
   * Updates UserInfo object, with a partial.
   */
  updateUserInfo(data: Partial<UserInfo>): void {
    this._userinfo.update(item => ({
      ...item,
      ...data
    }));
  }

  /**
   * refresh token
   * Retrieves 'access token'  used for API requests.
   */
  async refreshAccessToken(): Promise<AccessToken> {
    const response: AccessToken = await firstValueFrom(
      this.httpService.post(
        this.secUrls.accessToken,
        {},
        {
          headers: {
            'Authorization': `Basic ${this.configService.config.tkn_api}`
          },
          params: {
            'grant-type': 'client_credentials'
          }
        }
      )
    );
    return response;
  }

  /**
   *
   */
  async login(): Promise<any> {

    const instance = this.msalService.instance as PublicClientApplication;

    await instance.initialize();

    this.msalBroadcastService.msalSubject$
    .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
    .subscribe((result: EventMessage) => {
      const payload = result.payload as AuthenticationResult;
      this.msalService.instance.setActiveAccount(payload.account);
      this.setUserInfo(
        {
          name: payload.account.name ?? '',
          username: payload.account.username ?? '',
          employeeId: '',
          localAccountId: payload.account.localAccountId ?? '',
          homeAccountId: payload.account.homeAccountId ?? '',
          idToken: payload.account.idToken ?? '',
          roles: [],
          rol: '',
        }
      );
    });

    // explicitly handle redirect response (await result)
    try {
      const redirectResult = await this.msalService.instance.handleRedirectPromise();
      console.log(redirectResult);
      if ( redirectResult && redirectResult.account ) {
        this.msalService.instance.setActiveAccount(redirectResult.account);
      }
    } catch (err) {
      console.error('handleRedirectPromise error', err);
    }

    // now check accounts reliably
    const activeAccount = instance.getActiveAccount() || instance.getAllAccounts()[0] || null;
    console.log(activeAccount);

    if ( activeAccount.username != '' &&  activeAccount.username != null && activeAccount.username != undefined) {
      this.setUserInfo({
        name: activeAccount.name ?? '',
        username: activeAccount.username ?? '',
        employeeId: '',
        localAccountId: activeAccount.localAccountId ?? '',
        homeAccountId: activeAccount.homeAccountId ?? '',
        idToken: activeAccount.idToken ?? '',
        roles: [],
        rol: ''
      });
    } else {
      this.msalService.loginRedirect();
    }

  }

  /**
   * Initializes the steps to retrieve the user rol.
   */
  getRoles() {

    return this.getAzureToken().pipe(

      tap(() => { console.log("2 azure token"); }),

      switchMap((login: any) => this.loginForRoles(login.accessToken)),

      tap(() => { console.log("3 login roles"); }),

      switchMap((loginroles: any) => this.getUserRoles(loginroles.accessToken)),

      map((userRoles: RolResponse) => {
        console.log("4 roles");
        console.log(userRoles);
        userRoles.payload.employeeId = userRoles.payload.employeeId.padStart(5, "0");
        return userRoles.payload;
      }),

      catchError((err: any) => {
        console.error('getRoles chain error', err);
        if ( err instanceof InteractionRequiredAuthError ) {
          // this.msalService.loginRedirect();
        }
        return throwError(() => err);
      })

    );
  }


  /**
   * Sep 1
   * Request to Azure, a token.
   */
  getAzureToken(): any {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount) {
      this.msalService.loginRedirect();
      return throwError(() => new Error('No active MSAL account'));
    }

    const acc: SilentRequest = {
      ...activeAccount,
      scopes: environment.apiConfig.scopes
    };

    return from(this.msalService.acquireTokenSilent(acc)).pipe(
      catchError(err => {
        console.error('getAzureToken error', err);

        return throwError(() => err);
      })
    );
  }

  /**
   * Step 2
   * With te token retrieved from Azure, performs login to get
   * accesstoken, to request the roles.
   *
   */
  loginForRoles(token: string): Observable<any> {
    return this.httpService.post(
        this.secUrls.userLogin,
        {
          'userToken': token
        },
        {
          headers: {
            'authorization': `Basic ${this.configService.config.tkn_rol}`
          }
        }
    ).pipe(
      catchError(err => {
        console.error('loginForRoles error', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Step 3
   * With the accesstoken retrieved from previous step, then
   * performs a request to /advisor, which returns user info,
   * including roles.
   */
  getUserRoles(accessToken: string): any {
    return this.httpService.get(
        this.secUrls.userRoles,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        },
    ).pipe(
      catchError(err => {
        console.error('getUserRoles error', err);
        return throwError(() => err);
      })
    );
  }


  get activeAccount(): AccountInfo | null {
    console.log(this.msalService.instance.getAllAccounts());
    console.log(this.msalService.instance.getActiveAccount());
    return this.msalService.instance.getActiveAccount();

  }

}
