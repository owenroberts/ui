class UIInputList extends UICollection {
	constructor(params) {
		super(params);

		this.input = new UIElement({
			tag: 'input',
			class: 'search'
		});
		this.input.el.setAttribute('list', params.listName);
		
		function changeHandler(ev) {
			this.input.el.blur();
			if (params.callback) params.callback(this.value);
		}

		this.input.el.addEventListener('change', changeHandler);
		
		if (params.escape) {
			this.input.el.addEventListener('keydown', ev => {
				if (Cool.keys[ev.which] === 'escape') {
					this.input.el.removeEventListener('change', changeHandler);
					params.escape();
				}
			});
		}

		this.list = new UIElement({
			tag: 'datalist',
			id: params.listName
		});
		this.setOptions(params.options || []);

		this.append(this.input);
		this.append(this.list);
	}

	focus() {
		this.input.el.focus();
	}

	get value() {
		return this.input.el.value;
	}

	addOption(value, selected, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (selected) opt.selected = "selected";
		if (text) opt.textContent = text;
		this.list.el.appendChild(opt);
	}

	setOptions(options, selected) {
		for (let i = 0; i < options.length; i++) {
			const opt = Array.from(this.list.el.options).map(o => o.value);
			if (!opt.includes(options[i])) {
				this.addOption(options[i], selected == options[i]);
			}
		}
	}
}

UI.Elements.UIInputList = UIInputList;