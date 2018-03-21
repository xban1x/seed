// NgRx
import { Action } from '@ngrx/store';
import { PlatformState } from './platform.state';

export enum PlatformActions {
  SET_PLATFORM = '[Platform] Set platform'
}

export class SetPlatformAction implements Action {
  readonly type = PlatformActions.SET_PLATFORM;

  constructor ( public payload: PlatformState ) { }
}

export type PlatformActionsType = SetPlatformAction;
