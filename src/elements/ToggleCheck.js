class UIToggleCheck extends UICollection {
	constructor(params) {
		super(params);
		this.callback = params.callback;
		this.addClass('ui-collection');

		this.check = new UIElement({
			tag: 'input',
			class: 'toggle-check'
		});

		if (params.label) {
			this.append(new UILabel({
				text: params.label,
			}));
		}

		this.check.el.type = 'checkbox';
		this.check.el.checked = params.isOn || false;
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
		this.check.el.checked = value;
		if (this.callback) this.callback(value);
	}

	
}