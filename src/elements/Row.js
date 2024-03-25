import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';

export class UIRow extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('row');
	}
}