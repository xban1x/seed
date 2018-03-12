// Angular
import { Injectable, ErrorHandler } from '@angular/core';
// Libs
import { Config } from '@seed/models';
// Lodash
import isNil from 'lodash/isNil';
// Sentry
import * as Raven from 'raven-js';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
	constructor(private _config: Config) {
		if (isNil(this._config.sentry)) {
			throw new Error('Missing token for Sentry!');
		}
		const SENTRY_CONFIG: Raven.RavenOptions = {
			environment: this._config.env.type,
			release: this._config.app.version,
			tags: {
				name: this._config.app.name,
				mode: '' + this._config.env.production,
				debug: '' + this._config.env.debug,
				gitHash: this._config.app.hash,
				buildTime: '' + this._config.app.timestamp
			}
		};
		Raven.config(this._config.sentry, SENTRY_CONFIG).install();
	}

	handleError(error: any): void {
		Raven.captureException(error.originalError || error);
		if (this._config.env.debug) {
			console.error(error);
		}
	}
}
