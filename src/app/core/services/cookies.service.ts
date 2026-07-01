import { Injectable } from '@angular/core';
import { AccessToken } from '../interfaces/access-token';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor() { }

  /**
   *
   * @param token The token object.
   */
  setAuthToken(token: AccessToken): void {
    const d = new Date();
    d.setTime(d.getTime() + (+token.expiresIn * 1000));
    // d.setTime(d.getTime() + 15000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `access_token=${token.accessToken};${expires};path=/`;
  }


  getAuthToken(): string {
    const name = "access_token=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for ( let i = 0 ; i < ca.length ; i++ ) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if ( c.indexOf(name) == 0 ) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
