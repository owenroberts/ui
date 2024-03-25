import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';

export class UINumberStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-step');
		this.addClass('ui-collection'); // should be in UICollection??
		this.prompt = params.prompt;
		this.callback = params.callback;
		this.args = params.args;
		this.step = +params.step || 1;
		this.min = params.range ? +params.range[0] :
			+params.min || 0;
		this.max = params.range ? +params.range[1] :
			+params.max || 1000;

		// constrain range?
		
		this.numberInput = new UIDrag({
			...params,
			class: 'middle',
			onDrag: value => {
				this.update(this.value + this.step * value);
			},
			callback: value => {
				// not DRY repeated in Number.js
				if (typeof value === 'string') {
					if (value.match(/\D/)) {
						try {
							value = eval(value);
						} catch(e) {
							alert("Please enter a numerical value or mathematical expression.");
							return;
						}
					}
				}
				this.update(+value);
			}
		});

		this.stepDown = new UIButton({
			text: '◀',
			class: 'left-end',
			callback: () => {
				this.update(this.value - this.step);
			}
		});

		this.stepUp = new UIButton({
			text: '▶',
			class: 'right-end',
			callback: () => {
				this.update(this.value + this.step);
			}
		});

		this.append(this.stepDown);
		this.append(this.numberInput);
		this.append(this.stepUp);
	}

	keyHandler(value) {
		// this.update(value !== undefined ? +value : prompt(this.prompt));
		this.update(+prompt(this.prompt));
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
		this.value = value;
		// always set value before callback
		if (!uiOnly) {
			if (this.args) this.callback(value, ...this.args);
			else if (this.callback) this.callback(value);
		}
	}

	get html() {
		return this.el;
	}

	set value(value) {
		this.numberInput.value = +value;
	}

	get value() {
		return this.numberInput.value;
	}
}