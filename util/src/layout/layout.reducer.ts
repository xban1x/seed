import { LayoutActions, LayoutActionsType } from './layout.action';
import { LayoutState } from './layout.state';

const DEFAULT_STATE = new LayoutState();

export function layoutReducer(state: LayoutState = DEFAULT_STATE, action: LayoutActionsType) {
  switch (action.type) {
    case LayoutActions.SET_LAYOUT: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
