import { UIElement, UICollection } from '../oi.js';

export class UIRow extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('row');
	}
}