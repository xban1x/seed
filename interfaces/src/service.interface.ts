import { State } from './state.interface';
// NgRx
import { Store } from '@ngrx/store';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// Lodash
import isNil from 'lodash/isNil';

export abstract class Service<T extends State> {
  stateChange: Observable<T>;
  state: T = <T>{};
  private _subscription: Subscription;

  constructor(protected _store: Store<any>, private _storeName: string) {
    this._onInit();
  }

  private _onInit(): void {
    this.stateChange = this._store.select(this._storeName);
  }

  subscribe(): void {
    if (isNil(this._subscription)) {
      this._subscription = this.stateChange.subscribe((state: T) => {
        this.state = state;
      });
    }
  }

  unsubscribe(): void {
    if (!isNil(this._subscription)) {
      this._subscription.unsubscribe();
    }
  }
}
