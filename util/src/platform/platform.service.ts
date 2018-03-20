import { SetPlatformAction } from './platform.action';
import { PlatformState } from './platform.state';
// Libs
import {
	OperatingSystem,
	DeviceType,
	Browser,
	RenderingMode,
	NavigationType
} from '@seed/enums';
import { Service } from '@seed/interfaces';
// Angular
import { Injectable, Injector, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
// NgRx
import { Store } from '@ngrx/store';
// RxJS
import { filter } from 'rxjs/operators/filter';
// Lodash
import isNil from 'lodash/isNil';
import isEqual from 'lodash/isEqual';

const TRANSFER_STATE_KEY = makeStateKey<PlatformState>('PLATFORM_STATE');

@Injectable()
export class PlatformService extends Service<PlatformState> {
	constructor(
		protected readonly _store: Store<any>,
		private readonly _platform: Platform,
		private readonly _router: Router,
		@Inject(DOCUMENT) private readonly _document: Document,
		private readonly _transfer: TransferState,
		private readonly injector: Injector
	) {
		super(_store, PlatformState.STORE_NAME);
		this._init();
	}

	private async _init(): Promise<void> {
		let state: PlatformState = new PlatformState(this.state);

		if (this._platform.isBrowser) {
			if (this._transfer.hasKey(TRANSFER_STATE_KEY)) {
				state = this._transfer.get(TRANSFER_STATE_KEY, new PlatformState());
				const stateBrowser = this._initState();
				if (!isEqual(state, stateBrowser)) {
					state = stateBrowser;
					console.log(
						'PLATFORM: Browser Detection different than Server Detection.'
					);
				}
			} else {
				state = this._initState();
			}

			// Online handling
			if (!isNil(navigator.onLine)) {
				state.online = navigator.onLine;
				window.addEventListener('online', () => this._handleOnlineOffline());
				window.addEventListener('offline', () => this._handleOnlineOffline());
			}

			// Navigation Type handling
			if (!isNil(performance) && !isNil(performance.navigation)) {
				state.navigationType = NavigationType.toString(
					performance.navigation.type
				);

				this._router.events
					.pipe(filter((event: any) => event instanceof NavigationEnd))
					.subscribe(() => {
						if (isNil(performance) || isNil(performance.navigation)) {
							return;
						}
						const newState = new PlatformState(this.state);

						newState.navigationType = NavigationType.toString(
							performance.navigation.type
						);

						this._setPlatformState(newState);
						this.state = newState;
					});
			}

			// Connection Type handling
			if (!isNil(navigator.connection)) {
				state.connectionType = navigator.connection.type;
				state.connectionEffectiveType = navigator.connection.effectiveType;

				navigator.connection.addEventListener('change', () => {
					if (isNil(navigator.connection)) {
						return;
					}
					const newState = new PlatformState(this.state);

					newState.connectionType = navigator.connection.type;
					newState.connectionEffectiveType = navigator.connection.effectiveType;

					this._setPlatformState(newState);
					this.state = newState;
				});
			}

			// Fullscreen handling

			state.renderingMode = RenderingMode.BROWSER;
		} else {
			const headers = this.injector.get('Headers');
			state = this._initState(headers);
		}
		this._setPlatformState(state);
		this.state = state;
	}

	private _initState(headers?: any): PlatformState {
		let userAgent: string | undefined;

		if (this._platform.isBrowser) {
			userAgent = navigator.userAgent;
		} else if (!isNil(headers)) {
			userAgent = headers['user-agent'];
		}

		const state = new PlatformState(this.state);

		if (isNil(userAgent)) {
			return state;
		}

		state.renderingMode = RenderingMode.SERVER;

		state.userAgent = userAgent;

		state.initialReferrer = this.getReferrer();

		state.initialReferrerDomain = this.getReferrerDomain();

		this._userAgentDetection(state);
		this._findOSVersion(state);
		this._findBrowserVersion(state);
		this._findDeviceName(state);

		if (!isNil(state.browserVersion)) {
			state.browserVersion = state.browserVersion.replace(/(-|_| |\/|,)/, '.');
		}
		if (!isNil(state.operatingSystemVersion)) {
			state.operatingSystemVersion = state.operatingSystemVersion.replace(
				/(-|_| |\/|,)/,
				'.'
			);
		}

		return state;
	}

	private _extractDomain(url: string): string {
		if (isNil(url) || isEqual(url, '') || isEqual(url, '$direct')) {
			return url;
		}
		return new URL(url).hostname;
	}

	private _userAgentDetection(state: PlatformState) {
		if (/iPad|iPhone|iPod/.test(state.userAgent)) {
			state.operatingSystem = OperatingSystem.IOS;
			state.deviceType = DeviceType.MOBILE;
		} else if (/(a|A)ndroid/.test(state.userAgent)) {
			state.operatingSystem = OperatingSystem.ANDROID;
			state.deviceType = DeviceType.MOBILE;
		} else if (/Mac/.test(state.userAgent)) {
			state.operatingSystem = OperatingSystem.MAC_OS;
			state.deviceType = DeviceType.DESKTOP;
		} else if (/Win/.test(state.userAgent)) {
			state.operatingSystem = OperatingSystem.WINDOWS;
			state.deviceType = DeviceType.DESKTOP;
		} else if (/Linux/.test(state.userAgent)) {
			state.operatingSystem = OperatingSystem.LINUX;
			state.deviceType = DeviceType.DESKTOP;
		}

		if (/(msie|trident)/i.test(state.userAgent)) {
			state.browser = Browser.IE;
		} else if (/SamsungBrowser/.test(state.userAgent)) {
			state.browser = Browser.SAMSUNG_INTERNET;
		} else if (/Chrome/.test(state.userAgent)) {
			state.browser = Browser.CHROME;
		} else if (/CriOS/.test(state.userAgent)) {
			state.browser = Browser.CHROME_IOS;
		} else if (/(Firefox|minefield)/.test(state.userAgent)) {
			state.browser = Browser.FIREFOX;
		} else if (/FxiOS/.test(state.userAgent)) {
			state.browser = Browser.FIREFOX_IOS;
		} else if (/edge/.test(state.userAgent)) {
			state.browser = Browser.EDGE;
		} else if (/Opera/.test(state.userAgent)) {
			state.browser = Browser.OPERA;
		} else if (/GSA/.test(state.userAgent)) {
			state.browser = Browser.GOOGLE_SEARCH_APP_IOS;
		} else if (state.operatingSystem === OperatingSystem.MAC_OS) {
			state.browser = Browser.SAFARI;
		} else if (state.operatingSystem === OperatingSystem.IOS) {
			state.browser = Browser.SAFARI_IOS;
		}
	}

	private _findOSVersion(state: PlatformState) {
		if (state.operatingSystem === OperatingSystem.IOS) {
			const match = state.userAgent.match(/(iPhone|CPU) OS (\d\_?){1,3}/g);
			if (isNil(match)) {
				return;
			}
			state.operatingSystemVersion = match[0].split(' ', 3)[2];
			return;
		}
		if (state.operatingSystem === OperatingSystem.ANDROID) {
			const match = state.userAgent.match(/Android (\d\.?){1,3}/g);
			if (isNil(match)) {
				return;
			}
			state.operatingSystemVersion = match[0].split(' ', 2)[1];
			return;
		}
		if (state.operatingSystem === OperatingSystem.WINDOWS) {
			const match = state.userAgent.match(/Windows NT (\d*\_?){1,3}/g);
			if (isNil(match)) {
				return;
			}
			state.operatingSystemVersion = match[0].split(' ', 3)[2];
			return;
		}
		if (state.operatingSystem === OperatingSystem.MAC_OS) {
			const match = state.userAgent.match(/Mac OS X (\d*\_?){1,3}/g);
			if (isNil(match)) {
				return;
			}
			state.operatingSystemVersion = match[0].split(' ', 4)[3];
			return;
		}
	}

	private _findBrowserVersion(state: PlatformState) {
		if (
			state.browser === Browser.SAFARI ||
			state.browser === Browser.SAFARI_IOS
		) {
			const match = state.userAgent.match(/Version\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (
			state.browser === Browser.CHROME ||
			state.browser === Browser.CHROME_IOS
		) {
			const match = state.userAgent.match(/(CriOS|Chrome)\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (
			state.browser === Browser.FIREFOX ||
			state.browser === Browser.FIREFOX_IOS
		) {
			const match = state.userAgent.match(/(FxiOS|Firefox)\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (state.browser === Browser.SAMSUNG_INTERNET) {
			const match = state.userAgent.match(/SamsungBrowser\/\d\.\d/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (state.browser === Browser.EDGE) {
			const match = state.userAgent.match(/Edge\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (state.browser === Browser.GOOGLE_SEARCH_APP_IOS) {
			const match = state.userAgent.match(/GSA\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
		if (state.browser === Browser.IE) {
			const match = state.userAgent.match(/rv:\/(\d*\.?)*/g);
			if (isNil(match)) {
				return;
			}
			state.browserVersion = match[0].split('/', 2)[1];
			return;
		}
	}

	private _findDeviceName(state: PlatformState): void {
		if (state.deviceType !== DeviceType.MOBILE) {
			return;
		}
		if (state.operatingSystem === OperatingSystem.IOS) {
			if (/iPad/.test(state.userAgent)) {
				state.deviceName = 'iPad';
			}
			if (/iPhone/.test(state.userAgent)) {
				state.deviceName = 'iPhone';
			}
			if (/iPod/.test(state.userAgent)) {
				state.deviceName = 'iPod';
			}
		} else if (state.operatingSystem === OperatingSystem.ANDROID) {
			const match = state.userAgent.match(
				/Android (\d\.?){1,3}; (\w*(-\w*)? )*/g
			)[0];
			if (isNil(match)) {
				return;
			}
			const splits = match.trim().split(' ');
			state.deviceName = splits[splits.length - 1];
		}
	}

	private _handleOnlineOffline(): void {
		if (isNil(navigator.onLine)) {
			return;
		}
		const state = new PlatformState(this.state);

		state.online = navigator.onLine;

		this._setPlatformState(state);
		this.state = state;
	}

	private _setPlatformState(state: PlatformState): void {
		if (!isEqual(this.state, state)) {
			this._store.dispatch(new SetPlatformAction(state));
			if (this._platform.isBrowser) {
				return;
			}
			this._transfer.set(TRANSFER_STATE_KEY, state);
		}
	}

	/**
	 *  Util methods
	 */

	isOnline(): boolean {
		return this.state.online;
	}

	isBrowser(): boolean {
		return this.state.renderingMode === RenderingMode.BROWSER;
	}

	isServer(): boolean {
		return this.state.renderingMode === RenderingMode.SERVER;
	}

	isOSVersion(target: number): boolean {
		if (isNil(this.state.operatingSystemVersion)) {
			return false;
		}
		return this.state.operatingSystemVersion.startsWith('' + target);
	}

	isBrowserVersion(target: number): boolean {
		if (isNil(this.state.browserVersion)) {
			return false;
		}
		return this.state.browserVersion.startsWith('' + target);
	}

	isiOs(): boolean {
		return this.state.operatingSystem === OperatingSystem.IOS;
	}

	isAndroid(): boolean {
		return this.state.operatingSystem === OperatingSystem.ANDROID;
	}

	isWindows(): boolean {
		return this.state.operatingSystem === OperatingSystem.WINDOWS;
	}

	isMacOs(): boolean {
		return this.state.operatingSystem === OperatingSystem.MAC_OS;
	}

	isLinux(): boolean {
		return this.state.operatingSystem === OperatingSystem.LINUX;
	}

	isMobile(): boolean {
		return this.state.deviceType === DeviceType.MOBILE;
	}

	isDesktop(): boolean {
		return this.state.deviceType === DeviceType.DESKTOP;
	}

	isChrome(): boolean {
		return (
			this.state.browser === Browser.CHROME ||
			this.state.browser === Browser.CHROME_IOS
		);
	}

	isFirefox(): boolean {
		return (
			this.state.browser === Browser.FIREFOX ||
			this.state.browser === Browser.FIREFOX_IOS
		);
	}

	isSafari(): boolean {
		return (
			this.state.browser === Browser.SAFARI ||
			this.state.browser === Browser.SAFARI_IOS
		);
	}

	isEdge(): boolean {
		return this.state.browser === Browser.EDGE;
	}

	isIE(): boolean {
		return this.state.browser === Browser.IE;
	}

	isSamsungInternet(): boolean {
		return this.state.browser === Browser.SAMSUNG_INTERNET;
	}

	isOpera(): boolean {
		return this.state.browser === Browser.OPERA;
	}

	getOSName(): string {
		return this.state.operatingSystem;
	}

	getBrowserName(): string {
		return this.state.browser;
	}

	getCurrentURL(): string {
		return this._document.location.href;
	}

	getCurrentURLDomain(): string {
		return this._document.location.hostname;
	}

	getReferrer(): string {
		return this._document.referrer;
	}

	getReferrerDomain(): string {
		return this._extractDomain(this._document.referrer);
	}

	getUserAgent(): string {
		return this.state.userAgent;
	}
}
