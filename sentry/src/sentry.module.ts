import { NgModule, ErrorHandler } from '@angular/core';
import { SentryErrorHandler } from './sentry-error.handler';

@NgModule({
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }]
})
export class SentryModule {}
