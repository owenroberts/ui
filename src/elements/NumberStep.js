import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';
import { NumberMixins } from './Behaviors.js';

export class UINumberStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-step');
		Object.assign(this, NumberMixins);

		this.prompt = params.prompt;
		this.callback = params.callback;
		this.args = params.args; // use this ??
		
		const step = +params.step || 1;
		
		this.min = params.range ? 
			+params.range[0] :
			+(params.min ?? 0);
		this.max = params.range ? 
			+params.range[1] :
			+(params.max ?? 1000);

		// constrain range?
		
		this.numberInput = new UIDrag({
			...params,
			class: 'middle',
			onDrag: value => {
				this.update(this.value + step * value);
			},
			callback: value => {
				value = this.formatNumberInput(value);
				this.update(value);
			}
		});

		const stepDown = this.append(new UIButton({
			text: '◀',
			class: 'left-end',
			callback: () => {
				this.update(this.value - step);
			}
		}));

		// number in between step buttons
		this.append(this.numberInput);

		const stepUp = this.append(new UIButton({
			text: '▶',
			class: 'right-end',
			callback: () => {
				this.update(this.value + step);
			}
		}));
	}

	keyHandler(value) {
		this.update(this.formatNumberInput(prompt(this.prompt)));
	}

	update(value, uiOnly) {
		if (value === undefined) value = prompt(this.prompt);
		if (value === undefined || value === null || value === '') {
			console.trace();
			return alert('No value entered.');
		} else {
			value = +value;
		}

		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		this.value = this.formatNumberInput(value);
		// always set value before callback
		if (!uiOnly) {
			if (this.args) this.callback(value, ...this.args);
			else if (this.callback) this.callback(value);
		}
	}

	set value(value) {
		this.numberInput.value = +value;
	}

	get value() {
		return this.numberInput.value;
	}
}