import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UIRow } from './Row.js';

export class UITree extends UICollection {
	constructor(params) {
		super({ ...params, tag: 'details' });
		this.addClass('tree');
		this.addClass('row');

		const summary = this.append(new UIElement({
			tag: 'summary',
			text: params.title,
		}));

		this.row = this.append(new UIRow());
	}

	add(child, k, addBreak) {
		this.row.add(child); // goes in row, not el
		if (k !== undefined) this[k] = child;
		if (addBreak) this.addBreak();
		return child;
	}

	removeK(k) {
		this.row.el.removeChild(this[k].el);
		delete this[k];
	}

	remove(child) {
		this.row.el.removeChild(ui.child);
	}

	clear() {
		this.row.clear();
	}

	addBreak() {
		this.row.addBreak();
	}

	open() {
		this.el.open = true;
	}

	close() {
		this.el.open = false;
	}
}