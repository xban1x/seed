import { OpenGraphService } from './open-graph.service';
// Angular
import { NgModule } from '@angular/core';
// Libs
import { MetaModule } from '@seed/util';

@NgModule({
	imports: [MetaModule],
	providers: [OpenGraphService]
})
export class OpenGraphModule {}
