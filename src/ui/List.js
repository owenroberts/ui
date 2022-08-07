class UIList extends UICollection {
	constructor(params) {
		super(params);
	}

	insertBefore(ui, before) {
		this.el.insertBefore(ui.el, before.el);
	}

	get length() {
		return this.el.children.length;
	}

	get children() {
		return this.el.children;
	}

	addClass(_class) {
		for (let i = 0; i < this.els.length; i++) {
			if (!this.els[i].classList.contains(_class))
 				this.els[i].classList.add(_class);
		}
	}

	setId(id, index) {
		this.children[index].id = id;
	}

	removeIndex(index) {
		this.children[index].remove();
	}

	looper(callback, start, end) {
		const len = end || this.length - 2; /* for plusframe ... */
		for (let i = start || 0; i <= len; i++) {
			callback(this.children[i]);
		}
	}
}