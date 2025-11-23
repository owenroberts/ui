import { UIElement } from './Element.js';

export class UIButton extends UIElement {
	constructor(params) {
		super({ ...params, tag: "button"});
		this.addClass(params.btnClass ?? "btn");
		
		this.callback = params.callback;
		this.el.addEventListener('click', params.callback);
		if (params.key) {
			this.keyHandler = params.callback;
		}
	}
}