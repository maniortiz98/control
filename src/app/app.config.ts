import { ApplicationConfig, provideAppInitializer, inject } from "@angular/core";
import { ConfigService } from "./core/services/config.service";
import { VersionInitService } from "./core/services/version-init.service";

export const appConfig: ApplicationConfig = {
    providers: [
        ConfigService,
        provideAppInitializer(() => inject(ConfigService).loadConfig()),
        VersionInitService,
        provideAppInitializer(() => inject(VersionInitService).init())
    ]
};


