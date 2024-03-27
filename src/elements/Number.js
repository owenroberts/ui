import { UIText } from './Text.js';
import { NumberMixins } from './Behaviors.js';

export class UINumber extends UIText {
	constructor(params) {
		super(params);
		this.el.classList.add('number');
		if (!this.placeholder) {
			this.placeholder = 0;
			this.el.placeholder = 0;
		}
		Object.assign(this, NumberMixins);
	}

	update(value, uiOnly) {
		if (value === undefined) return;
		value = this.formatNumberInput(value);
		this.value = value; // always set value before callback
		if (this.callback && !uiOnly) this.callback(value);
	}

	keyHandler(value) {
		this.update(+prompt(this.prompt));
	}
}