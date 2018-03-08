import { MetaState } from './meta.state';
import { MetaService } from './meta.service';
import { metaReducer } from './meta.reducer';
// NgRx
import { StoreModule } from '@ngrx/store';
// Angular
import { NgModule } from '@angular/core';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';

@NgModule({
  imports: [StoreModule.forFeature(MetaState.STORE_NAME, metaReducer)],
  providers: [VIEWPORT_RULER_PROVIDER, MetaService]
})
export class MetaModule {}
