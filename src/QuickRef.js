/*
	module for running a function or adding uis to quick ref menu
	register all callbacks, props, uis with params to either run or recreate ui 
*/

import { Elements } from './Elements.js';
const { UIModal, UIButton, UILabel, UIInputSearch, } = Elements;

export function QuickRef(app) {

	const reg = []; // registered uis for reference
	const keys = []; // list of key commands for display 
	const list = []; // list of uis added to interfaces
	const defaultFontSize = 11;
	let panel;

	function add() {

		const m = new UIModal({
			title: "Add UI To Quick Ref",
			app: app,
			position: app.ui.panels.quick.position
		});

		function addUI(label) {
			const { type, params, prop } = reg.find(e => e.label === label);
			params.label = label;
			let row = panel.addRow();
			let ui;
			if (type === 'prop') {
				ui = new Elements[params.type](params);
			} else {
				ui = new UIButton(params);
			}
			row.append(new UILabel({ 
				text: label,
				css: { 'margin-right': 'auto' } 
			}));
			row.append(ui);
			row.append(new UIButton({
				text: 'x',
				callback: () => {
					panel.removeRow(row);
				}
			}));
		} 

		const input = new UIInputSearch({
			listName: 'quick-menu-list',
			options: reg.map(e => e.label),
			onEscape: () => { m.clear() },
			callback: value => {
				m.clear();
				addUI(value);
			}
		});
		m.add(input);
		input.focus();
	}

	function open() {

		const m = new UIModal({
			title: "Quick Menu",
			app: app,
			position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		});

		function callCallback(label) {
			const ui = reg.find(e => e.label === label);
			if (!ui) return;
			if (ui.type === 'prop') app.ui.faces[ui.prop].update();
			// test other types ...
			else ui.params.callback();
		} 

		const input = new UIInputSearch({
			listName: 'quick-menu-list',
			options: reg.map(e => e.label),
			onEscape: () => { m.clear() },
			callback: value => {
				m.clear();
				callCallback(value);
			}
		});
		m.add(input);
		input.focus();
	}

	function registerCallback(mod, label, params) {
		reg.push({ 
			label: `${mod} > ${label}`, 
			params, 
			type: 'callback' 
		});

		if (params.key) {
			keys.push({ 
				key: params.key, 
				label: `${mod} > ${label}`
			});
		}
	}

	function registerProp(prop, mod, label, params) {
		reg.push({ 
			label: `${mod} > ${label}`,
			prop,
			params, 
			type: 'prop' 
		});
		
		if (params.key) {
			keys.push({ key: params.key, label: `${mod} > ${label}` });
		}
	}

	function displayKeys() {
		const m = new UIModal({
			title: "Key Commands",
			app: app,
			class: 'key-command-list',
			position: { x: 200, y: 120 },
		});

		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			// m.add(new UIRow());
			m.add(new UILabel({ 
				text: k.key + ' --> ' + k.label,
				class: 'break'
			}));
		}
	}

	function connect() {

		panel = app.ui.getPanel('quick', { label: 'Quick Ref' });

		app.ui.addCallbacks([
			{ callback: open, text: "Menu", key: "ctrl-space" },
			{ callback: add, text: "+" },
			{ callback: displayKeys, text: 'Key Commands', key: 'ctrl-,' }
		]);

		app.ui.addProp('quickRefScale', {
			type: 'UINumberStep',
			value: defaultFontSize,
			label: "Scale",
			callback: value => {
				document.body.style.setProperty('--quick-ref-font-size', +value);
			},
			reset: true, // defaultFontSize ??
			range: [10, 40],
		});
	}

	return {
		connect, registerCallback, registerProp, 
		getList: () => { return list; }
	};
}