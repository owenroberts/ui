import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import * as Cool from '../../../cool/cool.js';

export class UIInputSearch extends UICollection {
	constructor(params) {
		super(params);

		const input = new UIElement({
			tag: 'input',
			class: 'search',
			css: { 'min-width': '80px' }
		});
		input.el.setAttribute('list', params.listName);
		
		function changeHandler(ev) {
			input.el.blur();
			if (params.callback) params.callback(this.value);
		}
		// const boundHandler = changeHandler.bind(this);
		input.el.addEventListener('change', changeHandler);
		
		if (params.onEscape) {
			input.el.addEventListener('keydown', ev => {
				if (Cool.keys[ev.which] === 'escape') {
					input.el.removeEventListener('change', changeHandler);
					params.onEscape();
				}
			});
		}

		const list = new UIElement({
			tag: 'datalist',
			id: params.listName
		});

		this.append(input, 'input');
		this.append(list, 'list');
		this.setOptions(params.options || []);
		if (params.selected) this.value = params.selected;
	}

	focus() {
		this.input.el.focus();
	}

	get value() {
		return this.input.el.value;
	}

	set value(value) {
		this.input.value = value;
	}

	addOption(value, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (text) opt.textContent = text;
		this.list.el.appendChild(opt);
	}

	setOptions(options) {
		for (let i = 0; i < options.length; i++) {
			const opt = Array.from(this.list.el.options).map(o => o.value);
			if (!opt.includes(options[i])) {
				this.addOption(options[i]);
			}
		}
	}
}