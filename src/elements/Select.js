import { UIElement } from './Element.js';

export function UISelect(params={}) {
	const ui = UIElement({ ...params, tag: 'select' });
	const callback = params.callback;
	setOptions(params.options ?? []);
	if (params.selected) ui.el.value = params.selected;
	if (params.value) ui.el.value = params.value;

	ui.el.addEventListener('change', ev => {
		if (callback) callback(ev.target.value);
		ev.target.blur();
	});

	function getOptions() {
		return Array.from(ui.el.options).map(o => o.value);
	}

	function update(value) {
		const options = getOptions();
		if (!options.includes(value)) addOption(value);
		ui.el.value = value;
		if (callback) callback(value);
	}

	function clearOptions() {
		for (let i = ui.el.children.length - 1; i >= 0; i--) {
			ui.el.children[i].remove();
		}
	}

	function removeOption(value) {
		for (let i = 0; i < ui.el.children.length; i++) {
			if (ui.el.children[i].value == value){
				ui.el.children[i].remove();
			}
		}
	}

	function addOption(value, text) {
		const opt = document.createElement("option");
		opt.value = opt.textContent = value;
		if (text) opt.textContent = text;
		ui.el.appendChild(opt);
	}

	function setOptions(options) {
		for (let i = 0; i < options.length; i++) {
			const opt = getOptions();
			const { value, text } = typeof options[i] === 'string' ?
				{ value: options[i] } :
				options[i];
			if (!opt.includes(value)) addOption(value, text);
		}
	}

	return Object.assign(ui, { update, getOptions, addOption, setOptions, clearOptions });
}