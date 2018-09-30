// Angular
import { Injectable, ErrorHandler } from '@angular/core';
// Libs
import { Config } from '@seed/models';
// Sentry
import * as Sentry from '@sentry/browser';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor(private _config: Config) {
    if (!this._config.sentry) {
      throw new Error('Missing token for Sentry!');
    }
    const SENTRY_CONFIG: Sentry.BrowserOptions = {
      dsn: this._config.sentry,
      environment: this._config.env.type,
      release: this._config.app.version
    };
    Sentry.init(SENTRY_CONFIG);
  }

  handleError(error: any): void {
    Sentry.captureException(error.originalError || error);
    if (this._config.env.debug) {
      console.error(error);
    }
  }
}
