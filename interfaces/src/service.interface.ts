// NgRx
import { Store } from '@ngrx/store';
// Lodash
import isNil from 'lodash/isNil';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { State } from './state.interface';

export abstract class Service<T extends State> {
  stateChange: Observable<T>;
  state: T = {} as T;
  private _subscription: Subscription;

  constructor(protected readonly _store: Store<any>, private readonly _storeName: string) {
    console.log('Service Init: ' + _storeName);
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
