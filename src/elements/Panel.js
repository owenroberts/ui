import * as Elements from '../elements.js';
import { getUIType } from '../interface.js';

export class UIPanel extends Elements.UICollection {
	constructor(params) {
		super({ ...params, id: `${params.id}-panel` });
		
		this.ui = params.ui;
		
		this.id = params.id;
		this.isPanel = true;
		this.addClass("panel");
		this.addClass("undocked");
		this.gridArea = "default";
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
			text: this.order ?? "0",
			class: "order-btn",
			callback: () => {
				this.order = +this.el.style.order + 1;
				this.orderBtn.setText(this.order);
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
		this.orderBtn.setText(n ?? "0");
		this.el.style.order = n;
	}

	get settings() {
		return {
			docked: !this.hasClass('undocked'),
			headless: this.hasClass('headless'),
			order: this.order,
			gridArea: this.gridArea,
		};
	}

	isOpen() {
		return !this.hasClass('undocked');
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

	setup(settings) {
		if (settings.docked) this.dock();
		else this.undock();
		if (settings.headless) this.headless();
		this.order = settings.order;
		this.gridArea = settings.gridArea;
	}

	addBreak() {
		this.addRow({ class: 'break' });
		// this.addRow();
	}

	addRow(params={}) {
		const row = new Elements.UIRow(params);
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
		const type = params.type ?? getUIType(params);
		const id = params.id ?? params.ref;
		const ui = new Elements[type](params);
		this.add(new Elements.UILabel({ text: params.label ?? id }));
		this.add(ui, id);
		if (params.key) {
			// this.ui.keys[params.key] = ui;
			this.ui.addKey(params.key, ui);
		}
		this.ui.faces[params.face ?? id] = ui;
		if (params.ignoreSettings) ui.ignoreSettings = true;
		this.ui.quick.register(ui, this.id, params);
		return ui;
	}

	addButton(params) {
		if (params.addRow) this.addRow();
		const ui = this.add(new Elements.UIButton(params));
		if (params.key) this.ui.addKey(params.key, ui, params);
		this.ui.quick.register(ui, this.id, params);
		return ui;
	}

	add(child, k, row) {
		if (this.debug) console.log(child, k, row);
		if (!row) row = this.rows[this.rows.length - 1];
		if (!row) row = this.addRow();
		if (k) this.children[k] = child;
		row.append(child, k);
		return child;
	}
}