import { PlatformActions, PlatformActionsType } from './platform.action';
import { PlatformState } from './platform.state';

const DEFAULT_STATE = new PlatformState();

export function platformReducer ( state: PlatformState = DEFAULT_STATE, action: PlatformActionsType ) {
  switch ( action.type ) {
    case PlatformActions.SET_PLATFORM: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
