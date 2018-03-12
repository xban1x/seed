import { AnalyticKey } from './key.enum';
import { Event } from './event.model';
import {
	UpdatePropertyAction,
	DeletePropertyAction,
	SendEventAction,
	RetryEventAction
} from './analytics.action';
import { Property } from './property.model';
import { AnalyticsState } from './analytics.state';
// Libs
import { Service } from '@seed/interfaces';
import {
	PlatformService,
	LayoutService,
	PlatformState,
	LayoutState
} from '@seed/util';
import { Config } from '@seed/models';
// Angular
import { Injectable } from '@angular/core';
// NgRx
import { Store } from '@ngrx/store';
// RxJS
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { first } from 'rxjs/operators/first';
// Lodash
import isNil from 'lodash/isNil';
// UUID
import * as uuid from 'uuid/v4';

@Injectable()
export class AnalyticsService<
	T extends any | AnalyticKey = AnalyticKey
> extends Service<AnalyticsState<T>> {
	constructor(
		private readonly _config: Config,
		private readonly _platform: PlatformService,
		private readonly _layout: LayoutService,
		protected readonly _store: Store<any>
	) {
		super(_store, AnalyticsState.STORE_NAME);
		this.subscribe();
		this._initUser();
		this._unsentEvents();
		this._onConfig(this._config);
		this._platform.stateChange.subscribe(state =>
			this._onPlatformChange(state)
		);
		this._layout.stateChange.subscribe(state => this._onLayoutChange(state));
	}

	private _initUser(): void {
		this.updateProperty(
			{
				name: AnalyticKey.DISTINCT_ID,
				value: uuid()
			},
			false
		);
		this.updateProperty(
			{
				name: AnalyticKey.SESSION_ID,
				value: uuid()
			},
			false
		);
	}

	private async _unsentEvents(): Promise<void> {
		if (!this._platform.isOnline()) {
			return;
		}
		if (this.state.events.length === this.state.responses.length) {
			return;
		}
		this.state.events.forEach(event => {
			const item = this.state.responses.find(
				response => response.id === event.id
			);
			if (isNil(item)) {
				this._store.dispatch(new RetryEventAction(event));
			}
		});
	}

	updateProperty(property: Property<T>, override = false): void {
		if (isNil(property.value) || property.value === '') {
			return;
		}
		const item = this.state.properties.find(
			prop => property.name === prop.name
		);
		if (!isNil(item) && (property.value === item.value || !override)) {
			return;
		}
		this._store.dispatch(new UpdatePropertyAction({ property, override }));
	}

	updateProperties(override = false, ...properties: Property<T>[]): void {
		properties.forEach(val => this.updateProperty(val, override));
	}

	deleteProperty(name: string): void {
		this._store.dispatch(new DeletePropertyAction(name));
	}

	sendEvent(event: Event<T>): Observable<boolean> {
		const id = uuid();
		this._onEvent(event);
		this._store.dispatch(new SendEventAction({ id, event }));
		return this.stateChange.pipe(
			map(state => state.responses.find(val => val.id === id)),
			filter(response => !isNil(response)),
			map(response => (response || { response: false }).response),
			first()
		);
	}

	private _onEvent(event: Event<T>): void {
		event.properties = [
			...event.properties,
			...this.state.properties,
			{
				name: AnalyticKey.REFERRER_URL,
				value: this._platform.getReferrer()
			},
			{
				name: AnalyticKey.REFERRER_DOMAIN,
				value: this._platform.getReferrerDomain()
			},
			{
				name: AnalyticKey.BROWSER_URL,
				value: this._platform.getCurrentURL()
			},
			{
				name: AnalyticKey.BROWSER_DOMAIN,
				value: this._platform.getCurrentURLDomain()
			},
			{
				name: AnalyticKey.FULLSCREEN,
				value: this._layout.isFullScreen()
			},
			{
				name: AnalyticKey.TIME,
				value: new Date().getTime()
			}
		];
	}

	private _onConfig(config: Config): void {
		const properties: Property<T>[] = [
			{
				name: AnalyticKey.APP_NAME,
				value: config.app.name
			},
			{
				name: AnalyticKey.APP_VERSION,
				value: config.app.version
			},
			{
				name: AnalyticKey.APP_BUILD_TIME,
				value: config.app.timestamp
			},
			{
				name: AnalyticKey.APP_GIT_HASH,
				value: config.app.hash
			},
			{
				name: AnalyticKey.APP_ENVIRONMENT,
				value: config.env.type
			},
			{
				name: AnalyticKey.APP_PRODUCTION,
				value: config.env.production
			},
			{
				name: AnalyticKey.APP_DEBUG,
				value: config.env.debug
			}
		];
		properties.forEach(val => this.updateProperty(val, true));
	}

	private _onPlatformChange(platform: PlatformState): void {
		const properties: Property<T>[] = [
			{
				name: AnalyticKey.ONLINE,
				value: platform.online
			},
			{
				name: AnalyticKey.NAVIGATION_TYPE,
				value: platform.navigationType
			},
			{
				name: AnalyticKey.NAVIGATION_TYPE,
				value: platform.navigationType
			},
			{
				name: AnalyticKey.DEVICE_NAME,
				value: platform.deviceName
			},
			{
				name: AnalyticKey.DEVICE_TYPE,
				value: platform.deviceType
			},
			{
				name: AnalyticKey.OS_NAME,
				value: platform.operatingSystem
			},
			{
				name: AnalyticKey.OS_VERSION,
				value: platform.operatingSystemVersion.split('.', 2)[0]
			},
			{
				name: AnalyticKey.OS_VERSION_FULL,
				value: platform.operatingSystemVersion
			},
			{
				name: AnalyticKey.BROWSER_NAME,
				value: platform.browser
			},
			{
				name: AnalyticKey.BROWSER_VERSION,
				value: platform.browserVersion.split('.', 2)[0]
			},
			{
				name: AnalyticKey.BROWSER_VERSION_FULL,
				value: platform.browserVersion
			},
			{
				name: AnalyticKey.BROWSER_USER_AGENT,
				value: platform.userAgent
			},
			{
				name: AnalyticKey.BROWSER_CONNECTION_TYPE,
				value: platform.connectionType
			},
			{
				name: AnalyticKey.BROWSER_CONNECTION_EFFECTIVE_TYPE,
				value: platform.connectionEffectiveType
			},
			{
				name: AnalyticKey.INITIAL_REFERRER_URL,
				value: platform.initialReferrer
			},
			{
				name: AnalyticKey.INITIAL_REFERRER_DOMAIN,
				value: platform.initialReferrerDomain
			}
		];
		properties.forEach(val => this.updateProperty(val, true));
	}

	private _onLayoutChange(layout: LayoutState): void {
		const properties: Property<T>[] = [
			{
				name: AnalyticKey.FULLSCREEN,
				value: layout.isFullScreen
			},
			{
				name: AnalyticKey.SCREEN_WIDTH,
				value: this._layout.getScreenWidth()
			},
			{
				name: AnalyticKey.SCREEN_HEIGHT,
				value: this._layout.getScreenHeight()
			},
			{
				name: AnalyticKey.WINDOW_WIDTH,
				value: layout.width
			},
			{
				name: AnalyticKey.WINDOW_HEIGHT,
				value: layout.height
			},
			{
				name: AnalyticKey.SCREEN_ORIENTATION,
				value: layout.orientation
			}
		];
		properties.forEach(val => this.updateProperty(val, true));
	}
}
