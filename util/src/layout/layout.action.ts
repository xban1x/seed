// NgRx
import { Action } from '@ngrx/store';
import { LayoutState } from './layout.state';

export enum LayoutActions {
  SET_LAYOUT = '[Layout] Set layout'
}

export class SetLayoutAction implements Action {
  readonly type = LayoutActions.SET_LAYOUT;

  constructor ( public payload: LayoutState ) { }
}

export type LayoutActionsType = SetLayoutAction;
