import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UIRow } from './Row.js';

export function UITree(params={}) {
	const ui = UICollection({ ...params, tag: 'details' });
	ui.addClass("tree");
	ui.addClass("row");
	ui.isTree = true;

	const summary = new UIElement({
		tag: 'summary',
		text: params.title,
	});
	ui.el.appendChild(summary.el);

	const row = new UIRow();
	ui.el.appendChild(row.el); // idk why but doesn't use add

	// this rewrote a bunch of shit but idk why, seems to be fine with out it???

	function open() {
		ui.el.open = true;
	}

	function close() {
		ui.el.open = false;
	}

	return Object.assign(ui, { open, close });
}