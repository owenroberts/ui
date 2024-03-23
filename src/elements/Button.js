import { UIElement } from './Element.js';
import { setKey, setCallback } from './Behaviors.js';

export function UIButton(params={}) {
	const ui = UIElement({ ...params, tag: 'button' });
	ui.addClass(params.btnClass ?? 'btn');
	ui.setText(ui.el.textContent ?? params.text);

	const { callback } = setCallback(ui, params, 'click');
	const { onPress } = setKey(ui, params.key, ui.getText());

	return Object.assign(ui, {
		keyHandler() { callback() },
		callback,
		onPress,
	});
}