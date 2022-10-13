class UINumberStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('number-step');
		this.addClass('ui-collection'); // should be in UICollection??
		this.callback = params.callback;
		this.args = params.args;
		this.step = +params.step || 1;
		this.min = params.range ? +params.range[0] :
			+params.min || 0;
		this.max = params.range ? +params.range[1] :
			+params.max || 100;

		// constrain range?
		
		this.numberInput = new UIDrag({
			...params,
			class: 'middle',
			drag: value => {
				this.update(this.value + this.step * value);
			},
			callback: value => {
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
		if (value === undefined || value === null || value === '') return alert('No value entered.');
		else value = +value;
		if (value < this.min) value = this.min;
		if (value > this.max) value = this.max;
		this.value = value;
		// always set value before callback
		if (!uiOnly) {
			if (this.args) this.callback(value, ...this.args);
			else this.callback(value);
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

UI.Elements.UINumberStep = UINumberStep;
