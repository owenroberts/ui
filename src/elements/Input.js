import { UIElement } from './Element.js';
import { KeyMixins } from './Behaviors.js';

export class UIInput extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'input' });
		this.callback = params.callback;
		// this.args = params.args || [];
		if (params.value) this.value = params.value;

		if (params.key) {
			Object.assign(this, KeyMixins);
			this.setKey(params.key, params.label);
		}
	}

	get value() {
		return this.el.value;
	}

	set value(value) {
		this.el.value = value;
	}
}