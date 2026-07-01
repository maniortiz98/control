import { ConfigService } from './config.service';
import { VersionInitService } from './version-init.service';

export function initializeApp(
  configService: ConfigService,
  versionInit: VersionInitService
) {
  return async () => {
    await configService.loadConfig();
    await versionInit.init();
  };
}
