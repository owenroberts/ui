// also a base class that doesn't get used .... 

import { UIElement } from './Element.js';
import { setKey } from './Behaviors.js';

export function UIInput(params={}) {
	const ui = UIElement({ ...params, tag: 'input' });
	ui.el.value = params.value ?? '';

	// input has label, button has text ??
	// what about when no key??
	const { onPress } = setKey(ui, params.key, params.label);

	return Object.assign(ui, {
		onPress,
		get() { return ui.el.value; },
		set(value) { ui.el.value = value; },
	});
}