import UICollection from './Collection.js';

export default class UIRow extends UICollection {
	constructor(params) {
		super(params);
		this.addClass('row');
		this.uiChildren = [];
		this.keys = [];
	}

	append(ui, k) {
		super.append(ui, k);
		if (k) this.keys.push(k);
		this.uiChildren.push(ui);
	}

	clear() {
		/* remove keys */
		for (const key in this.keys) {
			delete this[key];
		}
		this.keys = [];

		while (this.el.firstChild) {
			this.el.firstChild.value = null; /* prevent blur event */
			this.el.removeChild(this.el.firstChild);
		}
		this.uiChildren = [];
	}

	remove(ui, k) {
		super.remove(ui, k);
		let index = this.uiChildren.indexOf(ui);
		this.uiChildren.splice(index, 1);
	}

	get children() {
		return this.uiChildren;
	}

}