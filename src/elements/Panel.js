import { UICollection } from './Collection.js';
import { UIRow } from './Row.js';
import { UIToggle } from './Toggle.js';
import { UILabel } from './Label.js';
import { UIButton } from './Button.js';

export function UIPanel(params={}) {
	const ui = UICollection({ ...params, id: `${params.id}-panel` });
	ui.addClass("panel");
	ui.addClass("undocked");
	ui.gridArea = 'default';
	ui.isPanel = true;

	const rows = [];
	const header = ui.add(new UIRow({ class: "header" }));

	const open = header.add(new UIToggle({
		onText: "－",
		offText: "＋",
		class: "toggle",
		isOn: true, // default open
		callback: isOn => {
			if (!isOn) ui.addClass('closed');
			else ui.removeClass('closed');
		}
	}));

	header.add(new UILabel({ text: params.label }));
	header.add(new UIButton({
		text: 'X',
		class: 'undock-btn',
		callback: undock,
	}));

	const orderBtn = header.add(new UIButton({
		text: this.order ?? "0",
		class: "order-btn",
		callback: () => {
			ui.el.style.order = +ui.el.style.order + 1;
			orderBtn.setText(ui.el.style.order);
		}
	}));

	header.add(new UIButton({
		text: "[]",
		class: "block-btn",
		callback: () =>  {
			if (ui.hasClass('block')) ui.removeClass('block');
			else ui.addClass('block');
		}	
	}));

	header.add(new UIButton({
		text: "<",
		class: "headless-btn",
		callback: () => {
			if (ui.hasClass('headless')) ui.removeClass('headless');
			else ui.addClass('headless');
		}
	}));

	function close() {
		ui.addClass('closed');
		open.set(false);
	}

	function block() {
		ui.addClass('block');
	}

	function headless() {
		ui.addClass('headless');
	}

	function dock() {
		ui.removeClass('undocked');
	}

	function undock() {
		ui.addClass('undocked');
	}

	function addRow(k, className) {
		const row = new UIRow({ id: k, class: className, });
		ui.append(row, k);
		rows.push(row);
		return row;
	}

	function removeRow(row) {
		const index = rows.indexOf(row);
		rows.splice(index, 1);
		ui.remove(row);
		return ui;
	}

	function add(child, k, row) {
		if (!row) row = rows[rows.length - 1];
		if (!row) row = addRow();
		row.add(child, k);
		return child;
	}

	function setup(settings) {
		if (settings.docked) dock();
		else undock();
		
		if (!settings.open) close();
		
		if (settings.block) block();
		if (settings.headless) headless();
		
		ui.el.style.order = settings.order;
		ui.gridArea = settings.gridArea;
	}

	return Object.assign(ui, {
		add, addRow, setup,
		close, block, headless, dock, undock,
		isDocked() { return !ui.hasClass('undocked'); },
		isBlock() { return ui.hasClass('block'); },
		isHeadless() { return ui.hasClass('headless'); },
		isOpen() { return open.get(); },

		// need both?
		
		getSettings() {
			return {
				open: open.get(),
				docked: !ui.hasClass('undocked'),
				order: ui.el.style.order,
				block: ui.hasClass('block'),
				headless: ui.hasClass('headless'),
				gridArea: ui.gridArea,
			};
		},

		// use this??
		getLastRow() {
			if (rows.length === 0) return ui.addRow();
			return rows[rows.length - 1];
		}

		// don't know if i need these
		// get order() { return ui.el.style.order; },
		// set order(n) {
		// 	orderBtn.setText(n ?? "0");
		// 	ui.el.style.order = n;
		// },
	});
}

