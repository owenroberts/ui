import { UICollection } from './Collection.js';
import { UIRow } from './Row.js';
import { UIToggle } from './Toggle.js';
import { UILabel } from './Label.js';
import { UIButton } from './Button.js';

export class UIPanel extends UICollection {
	constructor(params) {
		super({ ...params, id: `${params.id}-panel` });
		this.id = params.id;
		this.isPanel = true;
		this.addClass("panel");
		this.addClass("undocked");
		this.gridArea = "default";
		
		this.rows = [];

		const header = this.append(new UIRow({ class: "header" }));
		// header.addClass('header');

		this.open = header.append(new UIToggle({
			onText: "－",
			offText: "＋",
			isOn: true, // default open
			callback: isOn => {
				if (!isOn) this.addClass('closed');
				else this.removeClass('closed');
			}
		}));

		header.append(new UILabel({ text: params.label }));

		header.append(new UIButton({
			text: 'X',
			class: 'undock-btn',
			callback: () => { this.undock(); },
		}));

		this.orderBtn = header.append(new UIButton({
			text: this.order || "0",
			class: "order-btn",
			callback: () => {
				this.order = +this.el.style.order + 1;
				this.orderBtn.text = this.order;
			}
		}));

		header.append(new UIButton({
			text: "[]",
			class: "block-btn",
			callback: () =>  {
				if (this.hasClass('block')) {
					this.removeClass('block');
				} else {
					this.addClass('block');
				}
			}	
		}));

		header.append(new UIButton({
			text: "<",
			class: "headless-btn",
			callback: () => {
				if (this.hasClass('headless')) {
					this.removeClass('headless');
				} else {
					this.addClass('headless');
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

	addRow(k, className) {
		const row = new UIRow({ id: k, class: className });
		this.append(row, k);
		this.rows.push(row);
		return row;
	}

	removeRow(row) {
		const index = this.rows.indexOf(row);
		this.rows.splice(index, 1);
		this.remove(row);
		return row;
	}

	add(child, k, row) {
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