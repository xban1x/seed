import { PlatformModule as Platform } from '@angular/cdk/platform';
// Angular
import { NgModule } from '@angular/core';
// NgRx
import { StoreModule } from '@ngrx/store';
import { platformReducer } from './platform.reducer';
import { PlatformService } from './platform.service';
import { PlatformState } from './platform.state';

@NgModule({
  imports: [Platform, StoreModule.forFeature(PlatformState.STORE_NAME, platformReducer)],
  providers: [PlatformService]
})
export class PlatformModule {}
