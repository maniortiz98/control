import { HttpClient, HttpHeaders, HttpParams, HttpContext, HttpResponse, HttpEvent, } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  context?: HttpContext;
  observe?: ObserveType;
  responseType?: any;
  body?: any;
  //responseType?: 'json' | 'text' | 'blob';
}

export type ObserveType = 'body' | 'response' | 'events';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private readonly http = inject(HttpClient);

  constructor() {}

  /**
   * Performs a GET request.
   */
  get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    return this.http.get<T>(url, this.createOptions(options));
  }

  /**
   * Performs a POST request.
   */
  post<T>(url: string, body: any = {}, options?: HttpRequestOptions): Observable<T> {
    return this.http.post<T>(url, body, this.createOptions(options));
  }

  /**
   * Performs a PUT request.
   */
  put<T>(url: string, body: any = {}, options?: HttpRequestOptions): Observable<T> {
    return this.http.put<T>(url, body, this.createOptions(options));
  }

  /**
   * Performs a DELETE request.
   */
  delete<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    return this.http.delete<T>(url, this.createOptions(options));
  }

  /**
   * Helper to merge headers, params, and context safely.
   */
  private createOptions(options?: HttpRequestOptions) {
    // --- Headers ---
    let headers = this.defaultHeaders;
    if (options?.headers) {
      for (const key of Object.keys(options.headers)) {
        headers = headers.set(key, options.headers[key]);
      }
    }

    // --- Params ---
    let params = new HttpParams();
    if (options?.params) {
      for (const key of Object.keys(options.params)) {
        params = params.set(key, options.params[key]);
      }
    }

    // --- Context ---
    const context = options?.context ?? new HttpContext();

    // --- Observe / ResponseType ---
    const observe = options?.observe ?? 'body';
    const responseType = options?.responseType ?? 'json';

    return {
      headers,
      params,
      context,
      // observe,
      responseType,
      ...(options && 'body' in options ? { body: options.body } : {})
    };
    /* } as any; // el cast permite usar distintos observe types */
  }
}