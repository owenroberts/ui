import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';

export class UIInputStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('input-step');

		this.options = params.options ?? [];
		this.index = params.value !== undefined ? 
			params.options.indexOf(params.value) : 
			0;
		this.callback = params.callback;

		this.textInput = new UIDrag({
			value: params.value,
			class: 'left-end',
			onDrag: value => {
				if (this.index + value >= 0 && this.index + value < this.options.length) {
					this.index += value;
				}
				this.update(this.options[this.index]);
			},
			callback: value => {
				this.update(this.value); // handle mis types on app end
			}
		});

		const stepDown = new UIButton({
			text: '▼',
			class: 'middle',
			callback: () => {
				if (this.index > 0) this.index -= 1;
				this.update(this.options[this.index]);
			}
		});

		const stepUp = new UIButton({
			text: '▲',
			class: 'right-end',
			callback: () => {
				if (this.index < this.options.length - 1) this.index += 1;
				this.update(this.options[this.index]);
			}
		});

		this.append(this.textInput);
		this.append(stepDown);
		this.append(stepUp);
	}

	update(value, uiOnly) {
		if (!this.options.includes(value)) return;
		this.value = value; // always set value before callback
		if (!uiOnly && this.callback) {
			if (this.args) this.callback(value, ...this.args);
			else this.callback(value);
		}
	}

	set value(value) {
		if (!this.options.includes(value)) return;
		this.index = this.options.indexOf(value);
		this.textInput.value = value;
	}

	get value() {
		return this.textInput.value;
	}
}