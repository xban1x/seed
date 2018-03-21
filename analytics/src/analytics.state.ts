// Libs
import { State } from '@seed/interfaces';
import { Event } from './event.model';
import { AnalyticKey } from './key.enum';
import { Property } from './property.model';
import { Response } from './response.model';

export class AnalyticsState<
	T extends any | AnalyticKey = AnalyticKey
> extends State {
	static readonly STORE_NAME = 'analytics';
	events: Array<{ id: string; event: Event }>;
	properties: Array<Property<T>>;
	propertiesVersions: [Array<Property<T>>];
	responses: Response[];
}
