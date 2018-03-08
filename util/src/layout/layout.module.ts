import { LayoutState } from './layout.state';
import { LayoutService } from './layout.service';
import { layoutReducer } from './layout.reducer';
// NgRx
import { StoreModule } from '@ngrx/store';
// Angular
import { NgModule } from '@angular/core';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';

@NgModule({
  imports: [StoreModule.forFeature(LayoutState.STORE_NAME, layoutReducer)],
  providers: [VIEWPORT_RULER_PROVIDER, LayoutService]
})
export class LayoutModule {}
