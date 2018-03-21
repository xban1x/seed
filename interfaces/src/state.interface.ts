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
        ( this as any )[ key ] = [ ...val ];
      } else if ( val instanceof Object ) {
        ( this as any )[ key ] = { ...val };
      } else {
        ( this as any )[ key ] = val;
      }
    }
  }
}
