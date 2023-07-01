class UIListStep extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('list-step');
		this.addClass('ui-collection');

		const list = params.list;
		let index = params.value !== undefined ? params.list.indexOf(params.value) : 0;
		if (params.callback) this.callback = params.callback;

		this.textInput = new UIDrag({
			value: params.value,
			class: 'left-end',
			drag: value => {
				if (index + value >= 0 && index + value < list.length) {
					index += value;
				}
				this.update(list[index]);
			},
			callback: value => {
				// if (list.includes(value)) this.update(value);
				this.update(value); // handle mis types on app end
			}
		});

		const stepDown = new UIButton({
			text: '▼',
			class: 'middle',
			callback: () => {
				if (index > 0) index -= 1;
				this.update(list[index]);
			}
		});

		const stepUp = new UIButton({
			text: '▲',
			class: 'right-end',
			callback: () => {
				if (index < list.length - 1) index += 1;
				this.update(list[index]);
			}
		});

		this.append(this.textInput);
		this.append(stepDown);
		this.append(stepUp);
	}

	update(value, uiOnly) {
		this.value = value; // always set value before callback
		if (!uiOnly && this.callback) {
			if (this.args) this.callback(value, ...this.args);
			else this.callback(value);
		}
	}

	set value(value) {
		this.textInput.value = value;
	}

	get value() {
		return this.textInput.value;
	}
}

UI.Elements.UIListStep = UIListStep;