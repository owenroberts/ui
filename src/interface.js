/*
	main interface function that handles everything else
	need better naming conventions to make uis clear
	add callback is for button w function
	add prop is for something to save in local settings
	add ui is for more complex ui types

*/

import { mobilecheck, whichKeyMap } from '../../cool/cool.js';
import { Layout } from './layout.js';
import { Settings } from './settings.js';
import { QuickMenu } from './quick.js';
import { UILabel, UIPanel, UIButton } from './elements.js';
import * as Elements from './elements.js';

import { LayoutPanel } from './panels/layout-panel.js';
import { SettingsPanel } from './panels/settings-panel.js';
import { WorkspacesPanel } from './panels/workspaces-panel.js';
import { QuickPanel } from './panels/quick-panel.js';

// move to cool.js? or oi/helpers?
export function labelFromKey(key) {
	let label = key[0].toUpperCase() + key.substring(1);
	label = label.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');
	return label;
}

export function getUIType(params) {
	const value = params.value ?? params.obj[params.ref]
	// options is either select or steppers
	if (params.options) {
		if (typeof value[0] === 'string') return 'UISelect';
	} else {
		if (typeof value === 'string') return 'UIText';
		if (typeof value === 'number') return 'UINumberStep';
		if (typeof value === 'boolean') return 'UIToggleCheck';
		if (Array.isArray(value)) return 'UIList';
	}
}


export class Interface {

	constructor(app, params) {

		// turn off ipad request desktop
		document.body.classList.add(mobilecheck() ? 'mobile' : 'desktop');

		this.keys = {}; // all short cut keys
		this.faces = {}; // all interfaces that need to be saved/updated -- make this all interfaces?
		this.panels = {};
		this.mousePosition = { x: 0, y: 0 };

		this.toolTip = new UILabel({ id: 'tool-tip' }); // should be app ... 
		this.layout = new Layout(app, params);
		this.layout.default.append(this.toolTip);

		this.quick = new QuickMenu(app);
		this.settings = new Settings(this, params.settings);
		
		this.addPanel(new LayoutPanel({ ui: this }));
		this.addPanel(new SettingsPanel({ ui: this }));
		this.addPanel(new WorkspacesPanel({ ui: this }));
		this.addPanel(new QuickPanel({ ui: this }));

		// this.layout.connect();
		// this.quick.connect();

		// let currentPanel;
		
		/* key commands */
		
		document.addEventListener("keydown", ev => {
			this.keyDown(ev);
		}, false);
		
		// track mouse for modal
		document.addEventListener("mousemove", ev => {
			this.mousePosition.x = ev.clientX;
			this.mousePosition.y = ev.clientY;
		}, false);
	}

	keyDown(ev) {

		let k = whichKeyMap[ev.which];
		if (k === "space") ev.preventDefault();
		k = ev.shiftKey ? "shift-" + k : k;
		k = ev.ctrlKey ? "ctrl-" + k : k;
		k = ev.altKey ? "alt-" + k : k;

		if (!k || !this.keys[k]) return;
		if (document.activeElement.type === "text") return;
		if (document.activeElement.type === "number") return;
		if (ev.metaKey) return;
		
		ev.preventDefault();

		this.keys[k].keyHandler(ev.target.value);
		this.onKeyPress(this.keys[k], true);
	}

	getType(value, type) {
		if (typeof value === 'string') return 'UIText';
		if (typeof value === 'number') return 'UINumber';
		if (typeof value === 'boolean') return 'UIToggle';
	}

	getUIType(params) {
		const value = params.value ?? params.obj[params.ref]
		// options is either select or steppers
		if (params.options) {
			if (typeof value[0] === 'string') return 'UISelect';
		} else {
			if (typeof value === 'string') return 'UIText';
			if (typeof value === 'number') return 'UINumberStep';
			if (typeof value === 'boolean') return 'UIToggleCheck';
			if (Array.isArray(value)) return 'UIList';
		}
	}

	addKey(key, ui) {
		this.keys[key] = ui;
		ui.el.title = `${ ui.text ?? ui.ref ?? ui.id } ~ ${ key }`;
		ui.el.addEventListener('mouseenter', () => { 
			this.onKeyPress(ui, false);
		});
		ui.el.addEventListener('mouseleave', () => {
			this.onKeyRelease(ui); 
		});
	}

	onKeyPress(ui, triggerRelease) {
		ui.addClass('triggered');
		this.toolTip.text = `${ ui.el.title }`;
		this.toolTip.addClass('visible');
		
		if (triggerRelease === true) {
			setTimeout(() => { 
				this.onKeyRelease(ui); 
			}, 400);
		}
	}

	onKeyRelease(ui) {
		ui.removeClass('triggered');
		this.toolTip.removeClass('visible');
	}

	getPanel(key, params={}) {
		// if (!key) return currentPanel;
		if (this.panels[key]) return this.panels[key];
		const label = params.label || labelFromKey(key);
		const panel = new UIPanel({ id: key, label });
		this.panels[key] = panel;
		this.layout.addSelectOption(key, label);
		// if (panel !== currentPanel) currentPanel = panel;
		return panel;
	}

	addPanel(panel) {
		const label = labelFromKey(panel.id);
		this.panels[panel.id] = panel;
		this.layout.addSelectOption(panel.id, label);
		return panel;
	}

	addCallbacks(callbacks, panel) {
		callbacks.forEach(params => { this.addCallback(params, panel); });
	}

	addCallback(params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = this.getPanel(panel);
		if (params.row) panel.addRow();
		if (params.label) panel.add(new UILabel({ text: params.label }));
		
		const ui = new Elements[params.type || 'UIButton'](params);
		panel.add(ui, params.k);
		if (params.key) this.keys[params.key] = ui;
		
		// error with type file ... 
		this.quick.registerCallback(labelFromKey(panel.id), labelFromKey(params.text || params.label), params);
		
		return ui;
	}

	addProps(props, panel) {
		for (const prop in props) {
			addProp(prop, props[prop], panel);
		}
	}

	addProp(prop, params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = getPanel(panel);
		
		const type = params.type || getType(params.value);
		const ui = new Elements[type](params);
		panel.addRow();
		if (!params.noLabel) { // any props not have a label ??
			panel.add(new UILabel({ 
				text: params.label || labelFromKey(prop),
				class: 'prop',
			}));
		}
		panel.add(ui);
		faces[prop] = ui;
		if (params.key) keys[params.key] = ui;

		if (params.reset) {
			panel.add(new UIButton({ text: 'Reset', callback: () => {
				ui.update(params.value);
			}}))
		}

		quick.registerProp(prop, labelFromKey(panel.id), labelFromKey(prop), params);
		return ui;
	}

	addUIs(uis, panel) {
		if (Array.isArray(uis)) {
			uis.forEach(ui => { addUI(ui, panel); });
		}
		else {
			for (const prop in uis) {
				const params = { ...uis[prop], face: prop, row: true };
				addUI(params, panel);
			}
		}
	}

	addUI(params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = this.getPanel(panel);
		if (params.row) panel.addRow();

		const type = params.type || getType(params.value);
		
		if (params.label) { // any props not have a label ??
			panel.add(new UILabel({ 
				text: params.label || labelFromKey(prop),
				class: 'prop',
			}));
		}
		
		let ui = new Elements[type](params);
		panel.add(ui, undefined, params.k);

		if (params.key) keys[params.key] = ui;
		if (params.face) {
			faces[params.face] = ui;
			ui.ignoreSettings = true;
			// quick.registerCallback(labelFromKey(panel.id), labelFromKey(params.face), params);
		}

		return ui;
	}
}