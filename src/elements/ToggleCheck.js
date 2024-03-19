import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';

export class UIToggleCheck extends UICollection {
	constructor(params) {
		super(params);
		this.callback = params.callback;
		this.addClass('ui-collection');

		// console.log(params);
		this.label = params.label;

		this.check = new UIElement({
			tag: 'input',
			class: 'toggle-check'
		});

		// if (params.label) {
		// 	this.append(new UILabel({
		// 		text: params.label,
		// 	}));
		// }

		this.check.el.type = 'checkbox';
		this.check.el.checked = params.isOn || params.value || false;
		this.check.el.addEventListener('change', ev => {
			if (this.callback) this.callback(ev.target.checked);
			this.check.el.blur();
		});

		this.el.appendChild(this.check.el);
	}

	get value() {
		return this.check.el.checked;
	}

	keyHandler(value) {
		this.update(value !== undefined ? value : !this.value);
	}

	update(value) {
		if (value === undefined) value = !this.value; // it is a toggle ...
		this.check.el.checked = value;
		if (this.callback) this.callback(value);
	}
}