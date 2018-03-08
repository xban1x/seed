import { VideoExtras, AudioExtras } from './models/index';
import { OGType } from './enums/index';
// Angular
import { Injectable } from '@angular/core';
// Libs
import { MetaService } from '@libs/util';
// Lodash
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

@Injectable()
export class OpenGraphService {
  constructor(private _meta: MetaService) {}

  setTitle(title: string, titleBar?: string): void {
    if (isNil(title) || isEqual(title, '')) {
      return;
    }
    this._meta.setTitle(titleBar || title);
    this._meta.updateTag({ property: 'og:title', content: title }, true);
  }

  setDescription(description: string): void {
    this._meta.updateTag({ property: 'description', content: description }, true);
    this._meta.updateTag({ property: 'og:description', content: description }, true);
  }

  setType(type: OGType): void {
    this._meta.updateTag({ property: 'og:type', content: type }, true);
  }

  setImage(url: string, imageExtras?: VideoExtras): void {
    this._meta.updateTag({ property: 'og:image:url', content: url }, true);
    if (isNil(imageExtras)) {
      return;
    }
    if (imageExtras.secureUrl) {
      this._meta.updateTag({ property: 'og:image:secure_url', content: imageExtras.secureUrl }, true);
    }
    if (imageExtras.type) {
      this._meta.updateTag({ property: 'og:image:type', content: imageExtras.type }, true);
    }
    if (imageExtras.width) {
      this._meta.updateTag({ property: 'og:image:width', content: '' + imageExtras.width }, true);
    }
    if (imageExtras.height) {
      this._meta.updateTag({ property: 'og:image:type', content: '' + imageExtras.height }, true);
    }
    if (imageExtras.alt) {
      this._meta.updateTag({ property: 'og:image:alt', content: imageExtras.alt }, true);
    }
  }

  setVideo(url: string, videoExtras?: VideoExtras): void {
    this._meta.updateTag({ property: 'og:video:url', content: url }, true);
    if (isNil(videoExtras)) {
      return;
    }
    if (videoExtras.secureUrl) {
      this._meta.updateTag({ property: 'og:video:secure_url', content: videoExtras.secureUrl }, true);
    }
    if (videoExtras.type) {
      this._meta.updateTag({ property: 'og:video:type', content: videoExtras.type }, true);
    }
    if (videoExtras.width) {
      this._meta.updateTag({ property: 'og:video:width', content: '' + videoExtras.width }, true);
    }
    if (videoExtras.height) {
      this._meta.updateTag({ property: 'og:video:type', content: '' + videoExtras.height }, true);
    }
    if (videoExtras.alt) {
      this._meta.updateTag({ property: 'og:video:alt', content: videoExtras.alt }, true);
    }
  }

  setAudio(url: string, audioExtras?: AudioExtras): void {
    this._meta.updateTag({ property: 'og:audio:url', content: url }, true);
    if (isNil(audioExtras)) {
      return;
    }
    if (audioExtras.secureUrl) {
      this._meta.updateTag({ property: 'og:audio:secure_url', content: audioExtras.secureUrl }, true);
    }
    if (audioExtras.type) {
      this._meta.updateTag({ property: 'og:audio:type', content: audioExtras.type }, true);
    }
  }

  setURL(url: string): void {
    this._meta.updateTag({ property: 'og:url', content: url });
  }
}
