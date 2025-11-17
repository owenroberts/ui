/*
	module for running a function or adding uis to quick ref menu
	register all callbacks, props, uis with params to either run or recreate ui 
*/

import { UIModal, UIButton, UILabel, UIInputSearch, UITree, UIRow } from './UI.js';

export function QuickRef(app) {

	const reg = []; // registered uis for reference
	const keys = {}; // list of key commands for display 
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
				css: { 'margin-right': 'auto' },
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
			onEsape: () => { m.clear() },
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
		});

		function callCallback(label) {
			const ui = reg.find(e => e.label === label);
			if (!ui) return;
			// console.log(label, ui);
			if (ui.type === 'prop') app.ui.faces[ui.prop].update();
			// test other types ...
			else ui.params.callback();
		}

		// huh? not DRY
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

		if (params.key) addToKeys(mod, label, params);
	}

	// lol also not DRY
	function registerProp(prop, mod, label, params) {
		reg.push({
			label: `${mod} > ${label}`,
			prop,
			params,
			type: 'prop'
		});
		
		if (params.key) addToKeys(mod, label, params);
	}

	function addToKeys(mod, label, params) {
		// keys.push({ key: params.key, label: `${mod} > ${label}` });
		// console.log('add', mod, label, params);
		if (!keys[mod]) keys[mod] = [];
		keys[mod].push({ key: params.key, label, letter: params.key.split('-').pop() });
	}

	function displayKeys() {
		const m = new UIModal({
			title: "Key Commands",
			app: app,
			class: 'key-command-list',
		});

		const keyRow = m.add(new UIRow());

		// console.log(keys);

		const alphas = {};
		const alphaTree = m.add(new UITree({ title: 'Alphabetical' }));
		keyRow.add(alphaTree);

		const modules = {};
		const modTree = m.add(new UITree({ title: 'Module' }));
		keyRow.add(modTree);
		
		const alphaLetters = [];

		for (let mod in keys) {

			if (!modules[mod]) {
				modules[mod] = new UITree({ title: mod });
			}

			for (let i = 0; i < keys[mod].length; i++) {
				const k = keys[mod][i];
				if (!alphas[k.letter]) {

					alphas[k.letter] = new UITree({ title: k.letter.toUpperCase() });
					alphaLetters.push(k.letter);
				}

				const text = `${k.key} -- ${mod} > ${k.label}`;
					
				modules[mod].add(new UILabel({ text, class: 'key-command-label' }));
				modules[mod].addBreak();

				alphas[k.letter].add(new UILabel({ text, class: 'key-command-label' }));
				alphas[k.letter].addBreak();
			}
		}

		alphaLetters.sort();
		for (let i = 0; i < alphaLetters.length; i++) {
			const letter = alphaLetters[i];
			alphaTree.add(alphas[letter]);
		}

		const modAlphas = Object.keys(keys).sort();
		for (let i = 0; i < modAlphas.length; i++) {
			modTree.add(modules[modAlphas[i]]);
		}
	}

	function connect() {

		panel = app.ui.getPanel('quick', { label: 'Quick Ref' });

		app.ui.addCallbacks([
			{ callback: open, text: "Menu", key: "q" },
			{ callback: add, text: "+" },
			{ callback: displayKeys, text: 'Key Commands', key: 'alt-k' }
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