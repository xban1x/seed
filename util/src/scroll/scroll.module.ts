import { ScrollService } from './scroll.service';
// Angular
import { NgModule } from '@angular/core';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';

@NgModule({
  providers: [VIEWPORT_RULER_PROVIDER, ScrollService]
})
export class ScrollModule {}
