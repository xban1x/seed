// Lodash
import isNil from 'lodash/isNil';

export abstract class State {
  constructor ( initial?: any ) {
    if ( isNil( initial ) ) {
      return;
    }
    const keys = Object.keys( initial );
    for ( const key of keys ) {
      const val = initial[ key ];
      if ( val instanceof Array ) {
        ( <any> this )[ key ] = [ ...val ];
      } else if ( val instanceof Object ) {
        ( <any> this )[ key ] = { ...val };
      } else {
        ( <any> this )[ key ] = val;
      }
    }
  }
}
