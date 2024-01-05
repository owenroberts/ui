class UIRow extends UICollection {
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
		return ui;
	}

	add(ui, k, addBreak) {
		this.append(ui, k);
		if (addBreak) this.addBreak();
		return ui;
	}

	insert(ui, ref) {
		super.insert(ui, ref);
		const index = this.uiChildren.indexOf(ref);
		this.uiChildren.splice(index, 0, ui);
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
		return ui;
	}

	pop() {
		let ui = this.uiChildren.pop();
		if (!ui) return;
		super.remove(ui);
		return ui;
	}

	addBreak() {
		this.add(new UIElement({ class: 'break' }));
	}

	get children() {
		return this.uiChildren;
	}

}

UI.Elements.UIRow = UIRow;