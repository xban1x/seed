import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
// Angular
import { NgModule } from '@angular/core';
// NgRx
import { StoreModule } from '@ngrx/store';
import { metaReducer } from './meta.reducer';
import { MetaService } from './meta.service';
import { MetaState } from './meta.state';

@NgModule({
  imports: [StoreModule.forFeature(MetaState.STORE_NAME, metaReducer)],
  providers: [VIEWPORT_RULER_PROVIDER, MetaService]
})
export class MetaModule {}
