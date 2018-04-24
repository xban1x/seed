import { DOCUMENT } from '@angular/common';
// Angular
import { Inject, Injectable } from '@angular/core';
import { makeStateKey, Meta, MetaDefinition, Title, TransferState } from '@angular/platform-browser';
// NgRx
import { Store } from '@ngrx/store';
import { Service } from '@seed/interfaces';
// Libs
import { Config } from '@seed/models';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
// Lodash
import { PlatformService } from '../platform/index';
import { SetMetaAction } from './meta.action';
import { MetaState } from './meta.state';

const TRANSFER_STATE_KEY = makeStateKey<MetaState>('META_STATE');

@Injectable()
export class MetaService extends Service<MetaState> {
  constructor(
    protected _store: Store<any>,
    private _platform: PlatformService,
    private _transfer: TransferState,
    private _config: Config,
    @Inject(DOCUMENT) private _document: Document,
    private _title: Title,
    private _meta: Meta
  ) {
    super(_store, MetaState.STORE_NAME);
    this._init();
  }

  private async _init(): Promise<void> {
    let state: MetaState = new MetaState({ meta: [] });
    if (this._platform.isBrowser() && this._transfer.hasKey(TRANSFER_STATE_KEY)) {
      state = this._transfer.get(TRANSFER_STATE_KEY, state);
    } else {
      this._findMetaTags(state);
    }
    this._setMetaState(state);
    this.state = state;
    if (this._config.staticMetadata !== undefined) {
      for (const tag of this._config.staticMetadata) {
        this.updateTag(tag, true);
      }
    }
  }

  private _findMetaTags(state: MetaState): void {
    const nodeList = Array.from(this._document.querySelectorAll('meta'));
    for (const elem of nodeList) {
      const attributeMap: MetaDefinition[] = Array.from(elem.attributes).map(attr => {
        const obj: any = {};
        if (attr !== undefined) {
          obj[attr.nodeName] = attr.nodeValue;
        }
        return obj;
      });
      const attributes: MetaDefinition | null = attributeMap.reduce((sum, n) => {
        return { ...sum, ...n };
      });
      if (attributes !== undefined) {
        state.meta.push(attributes);
      }
    }
  }

  getTitle(): string {
    return this.state.title;
  }

  setTitle(title: string): void {
    const state = new MetaState(this.state);
    if (state.title === title) {
      return;
    }
    state.title = title;
    this._title.setTitle(title);
    this._setMetaState(state);
    this.state = state;
  }

  addTag(tag: MetaDefinition, forceCreation: boolean = false): HTMLMetaElement | null {
    if (!forceCreation && this._findWithMeta(tag)) {
      return null;
    }
    this._add(tag);
    return this._meta.addTag(tag, forceCreation);
  }

  addTags(tags: MetaDefinition[], forceCreation: boolean = false): HTMLMetaElement[] {
    const res = [];
    for (const tag of tags) {
      const meta = this.addTag(tag, forceCreation);
      if (meta !== null) {
        res.push(meta);
      }
    }
    return res;
  }

  getTag(tag: MetaDefinition): HTMLMetaElement | null {
    if (!this._findWithMeta(tag)) {
      return null;
    }
    const selector = this._createSelector(tag);
    return this._meta.getTag(selector);
  }

  getTags(tag: MetaDefinition): HTMLMetaElement[] {
    if (!this._findWithMeta(tag)) {
      return [];
    }
    const selector = this._createSelector(tag);
    return this._meta.getTags(selector);
  }

  updateTag(tag: MetaDefinition, create = false): HTMLMetaElement | null {
    if (this._findWithMeta(tag)) {
      this._update(tag);
      return this._meta.updateTag(tag, null);
    } else if (create) {
      return this._meta.addTag(tag);
    }
    return null;
  }

  removeTag(tag: MetaDefinition): void {
    if (!this._findWithMeta(tag)) {
      return;
    }
    const selector = this._createSelector(tag);
    this._remove(tag);
    this._meta.removeTag(selector);
  }

  removeTagElement(meta: HTMLMetaElement): void {
    this._meta.removeTagElement(meta);
  }

  private _createSelector(tag: MetaDefinition): string {
    const index = this._findIndexWithMeta(tag);
    if (index < 0) {
      return '';
    }
    const m = this.state.meta[index];
    for (const prop in m) {
      if (has(tag, prop) && tag[prop] === m[prop]) {
        return prop + '=' + tag[prop];
      }
    }
    return '';
  }

  private _findWithMeta(tag: MetaDefinition): boolean {
    return this._findIndexWithMeta(tag) > -1;
  }

  private _findIndexWithMeta(tag: MetaDefinition): number {
    for (const key of Object.keys(tag)) {
      const index = this.state.meta.findIndex(val => has(val, key) && val[key] === tag[key]);
      if (index > -1) {
        return index;
      }
    }
    return -1;
  }

  private _add(tag: MetaDefinition) {
    const index = this._findIndexWithMeta(tag);
    const state = new MetaState(this.state);
    if (index > -1) {
      state.meta[index] = tag;
    } else {
      state.meta.push(tag);
    }
    this._setMetaState(state);
    this.state = state;
  }

  private _update(tag: MetaDefinition) {
    const index = this._findIndexWithMeta(tag);
    const state = new MetaState(this.state);
    state.meta[index] = tag;
    this._setMetaState(state);
    this.state = state;
  }

  private _remove(tag: MetaDefinition) {
    const index = this._findIndexWithMeta(tag);
    const state = new MetaState(this.state);
    state.meta.splice(index, 1);
    this._setMetaState(state);
    this.state = state;
  }

  private _setMetaState(state: MetaState): void {
    if (!isEqual(this.state, state)) {
      this._store.dispatch(new SetMetaAction(new MetaState(state)));
      if (this._platform.isBrowser()) {
        return;
      }
      this._transfer.set(TRANSFER_STATE_KEY, state);
    }
  }
}
