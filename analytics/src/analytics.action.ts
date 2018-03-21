// NgRx
import { Action } from '@ngrx/store';
import { Event } from './event.model';
import { Property } from './property.model';

export enum AnalyticsActions {
	UPDATE_PROPERTY = '[Analytics] Update property',
	DELETE_PROPERTY = '[Analytics] Delete property',
	SEND_EVENT = '[Analytics] Send event',
	RETRY_EVENT = '[Analytics] Retry event',
	SEND_RESPONSE = '[Analytics] Send response'
}

export class UpdatePropertyAction implements Action {
	readonly type = AnalyticsActions.UPDATE_PROPERTY;

	constructor(public payload: { property: Property<any>; override: boolean }) {}
}

export class DeletePropertyAction implements Action {
	readonly type = AnalyticsActions.DELETE_PROPERTY;

	constructor(public payload: string) {}
}

export class SendEventAction implements Action {
	readonly type = AnalyticsActions.SEND_EVENT;

	constructor(public payload: { id: string; event: Event<any> }) {}
}

export class RetryEventAction implements Action {
	readonly type = AnalyticsActions.RETRY_EVENT;

	constructor(public payload: { id: string; event: Event<any> }) {}
}

export class SendResponseAction implements Action {
	readonly type = AnalyticsActions.SEND_RESPONSE;

	constructor(public payload: { id: string; response: boolean }) {}
}

export type AnalyticsActionsType =
	| UpdatePropertyAction
	| DeletePropertyAction
	| SendEventAction
	| RetryEventAction
	| SendResponseAction;
