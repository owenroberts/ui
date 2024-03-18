import UIElement from './Element.js';

export default class UISelect extends UIElement {
	constructor(params) {
		params.tag = "select";
		super(params);
		if (params.callback) this.callback = params.callback;
		this.setOptions(params.options ?? []);
		if (params.selected) this.value = params.selected;
		if (params.value) this.value = params.value;
		
		this.el.addEventListener('change', ev => {
			if (params.callback) params.callback(ev.target.value);
			ev.target.blur();
		});
	}

	get options() {
		return Array.from(this.el.options).map(o => o.value);
	}

	update(value) {
		if (!this.options.includes(value)) this.addOption(value)
		this.value = value;
		if (this.callback) this.callback(value);
	}

	clearOptions() {
		for (let i = this.el.children.length - 1; i >= 0; i--) {
			this.el.children[i].remove();
		}
	}

	removeOption(value) {
		for (let i = 0; i < this.el.children.length; i++) {
			if (this.el.children[i].value == value){
				this.el.children[i].remove();
			}
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
				{ value: options[i] } :
				options[i];
			if (!opt.includes(value)) this.addOption(value, text);
		}
	}
}