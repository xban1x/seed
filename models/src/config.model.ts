// Libs
// Angular
import { MetaDefinition } from '@angular/platform-browser';
import { EnvironmentType } from '@seed/enums';

export class Config {
	app: {
		name: string;
		version: string;
		hash: string;
		timestamp: number;
	};
	env: {
		type: EnvironmentType;
		production: boolean;
		debug: boolean;
		hmr: boolean;
	};
	staticMetadata?: MetaDefinition[];
	analyticsUrl?: string;
	sentry?: string;
}
