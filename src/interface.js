import { mobilecheck, whichKeyMap } from '../../cool/cool.js';
import { Settings } from './settings.js';
import { QuickMenu } from './quick.js';
import { UILabel, UIPanel, UIButton, UICollection, UISection } from './components.js';
import * as Components from './components.js';

// panels for core settings and quick are separated to avoid loading error
import { SettingsPanel } from './panels/settings-panel.js';
import { WorkspacesPanel } from './panels/workspaces-panel.js';
import { QuickPanel } from './panels/quick-panel.js';

export function labelFromKey(key) {
	let label = key[0].toUpperCase() + key.substring(1);
	label = label.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');
	return label;
}

export function formatNumberInput(value) {
	if (typeof value === 'string') {
		if (value.match(/\D/)) {
			try {
				value = eval(value);
			} catch(e) {
				alert("Please enter a numerical value or mathematical expression.");
				return;
			}
		}
	}
	return value;
}

export class Interface {

	constructor(app, params) {

		// turn off ipad request desktop
		document.body.classList.add(mobilecheck() ? 'mobile' : 'desktop');

		this.keys = {}; // all short cut keys
		this.faces = {}; // all interfaces that need to be saved/updated -- make this all interfaces?
		this.panels = {};
		this.sections = {}; 
		
		this.mousePosition = { x: 0, y: 0 };

		this.container = new UICollection({ id: 'container' });
		this.toolTip = new UILabel({ id: 'tool-tip' }); // should be app ... 
		this.container.append(this.toolTip);

		this.quick = new QuickMenu(this);
		this.settings = new Settings(this, params.settings);
		
		this.addPanel(new SettingsPanel({ ui: this }));
		this.addPanel(new WorkspacesPanel({ ui: this }));
		this.addPanel(new QuickPanel({ ui: this }));
		
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

		if (k !== "escape") {
			if (document.activeElement.type === "text") return;
			if (document.activeElement.type === "number") return;
		}
		if (ev.metaKey) return;
		
		ev.preventDefault();
		this.keys[k].keyHandler(ev.target.value);
		this.onKeyPress(this.keys[k], true);
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
		this.toolTip.setText(`${ ui.el.title }`);
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

	addSection(key, params={}) {
		if (!key) return;
		if (this.sections[key]) return;
		
		this.sections[key] = this.container.add(new UISection({
			label: key,
			id: `${key}-section`, 
			ui: this,
		}));
		this.sections[key].addSelectorOptions(Object.keys(this.panels));
	}

	removeSection(key, ui) {
		if (Object.keys(this.sections).length === 1) return;
		this.container.remove(ui);
		delete this.sections[key];
	}

	addSectionPanelOption(key, label) {
		for (const k in this.sections) {
			// name this add panel option?
			this.sections[k].addSelectorOption(key, label);
		}
	}

	addPanel(panel) {
		const label = labelFromKey(panel.id);
		this.panels[panel.id] = panel;
		this.addSectionPanelOption(panel.id, label);
		// this.layout.addSelectOption(panel.id, label);
		return panel;
	}

	getComponentType(params) {
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
	
	addRef(panel, params) {
		if (!params.noRow) panel.addRow();
		const type = params.type ?? this.getComponentType(params);
		const id = params.id ?? params.ref;
		const component = new Components[type](params);
		panel.add(new UILabel({ text: params.label ?? id }));
		panel.add(component, id);
		if (params.key) {
			this.addKey(params.key, component);
		}
		this.faces[params.face ?? id] = component; // if params.face?
		if (params.ignoreSettings) component.ignoreSettings = true;
		this.quick.register(component, panel.id, params);
		// if (params.ref === "sequence") console.log(component)
		return component;
	}

	addButton(panel, params) {
		if (params.addRow) panel.addRow();
		const component = panel.add(new Components.UIButton(params));
		if (params.key) this.addKey(params.key, component, params);
		this.quick.register(component, panel.id, params);
		return component;
	}
}