// Libs
// Angular
import { MetaDefinition } from '@angular/platform-browser';
import { State } from '@seed/interfaces';

export class MetaState extends State {
	static readonly STORE_NAME = 'meta';

	title: string;
	meta: MetaDefinition[];
}
