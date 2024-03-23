import { UIElement } from './Element.js';
import { setKey, setCallback } from './Behaviors.js';

export function UIToggle(params={}) {
	const ui = UIElement({ ...params, tag: 'button' });
	ui.addClass(params.btnClass ?? 'btn');
	ui.addClass('toggle');
	ui.setText(ui.el.textContent ?? params.text ?? params.onText);

	// callback issue for toggle ??? 
	const { callback } = setCallback(ui, params, 'click', update);
	const { onPress } = setKey(ui, params.key, ui.getText());

	const onText = params.onText ?? params.text;
	const offText = params.offText ?? params.text;
	let isOn = params.isOn ?? params.value ?? false;
	if (isOn) on();

	function on() {
		ui.setText(onText);
		ui.addClass('on');
	}

	function off() {
		ui.setText(offText);
		ui.removeClass('on');
	}

	function set(setOn) {
		isOn = setOn
		if (isOn) on();
		else off();
	}

	function toggle() {
		isOn = !isOn;
		if (isOn) on();
		else off();
	}

	function update(setOn, uiOnly) {
		if (setOn !== isOn) {
			if (isOn === undefined) isOn = setOn;
			if (!uiOnly) callback(isOn);
			set(isOn);
		}
	}

	function keyHandler() {
		set(!isOn);
		callback(isOn);
	}

	return Object.assign(ui, {
		set, toggle, update, keyHandler,
	});
}

