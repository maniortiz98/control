import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BuildInfo {
  appVersion: string;
  buildDate?: string;
  bundleHash?: string;
  bundleSizeMB?: string;
  bundleFile?: string;
  bundlePathRelative?: string;
}

@Injectable({ providedIn: 'root' })
export class VersionInitService {
  constructor(private http: HttpClient) {}
  private initPromise?: Promise<void>;
  private buildInfo?: BuildInfo;

  getBuildInfo(): BuildInfo | undefined {
    return this.buildInfo;
  }

  private reload(url: string) {
    window.location.replace(url);
  }

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    const urlObj = new URL('assets/build-info.json', document.baseURI);

    const cacheBust =
      sessionStorage.getItem('buildInfoCacheBust') ||
      (() => {
        const v = localStorage.getItem('appVersion') || Date.now().toString();
        sessionStorage.setItem('buildInfoCacheBust', v);
        return v;
      })();

    urlObj.searchParams.set('v', cacheBust);
    const url = urlObj.toString();

    this.initPromise = new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 3000);

      this.http.get<BuildInfo>(url).subscribe({
        next: async (info) => {
          clearTimeout(timeout);
          this.buildInfo = info;

          const newVersion = info?.appVersion ?? 'unknown';
          const storedVersion = localStorage.getItem('appVersion');
          const alreadyReloaded = sessionStorage.getItem('reloadedForVersion');

          if (!storedVersion) {
            localStorage.setItem('appVersion', newVersion);
            return resolve();
          }

          if (storedVersion !== newVersion && alreadyReloaded !== newVersion) {
            const msalSnapshot = preserveMsalKeys();

            try {
              localStorage.clear();
            } catch {}
            try {
              sessionStorage.clear();
            } catch {}

            msalSnapshot.forEach((v, k) => localStorage.setItem(k, v));

            try {
              document.cookie.split(';').forEach((cookie) => {
                const name = cookie.split('=')[0].trim();
                if (name && !name.startsWith('msal')) {
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                }
              });
            } catch {}

            // caches → OK
            if ('caches' in window) {
              try {
                const keys = await caches.keys();
                await Promise.all(keys.map((k) => caches.delete(k)));
              } catch {}
            }

            localStorage.setItem('appVersion', newVersion);
            sessionStorage.setItem('reloadedForVersion', newVersion);
          }

          resolve();
        },
        error: () => {
          clearTimeout(timeout);
          resolve();
        },
      });
    });

    return this.initPromise;
  }
}

function preserveMsalKeys() {
  const snapshot = new Map<string, string>();

  Object.keys(localStorage)
    .filter((k) => k.startsWith('msal.'))
    .forEach((k) => {
      const v = localStorage.getItem(k);
      if (v !== null) snapshot.set(k, v);
    });

  return snapshot;
}
