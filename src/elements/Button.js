import { UIElement } from './Element.js';
import { KeyMixins } from './Behaviors.js';

export class UIButton extends UIElement {
	constructor(params) {
		super({ ...params, tag: "button"});
		this.addClass(params.btnClass ?? "btn"); /* for diff types of button */

		const args = params.args ?? [];
		function callback() {
			params.callback(...args);
		}
		this.el.addEventListener('click', callback);

		if (params.key) {
			Object.assign(this, KeyMixins);
			this.setKey(params.key, this.text);
			
			// sometimes keyhandler is different than callback
			this.keyHandler = callback;
		}
	}
}