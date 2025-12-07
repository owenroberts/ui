import { UIElement } from '../oi.js';

export class UIButton extends UIElement {
	constructor(params) {
		super({ ...params, tag: "button"});
		if (params.buttonClass) this.addClass(params.buttonClass);
		
		this.callback = params.callback;
		this.el.addEventListener('click', params.callback);
		if (params.key) {
			this.keyHandler = params.callback;
		}
	}
}