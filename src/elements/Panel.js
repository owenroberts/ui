import * as Elements from '../Elements.js';

export class UIPanel extends Elements.UICollection {
	constructor(params) {
		super({ ...params, id: `${params.id}-panel` });
		this.ui = params.ui;
		this.id = params.id;
		this.isPanel = true;
		this.addClass("panel");
		this.addClass("undocked");
		this.gridArea = "default";

		// this.ui.addPanel(this);
		
		this.rows = [];

		const header = this.append(new Elements.UIRow({ class: "header" }));
		// header.addClass('header');

		header.append(new Elements.UILabel({ text: params.label ?? params.id }));

		header.append(new Elements.UIButton({
			text: 'X',
			class: 'undock-btn',
			callback: () => { this.undock(); },
		}));

		this.orderBtn = header.append(new Elements.UIButton({
			text: this.order || "0",
			class: "order-btn",
			callback: () => {
				this.order = +this.el.style.order + 1;
				this.orderBtn.text = this.order;
			}
		}));

		header.append(new Elements.UIToggle({
			onText: "▿",
			offText: "◃",
			class: "headless-btn",
			callback: isOn => {
				if (isOn) {
					this.addClass('headless');
					this.addClass('block');
				} else {
					this.removeClass('block');
					this.removeClass('headless');
				}
			}
		}));
	}
	
	get order() {
		return this.el.style.order;
	}

	set order(n) {
		this.orderBtn.text = n || "0";
		this.el.style.order = n;
	}

	get settings() {
		return {
			open: this.open.value,
			docked: !this.hasClass('undocked'),
			block: this.hasClass('block'),
			headless: this.hasClass('headless'),
			order: this.order,
			gridArea: this.gridArea,
		};
	}

	isOpen() {
		return this.open.value;
	}

	close() {
		this.addClass('closed');
		this.open.set(false);
	}

	block() {
		this.addClass('block');
	}

	headless() {
		this.addClass('headless');
	}

	dock() {
		this.removeClass('undocked');
	}

	undock() {
		this.addClass('undocked');
	}

	addBreak() {
		this.addRow({ class: 'break' });
		this.addRow();
	}

	addRow(params={}) {
		const row = new Elements.UIRow({ id: params.id, class: params.class });
		this.append(row, params.id);
		this.rows.push(row);
		return row;
	}

	removeRow(row) {
		const index = this.rows.indexOf(row);
		this.rows.splice(index, 1);
		this.remove(row);
		return row;
	}

	addRef(params) {
		if (!params.noRow) this.addRow();
		const type = params.type ?? this.ui.getUIType(params);
		const id = params.id ?? params.ref;
		const ui = new Elements[type](params);
		this.add(new Elements.UILabel({ text: params.label ?? id }));
		this.add(ui, id);
		if (params.key) this.ui.keys[params.key] = ui;
		if (!params.ignore) {
			this.ui.faces[id] = ui; // or just loop through children later?
		}
		return ui;
	}

	add(child, k, row) {
		if (this.debug) console.log(child, k, row);
		if (!row) row = this.rows[this.rows.length - 1];
		if (!row) row = this.addRow();
		row.append(child, k);
		return child;
	}

	setup(settings) {
		if (settings.docked) this.dock();
		else this.undock();
		
		if (!settings.open) this.close();
		
		if (settings.block) this.block();
		if (settings.headless) this.headless();
		
		this.order = settings.order;
		this.gridArea = settings.gridArea;
	}
}