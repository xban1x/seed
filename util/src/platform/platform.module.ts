import { PlatformState } from './platform.state';
import { PlatformService } from './platform.service';
import { platformReducer } from './platform.reducer';
// NgRx
import { StoreModule } from '@ngrx/store';
// Angular
import { NgModule } from '@angular/core';
import { PlatformModule as Platform } from '@angular/cdk/platform';

@NgModule({
  imports: [Platform, StoreModule.forFeature(PlatformState.STORE_NAME, platformReducer)],
  providers: [PlatformService]
})
export class PlatformModule {}
