import { UIElement } from './Element.js';
import { KeyMixins } from './Behaviors.js';

export class UIInput extends UIElement {
	constructor(params) {
		super({ ...params, tag: 'input' });
		this.obj = params.obj;
		this.ref = params.ref;

		if (this.obj && this.ref) {
			this.value = this.obj[this.ref];
			this.id = this.ref;
			this.el.id = this.ref;
		}

		this.callback = params.callback;
		// this.args = params.args || [];
		if (typeof params.value !== 'undefined') this.value = params.value;

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