import { UIElement } from './Element.js';

export class UILabel extends UIElement {
	constructor(params) {
		params.tag = "label";
		super(params);
		this.text = params.text;
	}
}