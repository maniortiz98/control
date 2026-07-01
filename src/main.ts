import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

function loadExternalScript(src: string): void {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

if ( !environment.allowLog ) {
  console.log = () => undefined;
}

if ( environment.dynatrace ) {
  loadExternalScript(environment.dynatrace);
}

const bootstrapApp = () =>
  platformBrowser().bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
    .catch(err => console.error(err));

bootstrapApp();
