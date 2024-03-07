class UITree extends UICollection {
	constructor(params) {
		params.tag = 'details';
		// params.id = params.title + '-tree';
		super(params);
		this.addClass('tree');
		this.addClass('row');
		// this.addClass('break-line-up');

		const summary = new UIElement({
			tag: 'summary',
			text: params.title,
		});
		// this.add(summary);
		this.el.appendChild(summary.el);

		this.row = new UIRow();
		// this.add(this.row);
		this.el.appendChild(this.row.el);

	}

	addRow(ui, k) { // why?
		this.append(ui);
		if (k !== undefined) this[k] = ui;
	}

	add(ui, k, addBreak) {
		this.row.add(ui);
		if (k !== undefined) this[k] = ui;
		if (addBreak) this.addBreak();
		return ui;
	}

	removeK(k) {
		this.row.el.removeChild(this[k].el);
		delete this[k];
	}

	remove(ui) {
		this.row.el.removeChild(ui.el);
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

UI.Elements.UITree = UITree;