import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
// Angular
import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
// NgRx
import { Store } from '@ngrx/store';
// Libs
import { Service } from '@seed/interfaces';
import isEqual from 'lodash/isEqual';
// Lodash
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
// Validator
import * as isHexColor from 'validator/lib/isHexColor';
import { PlatformService } from '../platform/index';
import { SetLayoutAction } from './layout.action';
import { LayoutState } from './layout.state';

@Injectable()
export class LayoutService extends Service<LayoutState> {
	/**
	 * Instace of Renderer2 injected from root component
	 */
	renderer: Renderer2;
	private _rootCmp: ElementRef;
	private _fullScreenSupport: boolean;

	constructor(
		protected _store: Store<any>,
		private _platform: PlatformService,
		private _viewport: ViewportRuler,
		@Inject(DOCUMENT) private _document: Document
	) {
		super(_store, LayoutState.STORE_NAME);
		this._init();
	}

	private async _init(): Promise<void> {
		if (!this._platform.isBrowser()) {
			return;
		}

		this._fullScreenSupport = this._fullScreenPolyfill();

		if (this._fullScreenSupport) {
			this._document.addEventListener('fullscreenchange', () =>
				this._handleFullScreen()
			);
			this._document.addEventListener('webkitfullscreenchange', () =>
				this._handleFullScreen()
			);
			this._document.addEventListener('mozfullscreenchange', () =>
				this._handleFullScreen()
			);
		}

		const state = this._calculateState();

		state.pixelDensity = window.devicePixelRatio;
		state.isFullScreen = this.isFullScreen();

		this._setLayoutState(state);

		this._viewport.change(100).subscribe(() => this._onResize());

		if (this._platform.isMobile()) {
			setInterval(() => this._onResize(), 500);
		}
		return;
	}

	setDependencies(rootCmp: ElementRef, renderer: Renderer2): void {
		this.renderer = renderer;
		this._rootCmp = rootCmp;
	}

	/**
	 * Sets the background color of body element
	 * @param color Hex color string
	 */
	setBackgroundColor(color: string): void {
		if (isNil(color)) {
			return;
		}
		if (!isString(color)) {
			return;
		}
		if (!isHexColor(color)) {
			return;
		}
		const state = new LayoutState(this.state);
		state.backgroundColor = color;
		if (!isNil(this._rootCmp)) {
			this.renderer.setStyle(
				this._rootCmp.nativeElement,
				'background-color',
				color
			);
		}
		this.renderer.setStyle(this._document.body, 'background-color', color);
		this._setLayoutState(state);
	}

	openFullscreen(): void {
		if (!this._fullScreenSupport) {
			return;
		}
		this._document.body.requestFullScreen();
		if (isNil(this.state.backgroundColor)) {
			this.setBackgroundColor('#fff');
		}
	}

	getScreenWidth(): number {
		if (!this._platform.isBrowser()) {
			return 0;
		}
		return window.screen.width;
	}

	getScreenHeight(): number {
		if (!this._platform.isBrowser()) {
			return 0;
		}
		return window.screen.height;
	}

	isFullScreen(): boolean {
		return !!(
			this._document.webkitIsFullScreen ||
			this._document.mozFullScreen ||
			this._document.isFullScreen
		);
	}

	private _handleFullScreen(): void {
		const state = new LayoutState(this.state);
		state.isFullScreen = this.isFullScreen();
		this._setLayoutState(state);
	}

	private _fullScreenPolyfill(): boolean {
		try {
			this._document.body.requestFullScreen =
				this._document.body.webkitRequestFullScreen ||
				this._document.body.mozRequestFullScreen ||
				this._document.body.requestFullScreen;
			this._document.cancelFullScreen =
				this._document.webkitCancelFullScreen ||
				this._document.mozCancelFullScreen ||
				this._document.cancelFullScreen;
			return (
				!isNil(this._document.body.requestFullScreen) &&
				!isNil(this._document.cancelFullScreen)
			);
		} catch (err) {
			return false;
		}
	}

	private _onResize(): void {
		this._setLayoutState(this._calculateState());
	}

	private _calculateState(): LayoutState {
		const state = new LayoutState(this.state);
		state.viewport = this._viewport.getViewportSize();
		return state;
	}

	private _setLayoutState(state: LayoutState): void {
		if (!isEqual(this.state, state)) {
			this._store.dispatch(new SetLayoutAction(state));
			this.state = state;
		}
	}
}
