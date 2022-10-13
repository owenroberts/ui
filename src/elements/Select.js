class UISelect extends UIElement {
	constructor(params) {
		params.tag = "select";
		super(params);
		if (params.callback) this.callback = params.callback;
		this.setOptions(params.options || []);
		if (params.selected) this.value = params.selected;
		
		this.el.addEventListener('change', function(ev) {
			if (params.callback) params.callback(ev.target.value);
			ev.target.blur();
		});
	}

	update(option) {
		this.value = option;
		if (this.callback) this.callback(option);
	}

	removeOption(value) {
		for (let i = 0; i < this.el.children.length; i++) {
			if (this.el.children[i].value == value)
				this.el.children[i].remove();
		}
	}

	addOption(value, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (text) opt.textContent = text;
		this.el.appendChild(opt);
	}

	setOptions(options) {
		for (let i = 0; i < options.length; i++) {
			const opt = Array.from(this.el.options).map(o => o.value);
			const { value, text } = typeof options[i] === 'string' ?
				{ value: options[i] }  :
				options[i];
			if (!opt.includes(value)) this.addOption(value, text);
		}
	}
}

UI.Elements.UISelect = UISelect;