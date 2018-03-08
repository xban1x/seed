// Libs
import { ScrollBehavior } from '@libs/enums';

export interface Scroll {
  top: number;
  left: number;
  behavior?: ScrollBehavior;
}
