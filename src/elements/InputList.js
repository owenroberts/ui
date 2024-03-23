import { UICollection } from './Collection.js';
import { UIText } from './Text.js';
import { setList } from './Behaviors.js';

export function UIInputList(params={}) {
	const ui = UICollection(params);
	ui.addClass('input-list');

	function getItemUI(index, value) {
		return new UIText({
			value: value,
		});
	}

	return Object.assign(ui, setList(ui, params, getItemUI));
}