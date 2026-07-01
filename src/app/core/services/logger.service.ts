import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

type LevelLog = 'info' | 'log' | 'warn' | 'error';

interface LogEntry {
    level    : LevelLog;
    message  : string;
    timestamp: Date;
    context ?: any;
    userId  ?: string;
    url     ?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoggerSevice {

    private readonly _allowLog: boolean;

    constructor() {
         this._allowLog = environment.allowLog;
    }

    /**
     * Shows a simple message.
     */
    info(message: string): void {
        this._dispatch('info', message);
    }

    /**
     * Prints the title message and the data passed in next line.
     */
    log(message: string, data?: any): void {
        this._dispatch('log', message, data);
    }

    /**
     *
     */
    warn(message: string, data?: any): void {
        this._dispatch('warn', message, data);
    }

    /**
     *
     */
    error(message: string, data?: any): void {
        this._dispatch('error', message, data);
    }

    /**
     *
     */
    private _dispatch(level: LevelLog, message: string, data?: any): void {
        if ( !this._allowLog ) return;
        // const entry: LogEntry = {
        //     level,
        //     message,
        //     timestamp: new Date(),
        //     data,
        //     url: window.location.href
        // };
        if ( 'info' === level ) {
            console.info(this._format('info', message));
        } else {
            console.info(this._format(level, message));
            console[level](data ?? '');
        }

        /*
        console.log(
              `%c🕒 User Rol:%c ${rol}`,
              'color: #fff; background: #28a7a5ff; padding: 2px 6px; border-radius: 4px;',
              'color: #28a7a5ff; font-weight: bold;'
            );
            */
    }

    /**
     *
     */
    private _format(level: LevelLog, message: string): string {
        return `[${level.toUpperCase()}] : ${message}`;
    }
}
