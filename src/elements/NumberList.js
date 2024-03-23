import { UICollection } from './Collection.js';
import { UINumberStep } from './NumberStep.js';
import { setList } from './Behaviors.js';

export function UINumberList(params={}) {
	const ui = UICollection(params);
	ui.addClass('number-list');

	function getItemUI(index, value) {
		return new UINumberStep({
			value: value,
		});
	}

	return Object.assign(ui, setList(ui, params, getItemUI));
}