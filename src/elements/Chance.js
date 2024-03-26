import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UILabel } from './Label.js';

export class UIChance extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('value-bg');

		this.value = params.value;
		this.min = params.min ?? 0;
		this.max = params.max ?? 1;
		this.step = params.step ?? 0.01;
		this.total = this.max - this.min;
		if (params.callback) this.callback = params.callback;

		const label = this.append(new UILabel({
			text: params.label
		}));

		this.drag = this.append(new UIDrag({
			value: params.value,
			onDrag: change => {
				// this.update(this.value + this.step * change * 10); // why?
				this.update(this.value + this.step * change);
			},
			callback: value => {
				this.update(+value);
			}
		}));

		this.updateStyle();
	}

	updateStyle() {
		const pct = Math.round((this.value - this.min) / this.total * 100);
		this.setStyle('--value-percent', pct);
	}

	update(value, uiOnly) {
		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		this.value = +value.toFixed(3);
		this.drag.value = this.value;
		this.updateStyle()
		if (!uiOnly) {
			if (this.args) this.callback(value, ...this.args);
			else this.callback(value);
		}
	}
}