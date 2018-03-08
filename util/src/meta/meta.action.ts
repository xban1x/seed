import { MetaState } from './meta.state';
// NgRx
import { Action } from '@ngrx/store';

export enum MetaActions {
  SET_META = '[Meta] Set meta'
}

export class SetMetaAction implements Action {
  readonly type = MetaActions.SET_META;

  constructor ( public payload: MetaState ) { }
}

export type MetaActionsType = SetMetaAction;
