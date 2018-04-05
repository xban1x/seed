import { HttpClient } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
// NgRx
import { Actions, Effect } from '@ngrx/effects';
// Libs
import { Config } from '@seed/models';
// Lodash
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
// RxJS
import { mergeMap } from 'rxjs/operators/mergeMap';
import { retry } from 'rxjs/operators/retry';
import { AnalyticsActions, RetryEventAction, SendEventAction, SendResponseAction } from './analytics.action';

@Injectable()
export class AnalyticsEffects {
  @Effect()
  sendEvent$ = this._actions
    .ofType<SendEventAction | RetryEventAction>(AnalyticsActions.SEND_EVENT, AnalyticsActions.RETRY_EVENT)
    .pipe(
      mergeMap(action =>
        this._http
          .post<boolean>(this._config.analyticsUrl as any, action.payload)
          .pipe(
            retry(3),
            catchError(() => of<boolean>(false)),
            map(res => new SendResponseAction({ id: action.payload.id, response: res }))
          )
      )
    );

  constructor(private readonly _config: Config, private readonly _actions: Actions, private _http: HttpClient) {
    if (this._config.analyticsUrl === undefined) {
      throw new Error('Config: Analytics URL not defined');
    }
  }
}
