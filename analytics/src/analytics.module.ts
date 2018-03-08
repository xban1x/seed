import { AnalyticsEffects } from './analytics.effects';
import { AnalyticsState } from './analytics.state';
import { AnalyticsService } from './analytics.service';
import { analyticsReducer } from './analytics.reducer';
// Angular
import { NgModule } from '@angular/core';
// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule( {
  imports: [ StoreModule.forFeature( AnalyticsState.STORE_NAME, analyticsReducer ), EffectsModule.forFeature( [ AnalyticsEffects ] ) ],
  providers: [ AnalyticsService ]
} )
export class AnalyticsModule { }
