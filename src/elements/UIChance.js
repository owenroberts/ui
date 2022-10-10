class UIChance extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('value-bg');
		this.step = params.step;
		this.min = params.min;
		this.max = params.max;
		this.value = params.value;
		this.total = params.max - params.min;
		if (params.callback) this.callback = params.callback;

		this.drag = new UIDrag({
			value: params.value,
			drag: change => {
				this.update(this.value + this.step * change * 10);
			},
			callback: value => {
				this.update(+value);
			}
		});

		const label = new UILabel({
			text: params.label
		});

		this.append(label);
		this.append(this.drag);
		this.setProp('--value-percent', Math.round((this.value - this.min) / this.total * 100));
	}

	update(value, uiOnly) {
		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		this.value = +value.toFixed(3);
		this.drag.value = this.value;
		this.setProp('--value-percent', Math.round((this.value - this.min) / this.total * 100));
		if (!uiOnly) {
			if (this.args) this.callback(value, ...this.args);
			else this.callback(value);
		}
	}
}

UI.Elements.UIChance = UIChance;