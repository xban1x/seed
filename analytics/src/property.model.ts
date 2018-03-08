import { AnalyticKey } from './key.enum';
export class Property<T extends any | AnalyticKey = AnalyticKey> {
  name: T | AnalyticKey;
  value: any;
}
