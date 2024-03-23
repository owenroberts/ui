import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';

export function UIToggleCheck(params={}) {
	const ui = UICollection(params);
	const callback = params.callback;

	const check = new UIElement({
		tag: 'input',
		class: 'toggle-check'
	});
	check.setType('checkbox');
	check.el.checked = params.isOn ?? params.value ?? false;
	ui.el.appendChild(check.el); // why?

	check.el.addEventListener('change', ev => {
		callback(ev.target.checked);
		check.el.blur();
	});

	function update(value) {
		if (value !== undefined) check.el.checked = !value;
		callback(value); // fuck what?
	}

	return Object.assign(ui, {
		update,
		get() { return check.el.checked; },
		keyHandler(value) { update(value) },
	});
}



