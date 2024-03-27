import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { KeyMixins } from './Behaviors.js';

export class UIToggleCheck extends UICollection {
	constructor(params) {
		super(params);
		
		this.callback = params.callback;
		this.check = this.add(new UIElement({
			tag: 'input',
			class: 'toggle-check'
		}));

		this.check.el.type = 'checkbox';
		this.check.el.checked = params.isOn || params.value || false;
		this.check.el.addEventListener('change', ev => {
			if (this.callback) this.callback(ev.target.checked);
			this.check.el.blur();
		});

		if (params.key) {
			Object.assign(this, KeyMixins);
			this.setKey(params.key, params.label);
		}
	}

	/* get set more consistent, maybe chance later ... */

	get value() {
		return this.check.el.checked;
	}

	set value(value) {
		this.check.el.checked = false;
	}

	keyHandler(value) {
		this.update(value !== undefined ? value : !this.value);
	}

	update(value) {
		if (value === undefined) value = !this.value; // it is a toggle ...
		this.value = value;
		if (this.callback) this.callback(value);
	}
}