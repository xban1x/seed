import { MetaActions, MetaActionsType } from './meta.action';
import { MetaState } from './meta.state';

const DEFAULT_STATE = new MetaState( { meta: [] } );

export function metaReducer ( state: MetaState = DEFAULT_STATE, action: MetaActionsType ) {
  switch ( action.type ) {
    case MetaActions.SET_META: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
