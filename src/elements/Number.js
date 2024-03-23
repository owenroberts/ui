import { UIElement } from './Element.js';
import { setKey, setCallback } from './Behaviors.js';

export function UINumber(params={}) {
	const ui = UIElement({ ...params, tag: 'input' });
	ui.addClass('number');
	ui.el.value = params.value ?? '';
	ui.el.placeholder = 0;

	// const { callback } = setCallback(ui, params, 'click');
	const callback = params.callback;
	const { onPress } = setKey(ui, params.key, ui.getText());

	function update(value, uiOnly) {
		if (value === undefined) return;
		if (typeof value === 'string') {
			if (value.match(/\D/)) {
				try {
					value = eval(value);
				} catch(e) {
					alert("Please enter a numerical value or mathematical expression.");
					return;
				}
			}
		}
		if (typeof value === 'string') value = +value;
		ui.el.value = value; // always set value before callback
		if (callback && !uiOnly) callback(value);
	}

	function keyHandler(value) {
		update(+prompt(params.prompt));
	}

	return Object.assign(ui, {
		update,
		keyHandler,
		onPress,
		get() { return ui.el.value; },
		set(value) { ui.el.value = value; },
	});
}