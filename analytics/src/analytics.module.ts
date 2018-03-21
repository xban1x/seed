// Angular
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
// NgRx
import { StoreModule } from '@ngrx/store';
import { AnalyticsEffects } from './analytics.effects';
import { analyticsReducer } from './analytics.reducer';
import { AnalyticsService } from './analytics.service';
import { AnalyticsState } from './analytics.state';

@NgModule( {
  imports: [ StoreModule.forFeature( AnalyticsState.STORE_NAME, analyticsReducer ), EffectsModule.forFeature( [ AnalyticsEffects ] ) ],
  providers: [ AnalyticsService ]
} )
export class AnalyticsModule { }
