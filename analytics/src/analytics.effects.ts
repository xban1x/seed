import { SendEventAction, SendResponseAction, AnalyticsActions, RetryEventAction } from './analytics.action';
// Libs
import { Config } from '@libs/models';
// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// NgRx
import { Actions, Effect } from "@ngrx/effects";
// RxJS
import { mergeMap } from 'rxjs/operators/mergeMap';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { retry } from 'rxjs/operators/retry';
import { of } from 'rxjs/observable/of';
// Lodash
import isNil from 'lodash/isNil';

@Injectable()
export class AnalyticsEffects {

  @Effect()
  sendEvent$ = this._actions.ofType<SendEventAction | RetryEventAction>( AnalyticsActions.SEND_EVENT, AnalyticsActions.RETRY_EVENT ).pipe(
    mergeMap( ( action ) =>
      this._http.post<boolean>
        ( <any> this._config.analyticsUrl, action.payload )
        .pipe(
        retry( 3 ),
        catchError( () => of<boolean>( false ) ),
        map( ( res ) => new SendResponseAction( { id: action.payload.id, response: res } ) )
        ) ) );

  constructor ( private readonly _config: Config, private readonly _actions: Actions, private _http: HttpClient ) {
    if ( isNil( this._config.analyticsUrl ) ) {
      throw new Error( 'Config: Analytics URL not defined' );
    }
  }
}
