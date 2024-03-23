import { UICollection } from './Collection.js';

export function UIRow(params={}) {
	const ui = UICollection(params);
	ui.addClass('row');
	return ui;
}

