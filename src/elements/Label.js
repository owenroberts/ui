import { UIElement } from './Element.js';

export class UILabel extends UIElement {
	constructor(params) {
		super({ ...params, tag: "label" });
		this.text = params.text;
	}
}