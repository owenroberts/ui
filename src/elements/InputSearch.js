import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import * as Cool from '../../../cool/cool.js';

export function UIInputSearch(params={}) {
	const ui = UICollection(params);
	const callback = params.callback;

	const input = new UIElement({
		tag: 'input',
		class: 'search',
		css: { 'min-width': '80px' }
	});
	input.el.setAttribute('list', params.listName);

	function changeHandler(ev) {
		input.el.blur();
		callback(input.value);
	}
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

	ui.add(input, 'input');
	ui.add(list, 'list');
	setOptions(params.options ?? []);
	if (params.selected) input.value = params.selected;

	function setOptions(options) {
		for (let i = 0; i < options.length; i++) {
			const opt = Array.from(list.el.options).map(o => o.value);
			if (!opt.includes(options[i])) {
				addOption(options[i]);
			}
		}
	}

	function addOption(value, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (text) opt.textContent = text;
		list.el.appendChild(opt);
	}

	return Object.assign(ui, { 
		setOptions,
		addOption,
		focus() { input.el.focus(); },
		get() { return input.el.value; },
		set(value) { input.el.value = value; },
	});
}