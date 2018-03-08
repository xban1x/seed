import { PlatformService } from '../platform/index';
// Libs
import { ScrollBehavior } from '@libs/enums';
import { Scroll } from '@libs/models';
// Angular
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class ScrollService {
  constructor(private _platform: PlatformService, private _router: Router) {}

  scrollToTop() {
    this._scroll();
  }

  async navigateAndScroll(scroll: Scroll, route: string[], routeExtras: NavigationExtras) {
    try {
      const res = await this._router.navigate(route, routeExtras);
      if (res) {
        this._scroll(scroll);
      }
    } catch {}
  }

  async navigateAndScrollToTop(route: string[], routeExtras: NavigationExtras) {
    this.navigateAndScroll(
      {
        top: 0,
        left: 0,
        behavior: ScrollBehavior.SMOOTH
      },
      route,
      routeExtras
    );
  }

  private _scroll(
    data: Scroll = {
      top: 0,
      left: 0,
      behavior: ScrollBehavior.SMOOTH
    }
  ) {
    if (!this._platform.isBrowser()) {
      return;
    }
    window.scroll(data);
  }
}
