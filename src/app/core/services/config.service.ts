import { inject, Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { firstValueFrom } from "rxjs";

interface LoadedConfig {
  tkn_api: string;
  tkn_rol: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private http = inject(HttpClientService);
    private _config: LoadedConfig = {
        tkn_api: '',
        tkn_rol: ''
    };

    /**
     * Loads configuration file
     */
    async loadConfig(): Promise<void> {
        try {
            const data: LoadedConfig = await firstValueFrom(this.http.get('./assets/config.json'));
            this._config = data;
        } catch (err) {
            console.log("Error cargando configuracio.", err);
            this._config = {
                tkn_api: '',
                tkn_rol: ''
            };
        }
    }

    /**
     *
     */
    get config(): LoadedConfig {
        return this._config;
    }
}