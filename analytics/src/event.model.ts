import { AnalyticKey } from './key.enum';
import { Property } from './property.model';

export class Event<T extends any | AnalyticKey = AnalyticKey> {
  name: string;
  properties: Array<Property<T>>;
}
