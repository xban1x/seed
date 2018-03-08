// Libs
import { EnvironmentType } from '@libs/enums';
// Angular
import { MetaDefinition } from '@angular/platform-browser';

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
