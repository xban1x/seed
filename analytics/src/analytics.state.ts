import { AnalyticKey } from './key.enum';
import { Property } from './property.model';
import { Response } from './response.model';
import { Event } from './event.model';
// Libs
import { State } from '@libs/interfaces';

export class AnalyticsState<T extends any | AnalyticKey = AnalyticKey> extends State {
  static readonly STORE_NAME = 'analytics';
  events: { id: string, event: Event }[];
  properties: Property<T>[];
  propertiesVersions: [ Property<T>[] ];
  responses: Response[];
}
