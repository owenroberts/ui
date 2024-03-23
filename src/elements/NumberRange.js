// maybe deprecated ... check lines

import { UICollection } from './Collection.js';
import { UIDrag } from './Drag.js';
import { UIButton } from './Button.js';
import { setCallback } from './Behaviors.js';

export function UINumberRange(params={}) {
	const ui = UICollection();
	ui.addClass('number-range');

	const { callback } = setCallback(ui, params);
	let value = params.value;

	const numberInput = new UINumber({
		...params,
		callback: update,
	});

	const range = new UIRange({
		...params,
		callback: update,
	});

	// these never get added ??

	// not sure this happens
	if (params.event === 'change') {
		range.el.addEventListener('input', ev => {
			numberInput.el.placeholder = ev.currentTarget.value;
		});
	}

	function update(val, uiOnly) {
		if (!uiOnly) callback(+value);
		value = val;
	}

	return Object.assign(ui, {
		update,
		keyHandler(val) { update(+prompt(params.prompt)); },
		getHTML() { return [numberInput.el, range.el]; },
		get() { return value; },
		set(val) {
			value = val;
			numberInput.set(val);
			range.set(val);
		},
	});

}