import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
// Angular
import { NgModule } from '@angular/core';
// NgRx
import { StoreModule } from '@ngrx/store';
import { layoutReducer } from './layout.reducer';
import { LayoutService } from './layout.service';
import { LayoutState } from './layout.state';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  imports: [PlatformModule , StoreModule.forFeature(LayoutState.STORE_NAME, layoutReducer)],
  providers: [VIEWPORT_RULER_PROVIDER, LayoutService]
})
export class LayoutModule {}
