import * as Elements from '../elements.js';
import { getUIType } from '../interface.js';

export class UIPanel extends Elements.UICollection {
	constructor(params) {
		super({ ...params, id: `${params.id}-panel` });
		
		this.ui = params.ui;		
		this.id = params.id;
		this.addClass("panel");
		this.rows = [];

		const header = this.append(new Elements.UIRow({ class: "header" }));

		header.add(new Elements.UILabel({ text: params.label ?? params.id }));

		this.order = header.add(new Elements.UINumberStep({
			value: 0,
			class: "order-btn",
			callback: value => {
				this.setStyle("order", value);
			}
		}));

		header.add(new Elements.UIButton({
			text: 'X',
			class: 'undock-btn',
			callback: () => {
				this.ui.sections[this.section].panels.removeK(this.id);
			},
		}));

		this.headlessToggle = header.add(new Elements.UIToggle({
			onText: "▿",
			offText: "◃",
			class: "headless-btn",
			callback: value => {
				if (value) {
					this.addClass('headless');
				} else {
					this.removeClass('headless');
				}
			}
		}));
	}

	getSettings() {
		return {
			headless: this.hasClass('headless'),
			order: this.order.value,
		};
	}

	setup(settings) {
		this.headlessToggle.update(settings.headless ?? false);
		this.order.update(settings.order ?? 0);
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
		this.ui.faces[params.face ?? id] = ui; // if params.face?
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