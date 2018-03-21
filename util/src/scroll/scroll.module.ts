import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
// Angular
import { NgModule } from '@angular/core';
import { ScrollService } from './scroll.service';

@NgModule({
  providers: [VIEWPORT_RULER_PROVIDER, ScrollService]
})
export class ScrollModule {}
