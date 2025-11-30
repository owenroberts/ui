/*
	module for running a function or adding uis to quick ref menu
	register all callbacks, props, uis with params to either run or recreate ui 
*/

import { UIModal, UIButton, UILabel, UIInputSearch, UITree, UIRow } from './oi.js';

export class QuickMenu {
	constructor(app) {
		this.app = app;
		this.reg = []; // registered uis for reference
		this.keys = {}; // list of key commands for display 
		this.list = []; // list of uis added to interfaces
		this.isOpen = false;
	}

	open(addQuickUI) {
		if (this.isOpen) return;

		this.isOpen = true;

		const m = new UIModal({
			title: "Quick Menu",
			ui: this.app.ui,
			onClear: () => {
				this.isOpen = false;
			}
		});

		const input = m.add(new UIInputSearch({
			listName: 'quick-menu-list',
			options: this.reg.map(e => e.label),
			callback: value => {
				const reg = this.reg.find(e => e.label === value);
				if (!reg) {
					input.focus();
					return;
				}

				const { ui, params } = reg;

				if (addQuickUI) {
					this.app.ui.panels.quick.addUI(params);
					return;
				} 

				if (ui.callback) {
					ui.callback();
				} else if (ui.update) {
					ui.update(prompt('Value:'));
				}
				this.isOpen = false;
				m.clear();
			}
		}));

		input.focus();
	}

	register(ui, panelName, params) {
		const label = params.face ?? params.id ?? params.ref ?? params.text;
		this.reg.push({
			label: `${panelName} > ${ label }`,
			params,
			ui,
		});

		if (params.key) {
			this.addToKeys(panelName, label, params);
		}
	}

	addToKeys(panelName, label, params) {
		if (!this.keys[panelName]) {
			this.keys[panelName] = [];
		}
		this.keys[panelName].push({ 
			key: params.key, 
			label, 
			letter: params.key.split('-').pop(),
		});
	}

	displayKeys() {
		const m = new UIModal({
			title: "Key Commands",
			app: this.app,
			class: 'key-command-list',
		});

		const keyRow = m.add(new UIRow());

		// console.log(keys);

		const alphas = {};
		const alphaTree = m.add(new UITree({ title: 'Alphabetical' }));
		keyRow.add(alphaTree);

		const panels = {};
		const panelTree = m.add(new UITree({ title: 'Panel' }));
		keyRow.add(panelTree);
		
		const alphaLetters = [];

		for (let panelName in this.keys) {

			if (!panels[panelName]) {
				panels[panelName] = new UITree({ title: panelName });
			}

			for (let i = 0; i < this.keys[panelName].length; i++) {
				const k = this.keys[panelName][i];
				if (!alphas[k.letter]) {

					alphas[k.letter] = new UITree({ title: k.letter.toUpperCase() });
					alphaLetters.push(k.letter);
				}

				const text = `${k.key} -- ${panelName} > ${k.label}`;
					
				panels[panelName].add(new UILabel({ text, class: 'key-command-label' }));
				panels[panelName].addBreak();

				alphas[k.letter].add(new UILabel({ text, class: 'key-command-label' }));
				alphas[k.letter].addBreak();
			}
		}

		alphaLetters.sort();
		for (let i = 0; i < alphaLetters.length; i++) {
			const letter = alphaLetters[i];
			alphaTree.add(alphas[letter]);
		}

		const panelAlphas = Object.keys(this.keys).sort();
		for (let i = 0; i < panelAlphas.length; i++) {
			panelTree.add(panels[panelAlphas[i]]);
		}
	}
}