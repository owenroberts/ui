function Interface(app, params) {

	// turn off ipad request desktop
	document.body.classList.add(Cool.mobilecheck() ? 'mobile' : 'desktop');

	const keys = {}; // all short cut keys
	const faces = {}; // all interfaces that need to be saved/updated -- make this all interfaces?
	const panels = {};
	let quick, layout, settings;
	let currentPanel;

	/* key commands */
	function keyDown(ev) {
		let k = Cool.keys[ev.which];
		if (k === "space") ev.preventDefault();
		k = ev.shiftKey ? "shift-" + k : k;
		k = ev.ctrlKey ? "ctrl-" + k : k;
		k = ev.altKey ? "alt-" + k : k;

		if (!k || !keys[k]) return;
		if (document.activeElement.type === "text") return;
		if (document.activeElement.type === "number") return;
		if (ev.metaKey) return;
		
		ev.preventDefault();

		keys[k].keyHandler(ev.target.value);
		keys[k].onPress(true);
	}
	document.addEventListener("keydown", keyDown, false);
	window.ToolTip = new UILabel({ id: 'tool-tip' });

	function labelFromKey(key) {
		let label = key[0].toUpperCase() + key.substring(1);
		label = label.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');
		return label;
	}

	function getType(value, type) {
		// console.log(value, type);
		if (typeof value === 'string') return 'UIText';
		if (typeof value === 'number') return 'UINumber';
		if (typeof value === 'boolean') return 'UIToggle';
	}

	function getPanel(key, params={}) {
		if (!key) return currentPanel;
		if (panels[key]) return panels[key];
		const label = params.label || labelFromKey(key);
		const panel = new UIPanel({ id: key, label });
		panels[key] = panel;
		layout.addSelectOption(key, label);
		if (panel !== currentPanel) currentPanel = panel;
		return panel;
	}

	function addCallbacks(callbacks, panel) {
		callbacks.forEach(params => { addCallback(params, panel); });
	}

	function addCallback(params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = getPanel(panel);
		if (params.row) panel.addRow();
		if (params.label) panel.add(new UILabel({ text: params.label }));
		
		const ui = new UI.Elements[params.type || 'UIButton'](params);
		panel.add(ui, params.k);
		if (params.key) keys[params.key] = ui;
		
		quick.registerCallback(labelFromKey(panel.id), labelFromKey(params.text || params.label), params);
		
		return ui;
	}

	function addProps(props, panel) {
		for (const prop in props) {
			addProp(prop, props[prop], panel);
		}
	}

	function addProp(prop, params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = getPanel(panel);
		
		const type = params.type || getType(params.value);
		// console.log(type);
		const ui = new UI.Elements[type](params);
		panel.addRow();
		if (!params.noLabel) { // any props not have a label ??
			panel.add(new UILabel({ 
				text: params.label || labelFromKey(prop),
				class: 'prop',
			}));
		}
		panel.add(ui);
		if (prop === 'bpm') console.trace();
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

	function addUIs(uis, panel) {
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

	function addUI(params, panel) {
		if (!panel) panel = currentPanel;
		if (!panel.isPanel) panel = getPanel(panel);
		if (params.row) panel.addRow();

		const type = params.type || getType(params.value);
		
		if (params.label) { // any props not have a label ??
			panel.add(new UILabel({ 
				text: params.label || labelFromKey(prop),
				class: 'prop',
			}));
		}

		let ui = new UI.Elements[type](params);
		panel.add(ui, undefined, params.k);

		if (params.key) keys[params.key] = ui;
		if (params.face) {
			faces[params.face] = ui;
			ui.ignoreSettings = true;
		}
		return ui;
	}

	function setup() {
		layout = new Layout(app, params);
		quick = new QuickRef(app);
		layout.connect();
		quick.connect();
	}

	function getLayout() { return layout; } // getter/setter?
	function getQuickRef() { return quick; }

	return { keys, faces, panels, getLayout, getQuickRef, setup, getPanel, addCallback, addCallbacks, addProp, addProps, addUI, addUIs };
}

UI.Interface = Interface;