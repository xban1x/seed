import { isBrowser } from '../functions/index';
// Libs
import { LogCode, LogSeverity } from '@libs/enums';
import { Config } from '@libs/models';
// Lodash
import isNil from 'lodash/isNil';

export function logDebug(code: LogCode, message?: string) {
	_log(LogSeverity.DEBUG, code, message);
}

export function logInfo(code: LogCode, message?: string) {
	_log(LogSeverity.INFO, code, message);
}

export function logWarn(code: LogCode, message?: string) {
	_log(LogSeverity.WARN, code, message);
}

export function logError(code: LogCode, message?: string) {
	_log(LogSeverity.ERROR, code, message);
}

function _log(severity: LogSeverity, code: LogCode, message?: string): void {
	if (!isBrowser()) {
		return;
	}
	switch (severity) {
		case LogSeverity.DEBUG: {
			if (!window.config.env.debug) {
				return;
			}
			// tslint:disable-next-line:no-console
			console.debug(_sanitizeMessage(code, message));
			break;
		}
		case LogSeverity.INFO: {
			if (window.config.env.production) {
			} else {
				// tslint:disable-next-line:no-console
				console.info(_sanitizeMessage(code, message));
			}
			break;
		}
		case LogSeverity.WARN: {
			if (window.config.env.production) {
			} else {
				// tslint:disable-next-line:no-console
				console.warn(_sanitizeMessage(code, message));
			}
			break;
		}
		case LogSeverity.ERROR: {
			if (window.config.env.production) {
			} else {
				// tslint:disable-next-line:no-console
				console.info(_sanitizeMessage(code, message));
			}
			break;
		}
	}
}

function _sanitizeMessage(code: LogCode, message?: string): string {
	return (
		new Date().toISOString() +
		':' +
		code +
		(!isNil(message) ? ':' + message : '')
	);
}
