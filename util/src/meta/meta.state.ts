// Libs
import { State } from '@seed/interfaces';
// Angular
import { MetaDefinition } from '@angular/platform-browser';

export class MetaState extends State {
	static readonly STORE_NAME = 'meta';

	title: string;
	meta: MetaDefinition[];
}
