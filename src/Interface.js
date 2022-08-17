function Interface(app, params) {
	const self = this;
	const uiTypes = {
		UILabel,
		UIElement,
		UIRange,
		UIText,
		UINumber,
		UINumberRange,
		UINumberStep,
		UIToggle,
		UIToggleCheck,
		UIButton,
		UIColor,
		UISelect,
		UISelectButton,
		UICollection,
		UIList,
		UIRow,
		UIInput,
		UIInputList,
		UIFile,
	};

	// turn off ipad request desktop
	document.body.classList.add(Cool.mobilecheck() ? 'mobile' : 'desktop');

	this.keys = {};
	this.faces = {}; /* references to faces we need to update values ???  */
	this.panels = {};
	// all existing panels is different than section panels ...
	// but they can start here ... 
	
	this.quickRef = new QuickRef(app);
	
	this.maxPanels = 100; // limit number of panels open at one time, default 100, basically ignore this -- save for when we have abc layout
	this.maxWidth = 500;
	this.useMaxWidth = false;

	this.layout = new Layout(this, params);

	let baseFontSize = 11;
	this.updateScale = function(value) {
		if (value) baseFontSize = +value;
		document.body.style.setProperty('--base-font-size', baseFontSize);
	};

	/* key commands */
	this.keyDown = function(ev) {
		let k = Cool.keys[ev.which];
		if (k === "space") ev.preventDefault();
		k = ev.shiftKey ? "shift-" + k : k;
		k = ev.ctrlKey ? "ctrl-" + k : k;
		k = ev.altKey ? "alt-" + k : k;

		const ui = self.keys[k];

		if (k && ui && 
			document.activeElement.type !== "text" &&
			document.activeElement.type !== "number" && 
			!ev.metaKey) {
			ev.preventDefault();
			ui.keyHandler(ev.target.value);
			ui.onPress(true);
		}
	};
	document.addEventListener("keydown", self.keyDown, false);

	async function loadInterfaceFiles(file, callback) {
		const appFile = await fetch(file).then(response => response.json());
		const interfaceFile = await fetch('../ui/interface.json').then(response => response.json());
		
		const data = { ...interfaceFile };
		for (const k in appFile) {
			if (data[k]) data[k].uis.push(...appFile[k].uis);
			else data[k] = { ...appFile[k] };
		}
		
		for (const key in data) {
			const panel = self.panels[key] || self.createPanel(key, data[key]);
			const sections = data[key].uis;
			for (let i = 0; i < sections.length; i++) {
				const uis = sections[i];
				for (let j = 0; j < uis.list.length; j++) {
					self.createUI(uis.list[j], uis.module, uis.sub, panel);
				}
				// gives panel to module -- give to all ?
				if (uis.module === 'ui' && uis.sub) {
					app.ui[uis.sub].panel = panel;
				}
				if (data[key].addPanel && !app[uis.module].panel) {
					app[uis.module].panel = panel;
				}
			}
		}

		// self.layout.addSelectPanels([
		// 	...Object.keys(data).map(k => [k, data[k].label])
		// ]);
		
		// self.settings.load();
		self.quickRef.addData(data);
		self.panels.layout.dock();
		if (callback) callback();
	}

	this.load = function(file, callback) {
		loadInterfaceFiles(file, callback);
	};

	this.createPanel = function(key, data) {
		const panel = new UIPanel({ 
			id: key, 
			label: data.label, 
			onToggle: function() {
				let openPanels = lns.ui.panels.uiList.filter(p => p.isOpen && p.isDocked);
				// console.log(openPanels) 
			}
		});
		self.panels[key] = panel;
		// self.layout.addSelectPanels([[key, data.label]]);
		self.layout.addSelectOption(key, data.label);
		return panel;
	};

	this.createUI = function(data, mod, sub, panel) {

		const m = sub ? app[mod][sub] : app[mod]; // module with sub module
		// this is because a bunch of modules are "sub modules" of the ui object, for no reason?

		const params = { ...data.params };
		if (data.key) params.key = data.key;
		if (data.callback) params.callback = m[data.callback];

		// most callbacks
		for (const k in data.fromModule) {
			params[k] = m[data.fromModule[k]];
		}

		/* direct set properties, toggle, number */
		if (data.number) {
			params.callback = function(value) {
				m[data.number] = +value;
			};
			params.value = +m[data.number];
		}

		if (data.string) {
			params.callback = function(value) {
				m[data.string] = value;
			}
			params.value = m[data.string];
		}

		/* this is fuckin nuts right ... */
		if (data.toggle) {
			params.callback = function(value) {
				m[data.toggle] = typeof value !== 'undefined' ? value :
					!m[data.toggle];
			};
			params.value = m[data.number];
		}

		if (data.row) panel.addRow();

		/* 
			this is counter intuitive because 
			labels get created before ui, 
			doesn't work for uis created in js
		*/
		if (data.label) panel.add(new UILabel({ text: data.label }));
		
		// console.log(data);
		// console.log(panel.rows);
		let ui = new uiTypes[data.type](params);
		
		if (data.type == 'UIRow') panel.addRow(data.k, params.class);
		else if (data.k) {
			// panel.append(ui, data.k);
			// dont know if this will fuck up anything yet
			panel.add(ui, undefined, data.k); 
		}
		else panel.add(ui);

		/* add is to row, append is adding it straight there */

		if (params.prompt) ui.prompt = params.prompt; /* only key commands -- why here? */
		if (params.key) self.keys[data.key] = ui;
		if (data.face) self.faces[data.face] = ui;
		if (data.face && data.ignoreSettings) ui.ignoreSettings = true;
	};

	this.update = function() {
		app.uiUpdate();
	};
}