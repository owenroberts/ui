import { UIElement } from './Element.js';

export function UILabel(params={}) {
	const ui = UIElement({ ...params, tag: 'label' });
	ui.setText(params.text);
	return ui;
}